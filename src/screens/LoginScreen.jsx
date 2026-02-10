import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import api from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/LoginScreenStyle';

export default function Login() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      console.error('Email and password are required');
      return;
    }

    try {
      const res = await api.post('/api/auth/login', {
        email: cleanEmail,
        password: cleanPassword,
      });

      await AsyncStorage.setItem('token', res.data.token);
      // Save user data including country
      if (res.data.user) {
        await AsyncStorage.setItem('user', JSON.stringify(res.data.user));
      }
      navigation.replace('Dashboard');
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email or Username</Text>
        <TextInput
          style={[styles.input, emailFocused && styles.inputFocused]}
          placeholder="Enter your email or username"
          onChangeText={setEmail}
          value={email}
          autoCapitalize="none"
          onFocus={() => setEmailFocused(true)}
          onBlur={() => setEmailFocused(false)}
        />
      </View>

      <View style={styles.passwordInputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={[
            styles.input,
            passwordFocused && styles.inputFocused,
            styles.passwordInput,
          ]}
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          onChangeText={setPassword}
          value={password}
          onFocus={() => setPasswordFocused(true)}
          onBlur={() => setPasswordFocused(false)}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Icon
            name={showPassword ? 'visibility-off' : 'visibility'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.forgotContainer}>
        <Text
          style={styles.forgotText}
          onPress={() => navigation.navigate('ForgotPassword')}
        >
          Forgot your password?
        </Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Don't have an account?{' '}
          <Text
            style={styles.link}
            onPress={() => navigation.navigate('Signup')}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
}
