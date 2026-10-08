import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { getMyPulse, markConnectPromptShown, logout } from '@/lib/api';

type Pulse = {
  message?: string;
  days_logged?: number;
  average_sales?: number;
  best_day?: { date: string; sales_amount: number };
  worst_day?: { date: string; sales_amount: number };
  show_connect_prompt?: boolean;
};

export default function BusinessPulseScreen() {
  const router = useRouter();

  const [pulse, setPulse] = useState<Pulse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPulse();
  }, []);

  async function loadPulse() {
    setLoading(true);
    setError('');
    try {
      const data = await getMyPulse();
      setPulse(data);
    } catch (err: any) {
      setError(err.message || 'Could not load your business pulse.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDismissConnectPrompt() {
    try {
      await markConnectPromptShown();
      setPulse((prev) => (prev ? { ...prev, show_connect_prompt: false } : prev));
    } catch {
      // non-critical — ignore silently
    }
  }

  async function handleLogout() {
    await logout();
    router.replace('/');
  }

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.centered}>
          <ActivityIndicator size="large" />
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Your Business Pulse
        </ThemedText>

        {!!error && <ThemedText style={styles.error}>{error}</ThemedText>}

        {pulse?.message && <ThemedText style={styles.message}>{pulse.message}</ThemedText>}

        {pulse?.days_logged !== undefined && (
          <>
            <ThemedView style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Days logged</ThemedText>
              <ThemedText style={styles.statValue}>{pulse.days_logged}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Average sales</ThemedText>
              <ThemedText style={styles.statValue}>
                ₦{Number(pulse.average_sales).toLocaleString()}
              </ThemedText>
            </ThemedView>
            {pulse.best_day && (
              <ThemedView style={styles.statRow}>
                <ThemedText style={styles.statLabel}>Best day</ThemedText>
                <ThemedText style={styles.statValue}>
                  ₦{pulse.best_day.sales_amount.toLocaleString()}
                </ThemedText>
              </ThemedView>
            )}
            {pulse.worst_day && (
              <ThemedView style={styles.statRow}>
                <ThemedText style={styles.statLabel}>Worst day</ThemedText>
                <ThemedText style={styles.statValue}>
                  ₦{pulse.worst_day.sales_amount.toLocaleString()}
                </ThemedText>
              </ThemedView>
            )}
          </>
        )}

        {pulse?.show_connect_prompt && (
          <ThemedView style={styles.connectBox}>
            <ThemedText style={styles.connectText}>
              Want Vizera to track this automatically? You can connect your bank or POS later.
            </ThemedText>
            <Pressable onPress={handleDismissConnectPrompt}>
              <ThemedText style={styles.connectDismiss}>Maybe later</ThemedText>
            </Pressable>
          </ThemedView>
        )}

        <Pressable style={styles.button} onPress={() => router.push('/log-activity')}>
          <ThemedText style={styles.buttonText}>Log another day</ThemedText>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={handleLogout}>
          <ThemedText style={styles.secondaryButtonText}>Log out</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    marginTop: Spacing.four,
  },
  message: {
    opacity: 0.7,
  },
  error: {
    color: '#dc2626',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.two,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  statLabel: {
    opacity: 0.7,
  },
  statValue: {
    fontWeight: '600',
  },
  connectBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 10,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  connectText: {
    color: '#1e3a8a',
  },
  connectDismiss: {
    color: '#2563eb',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: Spacing.three,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: Spacing.two,
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
    color: '#dc2626',
    fontWeight: '600',
  },
});
