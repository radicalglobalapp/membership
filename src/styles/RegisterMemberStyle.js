import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80,
    flexGrow: 1,
  },

  /* ---------- FIELD GROUP ---------- */
  fieldGroup: {
    marginBottom: 10,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    letterSpacing: 0.2,
  },

  /* ---------- INPUTS ---------- */
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: '#333',
  },

  textArea: {
    height: 60,
    textAlignVertical: 'top',
    paddingTop: 12,
  },

  /* ---------- NAME ROW ---------- */
  nameRow: {
    flexDirection: 'row',
    gap: 10,
  },

  nameInput: {
    flex: 1,
  },

  /* ---------- PHONE WRAPPER ---------- */
  phoneWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  phoneCodeBox: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 42,
    justifyContent: 'center',
    minWidth: 60,
  },

  phoneCodeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  /* ---------- INLINE ROWS ---------- */
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  inlineLabel: {
    width: 100,
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.2,
  },

  inlineLabel2: {
    width: 60,
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    letterSpacing: 0.2,
  },

  inlineInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 42,
    paddingHorizontal: 12,
    justifyContent: 'center',
    fontSize: 14,
    color: '#333',
  },

  noBorderInput: {
    flex: 1,
    height: 42,
    justifyContent: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },

  /* ---------- PICKERS ---------- */
  pickerBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    overflow: 'hidden',
  },

  inlinePickerBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    overflow: 'hidden',
  },

  /* ---------- TEXT STYLES ---------- */
  inputText: {
    fontSize: 14,
    color: '#333',
  },

  placeholderText: {
    fontSize: 14,
    color: '#999',
  },

  totalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },

  /* ---------- GENDER RADIO ---------- */
  genderRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },

  radioText: {
    fontSize: 13,
    color: '#333',
    marginLeft: -4,
  },

  /* ---------- BUTTONS ---------- */
  registerButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 20,
    width: '100%',
    minHeight: 52,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },

  registerButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },

  registerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  /* ---------- LOADING ---------- */
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },

  /* ---------- ADDITIONAL UTILITIES ---------- */
  inputFocused: {
    borderColor: '#007AFF',
    borderWidth: 2,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },

  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontStyle: 'italic',
  },

  errorText: {
    fontSize: 12,
    color: '#dc2626',
    marginTop: 4,
  },

  infoBox: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
  },

  infoText: {
    fontSize: 13,
    color: '#1565C0',
    lineHeight: 18,
  },
});
