import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PulseShareCard } from '@/components/pulse-share-card';
import { Spacing } from '@/constants/theme';
import { getMyPulse, getMyProfile, markConnectPromptShown, logout } from '@/lib/api';

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
  const shareCardRef = useRef<View>(null);

  const [pulse, setPulse] = useState<Pulse | null>(null);
  const [businessName, setBusinessName] = useState('My Business');
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError('');
    try {
      const [pulseData, profileData] = await Promise.all([getMyPulse(), getMyProfile()]);
      setPulse(pulseData);
      setBusinessName(profileData.business_name);
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

  async function handleShare() {
    if (!shareCardRef.current) return;

    setSharing(true);
    try {
      const uri = await captureRef(shareCardRef, { format: 'png', quality: 0.9 });

      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(uri, { mimeType: 'image/png' });
      } else {
        setError('Sharing is not available on this device.');
      }
    } catch (err: any) {
      setError('Could not create your share card. Please try again.');
    } finally {
      setSharing(false);
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

  const hasStats = pulse?.days_logged !== undefined && pulse.days_logged > 0;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="title" style={styles.title}>
          Your Business Pulse
        </ThemedText>

        {!!error && <ThemedText style={styles.error}>{error}</ThemedText>}

        {pulse?.message && <ThemedText style={styles.message}>{pulse.message}</ThemedText>}

        {hasStats && (
          <>
            <ThemedView style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Days logged</ThemedText>
              <ThemedText style={styles.statValue}>{pulse!.days_logged}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Average sales</ThemedText>
              <ThemedText style={styles.statValue}>
                ₦{Number(pulse!.average_sales).toLocaleString()}
              </ThemedText>
            </ThemedView>
            {pulse!.best_day && (
              <ThemedView style={styles.statRow}>
                <ThemedText style={styles.statLabel}>Best day</ThemedText>
                <ThemedText style={styles.statValue}>
                  ₦{pulse!.best_day.sales_amount.toLocaleString()}
                </ThemedText>
              </ThemedView>
            )}
            {pulse!.worst_day && (
              <ThemedView style={styles.statRow}>
                <ThemedText style={styles.statLabel}>Worst day</ThemedText>
                <ThemedText style={styles.statValue}>
                  ₦{pulse!.worst_day.sales_amount.toLocaleString()}
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

        {hasStats && (
          <Pressable style={styles.shareButton} onPress={handleShare} disabled={sharing}>
            {sharing ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Share my pulse</ThemedText>
            )}
          </Pressable>
        )}

        <Pressable style={styles.button} onPress={() => router.push('/log-activity')}>
          <ThemedText style={styles.buttonText}>Log another day</ThemedText>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={handleLogout}>
          <ThemedText style={styles.secondaryButtonText}>Log out</ThemedText>
        </Pressable>

        {hasStats && (
          <View style={styles.offscreen} pointerEvents="none">
            <PulseShareCard
              ref={shareCardRef}
              businessName={businessName}
              averageSales={pulse!.average_sales!}
              daysLogged={pulse!.days_logged!}
              bestDaySales={pulse!.best_day!.sales_amount}
            />
          </View>
        )}
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
  shareButton: {
    backgroundColor: '#1e3a8a',
    paddingVertical: Spacing.three,
    borderRadius: 12,
    alignItems: 'center',
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
    color: '#dc2626',
    fontWeight: '600',
  },
  offscreen: {
    position: 'absolute',
    top: -9999,
    left: -9999,
  },
});
