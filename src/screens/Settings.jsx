import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { Appbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AppBar from '../components/AppBar';
import styles from '../styles/SettingsStyle';
import { SettingsContext } from '../context/SettingsContext';
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { countryData } from '../data/countryData';
import { countryConfig } from '../utils/countryConfig';

export default function Settings({ navigation }) {
  const { settings, setSettings, updateSettings } = useContext(SettingsContext);

  // User profile fields
  const [fullName, setFullName] = useState('');
  const [studioName, setStudioName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [country, setCountry] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editingField, setEditingField] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');

  // Temporary values for editing
  const [tempName, setTempName] = useState('');
  const [tempStudio, setTempStudio] = useState('');
  const [tempMobile, setTempMobile] = useState('');
  const [tempEmail, setTempEmail] = useState('');

  const allCountries = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Antigua and Barbuda',
    'Argentina',
    'Armenia',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bhutan',
    'Bolivia',
    'Bosnia and Herzegovina',
    'Botswana',
    'Brazil',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cabo Verde',
    'Cambodia',
    'Cameroon',
    'Canada',
    'Central African Republic',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Comoros',
    'Congo',
    'Costa Rica',
    'Croatia',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Eritrea',
    'Estonia',
    'Eswatini',
    'Ethiopia',
    'Fiji',
    'Finland',
    'France',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Greece',
    'Grenada',
    'Guatemala',
    'Guinea',
    'Guinea-Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kiribati',
    'Kosovo',
    'Kuwait',
    'Kyrgyzstan',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Marshall Islands',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Micronesia',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Morocco',
    'Mozambique',
    'Myanmar',
    'Namibia',
    'Nauru',
    'Nepal',
    'Netherlands',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'North Korea',
    'North Macedonia',
    'Norway',
    'Oman',
    'Pakistan',
    'Palau',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Qatar',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Kitts and Nevis',
    'Saint Lucia',
    'Saint Vincent and the Grenadines',
    'Samoa',
    'San Marino',
    'Sao Tome and Principe',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'Solomon Islands',
    'Somalia',
    'South Africa',
    'South Korea',
    'South Sudan',
    'Spain',
    'Sri Lanka',
    'Sudan',
    'Suriname',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    'Timor-Leste',
    'Togo',
    'Tonga',
    'Trinidad and Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Tuvalu',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'United States',
    'Uruguay',
    'Uzbekistan',
    'Vanuatu',
    'Vatican City',
    'Venezuela',
    'Vietnam',
    'Yemen',
    'Zambia',
    'Zimbabwe',
  ];

  const filteredCountries = allCountries.filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase()),
  );

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoadingProfile(true);
      const token = await AsyncStorage.getItem('token');
      const res = await api.get('/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = res.data;
      setFullName(profile.fullName || profile.name || '');
      setStudioName(profile.studioName || '');
      setEmail(profile.email || '');
      setMobile(profile.mobile || profile.phone || '');
      setCountry(profile.country || 'India');
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoadingProfile(false);
    }
  };

  const startEditing = field => {
    setEditingField(field);
    if (field === 'name') setTempName(fullName);
    if (field === 'studio') setTempStudio(studioName);
    if (field === 'mobile') setTempMobile(mobile);
    if (field === 'email') setTempEmail(email);
  };

  const cancelEditing = () => {
    setEditingField(null);
    setTempName('');
    setTempStudio('');
    setTempMobile('');
    setTempEmail('');
  };

  const saveField = async field => {
    let value = '';
    let fieldName = '';

    if (field === 'name') {
      value = tempName.trim();
      fieldName = 'Name';
      if (!value) {
        Alert.alert('Error', 'Name cannot be empty');
        return;
      }
    } else if (field === 'studio') {
      value = tempStudio.trim();
      fieldName = 'Studio Name';
    } else if (field === 'mobile') {
      value = tempMobile.trim();
      fieldName = 'Phone Number';
      if (!value || value.length < 10) {
        Alert.alert('Error', 'Please enter a valid phone number');
        return;
      }
    } else if (field === 'email') {
      value = tempEmail.trim();
      fieldName = 'Email';
      if (!value || !/\S+@\S+\.\S+/.test(value)) {
        Alert.alert('Error', 'Please enter a valid email');
        return;
      }
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const payload = {
        fullName: field === 'name' ? value : fullName,
        studioName: field === 'studio' ? value : studioName,
        email: field === 'email' ? value : email,
        mobile: field === 'mobile' ? value : mobile,
        country: country,
      };

      await api.put('/api/profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update state
      if (field === 'name') setFullName(value);
      if (field === 'studio') setStudioName(value);
      if (field === 'mobile') setMobile(value);
      if (field === 'email') setEmail(value);

      Alert.alert('Success', `${fieldName} updated successfully`);
      setEditingField(null);
    } catch (error) {
      console.error('Failed to update:', error);
      Alert.alert('Error', 'Failed to update. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateCountry = async selectedCountry => {
    setLoading(true);
    try {
      // Update app settings instead of user profile
      await updateSettings(selectedCountry);

      // Update local user profile country (for display purposes)
      const token = await AsyncStorage.getItem('token');
      await api.put(
        '/api/profile',
        {
          fullName,
          studioName,
          email,
          mobile,
          country: selectedCountry,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Update local state
      setCountry(selectedCountry);

      Alert.alert('Success', 'Country updated successfully');
    } catch (error) {
      console.error('Failed to update country:', error);
      Alert.alert('Error', 'Failed to update country');
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    if (!currentPassword) {
      Alert.alert('Error', 'Please enter your current password');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      await api.put(
        '/api/change-password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      Alert.alert('Success', 'Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);
    } catch (error) {
      console.error('Failed to change password:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to change password',
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <View style={styles.container}>
        <AppBar
          title="Settings"
          backAction={
            <Appbar.BackAction
              iconColor="#fff"
              onPress={() => navigation.goBack()}
            />
          }
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00BCD4" />
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar
        title="Settings"
        backAction={
          <Appbar.BackAction
            iconColor="#fff"
            onPress={() => navigation.goBack()}
          />
        }
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Name Field */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => startEditing('name')}
          disabled={editingField === 'name'}
        >
          <Icon name="account" size={24} color="#666" style={styles.icon} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Name</Text>
            {editingField === 'name' ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.editInput}
                  value={tempName}
                  onChangeText={setTempName}
                  placeholder="Enter your name"
                  autoFocus
                />
                <View style={styles.editActions}>
                  <TouchableOpacity
                    onPress={cancelEditing}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => saveField('name')}
                    style={styles.saveButtonSmall}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.saveText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={styles.settingValue}>{fullName || 'Not set'}</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Phone Number Field */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => startEditing('mobile')}
          disabled={editingField === 'mobile'}
        >
          <Icon name="phone" size={24} color="#666" style={styles.icon} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Phone number</Text>
            {editingField === 'mobile' ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.editInput}
                  value={tempMobile}
                  onChangeText={setTempMobile}
                  placeholder="Enter phone number"
                  keyboardType="phone-pad"
                  maxLength={10}
                  autoFocus
                />
                <View style={styles.editActions}>
                  <TouchableOpacity
                    onPress={cancelEditing}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => saveField('mobile')}
                    style={styles.saveButtonSmall}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.saveText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={styles.settingValue}>{mobile || 'Not set'}</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Email Field */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => startEditing('email')}
          disabled={editingField === 'email'}
        >
          <Icon name="email" size={24} color="#666" style={styles.icon} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Email</Text>
            {editingField === 'email' ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.editInput}
                  value={tempEmail}
                  onChangeText={setTempEmail}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoFocus
                />
                <View style={styles.editActions}>
                  <TouchableOpacity
                    onPress={cancelEditing}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => saveField('email')}
                    style={styles.saveButtonSmall}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={styles.saveText}>Save</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Text style={styles.settingValue}>{email || 'Not set'}</Text>
            )}
          </View>
        </TouchableOpacity>

        {/* Country Field */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setShowCountryPicker(true)}
        >
          <Icon name="earth" size={24} color="#666" style={styles.icon} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Country</Text>
            <Text style={styles.settingValue}>
              {country
                ? `${countryConfig[country]?.phoneCode || ''} ${country}`
                : 'Not set'}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Password Field */}
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setShowPasswordModal(true)}
        >
          <Icon name="key" size={24} color="#666" style={styles.icon} />
          <View style={styles.settingContent}>
            <Text style={styles.settingLabel}>Password</Text>
            <Text style={styles.settingValue}>********</Text>
          </View>
        </TouchableOpacity>
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

            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search country..."
                value={countrySearch}
                onChangeText={setCountrySearch}
              />
            </View>

            <FlatList
              data={filteredCountries}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    country === item && styles.countryItemSelected,
                  ]}
                  onPress={() => {
                    updateCountry(item);
                    setShowCountryPicker(false);
                    setCountrySearch('');
                  }}
                >
                  <Text
                    style={[
                      styles.countryText,
                      country === item && styles.countryTextSelected,
                    ]}
                  >
                    {countryConfig[item]?.phoneCode
                      ? `${countryConfig[item].phoneCode} ${item}`
                      : item}
                  </Text>
                  {country === item && <Text style={styles.checkmark}>✓</Text>}
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

      {/* Password Change Modal */}
      <Modal
        visible={showPasswordModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <TouchableOpacity
                onPress={() => setShowPasswordModal(false)}
                style={styles.modalCloseButton}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.passwordForm}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>New Password *</Text>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password (min 6 chars)"
                  secureTextEntry
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm New Password *</Text>
                <TextInput
                  style={styles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry
                />
              </View>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={updatePassword}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>Change Password</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Save Changes Button */}
      <View style={styles.saveButtonContainer}>
        <TouchableOpacity
          style={[
            styles.saveChangesButton,
            loading && styles.saveButtonDisabled,
          ]}
          onPress={() =>
            Alert.alert('Success', 'All changes saved successfully')
          }
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveChangesText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
