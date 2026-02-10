import { useEffect, useState, useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Appbar, Menu, IconButton } from 'react-native-paper';
import API from '../api';
import AppBar from '../components/AppBar';
import styles from '../styles/MemberListScreenStyle';


export default function MembersScreen({ navigation }) {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchMembers();
    }, []),
  );

  useEffect(() => {
    applyFilter();
  }, [members, activeFilter]);

  const fetchMembers = async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const token = await AsyncStorage.getItem('token');
      const res = await API.get('/api/members', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(res.data.members || res.data || []);
    } catch (err) {
      console.log('API ERROR:', err.message);
      Alert.alert(
        'Error',
        'Failed to fetch members. Please check your connection.',
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const applyFilter = () => {
    if (activeFilter === 'all') {
      setFilteredMembers(members);
    } else if (activeFilter === 'active') {
      setFilteredMembers(members.filter(member => isNotExpired(member)));
    } else if (activeFilter === 'expired') {
      setFilteredMembers(members.filter(member => !isNotExpired(member)));
    }
  };

  const getFilterCounts = () => {
    const active = members.filter(m => isNotExpired(m)).length;
    const expired = members.filter(m => !isNotExpired(m)).length;
    return { all: members.length, active, expired };
  };

  const onRefresh = () => {
    fetchMembers(true);
  };

  const deleteMember = async member => {
    Alert.alert(
      'Delete Member',
      `Are you sure you want to delete ${member.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              await API.delete(`/api/members/${member._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              Alert.alert('Success', 'Member deleted successfully.');
              fetchMembers();
            } catch (err) {
              console.log('Delete error:', err);
              Alert.alert('Error', 'Failed to delete member.');
            }
          },
        },
      ],
    );
  };

  const getInitials = name => {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const parseToDateOnly = dateString => {
    if (!dateString) return null;
    if (/^\d{1,2} \w{3} \d{4}$/.test(dateString)) {
      const d = new Date(dateString);
      return isNaN(d.getTime())
        ? null
        : new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const d = new Date(dateString);
      return isNaN(d.getTime())
        ? null
        : new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    const m = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (m) {
      const iso = `${m[3]}-${m[2]}-${m[1]}`;
      const d = new Date(iso);
      return isNaN(d.getTime())
        ? null
        : new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    const d = new Date(dateString);
    return isNaN(d.getTime())
      ? null
      : new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const isNotExpired = item => {
    if (item.status) {
      return item.status.trim().toUpperCase() === 'ACTIVE';
    }
    const expiryDate = parseToDateOnly(
      item.expiryDate || item.expiry_date || item.expiry,
    );
    if (!expiryDate) return false;
    const today = new Date();
    const todayDateOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    return expiryDate.getTime() >= todayDateOnly.getTime();
  };

  const renderMemberCard = ({ item }) => {
    const isActive = isNotExpired(item);

    return (
      <View style={styles.memberCard}>
        <TouchableOpacity style={styles.cardContent} activeOpacity={0.7}>
          <View style={styles.leftSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.memberName}>{item.name}</Text>
            </View>
          </View>

          <View
            style={[
              styles.statusBadge,
              isActive ? styles.statusActive : styles.statusExpired,
            ]}
          >
            <Text
              style={[
                styles.statusText,
                isActive ? styles.statusTextActive : styles.statusTextExpired,
              ]}
            >
              {isActive ? 'Active' : 'Expired'}
            </Text>
          </View>
        </TouchableOpacity>

        <Menu
          visible={menuVisible && selectedMember?._id === item._id}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              size={20}
              iconColor="#666"
              onPress={() => {
                setSelectedMember(item);
                setMenuVisible(true);
              }}
            />
          }
        >
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('MemberDetails', { member: item });
            }}
            title="View Details"
            leadingIcon="eye"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              navigation.navigate('RegisterMember', { member: item });
            }}
            title="Edit Details"
            leadingIcon="pencil"
          />
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              deleteMember(item);
            }}
            title="Delete"
            leadingIcon="delete"
          />
        </Menu>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.container}>
        <AppBar
          title="Member List"
          backAction={
            <Appbar.BackAction
              iconColor="#fff"
              onPress={() => navigation.goBack()}
            />
          }
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading members...</Text>
        </View>
      </View>
    );
  }

  const counts = getFilterCounts();

  return (
    <View style={styles.container}>
      <AppBar
        title="Member List"
        backAction={
          <Appbar.BackAction
            iconColor="#fff"
            onPress={() => navigation.goBack()}
          />
        }
      />

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'all' && styles.filterChipActive,
          ]}
          onPress={() => setActiveFilter('all')}
          activeOpacity={0.7}
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
            activeFilter === 'active' && styles.filterChipActive,
            activeFilter === 'active' && styles.filterChipActiveGreen,
          ]}
          onPress={() => setActiveFilter('active')}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.filterChipText,
              activeFilter === 'active' && styles.filterChipTextActive,
            ]}
          >
            Active ({counts.active})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterChip,
            activeFilter === 'expired' && styles.filterChipActive,
            activeFilter === 'expired' && styles.filterChipExpired,
          ]}
          onPress={() => setActiveFilter('expired')}
          activeOpacity={0.7}
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

      {filteredMembers.length === 0 ? (
        <View style={styles.emptyContainer}>
          {members.length === 0 ? (
            <>
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={styles.emptyTitle}>No Members Yet</Text>
              <Text style={styles.emptyText}>
                Start by registering your first member
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.emptyIcon}>
                {activeFilter === 'active' ? '✅' : '❌'}
              </Text>
              <Text style={styles.emptyTitle}>
                {activeFilter === 'active'
                  ? 'No Active Members'
                  : 'No Expired Members'}
              </Text>
              <Text style={styles.emptyText}>
                {activeFilter === 'active'
                  ? 'All memberships have expired'
                  : 'All memberships are active'}
              </Text>
            </>
          )}
        </View>
      ) : (
        <FlatList
          data={filteredMembers}
          keyExtractor={item => item._id}
          renderItem={renderMemberCard}
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
      )}
    </View>
  );
}
