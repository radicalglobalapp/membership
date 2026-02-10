import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Appbar } from 'react-native-paper';
import AppBar from '../components/AppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRenewalHistory } from '../api';
import styles from '../styles/RenewalHistoryStyle';
import { SettingsContext } from '../context/SettingsContext';

export default function RenewalHistory({ navigation, route }) {
  const { member } = route.params;
  const { settings } = useContext(SettingsContext);
  const currencySymbol = settings?.currencySymbol || '₹';
  const [renewals, setRenewals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRenewalHistory();
  }, []);

  const loadRenewalHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const memberId = member._id || member.id;
      const history = await getRenewalHistory(memberId, token);
      setRenewals(history);
    } catch (error) {
      console.error('Error loading renewal history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppBar
          title="Renewal History"
          backAction={
            <Appbar.BackAction
              iconColor="#fff"
              onPress={() => navigation.goBack()}
            />
          }
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading renewal history...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar
        title="Renewal History"
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
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {member.name?.charAt(0).toUpperCase() || 'M'}
            </Text>
          </View>
          <Text style={styles.memberName}>{member.name}</Text>
          <Text style={styles.memberId}>
            Member ID: {member._id || member.id}
          </Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Renewal Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Renewals</Text>
              <Text style={styles.summaryValue}>{renewals.length}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Member Since</Text>
              <Text style={styles.summaryValueSmall}>
                {formatDate(member.joiningDate)}
              </Text>
            </View>
          </View>
        </View>
        {/* Renewal History List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Renewals</Text>

          {renewals.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🔄</Text>
              <Text style={styles.emptyText}>No renewal history found</Text>
              <Text style={styles.emptySubtext}>
                Renewal records will appear here once membership is renewed
              </Text>
            </View>
          ) : (
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.dateColumn]}>
                  Renewal Date
                </Text>
                <Text style={[styles.tableHeaderText, styles.planColumn]}>
                  Plan
                </Text>
                <Text style={[styles.tableHeaderText, styles.expiryColumn]}>
                  New Expiry
                </Text>
                <Text style={[styles.tableHeaderText, styles.amountColumn]}>
                  Amount
                </Text>
              </View>

              {/* Table Rows */}
              {renewals.map((renewal, index) => (
                <View
                  key={renewal.id || index}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 && styles.tableRowEven,
                  ]}
                >
                  <Text style={[styles.tableCell, styles.dateColumn]}>
                    {formatDate(renewal.renewal_date)}
                  </Text>
                  <Text style={[styles.tableCell, styles.planColumn]}>
                    {renewal.plan_name || 'N/A'}
                  </Text>
                  <Text style={[styles.tableCell, styles.expiryColumn]}>
                    {formatDate(renewal.new_expiry_date)}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.amountColumn,
                      styles.amountCellText,
                    ]}
                  >
                    {currencySymbol}
                    {parseFloat(
                      renewal.amount_paid || renewal.final_amount || 0,
                    ).toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
