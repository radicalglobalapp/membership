import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import api from '../api';
import styles from '../styles/ForgotPasswordStyle';

export default function ForgotPassword() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const sendOTP = async () => {
    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setMessage({ type: 'error', text: 'Please enter your email' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/api/auth/forgot-password', {
        email: cleanEmail,
      });
      setMessage({
        type: 'success',
        text: res.data.msg || 'OTP sent to your email!',
      });
      setStep(2);
    } catch (error) {
      console.log('Send OTP error:', error.response?.data || error.message);
      setMessage({
        type: 'error',
        text:
          error.response?.data?.msg || 'Failed to send OTP. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async () => {
    const cleanOtp = otp.trim();
    const cleanPassword = newPassword.trim();

    if (!cleanOtp || !cleanPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await api.post('/api/auth/reset-password', {
        email: email.trim(),
        otp: cleanOtp,
        newPassword: cleanPassword,
      });
      setMessage({
        type: 'success',
        text: res.data.msg || 'Password reset successful!',
      });

      setTimeout(() => navigation.navigate('Login'), 2000);
    } catch (error) {
      console.log(
        'Reset password error:',
        error.response?.data || error.message,
      );
      setMessage({
        type: 'error',
        text:
          error.response?.data?.msg ||
          'Invalid OTP or reset failed. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          {step === 1
            ? 'Enter your email to receive a reset code'
            : 'Enter the OTP and your new password'}
        </Text>
      </View>

      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        <View style={[styles.step, step >= 1 && styles.stepActive]}>
          <Text style={[styles.stepText, step >= 1 && styles.stepTextActive]}>
            1
          </Text>
        </View>
        <View
          style={[styles.stepLine, step === 2 && styles.stepLineCompleted]}
        />
        <View style={[styles.step, step === 2 && styles.stepActive]}>
          <Text style={[styles.stepText, step === 2 && styles.stepTextActive]}>
            2
          </Text>
        </View>
      </View>

      {/* Messages */}
      {message.text !== '' && (
        <View
          style={
            message.type === 'success'
              ? styles.successMessage
              : styles.errorMessage
          }
        >
          <Text
            style={
              message.type === 'success' ? styles.successText : styles.errorText
            }
          >
            {message.text}
          </Text>
        </View>
      )}

      {/* Form */}
      <View style={styles.form}>
        {step === 1 ? (
          <>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'email' && styles.inputFocused,
                ]}
                placeholder="Enter your email"
                onChangeText={setEmail}
                value={email}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {/* Send OTP Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={sendOTP}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Info Text */}
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                We've sent a verification code to {email}
              </Text>
            </View>

            {/* OTP Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'otp' && styles.inputFocused,
                ]}
                placeholder="Enter 6-digit OTP"
                onChangeText={setOtp}
                value={otp}
                keyboardType="number-pad"
                maxLength={6}
                editable={!loading}
                onFocus={() => setFocusedField('otp')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {/* New Password Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={[
                  styles.input,
                  focusedField === 'password' && styles.inputFocused,
                ]}
                placeholder="Create a new password"
                secureTextEntry
                onChangeText={setNewPassword}
                value={newPassword}
                editable={!loading}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
              />
            </View>

            {/* Reset Password Button */}
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={resetPassword}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Reset Password</Text>
              )}
            </TouchableOpacity>

            {/* Resend OTP */}
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary, { marginTop: 12 }]}
              onPress={sendOTP}
              disabled={loading}
            >
              <Text style={styles.buttonSecondaryText}>Resend OTP</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Remember your password?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Login')}
          >
            Login
          </Text>
        </Text>
      </View>
    </View>
  );
}
