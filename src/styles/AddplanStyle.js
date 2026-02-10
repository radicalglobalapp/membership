import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  header: {
    backgroundColor: '#007AFF',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },

  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },

  inputContainer: {
    marginBottom: 24,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a1a1a',
  },

  inputFocused: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },

  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 14,
  },

  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  selectText: {
    fontSize: 16,
    color: '#1a1a1a',
  },

  placeholderText: {
    color: '#999',
  },

  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    elevation: 4,
  },

  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },

  priceInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingLeft: 16,
  },

  currencySymbol: {
    fontSize: 20,
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
  },

  createButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },

  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
