import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function ExpiryMemberCard({ member, navigation }) {
  const remainingDays = member.remaining_days;

  const showRenew = remainingDays <= 7 || remainingDays < 0;

  const getBadge = () => {
    if (remainingDays < 0) return 'EXPIRED';
    return `${remainingDays} DAYS`;
  };

  const getBadgeStyle = () => {
    if (remainingDays < 0) return styles.expiredBadge;
    if (remainingDays <= 3) return styles.urgentBadge;
    return styles.warningBadge;
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View>
          <Text style={styles.name}>
            {member.first_name} {member.last_name}
          </Text>
          <Text style={styles.phone}>{member.phone}</Text>
          <Text style={styles.expiry}>Exp: {member.expiry_date}</Text>
        </View>

        <View style={[styles.badge, getBadgeStyle()]}>
          <Text style={styles.badgeText}>{getBadge()}</Text>
        </View>
      </View>

      {showRenew && (
        <TouchableOpacity
          style={styles.renewBtn}
          onPress={() =>
            navigation.navigate('RenewMembership', {
              memberId: member._id || member.id,
              memberName: member.first_name + ' ' + member.last_name,
            })
          }
        >
          <Text style={styles.renewText}>RENEW</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  phone: {
    color: '#666',
  },
  expiry: {
    fontSize: 12,
    marginTop: 3,
  },
  badge: {
    padding: 10,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  urgentBadge: {
    backgroundColor: '#fde2e2',
  },
  warningBadge: {
    backgroundColor: '#e0f7ec',
  },
  expiredBadge: {
    backgroundColor: '#ffd6d6',
  },
  badgeText: {
    fontWeight: 'bold',
    color: '#b00020',
  },
  renewBtn: {
    marginTop: 12,
    backgroundColor: '#1976d2',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  renewText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
