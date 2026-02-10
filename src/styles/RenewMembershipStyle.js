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

  /* ---------- SCROLL VIEW ---------- */
  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 40,
  },

  /* ---------- MEMBER CARD ---------- */
  memberCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  avatarText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },

  memberInfo: {
    flex: 1,
  },

  memberName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },

  memberPhone: {
    fontSize: 14,
    color: '#666',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  infoLabel: {
    fontSize: 14,
    color: '#666',
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  /* ---------- INPUT ---------- */
  inputContainer: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    letterSpacing: 0.2,
  },

  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    overflow: 'hidden',
  },

  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingLeft: 16,
    overflow: 'hidden',
  },

  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },

  priceInput: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 16,
    fontSize: 16,
    color: '#1a1a1a',
    borderWidth: 0,
  },

  

  /* ---------- DATE INPUT ---------- */
  dateInputContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: 'center',
  },

  dateText: {
    fontSize: 16,
    color: '#1a1a1a',
  },

  datePlaceholder: {
    fontSize: 16,
    color: '#999',
  },

  /* ---------- PLAN DETAILS CARD ---------- */
  planDetailsCard: {
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#B3E0FF',
  },

  planDetailsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    letterSpacing: 0.3,
  },

  planDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },

  planDetailLabel: {
    fontSize: 14,
    color: '#666',
  },

  planDetailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },

  expiryText: {
    color: '#007AFF',
  },

  discountText: {
    color: '#34C759',
  },

  divider: {
    height: 1,
    backgroundColor: '#B3E0FF',
    marginVertical: 12,
  },

  totalDetailLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  totalDetailAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#007AFF',
  },

  /* ---------- TOTAL CONTAINER ---------- */
  totalContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFB74D',
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

  totalAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F57C00',
  },

  /* ---------- RENEW BUTTON ---------- */
  renewButton: {
    backgroundColor: '#34C759',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },

  renewButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
  },

  renewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});