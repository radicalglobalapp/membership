import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';
import styles from '../styles/DashboardStyle';
import AppBar from '../components/AppBar.jsx';
import { Appbar } from 'react-native-paper';

export default function Dashboard({ navigation }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await api.get('/api/dashboard', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(res.data.message);

      if (res.data.userName) {
        setUserName(res.data.userName);
      }
    } catch (error) {
      console.error('Failed to load dashboard:', error);

      if (error.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.replace('Login');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar
        title="Membership"
        backAction={<Appbar.Action icon="home" iconColor="#fff" />}
        action={
          <Appbar.Action icon="power" iconColor="#fff" onPress={logout} />
        }
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          <View style={styles.cardHalf}>
            <TouchableOpacity
              style={styles.cardInner}
              onPress={() => navigation.navigate('MemberListScreen')}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIcon, { backgroundColor: '#E8F5E9' }]}>
                <Text style={styles.cardIconText}>⚙️</Text>
              </View>
              <View>
                <Text style={styles.cardTitle}>Members List</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.cardHalf}>
            <TouchableOpacity
              style={styles.cardInner}
              onPress={() => navigation.navigate('AddPlan')}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIcon, { backgroundColor: '#F3E5F5' }]}>
                <Text style={styles.cardIconText}>📋</Text>
              </View>
              <View>
                <Text style={styles.cardTitle}> Plans</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.cardHalf}>
            <TouchableOpacity
              style={styles.cardInner}
              onPress={() => navigation.navigate('RegisterMember')}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIcon, { backgroundColor: '#E3F2FD' }]}>
                <Text style={styles.cardIconText}>👤</Text>
              </View>
              <View>
                <Text style={styles.cardTitle}>Add Member</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.cardHalf}>
            <TouchableOpacity
              style={styles.cardInner}
              onPress={() => navigation.navigate('ExpiryScreen')}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIcon, { backgroundColor: '#FFF3E0' }]}>
                <Text style={styles.cardIconText}>📊</Text>
              </View>
              <View>
                <Text style={styles.cardTitle}> Expiry Member</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.cardHalf}>
            <TouchableOpacity
              style={styles.cardInner}
              onPress={() => navigation.navigate('Settings')}
              activeOpacity={0.7}
            >
              <View style={[styles.cardIcon, { backgroundColor: '#FCE4EC' }]}>
                <Text style={styles.cardIconText}>🔧</Text>
              </View>
              <View>
                <Text style={styles.cardTitle}>Settings</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.quickActionCard}>
          <TouchableOpacity
            style={styles.quickActionTop}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('TransactionsScreen')}
          >
            <View style={styles.quickActionLeft}>
              <View
                style={[styles.quickActionIcon, { backgroundColor: '#E3F2FD' }]}
              >
                <Text style={styles.quickActionIconText}>📝</Text>
              </View>

              <Text style={styles.quickActionText}>View All Transactions</Text>
            </View>

            <Text style={styles.quickActionArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
