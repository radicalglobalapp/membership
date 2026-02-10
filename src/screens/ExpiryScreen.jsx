import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  FlatList,
  Text,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appbar } from 'react-native-paper';

import api from '../api';
import AppBar from '../components/AppBar';
import styles from '../styles/ExpiryScreenStyle';

export default function ExpiryScreen({ navigation }) {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchData = async (isRefreshing = false) => {
    try {
      isRefreshing ? setRefreshing(true) : setLoading(true);

      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      const res = await api.get('/api/expiry/expiring', {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('API response:', res.data);

      const sortedMembers = (res.data || []).sort((a, b) => {
        if (a.remaining_days < 0 && b.remaining_days >= 0) return 1;
        if (a.remaining_days >= 0 && b.remaining_days < 0) return -1;
        return a.remaining_days - b.remaining_days;
      });

      console.log('Sorted members:', sortedMembers);

      setMembers(sortedMembers);
      setFilteredMembers(sortedMembers);
    } catch (err) {
      console.error('Fetch error:', err);
      setMembers([]);
      setFilteredMembers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  useEffect(() => {
    applyFilters();
  }, [searchQuery, activeFilter, members]);

  const applyFilters = () => {
    let filtered = [...members];

    if (activeFilter === 'expired') {
      filtered = filtered.filter(m => m.remaining_days < 0);
    } else if (activeFilter === 'expiring') {
      filtered = filtered.filter(
        m => m.remaining_days >= 0 && m.remaining_days <= 7,
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(m =>
        m.fullName?.toLowerCase().includes(query),
      );
    }

    setFilteredMembers(filtered);
  };

  const onRefresh = () => fetchData(true);

  const getUrgencyLevel = days => {
    if (days < 0) return 'expired';
    if (days <= 3) return 'critical';
    if (days <= 7) return 'warning';
    return 'safe';
  };

  const formatDate = date => {
    if (!date) return '';
    const [y, m, d] = date.split('T')[0].split('-');
    return `${d}-${m}-${y}`;
  };

  const getFilterCounts = () => {
    const expired = members.filter(m => m.remaining_days < 0).length;
    const expiring = members.filter(
      m => m.remaining_days >= 0 && m.remaining_days <= 7,
    ).length;
    return { expired, expiring, all: members.length };
  };

  const counts = getFilterCounts();

  const renderItem = ({ item }) => {
    const daysLeft = item.remaining_days;
    const urgency = getUrgencyLevel(daysLeft);

    return (
      <View style={styles.memberCard}>
        <View style={styles.leftContent}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>
              {item.fullName?.charAt(0)?.toUpperCase() || 'M'}
            </Text>
          </View>

          <View style={styles.memberInfo}>
            <Text style={styles.nameText}>{item.fullName}</Text>
            <Text style={styles.phoneText}>{item.phone}</Text>
          </View>
        </View>

        <View style={styles.rightContent}>
          <View
            style={[
              styles.daysContainer,
              urgency === 'critical' && styles.daysCritical,
              urgency === 'warning' && styles.daysWarning,
              urgency === 'safe' && styles.daysSafe,
              urgency === 'expired' && styles.daysExpired,
            ]}
          >
            {daysLeft < 0 ? (
              <Text style={styles.expiredText}>EXPIRED</Text>
            ) : (
              <>
                <Text style={styles.daysNumber}>{daysLeft}</Text>
                <Text style={styles.daysLabel}>
                  {daysLeft === 1 ? 'Day' : 'Days'}
                </Text>
              </>
            )}
          </View>

          <Text style={styles.expiryDate}>
            Exp: {formatDate(item.expiry_date)}
          </Text>

          {daysLeft <= 7 && (
            <TouchableOpacity
              style={styles.renewButton}
              onPress={() =>
                navigation.navigate('RenewMembership', {
                  member: item,
                })
              }
            >
              <Text style={styles.renewButtonText}>Renew</Text>
            </TouchableOpacity>
          )}
        </View>

        {urgency === 'critical' && <View style={styles.urgentIndicator} />}
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <AppBar
          title="Upcoming Expiries"
          backAction={
            <Appbar.BackAction
              iconColor="#fff"
              onPress={() => navigation.goBack()}
            />
          }
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading expiring members...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar
        title="Upcoming Expiries"
        backAction={
          <Appbar.BackAction
            iconColor="#fff"
            onPress={() => navigation.goBack()}
          />
        }
      />

      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by...."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'all' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('all')}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'all' && styles.filterChipTextActive,
            ]}
          >
            All ({counts.all})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'expiring' && styles.filterChipActive,
            activeFilter === 'expiring' && styles.filterChipWarning,
          ]}
          onPress={() => setActiveFilter('expiring')}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'expiring' && styles.filterChipTextActive,
            ]}
          >
            Expiring Soon ({counts.expiring})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'expired' && styles.filterChipActive,
            activeFilter === 'expired' && styles.filterChipExpired,
          ]}
          onPress={() => setActiveFilter('expired')}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'expired' && styles.filterChipTextActive,
            ]}
          >
            Expired ({counts.expired})
          </Text>
        </TouchableOpacity>
      </View>

      {searchQuery.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={styles.resultsText}>
            {filteredMembers.length} result
            {filteredMembers.length !== 1 ? 's' : ''} found
          </Text>
        </View>
      )}

      {filteredMembers.length === 0 ? (
        <View style={styles.emptyContainer}>
          {searchQuery.length > 0 ? (
            <>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No Results Found</Text>
              <Text style={styles.emptyText}>
                No members match your search criteria
              </Text>
              <TouchableOpacity
                style={styles.clearSearchButton}
                onPress={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                }}
              >
                <Text style={styles.clearSearchButtonText}>Clear Search</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.emptyIcon}>✅</Text>
              <Text style={styles.emptyTitle}>All Good!</Text>
              <Text style={styles.emptyText}>
                {activeFilter === 'expired'
                  ? 'No expired memberships'
                  : activeFilter === 'expiring'
                  ? 'No memberships expiring soon'
                  : 'No memberships expiring soon'}
              </Text>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredMembers}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#007AFF']}
            />
          }
        />
      )}
    </View>
  );
}
