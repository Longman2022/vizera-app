import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/constants/vizera-theme';
import { PulseShareCard } from '@/components/pulse-share-card';
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
      <View style={styles.container}>
        <SafeAreaView style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.ink} />
        </SafeAreaView>
      </View>
    );
  }

  const hasStats = pulse?.days_logged !== undefined && pulse.days_logged > 0;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Your Business Pulse</Text>

        {!!error && <Text style={styles.error}>{error}</Text>}

        {pulse?.message && <Text style={styles.message}>{pulse.message}</Text>}

        {hasStats && (
          <View style={styles.ledger}>
            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerLabel}>Days logged</Text>
              <Text style={styles.ledgerValue}>{pulse!.days_logged}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.ledgerRow}>
              <Text style={styles.ledgerLabel}>Average sales</Text>
              <Text style={styles.ledgerValue}>
                ₦{Number(pulse!.average_sales).toLocaleString()}
              </Text>
            </View>

            {pulse!.best_day && (
              <>
                <View style={styles.divider} />
                <View style={styles.ledgerRow}>
                  <Text style={styles.ledgerLabel}>Best day</Text>
                  <Text style={[styles.ledgerValue, styles.positive]}>
                    ₦{pulse!.best_day.sales_amount.toLocaleString()}
                  </Text>
                </View>
              </>
            )}

            {pulse!.worst_day && (
              <>
                <View style={styles.divider} />
                <View style={styles.ledgerRow}>
                  <Text style={styles.ledgerLabel}>Worst day</Text>
                  <Text style={[styles.ledgerValue, styles.negative]}>
                    ₦{pulse!.worst_day.sales_amount.toLocaleString()}
                  </Text>
                </View>
              </>
            )}
          </View>
        )}

        {pulse?.show_connect_prompt && (
          <View style={styles.connectBox}>
            <Text style={styles.connectText}>
              Want Vizera to track this automatically? You can connect your bank or POS later.
            </Text>
            <Pressable onPress={handleDismissConnectPrompt}>
              <Text style={styles.connectDismiss}>Maybe later</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.spacer} />

        {hasStats && (
          <Pressable style={styles.shareButton} onPress={handleShare} disabled={sharing}>
            {sharing ? (
              <ActivityIndicator color={Colors.paper} />
            ) : (
              <Text style={styles.buttonText}>Share my pulse</Text>
            )}
          </Pressable>
        )}

        <Pressable style={styles.button} onPress={() => router.push('/log-activity')}>
          <Text style={styles.buttonTextDark}>Log another day</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={handleLogout}>
          <Text style={styles.secondaryButtonText}>Log out</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.paper,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginTop: 8,
  },
  message: {
    fontFamily: Fonts.body,
    color: Colors.inkMuted,
  },
  error: {
    fontFamily: Fonts.body,
    color: Colors.brick,
  },
  ledger: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.hairline,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  ledgerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.hairline,
  },
  ledgerLabel: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.inkMuted,
  },
  ledgerValue: {
    fontFamily: Fonts.bodyBold,
    fontSize: 16,
    color: Colors.ink,
  },
  positive: {
    color: Colors.growth,
  },
  negative: {
    color: Colors.brick,
  },
  connectBox: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.hairline,
    borderRadius: 8,
    padding: 16,
    gap: 8,
  },
  connectText: {
    fontFamily: Fonts.body,
    color: Colors.ink,
  },
  connectDismiss: {
    fontFamily: Fonts.bodyBold,
    color: Colors.gold,
  },
  spacer: {
    flex: 1,
  },
  shareButton: {
    backgroundColor: Colors.gold,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.hairline,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: Fonts.bodyBold,
    color: Colors.ink,
    fontSize: 16,
  },
  buttonTextDark: {
    fontFamily: Fonts.bodyBold,
    color: Colors.ink,
    fontSize: 16,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontFamily: Fonts.bodyBold,
    color: Colors.brick,
    fontSize: 15,
  },
  offscreen: {
    position: 'absolute',
    top: -9999,
    left: -9999,
  },
});
