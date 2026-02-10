import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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

  /* ---------- HEADER CARD ---------- */
  headerCard: {
    backgroundColor: '#fff',
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  avatarLargeText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#fff',
  },

  memberNameLarge: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
  },

  statusBadgeLarge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },

  statusActive: {
    backgroundColor: '#d1fae5',
  },

  statusExpired: {
    backgroundColor: '#fee2e2',
  },

  statusTextLarge: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  statusTextActive: {
    color: '#065f46',
  },

  statusTextExpired: {
    color: '#991b1b',
  },

  warningBanner: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F57C00',
    width: '100%',
  },

  warningText: {
    fontSize: 13,
    color: '#E65100',
    fontWeight: '600',
    textAlign: 'center',
  },

  /* ---------- STATS CARDS ---------- */
  statsContainer: {
    marginBottom: 16,
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingLeft: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },

  statsHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    paddingRight: 16,
    letterSpacing: 0.3,
  },

  statsScroll: {
    flexGrow: 0,
  },

  statsScrollContainer: {
    paddingRight: 16,
    gap: 12,
  },

  statCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 16,
    padding: 20,
    width: 140,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  statCardClickable: {
    backgroundColor: '#E3F2FD',
    borderColor: '#2196F3',
    borderWidth: 1.5,
  },

  viewDetailsText: {
    fontSize: 11,
    color: '#2196F3',
    fontWeight: '600',
    marginTop: 8,
    letterSpacing: 0.2,
  },

  statIcon: {
    fontSize: 32,
    marginBottom: 12,
  },

  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 6,
    textAlign: 'center',
  },

  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
    textAlign: 'center',
    letterSpacing: 0.2,
  },

  activeColor: {
    color: '#16a34a',
  },

  expiredColor: {
    color: '#dc2626',
  },

  /* ---------- SECTION ---------- */
  section: {
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
    letterSpacing: 0.3,
  },

  /* ---------- INFO ROW ---------- */
  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  infoLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    color: '#1a1a1a',
    fontWeight: '600',
  },

  expiredText: {
    color: '#dc2626',
  },

  highlightText: {
    color: '#007AFF',
  },

  discountText: {
    color: '#34C759',
  },

  /* ---------- PAYMENT BADGE ---------- */
  paymentBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 4,
  },

  paymentPaid: {
    backgroundColor: '#d1fae5',
  },

  paymentUnpaid: {
    backgroundColor: '#fee2e2',
  },

  paymentText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  paymentTextPaid: {
    color: '#065f46',
  },

  paymentTextUnpaid: {
    color: '#991b1b',
  },

  /* ---------- ACTION BUTTONS ---------- */
  actionButtons: {
    paddingHorizontal: 16,
    marginTop: 8,
  },

  editButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  renewButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  renewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  finalAmountText: {
    fontWeight: '700',
    color: '#1a1a1a',
    fontSize: 16,
  },

  remainingText: {
    fontWeight: '700',
    color: '#dc2626',
    fontSize: 16,
  },

  successText: {
    color: '#16a34a',
    fontWeight: '600',
  },
});