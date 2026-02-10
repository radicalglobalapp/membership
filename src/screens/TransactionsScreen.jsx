import React, { useEffect, useState, useCallback, useContext } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import { Appbar } from 'react-native-paper';
import api from '../api';
import AppBar from '../components/AppBar';
import styles from '../styles/TransactionsScreenStyle';
import { SettingsContext } from '../context/SettingsContext';

export default function TransactionsScreen({ navigation }) {
  const route = useRoute();
  const { settings } = useContext(SettingsContext);
  const currencySymbol = settings?.currencySymbol || '₹';
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState(
    route.params?.filter || 'all',
  );

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, []),
  );

  useEffect(() => {
    setFilteredTransactions(filterTransactions(transactions, activeFilter));
  }, [activeFilter, transactions]);

  const fetchTransactions = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await api.get('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allTransactions = res.data || [];
      setTransactions(allTransactions);
      setFilteredTransactions(
        filterTransactions(allTransactions, activeFilter),
      );
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const filterTransactions = (transactions, period) => {
    if (!period || period === 'all') return transactions;

    const now = new Date();
    let startDate;

    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return transactions;
    }

    return transactions.filter(t => {
      const transDate = new Date(
        t.transactionDate || t.joiningDate || t.created_at,
      );
      return transDate >= startDate;
    });
  };

  const onRefresh = () => {
    fetchTransactions(true);
  };

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTotalAmount = () => {
    return filteredTransactions.reduce(
      (sum, t) => sum + (Number(t.totalAmount) || 0),
      0,
    );
  };

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity
      style={styles.transactionRow}
      onPress={() => {
        const receiptData = {
          receiptNo: item.id,
          paymentDate: formatDate(item.transactionDate),
          memberName: item.memberName,
          mobile: item.mobile,
          planName: item.planName,
          joinDate: item.joinDate,
          expiryDate: item.expiryDate,
          amount: item.totalAmount,
          discount: item.discount,
          paidAmount: item.totalAmount - item.discount,
        };
        navigation.navigate('ReceiptScreen', { receiptData });
      }}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <Text style={styles.memberName}>
          {item.memberName || item.fullName || 'Unknown'}
        </Text>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.paymentDate}>
          {formatDate(
            item.paymentDate || item.joiningDate || item.transactionDate,
          )}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <AppBar
          title="Transaction History"
          backAction={
            <Appbar.BackAction
              iconColor="#fff"
              onPress={() => navigation.goBack()}
            />
          }
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading transactions...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar
        title="Transaction History"
        backAction={
          <Appbar.BackAction
            iconColor="#fff"
            onPress={() => navigation.goBack()}
          />
        }
      />

      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💳</Text>
          <Text style={styles.emptyTitle}>No Transactions</Text>
          <Text style={styles.emptyText}>
            Transaction history will appear here
          </Text>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Transactions:</Text>
              <Text style={styles.summaryValue}>
                {filteredTransactions.length}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Amount:</Text>
              <Text style={styles.summaryAmount}>
                {currencySymbol}
                {getTotalAmount().toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Filter Chips */}
          <View style={styles.filterRow}>
            {['All', 'Day', 'Week', 'Month', 'Year'].map(item => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.filterChip,
                  activeFilter === item.toLowerCase() &&
                    styles.activeFilterChip,
                ]}
                activeOpacity={0.7}
                onPress={() => setActiveFilter(item.toLowerCase())}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    activeFilter === item.toLowerCase() &&
                      styles.activeFilterChipText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Header Row */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerText}>Name</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.headerText}>Date</Text>
            </View>
          </View>

          {/* Transactions List */}
          <FlatList
            data={filteredTransactions}
            keyExtractor={item =>
              item.id?.toString() || Math.random().toString()
            }
            renderItem={renderTransactionItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={['#007AFF']}
              />
            }
          />
        </View>
      )}
    </View>
  );
}
