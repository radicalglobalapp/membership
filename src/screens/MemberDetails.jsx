import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Appbar } from 'react-native-paper';
import AppBar from '../components/AppBar';
import styles from '../styles/MemberDetailsStyle';
import { countryData } from '../data/countryData';
import { SettingsContext } from '../context/SettingsContext';

export default function MemberDetails({ navigation, route }) {
  const { member } = route.params;

  const { settings } = useContext(SettingsContext);
  const memberCountry = member?.country || 'India';
  const memberCurrencySymbol =
    settings?.currencySymbol ||
    countryData[memberCountry]?.currencySymbol ||
    '₹';

  const formatDate = dateString => {
    if (!dateString) return 'N/A';

    if (/^\d{1,2} \w{3} \d{4}$/.test(dateString)) return dateString;

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const d = new Date(dateString);
      if (!isNaN(d.getTime()))
        return d.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
    }

    const m = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (m) {
      const iso = `${m[3]}-${m[2]}-${m[1]}`;
      const d = new Date(iso);
      if (!isNaN(d.getTime()))
        return d.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        });
    }

    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    }

    return 'N/A';
  };

  const parseDate = dateString => {
    if (!dateString) return null;

    const monthNames = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };

    const humanReadableMatch = dateString.match(
      /^(\d{1,2})\s+(\w{3})\s+(\d{4})$/,
    );
    if (humanReadableMatch) {
      const [, day, monthName, year] = humanReadableMatch;
      const monthIndex = monthNames[monthName];
      if (monthIndex !== undefined) {
        return new Date(parseInt(year), monthIndex, parseInt(day));
      }
    }

    if (/^\d{4}-\d{2}-\d{2}T/.test(dateString)) {
      const datePart = dateString.split('T')[0];
      const [year, month, day] = datePart.split('-').map(Number);
      return new Date(year, month - 1, day);
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    }

    const ddmmyyyyMatch = dateString.match(/^(\d{2})-(\d{2})-(\d{4})$/);
    if (ddmmyyyyMatch) {
      const [, day, month, year] = ddmmyyyyMatch;
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    }

    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  };

  const getDaysRemaining = expiryDate => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = parseDate(expiryDate);
    if (!expiry) return 0;

    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

  const checkIsActive = expiryDate => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiry = parseDate(expiryDate);
    if (!expiry) return false;

    expiry.setHours(23, 59, 59, 999);

    return expiry >= today;
  };

  const isActive = checkIsActive(member.expiryDate);
  const daysRemaining = getDaysRemaining(member.expiryDate);

  const getInitials = name => {
    if (!name) return 'M';
    return name
      .trim()
      .split(/\s+/)
      .map(n => n.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const totalAmount = parseFloat(
    member.totalAmount || member.total_amount || 0,
  );
  const discount = parseFloat(member.discount || 0);
  const amountPaid = parseFloat(member.amountPaid || member.amount_paid || 0);
  const finalAmount = totalAmount - discount;
  const isPaid =
    member.paymentStatus === 'Paid' ||
    member.paymentStatus === 'PAID' ||
    (amountPaid > 0 && amountPaid >= finalAmount);

  // Format plan string: add space between number and unit and show currency for price
  const rawPlan = member.plan || '';
  let formattedPlan = rawPlan;
  if (rawPlan) {
    // add space between number and letters (e.g. '10days' -> '10 days')
    formattedPlan = formattedPlan.replace(/(\d+)([A-Za-z]+)/g, '$1 $2');

    // replace trailing price (last number) with currency symbol + formatted price
    const priceMatch = formattedPlan.match(/(\d+(?:\.\d+)?)\s*$/);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1]);
      if (!Number.isNaN(price)) {
        const priceStr = `${memberCurrencySymbol}${price.toFixed(2)}`;
        formattedPlan = formattedPlan.slice(0, priceMatch.index) + priceStr;
      }
    }
  }

  return (
    <View style={styles.container}>
      <AppBar
        title="Member Details"
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
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>
              {getInitials(member.name)}
            </Text>
          </View>
          <Text style={styles.memberNameLarge}>{member.name}</Text>

          <View
            style={[
              styles.statusBadgeLarge,
              isActive ? styles.statusActive : styles.statusExpired,
            ]}
          >
            <Text
              style={[
                styles.statusTextLarge,
                isActive ? styles.statusTextActive : styles.statusTextExpired,
              ]}
            >
              {isActive ? '● Active' : '● Expired'}
            </Text>
          </View>

          {isActive && daysRemaining <= 7 && daysRemaining > 0 && (
            <View style={styles.warningBanner}>
              <Text style={styles.warningText}>
                ⚠️ Membership expires in {daysRemaining}{' '}
                {daysRemaining === 1 ? 'day' : 'days'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsHeader}>Membership Overview</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsScrollContainer}
            style={styles.statsScroll}
          >
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>👤</Text>
              <Text style={styles.statValue}>
                {member.joiningDate
                  ? formatDate(member.joiningDate).split(' ')[2]
                  : 'N/A'}
              </Text>
              <Text style={styles.statLabel}>Member Since</Text>
            </View>

            <TouchableOpacity
              style={[styles.statCard, styles.statCardClickable]}
              onPress={() => navigation.navigate('Renewalhistory', { member })}
            >
              <Text style={styles.statIcon}>🔄</Text>
              <Text style={styles.statValue}>
                {member.totalRenewals || '0'}
              </Text>
              <Text style={styles.statLabel}>Total Renewals</Text>
              <Text style={styles.viewDetailsText}>View All Renewals →</Text>
            </TouchableOpacity>

            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📅</Text>
              <Text style={styles.statValue}>
                {member.lastRenewalDate
                  ? formatDate(member.lastRenewalDate)
                  : 'N/A'}
              </Text>
              <Text style={styles.statLabel}>Last Renewal</Text>
            </View>

            <TouchableOpacity
              style={[styles.statCard, styles.statCardClickable]}
              onPress={() => navigation.navigate('Paymenthistory', { member })}
            >
              <Text style={styles.statIcon}>📝</Text>
              <Text style={styles.statLabel}>Payments History</Text>
              <Text style={styles.viewDetailsText}>View →</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{member.name?.trim() || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{member.email || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{member.phone || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>
              {member.address?.trim() || 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{member.gender || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth</Text>
            <Text style={styles.infoValue}>{member.dob || 'N/A'}</Text>
          </View>
        </View>

        {/* Membership Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Membership Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Plan</Text>
            <Text style={styles.infoValue}>{formattedPlan || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Joining Date</Text>
            <Text style={styles.infoValue}>{member.joiningDate || 'N/A'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Expiry Date</Text>
            <Text style={[styles.infoValue, !isActive && styles.expiredText]}>
              {member.expiryDate || 'N/A'}
            </Text>
          </View>

          {!isActive && daysRemaining < 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Days Since Expiry</Text>
              <Text style={[styles.infoValue, styles.expiredText]}>
                {Math.abs(daysRemaining)} days ago
              </Text>
            </View>
          )}

          {isActive && daysRemaining >= 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Days Remaining</Text>
              <Text style={[styles.infoValue, styles.successText]}>
                {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
              </Text>
            </View>
          )}
        </View>

        {/* Payment Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Details</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Plan Price</Text>
            <Text style={styles.infoValue}>
              {memberCurrencySymbol}
              {totalAmount.toFixed(2)}
            </Text>
          </View>

          {discount > 0 && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Discount</Text>
              <Text style={[styles.infoValue, styles.discountText]}>
                - {memberCurrencySymbol}
                {discount.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Final Amount</Text>
            <Text style={[styles.infoValue, styles.finalAmountText]}>
              {memberCurrencySymbol}
              {finalAmount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Status</Text>
            <View
              style={[
                styles.paymentBadge,
                isPaid ? styles.paymentPaid : styles.paymentUnpaid,
              ]}
            >
              <Text
                style={[
                  styles.paymentText,
                  isPaid ? styles.paymentTextPaid : styles.paymentTextUnpaid,
                ]}
              >
                {isPaid ? 'Paid' : 'Not Paid'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
