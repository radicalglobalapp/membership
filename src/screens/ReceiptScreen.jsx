import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import Share from 'react-native-share';
import { Appbar, Menu } from 'react-native-paper';
import AppBar from '../components/AppBar';
import styles from '../styles/ReceiptScreenStyle';
import { useContext } from 'react';
import { SettingsContext } from '../context/SettingsContext';

export default function ReceiptScreen({ route, navigation }) {
  const { receiptData } = route.params;
  const [menuVisible, setMenuVisible] = useState(false);
  const { settings } = useContext(SettingsContext);
  const currency = settings?.currencySymbol || settings?.currency_symbol || '₹';
  const phoneCode = settings?.phoneCode || settings?.phone_code || '+91';

  const {
    receiptNo,
    paymentDate,
    memberName,
    mobile,
    planName,
    joinDate,
    expiryDate,
    amount,
    discount,
    paidAmount,
  } = receiptData;

  const formatDate = dateString => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const receiptText = `
🧾 PAYMENT RECEIPT
━━━━━━━━━━━━━━━━━━━

Receipt No: ${receiptNo}
Payment Date: ${paymentDate}

👤 MEMBER DETAILS
━━━━━━━━━━━━━━━━━━━
Name: ${memberName}
Mobile: ${mobile}

📦 PLAN DETAILS
━━━━━━━━━━━━━━━━━━━
Plan: ${planName}
Joining Date: ${formatDate(joinDate)}
Expiry Date: ${formatDate(expiryDate)}

💰 PAYMENT SUMMARY
━━━━━━━━━━━━━━━━━━━
Amount: ${currency}${amount}
Discount: ${currency}${discount}
━━━━━━━━━━━━━━━━━━━
Paid Amount: ${currency}${paidAmount}

Thank you for your payment!
  `.trim();

  const shareViaWhatsApp = async () => {
    setMenuVisible(false);
    try {
      const phone = mobile.replace(/[^0-9]/g, '');
      const url = `https://wa.me/${phoneCode.replace(
        '+',
        '',
      )}${phone}?text=${encodeURIComponent(receiptText)}`;

      await Linking.openURL(url);
    } catch (e) {
      Alert.alert('Error', 'WhatsApp not available');
    }
  };

  const shareViaSMS = async () => {
    setMenuVisible(false);
    try {
      const phone = mobile.replace(/[^0-9]/g, '');
      const url = `sms:${phone}?body=${encodeURIComponent(receiptText)}`;
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert('Error', 'SMS not available');
    }
  };

  const shareViaOtherApps = async () => {
    setMenuVisible(false);
    try {
      await Share.open({
        message: receiptText,
        title: 'Payment Receipt',
      });
    } catch (e) {
      console.log('Share error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <AppBar
        title="Receipt"
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PAYMENT RECEIPT </Text>
        </View>

        {/* Receipt Card */}
        <View style={styles.receiptCard}>
          {/* Receipt Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Receipt No:</Text>
              <Text style={styles.infoValue}>#{receiptNo}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Payment Date:</Text>
              <Text style={styles.infoValue}>{paymentDate}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Member Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>👤 Member Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name:</Text>
              <Text style={styles.detailValue}>{memberName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Mobile:</Text>
              <Text style={styles.detailValue}>{mobile}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Plan Details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>📦 Plan Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Plan:</Text>
              <Text style={styles.detailValue}>{planName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Joining Date:</Text>
              <Text style={styles.detailValue}>{formatDate(joinDate)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Expiry Date:</Text>
              <Text style={styles.detailValue}>{formatDate(expiryDate)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Payment Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💰 Payment Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount:</Text>
              <Text style={styles.summaryValue}>
                {currency}
                {amount}
              </Text>
            </View>
            {discount > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount:</Text>
                <Text style={[styles.summaryValue, styles.discountText]}>
                  - {currency}
                  {discount}
                </Text>
              </View>
            )}
            <View style={styles.totalDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Paid Amount:</Text>
              <Text style={styles.totalAmount}>
                {currency}
                {paidAmount}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => setMenuVisible(true)}
                activeOpacity={0.7}
              >
                <Text style={styles.shareButtonText}>📤 Share Receipt</Text>
              </TouchableOpacity>
            }
          >
            <Menu.Item
              onPress={shareViaWhatsApp}
              title="Share via WhatsApp"
              leadingIcon="whatsapp"
            />
            <Menu.Item
              onPress={shareViaSMS}
              title="Send as SMS"
              leadingIcon="message-text"
            />
            <Menu.Item
              onPress={shareViaOtherApps}
              title="Other Apps"
              leadingIcon="share-variant"
            />
          </Menu>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
