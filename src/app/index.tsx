import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/constants/vizera-theme';

export default function WelcomeScreen() {
  const router = useRouter();

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

        <Pressable style={styles.button} onPress={() => router.push('/business-setup')}>
          <Text style={styles.buttonText}>Get started</Text>
        </Pressable>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    gap: 48,
  },
  heroSection: {
    alignItems: 'center',
    gap: 16,
  },
  wordmark: {
    fontFamily: Fonts.display,
    fontSize: 40,
    color: Colors.ink,
  },
  rule: {
    width: 48,
    height: 3,
    backgroundColor: Colors.gold,
    borderRadius: 2,
  },
  tagline: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.inkMuted,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 260,
  },
  button: {
    backgroundColor: Colors.ink,
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: Fonts.bodyBold,
    color: Colors.paper,
    fontSize: 16,
  },
});
