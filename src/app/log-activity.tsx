import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { logVoiceActivity } from '@/lib/api';

export default function LogActivityScreen() {
  const router = useRouter();

  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ sales_amount: number; expenses: number } | null>(null);

  async function handleSubmit() {
    setError('');
    setResult(null);

    if (!transcript.trim()) {
      setError('Tell us what happened today first.');
      return;
    }

    setLoading(true);
    try {
      const activity = await logVoiceActivity(transcript);
      setResult({ sales_amount: activity.sales_amount, expenses: activity.expenses });
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          What happened today?
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Tell us about your sales and expenses, in your own words.
        </ThemedText>

        <TextInput
          style={styles.textArea}
          placeholder="e.g. made 15k today, spent 3k on supplies"
          placeholderTextColor="#999"
          value={transcript}
          onChangeText={setTranscript}
          multiline
          numberOfLines={4}
        />

        {!!error && <ThemedText style={styles.error}>{error}</ThemedText>}

        {result && (
          <ThemedView style={styles.resultBox}>
            <ThemedText style={styles.resultText}>
              Logged: ₦{result.sales_amount.toLocaleString()} sales, ₦
              {result.expenses.toLocaleString()} expenses
            </ThemedText>
          </ThemedView>
        )}

        <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <ThemedText style={styles.buttonText}>Log it</ThemedText>}
        </Pressable>

        {result && (
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/business-pulse')}>
            <ThemedText style={styles.secondaryButtonText}>See my business pulse</ThemedText>
          </Pressable>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    marginTop: Spacing.four,
  },
  subtitle: {
    opacity: 0.7,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: Spacing.three,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  error: {
    color: '#dc2626',
  },
  resultBox: {
    backgroundColor: '#dcfce7',
    borderRadius: 10,
    padding: Spacing.three,
  },
  resultText: {
    color: '#166534',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: Spacing.three,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2563eb',
    fontWeight: '600',
    fontSize: 16,
  },
});
