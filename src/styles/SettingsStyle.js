import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

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

  scrollView: {
    flex: 1,
  },

  // Display Style Settings Items
  settingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  icon: {
    marginRight: 16,
    marginTop: 4,
  },

  settingContent: {
    flex: 1,
  },

  settingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },

  settingValue: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },

  // Edit Mode Styles
  editContainer: {
    marginTop: 8,
  },

  editInput: {
    borderWidth: 1,
    borderColor: '#00BCD4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1a1a1a',
    marginBottom: 12,
  },

  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },

  cancelButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  cancelText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },

  saveButtonSmall: {
    backgroundColor: '#00BCD4',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 6,
    minWidth: 60,
    alignItems: 'center',
  },

  saveText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },

  modalCloseButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCloseText: {
    fontSize: 24,
    color: '#666',
    fontWeight: '300',
  },

  // Country Picker Styles
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },

  searchInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1a1a1a',
  },

  countryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },

  countryItemSelected: {
    backgroundColor: '#e0f7fa',
  },

  countryText: {
    fontSize: 16,
    color: '#1a1a1a',
  },

  countryTextSelected: {
    color: '#00BCD4',
    fontWeight: '600',
  },

  checkmark: {
    fontSize: 20,
    color: '#00BCD4',
    fontWeight: '700',
  },

  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#999',
  },

  // Password Form Styles
  passwordForm: {
    padding: 20,
  },

  inputGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#1a1a1a',
  },

  saveButton: {
    backgroundColor: '#00BCD4',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    minHeight: 50,
  },

  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  // Save Changes Button Styles
  saveButtonContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  saveChangesButton: {
    backgroundColor: '#00BCD4',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },

  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },

  saveChangesText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
