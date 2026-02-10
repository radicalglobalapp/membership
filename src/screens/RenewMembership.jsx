import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Appbar } from 'react-native-paper';
import api from '../api';
import AppBar from '../components/AppBar';
import styles from '../styles/RenewMembershipStyle';
import { SettingsContext } from '../context/SettingsContext';
import { countryData } from '../data/countryData';

export default function RenewMembership({ route, navigation }) {
  const { settings } = useContext(SettingsContext);
  const { member } = route.params;

  // Get currency symbol based on member's country
  const memberCountry = member?.country || 'India';
  const memberCurrencySymbol =
    countryData[memberCountry]?.currencySymbol || '₹';

  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [renewDate, setRenewDate] = useState('');
  const [showRenewDatePicker, setShowRenewDatePicker] = useState(false);
  const [discount, setDiscount] = useState('');
  const [totalAmount, setTotalAmount] = useState('0');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [currentMembership, setCurrentMembership] = useState(null);

  useEffect(() => {
    fetchPlans();
    fetchCurrentMembership();
  }, []);

  const fetchCurrentMembership = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const res = await api.get(`/api/renew/${member._id || member.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCurrentMembership(res.data);
    } catch (err) {
      console.error('Error fetching current membership:', err);
    }
  };

  // Auto-fill renew date based on current membership
  useEffect(() => {
    if (currentMembership && currentMembership.expiry_date) {
      const expiryDate = new Date(currentMembership.expiry_date);
      const today = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);

      let suggestedRenewDate;

      if (expiryDate < oneMonthAgo) {
        // Expired more than 1 month ago - use today's date
        suggestedRenewDate = today;
      } else {
        // Expired recently or still active - use expiry date
        suggestedRenewDate = expiryDate;
      }

      setRenewDate(formatDisplayDate(suggestedRenewDate));
    }
  }, [currentMembership]);

  // Auto-calculate total when plan or discount changes
  useEffect(() => {
    if (selectedPlan) {
      const planPrice = Number(selectedPlan.price) || 0;
      const discountAmount = Number(discount);
      const validDiscount = Math.min(discountAmount, planPrice);
      const total = Math.max(0, planPrice - validDiscount);

      setDiscount(validDiscount.toString());
      setTotalAmount(total.toString());
    }
  }, [selectedPlan, discount]);

  const formatDisplayDate = date => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const res = await api.get('/api/plans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(res.data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      Alert.alert('Error', 'Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelect = planId => {
    const plan = plans.find(p => String(p.id) === String(planId));
    setSelectedPlanId(planId);
    setSelectedPlan(plan);
  };

  const calculateExpiryDate = () => {
    if (!selectedPlan || !renewDate) return 'N/A';

    // Parse renew date (DD-MM-YYYY format)
    const [day, month, year] = renewDate.split('-').map(Number);
    const startDate = new Date(year, month - 1, day);
    const expiry = new Date(startDate);

    const value = parseInt(selectedPlan.duration_value, 10);
    const unit = selectedPlan.duration_unit?.toLowerCase();

    if (unit === 'day') expiry.setDate(expiry.getDate() + value);
    if (unit === 'week') expiry.setDate(expiry.getDate() + value * 7);
    if (unit === 'month') expiry.setMonth(expiry.getMonth() + value);
    if (unit === 'year') expiry.setFullYear(expiry.getFullYear() + value);

    return expiry.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDuration = (value, unit) => {
    const u = unit?.toUpperCase();

    if (u === 'DAY') return `${value} ${value > 1 ? 'Days' : 'Day'}`;
    if (u === 'WEEK') return `${value} ${value > 1 ? 'Weeks' : 'Week'}`;
    if (u === 'MONTH') return `${value} ${value > 1 ? 'Months' : 'Month'}`;
    if (u === 'YEAR') return `${value} ${value > 1 ? 'Years' : 'Year'}`;

    return `${value} Days`;
  };

  const renew = async () => {
    if (!selectedPlanId) {
      return Alert.alert('Error', 'Please select a plan');
    }

    if (!renewDate) {
      return Alert.alert('Error', 'Please select renew date');
    }

    setSubmitting(true);

    try {
      const token = await AsyncStorage.getItem('token');
      await api.post(
        '/api/renew',
        {
          memberId: member._id || member.id,
          planId: selectedPlanId,
          renewDate: renewDate,
          discount: Number(discount),
          totalAmount: Number(totalAmount),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Alert.alert('Success', 'Membership renewed successfully!', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Error renewing membership:', error);
      Alert.alert('Error', 'Failed to renew membership. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppBar
          title="Renew Membership"
          backAction={
            <Appbar.BackAction
              iconColor="#fff"
              onPress={() => navigation.goBack()}
            />
          }
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading plans...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar
        title="Renew Membership"
        backAction={
          <Appbar.BackAction
            iconColor="#fff"
            onPress={() => navigation.goBack()}
          />
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Member Info Card */}
        <View style={styles.memberCard}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {(member.fullName || member.firstName)
                ?.charAt(0)
                ?.toUpperCase() || ''}
            </Text>
          </View>
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>
              {member.fullName || `${member.firstName} ${member.lastName}`}
            </Text>
            <Text style={styles.memberPhone}>{member.phone}</Text>
          </View>
        </View>

        {/* New Plan Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select New Plan</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Plan *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedPlanId}
                onValueChange={handlePlanSelect}
              >
                <Picker.Item label="Select Plan" value="" />
                {plans.map(p => (
                  <Picker.Item
                    key={p.id}
                    label={`${p.plan_name} • ${formatDuration(
                      p.duration_value,
                      p.duration_unit,
                    )} • ${settings?.currencySymbol || '₹'}${p.price}`}
                    value={String(p.id)}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Renew Date */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Renew Date *</Text>
            <TouchableOpacity
              style={styles.dateInputContainer}
              onPress={() => setShowRenewDatePicker(true)}
            >
              <Text
                style={renewDate ? styles.dateText : styles.datePlaceholder}
              >
                {renewDate || 'Select renew date'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Discount */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Discount (Optional)</Text>
            <View style={styles.priceInputContainer}>
              <Text style={styles.currencySymbol}>
                {settings?.currencySymbol || '₹'}
              </Text>
              <TextInput
                style={[
                  styles.priceInput,
                  focusedField === 'discount' && styles.inputFocused,
                ]}
                placeholder="Enter discount"
                keyboardType="numeric"
                value={discount}
                onChangeText={setDiscount}
                onFocus={() => setFocusedField('discount')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          {/* Plan Details */}
          {selectedPlan && (
            <View style={styles.planDetailsCard}>
              <View style={styles.planDetailRow}>
                <Text style={styles.planDetailLabel}>Duration:</Text>
                <Text style={styles.planDetailValue}>
                  {formatDuration(
                    selectedPlan.duration_value,
                    selectedPlan.duration_unit,
                  )}
                </Text>
              </View>
              <View style={styles.planDetailRow}>
                <Text style={styles.planDetailLabel}>Plan Price:</Text>
                <Text style={styles.planDetailValue}>
                  {memberCurrencySymbol}
                  {selectedPlan.price}
                </Text>
              </View>
              <View style={styles.planDetailRow}>
                <Text style={styles.planDetailLabel}>Renew Date:</Text>
                <Text style={styles.planDetailValue}>{renewDate}</Text>
              </View>
              <View style={styles.planDetailRow}>
                <Text style={styles.planDetailLabel}>Expiry Date:</Text>
                <Text style={[styles.planDetailValue, styles.expiryText]}>
                  {calculateExpiryDate()}
                </Text>
              </View>
              <View style={styles.planDetailRow}>
                <Text style={styles.planDetailLabel}>Discount:</Text>
                <Text style={styles.planDetailValue}>
                  {memberCurrencySymbol}
                  {discount || '0'}
                </Text>
              </View>
              <View style={styles.planDetailRow}>
                <Text style={styles.planDetailLabel}>Total Amount:</Text>
                <Text style={styles.planDetailValue}>
                  {memberCurrencySymbol}
                  {totalAmount}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Renew Button */}
        <TouchableOpacity
          style={[styles.renewButton, submitting && styles.renewButtonDisabled]}
          onPress={renew}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.renewButtonText}>🔄 Renew Membership</Text>
          )}
        </TouchableOpacity>

        {/* Renew Date Picker */}
        {showRenewDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            onChange={(e, d) => {
              setShowRenewDatePicker(false);
              if (e.type === 'set' && d) {
                setRenewDate(formatDisplayDate(d));
              }
            }}
          />
        )}
      </ScrollView>
    </View>
  );
}
