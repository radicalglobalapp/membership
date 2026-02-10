import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api';
import { countryData } from '../data/countryData';
import styles from '../styles/SignupScreenStyle';

export default function Signup() {
  const navigation = useNavigation();
  const [data, setData] = useState({
    Username: '',
    email: '',
    mobile: '',
    password: '',
    country: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  // Get all countries from countryData
  const allCountries = Object.keys(countryData);

  // Filter countries based on search
  const filteredCountries = allCountries.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  const signup = async () => {
    const required = [
      { key: 'Username', label: 'Username' },
      { key: 'email', label: 'Email' },
      { key: 'mobile', label: 'Mobile' },
      { key: 'country', label: 'Country' },
      { key: 'password', label: 'Password' },
      { key: 'confirmPassword', label: 'Confirm Password' },
    ];

    const missing = required
      .filter(f => {
        if (f.key === 'confirmPassword')
          return !confirmPassword || confirmPassword.trim() === '';
        return !data[f.key] || data[f.key].toString().trim() === '';
      })
      .map(f => f.label);

    if (missing.length > 0) {
      const msg =
        missing.length === 1
          ? `${missing[0]} is required`
          : `Please fill: ${missing.join(', ')}`;
      alert(msg);
      return;
    }

    if (data.password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const payload = {
      Username: data.Username.trim(),
      email: data.email.trim(),
      mobile: data.mobile.trim(),
      country: data.country.trim(),
      password: data.password.trim(),
      ConfirmPassword: confirmPassword.trim(),
    };

    try {
      const res = await api.post('/api/auth/signup', payload);
      alert(res?.data?.msg || 'Signup Successful');
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
      const msg =
        error?.response?.data?.msg ||
        error.message ||
        'Signup failed. Please try again.';
      alert(msg);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'username' && styles.inputFocused,
              ]}
              placeholder="Enter your username"
              onChangeText={t => setData({ ...data, Username: t })}
              value={data.Username}
              autoCapitalize="none"
              onFocus={() => setFocusedField('username')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'email' && styles.inputFocused,
              ]}
              placeholder="Enter your email"
              onChangeText={t => setData({ ...data, email: t })}
              value={data.email}
              keyboardType="email-address"
              autoCapitalize="none"
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Mobile</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'mobile' && styles.inputFocused,
              ]}
              placeholder="Enter your mobile number"
              onChangeText={t => setData({ ...data, mobile: t })}
              value={data.mobile}
              keyboardType="phone-pad"
              onFocus={() => setFocusedField('mobile')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Country</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowCountryPicker(true)}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.pickerText, !data.country && styles.placeholder]}
              >
                {data.country && countryData[data.country]
                  ? `${countryData[data.country].phoneCode} ${data.country}`
                  : 'Select your country'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'password' && styles.inputFocused,
              ]}
              placeholder="Create a password"
              secureTextEntry
              onChangeText={t => setData({ ...data, password: t })}
              value={data.password}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              style={[
                styles.input,
                focusedField === 'confirmPassword' && styles.inputFocused,
              ]}
              placeholder="Confirm your password"
              secureTextEntry
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              onFocus={() => setFocusedField('confirmPassword')}
              onBlur={() => setFocusedField(null)}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={signup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account?{' '}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate('Login')}
              >
                Login
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Country Picker Modal */}
      <Modal
        visible={showCountryPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowCountryPicker(false);
          setCountrySearch('');
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowCountryPicker(false);
                  setCountrySearch('');
                }}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search country..."
                value={countrySearch}
                onChangeText={setCountrySearch}
                autoFocus={false}
              />
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    data.country === item && styles.countryItemSelected,
                  ]}
                  onPress={() => {
                    setData({ ...data, country: item });
                    setShowCountryPicker(false);
                    setCountrySearch('');
                  }}
                >
                  <Text
                    style={[
                      styles.countryText,
                      data.country === item && styles.countryTextSelected,
                    ]}
                  >
                    {`${countryData[item].phoneCode} ${item}`}
                  </Text>
                  {data.country === item && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No countries found</Text>
                </View>
              }
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
