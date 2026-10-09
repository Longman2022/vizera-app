import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/constants/vizera-theme';
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
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>What happened today?</Text>
        <Text style={styles.subtitle}>Tell us about your sales and expenses, in your own words.</Text>

        <TextInput
          style={styles.textArea}
          placeholder="e.g. made 15k today, spent 3k on supplies"
          placeholderTextColor={Colors.inkMuted}
          value={transcript}
          onChangeText={setTranscript}
          multiline
          numberOfLines={4}
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        {result && (
          <View style={styles.resultBox}>
            <Text style={styles.resultText}>
              Logged: ₦{result.sales_amount.toLocaleString()} sales, ₦
              {result.expenses.toLocaleString()} expenses
            </Text>
          </View>
        )}

        <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.paper} /> : <Text style={styles.buttonText}>Log it</Text>}
        </Pressable>

        {result && (
          <Pressable style={styles.secondaryButton} onPress={() => router.push('/business-pulse')}>
            <Text style={styles.secondaryButtonText}>See my business pulse</Text>
          </Pressable>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  safeArea: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 22,
    color: Colors.ink,
    marginTop: 24,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.inkMuted,
  },
  textArea: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.hairline,
    borderRadius: 8,
    padding: 16,
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.ink,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  error: {
    fontFamily: Fonts.body,
    color: Colors.brick,
  },
  resultBox: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.growth,
    borderRadius: 8,
    padding: 16,
  },
  resultText: {
    fontFamily: Fonts.bodyBold,
    color: Colors.growth,
  },
  button: {
    backgroundColor: Colors.ink,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: Fonts.bodyBold,
    color: Colors.paper,
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: Fonts.bodyBold,
    color: Colors.gold,
    fontSize: 16,
  },
});
