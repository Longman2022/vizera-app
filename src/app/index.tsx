import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/constants/vizera-theme';
import { getToken } from '@/lib/api';

export default function WelcomeScreen() {
  const router = useRouter();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    checkExistingSession();
  }, []);

  async function checkExistingSession() {
    const token = await getToken();
    if (token) {
      router.replace('/log-activity');
      return;
    }
    setCheckingSession(false);
  }

  if (checkingSession) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.ink} />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.heroSection}>
          <Text style={styles.wordmark}>Vizera</Text>
          <View style={styles.rule} />
          <Text style={styles.tagline}>
            Turn your daily hustle into your business record.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.button} onPress={() => router.push('/business-setup')}>
            <Text style={styles.buttonText}>Get started</Text>
          </Pressable>

          <Pressable style={styles.secondaryButton} onPress={() => router.push('/login')}>
            <Text style={styles.secondaryButtonText}>Already have an account? Log in</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.paper },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  safeArea: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, gap: 48 },
  heroSection: { alignItems: 'center', gap: 16 },
  wordmark: { fontFamily: Fonts.display, fontSize: 40, color: Colors.ink },
  rule: { width: 48, height: 3, backgroundColor: Colors.gold, borderRadius: 2 },
  tagline: { fontFamily: Fonts.body, fontSize: 16, color: Colors.inkMuted, textAlign: 'center', lineHeight: 24, maxWidth: 260 },
  actions: { alignSelf: 'stretch', gap: 8 },
  button: { backgroundColor: Colors.ink, paddingVertical: 16, borderRadius: 8, alignItems: 'center' },
  buttonText: { fontFamily: Fonts.bodyBold, color: Colors.paper, fontSize: 16 },
  secondaryButton: { paddingVertical: 8, alignItems: 'center' },
  secondaryButtonText: { fontFamily: Fonts.bodyBold, color: Colors.gold, fontSize: 14 },
});
