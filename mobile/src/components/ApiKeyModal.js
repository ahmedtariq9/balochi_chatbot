import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
  ScrollView
} from 'react-native';
import { verifyApiKey } from '../services/gemini';

export default function ApiKeyModal({ visible, onClose, currentKey, onSaveKey }) {
  const [inputKey, setInputKey] = useState(currentKey || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    setError('');
    const clean = inputKey.replace(/["'\s]/g, '');
    if (!clean) {
      setError('براہ کرم اپنی Google AI Studio API Key درج کریں۔');
      return;
    }

    setLoading(true);
    const result = await verifyApiKey(clean);
    setLoading(false);

    if (result.valid) {
      onSaveKey(clean);
      onClose();
    } else {
      setError(result.error || 'Failed to authenticate key.');
    }
  };

  const handleClear = () => {
    onSaveKey('');
    setInputKey('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Google AI Studio Key</Text>
            {currentKey ? (
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Text style={styles.closeText}>✕</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Guide Box */}
            <View style={styles.guideBox}>
              <Text style={styles.guideTitle}>مفت API Key حاصل کرنے کا طریقہ:</Text>
              <Text style={styles.guideText}>
                1. نیچے دیے گئے لنک پر کلک کر کے گوگل اکاؤنٹ سے لاگ ان کریں:{'\n'}
                2. "Create API Key" بٹن دبائیں۔{'\n'}
                3. کی کاپی کر کے نیچے باکس میں پیسٹ کریں۔
              </Text>
              <TouchableOpacity
                style={styles.linkBtn}
                onPress={() => Linking.openURL('https://aistudio.google.com/app/apikey')}
              >
                <Text style={styles.linkText}>اوپن کریں: aistudio.google.com ↗</Text>
              </TouchableOpacity>
            </View>

            {/* Input */}
            <Text style={styles.label}>Paste Gemini API Key:</Text>
            <TextInput
              style={styles.input}
              value={inputKey}
              onChangeText={(t) => {
                setInputKey(t);
                setError('');
              }}
              placeholder="AIzaSy..."
              placeholderTextColor="#64748b"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            {/* Action Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.verifyBtn, loading && styles.btnDisabled]}
                onPress={handleVerify}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={styles.verifyText}>Verify & Start Chatting</Text>
                )}
              </TouchableOpacity>

              {currentKey ? (
                <TouchableOpacity style={styles.clearBtn} onPress={handleClear}>
                  <Text style={styles.clearText}>Clear</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end'
  },
  sheet: {
    backgroundColor: '#0f172a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderColor: '#1e293b',
    padding: 20,
    maxHeight: '85%'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  title: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  closeBtn: {
    padding: 6
  },
  closeText: {
    color: '#94a3b8',
    fontSize: 16
  },
  body: {
    marginBottom: 10
  },
  guideBox: {
    backgroundColor: '#020617',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    marginBottom: 16
  },
  guideTitle: {
    color: '#34d399',
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 6
  },
  guideText: {
    color: '#94a3b8',
    fontSize: 12,
    lineHeight: 18
  },
  linkBtn: {
    marginTop: 10,
    paddingVertical: 6
  },
  linkText: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: 'bold'
  },
  label: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6
  },
  input: {
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'monospace'
  },
  errorText: {
    color: '#f87171',
    fontSize: 11,
    marginTop: 6
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18
  },
  verifyBtn: {
    flex: 1,
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnDisabled: {
    backgroundColor: '#334155'
  },
  verifyText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13
  },
  clearBtn: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center'
  },
  clearText: {
    color: '#cbd5e1',
    fontWeight: '600',
    fontSize: 12
  }
});
