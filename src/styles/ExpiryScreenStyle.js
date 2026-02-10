import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  /* ---------- LOADING STATE ---------- */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },

  /* ---------- SEARCH BAR ---------- */
  searchContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },

  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1a1a1a',
    padding: 0,
  },

  clearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  clearButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },

  /* ---------- FILTER CHIPS ---------- */
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
  },

  filterChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },

  filterChipWarning: {
    backgroundColor: '#F57C00',
    borderColor: '#F57C00',
  },

  filterChipExpired: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },

  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },

  filterChipTextActive: {
    color: '#fff',
  },

  /* ---------- RESULTS COUNT ---------- */
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },

  resultsText: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },

  /* ---------- EMPTY STATE ---------- */
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },

  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },

  emptyText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },

  clearSearchButton: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },

  clearSearchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },

  /* ---------- LIST CONTAINER ---------- */
  listContainer: {
    flex: 1,
  },

  statsBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  statsText: {
    fontSize: 14,
    color: '#666',
  },

  statsValue: {
    fontWeight: '700',
    color: '#dc2626',
    fontSize: 16,
  },

  listContent: {
    padding: 16,
    paddingBottom: 24,
  },

  /* ---------- MEMBER CARD ---------- */
  memberCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },

  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  memberInfo: {
    flex: 1,
  },

  nameText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },

  phoneText: {
    fontSize: 13,
    color: '#666',
  },

  /* ---------- RIGHT SIDE ---------- */
  rightContent: {
    alignItems: 'flex-end',
  },

  daysContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 6,
    minWidth: 70,
  },

  daysCritical: {
    backgroundColor: '#fee2e2',
  },

  daysWarning: {
    backgroundColor: '#FFF3E0',
  },

  daysSafe: {
    backgroundColor: '#d1fae5',
  },

  daysExpired: {
    backgroundColor: '#FDECEA',
  },

  daysNumber: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },

  daysLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  daysTextCritical: {
    color: '#991b1b',
  },

  daysTextWarning: {
    color: '#F57C00',
  },

  daysTextSafe: {
    color: '#065f46',
  },

  expiredText: {
    color: '#D32F2F',
    fontWeight: 'bold',
    fontSize: 14,
  },

  expiryDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    marginBottom: 4,
    textAlign: 'center',
  },

  /* ---------- RENEW BUTTON ---------- */
  renewButton: {
    marginTop: 6,
    backgroundColor: '#1976d2',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
  },

  renewButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },

  /* ---------- URGENCY INDICATOR ---------- */
  urgentIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#dc2626',
  },
});