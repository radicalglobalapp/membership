import React, { useState, useCallback, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Appbar, RadioButton } from 'react-native-paper';

import api from '../api';
import styles from '../styles/RegisterMemberStyle';
import AppBar from '../components/AppBar';
import { SettingsContext } from '../context/SettingsContext';
import { countryData } from '../data/countryData';

export default function RegisterMember({ navigation }) {
  const { settings } = useContext(SettingsContext);

  /* -------------------- STATE -------------------- */
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    gender: '',
    dob: '',
    joiningDate: '',
    expiryDate: '',
    planName: '',
    plan: '',
    discount: '',
    totalAmount: '',
    paymentStatus: '',
  });

  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showDobPicker, setShowDobPicker] = useState(false);
  const [showJoiningPicker, setShowJoiningPicker] = useState(false);

  const route = useRoute();
  const member = route.params?.member;

  /* -------------------- UTILS -------------------- */
  const formatDisplayDate = date => {
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const y = date.getFullYear();
    return `${d}-${m}-${y}`;
  };

  const parseDisplayDate = str => {
    if (!str) return '';
    const parts = str.split(' ');
    if (parts.length !== 3) return '';
    const day = parts[0];
    const monthMap = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };
    const month = monthMap[parts[1]];
    const year = parts[2];
    return `${day}-${month}-${year}`;
  };

  /* -------------------- FETCH PLANS -------------------- */
  useFocusEffect(
    useCallback(() => {
      const fetchPlans = async () => {
        try {
          setLoadingPlans(true);
          const token = await AsyncStorage.getItem('token');
          const res = await api.get('/api/plans', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setPlans(Array.isArray(res.data) ? res.data : []);
        } catch {
          setPlans([]);
        } finally {
          setLoadingPlans(false);
        }
      };
      fetchPlans();
    }, []),
  );

  /* -------------------- TOTAL CALCULATION -------------------- */
  useEffect(() => {
    const plan = plans.find(p => String(p.id) === String(form.plan));
    if (plan) {
      const price = Number(plan.price) || 0;
      const discountEntered = Number(form.discount) || 0;

      const validDiscount = Math.min(discountEntered, price);

      setForm(p => ({
        ...p,
        discount: validDiscount.toString(),
        totalAmount: (price - validDiscount).toString(),
      }));
    }
  }, [form.plan, form.discount, plans]);

  /* -------------------- EXPIRY DATE CALCULATION -------------------- */
  useEffect(() => {
    const plan = plans.find(p => String(p.id) === String(form.plan));
    if (plan && form.joiningDate) {
      const [dd, mm, yyyy] = form.joiningDate.split('-').map(Number);
      const date = new Date(yyyy, mm - 1, dd);

      const value = parseInt(plan.duration_value, 10);
      const unit = plan.duration_unit.toLowerCase();

      if (unit === 'day') date.setDate(date.getDate() + value);
      if (unit === 'week') date.setDate(date.getDate() + value * 7);
      if (unit === 'month') date.setMonth(date.getMonth() + value);
      if (unit === 'year') date.setFullYear(date.getFullYear() + value);

      setForm(p => ({ ...p, expiryDate: formatDisplayDate(date) }));
    }
  }, [form.joiningDate, form.plan, plans]);

  /* -------------------- POPULATE FORM FOR EDIT -------------------- */
  useEffect(() => {
    if (member) {
      setForm({
        firstName: member.name ? member.name.split(' ')[0] : '',
        lastName: member.name ? member.name.split(' ').slice(1).join(' ') : '',
        email: member.email || '',
        phone: member.phone || '',
        address: member.address || '',
        country: member.country || '',
        gender: member.gender || '',
        dob: member.dob || '',
        joiningDate: member.joiningDate
          ? parseDisplayDate(member.joiningDate)
          : '',
        expiryDate: member.expiryDate
          ? parseDisplayDate(member.expiryDate)
          : '',
        planName: member.plan_name || '',
        plan: String(member.planId || ''),
        discount: String(member.discount || ''),
        totalAmount: String(member.totalAmount || ''),
        paymentStatus: member.paymentStatus === 'Paid' ? 'PAID' : 'NOT_PAID',
      });
    }
  }, [member]);

  /* -------------------- SUBMIT -------------------- */
  const submit = async () => {
    if (!form.firstName.trim())
      return Alert.alert('Validation Error', 'First name is required');

    if (!form.lastName.trim())
      return Alert.alert('Validation Error', 'Last name is required');

    if (!/^\d{10}$/.test(form.phone))
      return Alert.alert(
        'Validation Error',
        'Enter valid 10-digit phone number',
      );

    if (form.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email))
        return Alert.alert('Validation Error', 'Invalid email address');
    }

    if (!form.dob)
      return Alert.alert('Validation Error', 'Date of birth is required');

    if (!form.joiningDate)
      return Alert.alert('Validation Error', 'Joining date is required');

    if (!form.plan)
      return Alert.alert('Validation Error', 'Please select a plan');

    if (!form.paymentStatus && Number(form.totalAmount) > 0)
      return Alert.alert('Validation Error', 'Select payment status');

    setSubmitting(true);

    try {
      const token = await AsyncStorage.getItem('token');

      if (member) {
        // Update existing member
        await api.put(
          `/api/members/${member._id}`,
          {
            ...form,
            planId: form.plan,
            discount: Number(form.discount || 0),
            totalAmount: Number(form.totalAmount || 0),
            paymentStatus: form.paymentStatus === 'PAID' ? 'Paid' : 'Not Paid',
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        Alert.alert('Success', 'Member updated successfully');
      } else {
        // Register new member
        await api.post(
          '/api/members/register',
          {
            ...form,
            planId: form.plan,
            discount: Number(form.discount || 0),
            totalAmount: Number(form.totalAmount || 0),
            paymentStatus: form.paymentStatus === 'PAID' ? 'Paid' : 'Not Paid',
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );

        Alert.alert('Success', 'Member registered successfully');
      }

      navigation.goBack();
    } catch (error) {
      console.error('Submit error:', error.response?.data || error.message);
      const errorMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Unknown error';
      Alert.alert(
        'Error',
        member
          ? `Update failed: ${errorMsg}`
          : `Registration failed: ${errorMsg}`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <View style={styles.container}>
      <AppBar
        title={member ? 'Edit Member' : 'Register Member'}
        backAction={
          <Appbar.BackAction iconColor="#fff" onPress={navigation.goBack} />
        }
      />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid
        keyboardShouldPersistTaps="handled"
      >
        {/* ---------- NAME ---------- */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Name *</Text>
          <View style={styles.nameRow}>
            <TextInput
              placeholder="First Name"
              style={[styles.input, styles.nameInput]}
              value={form.firstName}
              onChangeText={t => setForm(p => ({ ...p, firstName: t }))}
            />
            <TextInput
              placeholder="Last Name"
              style={[styles.input, styles.nameInput]}
              value={form.lastName}
              onChangeText={t => setForm(p => ({ ...p, lastName: t }))}
            />
          </View>
        </View>

        {/* ---------- PHONE ---------- */}
        <View style={styles.inlineRow}>
          <Text style={styles.inlineLabel}>Phone *</Text>
          <View style={styles.phoneWrapper}>
            <View style={styles.phoneCodeBox}>
              <Text style={styles.phoneCodeText}>
                {settings?.phoneCode || '+91'}
              </Text>
            </View>
            <TextInput
              placeholder="10-digit number"
              style={styles.inlineInput}
              keyboardType="numeric"
              maxLength={10}
              value={form.phone}
              onChangeText={t =>
                setForm(p => ({ ...p, phone: t.replace(/[^0-9]/g, '') }))
              }
            />
          </View>
        </View>

        {/* ---------- EMAIL ---------- */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="email address"
            style={styles.input}
            keyboardType="email-address"
            value={form.email}
            onChangeText={t => setForm(p => ({ ...p, email: t }))}
          />
        </View>

        {/* ---------- ADDRESS ---------- */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            placeholder="your address"
            style={[styles.input, styles.textArea]}
            multiline
            value={form.address}
            onChangeText={t => setForm(p => ({ ...p, address: t }))}
          />
        </View>

        {/* ---------- GENDER ---------- */}
        <View style={styles.inlineRow}>
          <Text style={styles.inlineLabel2}>Gender</Text>
          <RadioButton.Group
            value={form.gender}
            onValueChange={v => setForm(p => ({ ...p, gender: v }))}
          >
            <View style={styles.genderRow}>
              {['Male', 'Female', 'Other'].map(g => (
                <View key={g} style={styles.radioItem}>
                  <RadioButton value={g} />
                  <Text style={styles.radioText}>{g}</Text>
                </View>
              ))}
            </View>
          </RadioButton.Group>
        </View>

        {/* ---------- DOB ---------- */}
        <View style={styles.inlineRow}>
          <Text style={styles.inlineLabel}>DOB *</Text>
          <TouchableOpacity
            style={styles.inlineInput}
            onPress={() => setShowDobPicker(true)}
          >
            <Text style={form.dob ? styles.inputText : styles.placeholderText}>
              {form.dob || 'Select DOB'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ---------- PLAN ---------- */}
        <View style={styles.inlineRow}>
          <Text style={styles.inlineLabel}>Plan *</Text>
          <View style={styles.pickerBox}>
            {loadingPlans ? (
              <ActivityIndicator />
            ) : (
              <Picker
                selectedValue={form.plan}
                onValueChange={v => setForm(p => ({ ...p, plan: v }))}
              >
                <Picker.Item label="Select Plan" value="" />
                {plans.map(p => {
                  const currencySymbol = form.country
                    ? countryData[form.country]?.currencySymbol
                    : settings?.currencySymbol || '₹';
                  return (
                    <Picker.Item
                      key={p.id}
                      label={`${p.plan_name} • ${p.duration_value} ${p.duration_unit} • ${currencySymbol}${p.price}`}
                      value={String(p.id)}
                    />
                  );
                })}
              </Picker>
            )}
          </View>
        </View>

        {/* ---------- JOINING DATE ---------- */}
        <View style={styles.inlineRow}>
          <Text style={styles.inlineLabel}>Joining *</Text>
          <TouchableOpacity
            style={styles.inlineInput}
            onPress={() => setShowJoiningPicker(true)}
          >
            <Text style={styles.inputText}>
              {form.joiningDate || 'Select Joining Date'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ---------- EXPIRY ---------- */}
        <View style={styles.inlineRow}>
          <Text style={styles.inlineLabel}>Expiry</Text>
          <View style={styles.noBorderInput}>
            <Text style={styles.inputText}>{form.expiryDate}</Text>
          </View>
        </View>

        {/* ---------- DISCOUNT ---------- */}
        <View style={styles.inlineRow}>
          <Text style={styles.inlineLabel}>Discount</Text>
          <TextInput
            style={styles.inlineInput}
            keyboardType="numeric"
            value={form.discount}
            onChangeText={t =>
              setForm(p => ({ ...p, discount: t.replace(/[^0-9]/g, '') }))
            }
          />
        </View>

        {/* ---------- TOTAL ---------- */}
        <View style={styles.inlineRow}>
          <Text style={styles.inlineLabel}>Total</Text>
          <View style={styles.noBorderInput}>
            <Text style={styles.totalText}>
              {(() => {
                const currencySymbol = form.country
                  ? countryData[form.country]?.currencySymbol
                  : settings?.currencySymbol || '₹';
                return `${currencySymbol} ${form.totalAmount}`;
              })()}
            </Text>
          </View>
        </View>

        {/* ---------- PAYMENT ---------- */}
        <View style={styles.inlineRow}>
          <Text style={styles.inlineLabel}>Payment</Text>
          <View style={styles.inlinePickerBox}>
            <Picker
              selectedValue={form.paymentStatus}
              onValueChange={v => setForm(p => ({ ...p, paymentStatus: v }))}
            >
              <Picker.Item label="Select" value="" />
              <Picker.Item label="Paid" value="PAID" />
              <Picker.Item label="Not Paid" value="NOT_PAID" />
            </Picker>
          </View>
        </View>

        {/* ---------- SUBMIT ---------- */}
        <TouchableOpacity
          style={[
            styles.registerButton,
            submitting && styles.registerButtonDisabled,
          ]}
          onPress={submit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Submit</Text>
          )}
        </TouchableOpacity>

        {/* ---------- DATE PICKERS ---------- */}
        {showDobPicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            maximumDate={new Date()}
            onChange={(e, d) => {
              setShowDobPicker(false);
              if (e.type === 'set' && d) {
                setForm(p => ({ ...p, dob: formatDisplayDate(d) }));
              }
            }}
          />
        )}

        {showJoiningPicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            onChange={(e, d) => {
              setShowJoiningPicker(false);
              if (e.type === 'set' && d) {
                setForm(p => ({
                  ...p,
                  joiningDate: formatDisplayDate(d),
                }));
              }
            }}
          />
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}
