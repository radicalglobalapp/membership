import React, { useState, memo, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { Appbar } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import AppBar from '../components/AppBar';
import api from '../api';
import styles from '../styles/AddplanStyle';
import { SettingsContext } from '../context/SettingsContext';

const RenderInput = memo(
  ({ label, value, placeholder, keyboardType, focused, onFocus, onChange }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, focused && styles.inputFocused]}
        placeholder={placeholder}
        value={value}
        keyboardType={keyboardType}
        onChangeText={onChange}
        onFocus={onFocus}
      />
    </View>
  ),
);

export default function AddPlan({ navigation }) {
  const { settings } = useContext(SettingsContext);

  const [planName, setPlanName] = useState('');
  const [durationValue, setDurationValue] = useState('');
  const [durationUnit, setDurationUnit] = useState('');
  const [price, setPrice] = useState('');

  const [showPlanDropdown, setShowPlanDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);

  const PlanUnits = [
    { value: 'Basic', label: 'Basic' },
    { value: 'Intermediate', label: 'Intermediate' },
    { value: 'Advanced', label: 'Advanced' },
    { value: 'Premium', label: 'Premium' },
  ];

  const durationUnits = [
    { value: 'DAY', label: 'Days' },
    { value: 'WEEK', label: 'Weeks' },
    { value: 'MONTH', label: 'Months' },
    { value: 'YEAR', label: 'Years' },
  ];

  const createPlan = async () => {
    if (!planName || !durationValue || !durationUnit || !price) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');

      await api.post(
        '/api/plans/create',
        {
          planName,
          durationValue: Number(durationValue),
          durationUnit,
          price: Number(price),
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Alert.alert('Success', 'Plan created successfully');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.response?.data?.msg || 'Failed to create plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar
        title="Create Plan"
        backAction={
          <Appbar.BackAction
            iconColor="#fff"
            onPress={() => navigation.goBack()}
          />
        }
      />

      <KeyboardAwareScrollView
        contentContainerStyle={styles.section}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={120}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Plan Name *</Text>

          <TouchableOpacity
            onPress={() => {
              setShowPlanDropdown(prev => !prev);
              setShowDurationDropdown(false);
            }}
          >
            <View style={styles.selectInput}>
              <Text
                style={[styles.selectText, !planName && styles.placeholderText]}
              >
                {planName || 'Select Plan Name'}
              </Text>

              <Icon
                name="chevron-down"
                size={20}
                color="#555"
                style={{
                  transform: [{ rotate: showPlanDropdown ? '180deg' : '0deg' }],
                }}
              />
            </View>
          </TouchableOpacity>

          {showPlanDropdown && (
            <View style={styles.dropdownMenu}>
              {PlanUnits.map(item => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setPlanName(item.value);
                    setShowPlanDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <RenderInput
          label="Number *"
          placeholder="Enter Number"
          value={durationValue}
          keyboardType="number-pad"
          focused={focusedField === 'number'}
          onFocus={() => {
            setFocusedField('number');
            setShowPlanDropdown(false);
            setShowDurationDropdown(false);
          }}
          onChange={text => setDurationValue(text.replace(/[^0-9]/g, ''))}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Duration Type *</Text>

          <TouchableOpacity
            onPress={() => {
              setShowDurationDropdown(prev => !prev);
              setShowPlanDropdown(false);
            }}
          >
            <View style={styles.selectInput}>
              <Text
                style={[
                  styles.selectText,
                  !durationUnit && styles.placeholderText,
                ]}
              >
                {durationUnit
                  ? durationUnits.find(d => d.value === durationUnit)?.label
                  : 'Select Duration Type'}
              </Text>

              <Icon
                name="chevron-down"
                size={20}
                color="#555"
                style={{
                  transform: [
                    {
                      rotate: showDurationDropdown ? '180deg' : '0deg',
                    },
                  ],
                }}
              />
            </View>
          </TouchableOpacity>

          {showDurationDropdown && (
            <View style={styles.dropdownMenu}>
              {durationUnits.map(item => (
                <TouchableOpacity
                  key={item.value}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setDurationUnit(item.value);
                    setShowDurationDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Price ({settings?.currency || 'INR'}) *
          </Text>
          <View style={styles.priceInputContainer}>
            <Text style={styles.currencySymbol}>
              {settings?.currencySymbol || '₹'}
            </Text>
            <TextInput
              style={styles.priceInput}
              placeholder="Amount"
              keyboardType="number-pad"
              value={price}
              onChangeText={t => setPrice(t.replace(/[^0-9]/g, ''))}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.createButton}
          onPress={createPlan}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.createButtonText}>Create Plan</Text>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </>
  );
}
