import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Appbar } from 'react-native-paper';
import AppBar from '../components/AppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPaymentHistory } from '../api';
import { countryData } from '../data/countryData';
import { SettingsContext } from '../context/SettingsContext';

export default function PaymentHistory({ navigation, route }) {
  const { member } = route.params;
  console.log('PaymentHistory member:', member);

  // Get currency symbol: prefer admin settings, fall back to member country
  const { settings } = useContext(SettingsContext);
  const memberCountry = member?.country || 'India';
  const memberCurrencySymbol =
    settings?.currencySymbol ||
    countryData[memberCountry]?.currencySymbol ||
    '₹';
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const loadPaymentHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const memberId = member._id || member.id;
      console.log('Using memberId for payments:', memberId);
      const history = await getPaymentHistory(memberId, token);
      console.log('Payment history received:', history);
      setPayments(history);
    } catch (error) {
      console.error('Error loading payment history:', error);
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

  const getTotalPaid = () => {
    return payments.reduce(
      (sum, payment) => sum + parseFloat(payment.amount || 0),
      0,
    );
  };

  const handlePaymentPress = payment => {
    const receiptData = {
      receiptNo: payment.id || payment._id,
      paymentDate: formatDate(payment.payment_date || payment.created_at),
      memberName: member.name,
      mobile: member.phone,
      planName: payment.plan_name || member.plan,
      joinDate: formatDate(payment.joining_date || member.joiningDate),
      expiryDate: formatDate(payment.expiry_date || member.expiryDate),
      amount: parseFloat(payment.amount || 0),
      discount: parseFloat(payment.discount || 0),
      paidAmount:
        parseFloat(payment.amount || 0) - parseFloat(payment.discount || 0),
    };
    navigation.navigate('ReceiptScreen', { receiptData });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <AppBar
          title="Payment History"
          backAction={
            <Appbar.BackAction
              iconColor="#fff"
              onPress={() => navigation.goBack()}
            />
          }
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading payment history...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar
        title="Payment History"
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
          <Text style={styles.memberId}>ID: {member._id || member.id}</Text>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Payment Summary</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Payments</Text>
              <Text style={styles.summaryValue}>{payments.length}</Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Total Amount</Text>
              <Text style={[styles.summaryValue, styles.amountText]}>
                {memberCurrencySymbol}
                {getTotalPaid().toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment History List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction History</Text>

          {payments.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={styles.emptyText}>No payment history found</Text>
              <Text style={styles.emptySubtext}>
                Payments will appear here once recorded
              </Text>
            </View>
          ) : (
            <View style={styles.tableContainer}>
              {/* Table Header */}
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, styles.dateColumn]}>
                  Date
                </Text>
                <Text style={[styles.tableHeaderText, styles.planColumn]}>
                  Plan
                </Text>
                <Text style={[styles.tableHeaderText, styles.amountColumn]}>
                  Amount
                </Text>
              </View>

              {/* Table Rows */}
              {payments.map((payment, index) => (
                <TouchableOpacity
                  key={payment.id || index}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 && styles.tableRowEven,
                  ]}
                  onPress={() => handlePaymentPress(payment)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.tableCell, styles.dateColumn]}>
                    {formatDate(payment.payment_date || payment.created_at)}
                  </Text>
                  <Text style={[styles.tableCell, styles.planColumn]}>
                    {payment.plan_name || 'N/A'}
                  </Text>
                  <Text
                    style={[
                      styles.tableCell,
                      styles.amountColumn,
                      styles.amountCellText,
                    ]}
                  >
                    {memberCurrencySymbol}
                    {parseFloat(payment.amount || 0).toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },

  /* Member Card */
  memberCard: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },

  memberName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },

  memberId: {
    fontSize: 13,
    color: '#666',
  },

  /* Summary Card */
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },

  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e0e0e0',
  },

  summaryLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },

  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  amountText: {
    color: '#16a34a',
  },

  /* Section */
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    letterSpacing: 0.3,
  },

  /* Table Container */
  tableContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  /* Table Header */
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  tableHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  /* Table Row */
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  tableRowEven: {
    backgroundColor: '#f9fafb',
  },

  tableCell: {
    fontSize: 14,
    color: '#1a1a1a',
  },

  /* Column Widths */
  dateColumn: {
    flex: 2,
  },

  planColumn: {
    flex: 2.5,
    paddingHorizontal: 8,
  },

  amountColumn: {
    flex: 1.5,
    textAlign: 'right',
  },

  amountCellText: {
    fontWeight: '600',
    color: '#16a34a',
  },

  /* Empty State */
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 8,
  },

  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },

  emptySubtext: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
});
