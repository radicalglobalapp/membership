import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { countryConfig } from '../utils/countryConfig';
import api from '../api';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    // Set up a listener for user data changes
    const unsubscribe = AsyncStorage.getItem('user').then(user => {
      if (user) {
        const userData = JSON.parse(user);
        const country = userData?.country || 'India';
        setSettings(countryConfig[country] || countryConfig['India']);
      }
    });
    setLoading(false);
  }, []);

  const fetchSettings = async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      if (userJson) {
        const user = JSON.parse(userJson);
        const country = user?.country || 'India';
        setSettings(countryConfig[country] || countryConfig['India']);
      } else {
        // Default to India if no user is found
        setSettings(countryConfig['India']);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setSettings(countryConfig['India']);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async country => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      const user = userJson ? JSON.parse(userJson) : {};

      // First, update the backend app_settings table
      const token = await AsyncStorage.getItem('token');
      await api.put(
        '/api/settings',
        { country },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      // Then update local storage
      const updatedUser = { ...user, country };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));

      setSettings(countryConfig[country] || countryConfig['India']);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
