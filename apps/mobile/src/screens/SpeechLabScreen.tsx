import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Platform } from 'react-native';
import { SpeechRecognitionResult } from '@phonicsquest/shared';
import { Speech } from '../services/speech/SpeechService';
import { SoundEffects } from '../services/soundEffects';
import { Colors } from '../theme/colors';

interface SpeechLabScreenProps {
  onClose: () => void;
}

export const SpeechLabScreen: React.FC<SpeechLabScreenProps> = ({ onClose }) => {
  const [targetText, setTargetText] = useState('s');
  const [providerMode, setProviderMode] = useState<'auto' | 'on-device' | 'azure-cloud'>('auto');
  const [confidenceThreshold, setConfidenceThreshold] = useState(65);
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<SpeechRecognitionResult | null>(null);
  const [statusMessage, setStatusMessage] = useState('Select target sound and press Speak');

  const handleTestSpeech = async () => {
    setIsRecording(true);
    setStatusMessage(`Listening for: "${targetText}"... Speak now into microphone!`);
    SoundEffects.playClick();

    try {
      Speech.setProvider(providerMode);
      const res = await Speech.assessSpeech({
        expectedText: targetText,
        targetPhoneme: targetText,
        audioUri: '',
        isAssessment: false,
        confidenceThreshold,
      });

      setResult(res);
      setIsRecording(false);

      if (res.passed) {
        SoundEffects.playSuccess();
        setStatusMessage(`✅ PASSED (${res.confidence}% confidence via ${res.provider})`);
      } else {
        SoundEffects.playRetry();
        setStatusMessage(`❌ FAILED (${res.confidence}% confidence via ${res.provider})`);
      }
    } catch (err: any) {
      setIsRecording(false);
      setStatusMessage(`Error: ${err.message}`);
    }
  };

  const playSynthesizedReference = () => {
    SoundEffects.playClick();
    SoundEffects.speakPhonics(targetText);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0F172A', margin: 0 }}>
            🎙️ Phonics Speech Lab & Diagnostic
          </h2>
          <p style={{ fontSize: 13, color: '#64748B', margin: '4px 0 0 0' }}>
            Real-time hybrid speech testing (On-Device & Cloud Azure proxy)
          </p>
        </div>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeBtnText}>✕ Close</Text>
        </TouchableOpacity>
      </View>

      {/* Provider Selector */}
      <View style={styles.card}>
        <Text style={styles.label}>Speech Provider Engine</Text>
        <View style={styles.pillRow}>
          {(['auto', 'on-device', 'azure-cloud'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.pill,
                providerMode === mode && styles.pillActive,
              ]}
              onPress={() => setProviderMode(mode)}
            >
              <Text
                style={[
                  styles.pillText,
                  providerMode === mode && styles.pillTextActive,
                ]}
              >
                {mode === 'auto' ? 'Auto Router' : mode === 'on-device' ? 'On-Device (Offline)' : 'Azure Cloud (Proxy)'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Target Phoneme or Word Input */}
      <View style={styles.card}>
        <Text style={styles.label}>Target Phoneme / Word</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.textInput}
            value={targetText}
            onChangeText={setTargetText}
            placeholder="e.g. s, sat, pig, th"
          />
          <TouchableOpacity style={styles.hearBtn} onPress={playSynthesizedReference}>
            <Text style={styles.hearBtnText}>🔊 Reference Audio</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Sound Chips */}
        <View style={styles.quickChipsRow}>
          {['s', 'a', 't', 'p', 'i', 'n', 'sat', 'pig', 'sh', 'ch', 'th'].map((chip) => (
            <TouchableOpacity
              key={chip}
              style={styles.chip}
              onPress={() => setTargetText(chip)}
            >
              <Text style={styles.chipText}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Confidence Threshold */}
      <View style={styles.card}>
        <View style={styles.thresholdRow}>
          <Text style={styles.label}>Child Voice Pass Threshold: {confidenceThreshold}%</Text>
        </View>
        <View style={styles.sliderButtons}>
          {[55, 60, 65, 70, 75, 80].map((val) => (
            <TouchableOpacity
              key={val}
              style={[
                styles.sliderBtn,
                confidenceThreshold === val && styles.sliderBtnActive,
              ]}
              onPress={() => setConfidenceThreshold(val)}
            >
              <Text
                style={[
                  styles.sliderBtnText,
                  confidenceThreshold === val && styles.sliderBtnTextActive,
                ]}
              >
                {val}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Speak Action Button */}
      <TouchableOpacity
        style={[styles.recordBtn, isRecording && styles.recordBtnActive]}
        onPress={handleTestSpeech}
        disabled={isRecording}
      >
        <Text style={styles.recordBtnText}>
          {isRecording ? '🔴 Listening... Speak Now!' : '🎙️ Test & Speak Target'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.statusText}>{statusMessage}</Text>

      {/* Recognition Result JSON Display */}
      {result && (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>Normalized Recognition Output</Text>
            <span
              style={{
                backgroundColor: result.passed ? '#DCFCE7' : '#FEE2E2',
                color: result.passed ? '#15803D' : '#B91C1C',
                fontWeight: 800,
                fontSize: 12,
                padding: '4px 10px',
                borderRadius: 8,
              }}
            >
              {result.passed ? 'PASSED' : 'RETRY'}
            </span>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Provider</Text>
              <Text style={styles.statVal}>{result.provider}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Confidence</Text>
              <Text style={styles.statVal}>{result.confidence}%</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Recognized</Text>
              <Text style={styles.statVal}>&quot;{result.recognized}&quot;</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Latency</Text>
              <Text style={styles.statVal}>{result.durationMs}ms</Text>
            </View>
          </View>

          <Text style={styles.jsonLabel}>Raw Speech Payload:</Text>
          <Text style={styles.jsonPre}>{JSON.stringify(result, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  content: {
    padding: 20,
    alignItems: 'center',
    gap: 14,
    maxWidth: 680,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  closeBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  closeBtnText: {
    fontWeight: '800',
    color: '#475569',
    fontSize: 13,
  },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    borderColor: '#BAE6FD',
  },
  label: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textDark,
    marginBottom: 10,
  },
  pillRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
  },
  pillActive: {
    backgroundColor: '#0284C7',
    borderColor: '#0369A1',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
  },
  textInput: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 16,
    fontWeight: '700',
    backgroundColor: '#F8FAFC',
  },
  hearBtn: {
    backgroundColor: '#FEF3C7',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    justifyContent: 'center',
  },
  hearBtnText: {
    fontWeight: '800',
    color: '#92400E',
    fontSize: 13,
  },
  quickChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  chip: {
    backgroundColor: '#E0F2FE',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
  },
  thresholdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  sliderBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sliderBtnActive: {
    backgroundColor: '#10B981',
    borderColor: '#059669',
  },
  sliderBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  sliderBtnTextActive: {
    color: '#FFFFFF',
  },
  recordBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  recordBtnActive: {
    backgroundColor: '#EF4444',
  },
  recordBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    textAlign: 'center',
  },
  resultCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textDark,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '700',
  },
  statVal: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  jsonLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
  },
  jsonPre: {
    backgroundColor: '#0F172A',
    color: '#38BDF8',
    padding: 12,
    borderRadius: 10,
    fontSize: 11,
    overflow: 'hidden',
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
    margin: 0,
  },
});
