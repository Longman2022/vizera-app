import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/constants/vizera-theme';
import { signup, login } from '@/lib/api';

export default function BusinessSetupScreen() {
  const router = useRouter();

  const [businessName, setBusinessName] = useState('');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit() {
    setError('');

    if (!businessName || !identifier || !password) {
      setError('Fill in every field to continue.');
      return;
    }

    setLoading(true);
    try {
      const isEmail = identifier.includes('@');

      await signup({
        business_name: businessName,
        email: isEmail ? identifier : undefined,
        phone_number: isEmail ? undefined : identifier,
        password,
        consent_given: true,
      });

      await login(identifier, password);

      router.replace('/business-profile');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>You can add the rest of your business details next.</Text>

        <TextInput
          style={styles.input}
          placeholder="Business name"
          placeholderTextColor={Colors.inkMuted}
          value={businessName}
          onChangeText={setBusinessName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email or phone number"
          placeholderTextColor={Colors.inkMuted}
          value={identifier}
          onChangeText={setIdentifier}
          autoCapitalize="none"
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
          {loading ? <ActivityIndicator color={Colors.paper} /> : <Text style={styles.buttonText}>Continue</Text>}
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
});
