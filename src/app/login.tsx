import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/constants/vizera-theme';
import { login } from '@/lib/api';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setError('');

    if (!email || !password) {
      setError('Enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      router.replace('/log-activity');
    } catch (err: any) {
      setError(err.message || 'Could not log in. Check your details and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to your business account.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={Colors.inkMuted}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={Colors.inkMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {!!error && <Text style={styles.error}>{error}</Text>}

        <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color={Colors.paper} /> : <Text style={styles.buttonText}>Log in</Text>}
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push('/business-setup')}>
          <Text style={styles.secondaryButtonText}>New here? Create an account</Text>
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
    padding: 24,
    gap: 16,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 22,
    color: Colors.ink,
  },
  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.inkMuted,
    marginBottom: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.hairline,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.ink,
  },
  error: {
    fontFamily: Fonts.body,
    color: Colors.brick,
  },
  button: {
    backgroundColor: Colors.ink,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
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
    fontSize: 15,
  },
});
