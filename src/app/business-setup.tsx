import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { signup, login } from '@/lib/api';

const PAYMENT_OPTIONS = ['cash', 'transfer', 'pos'];

export default function BusinessSetupScreen() {
  const router = useRouter();

  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [merchantType, setMerchantType] = useState('');
  const [location, setLocation] = useState('');
  const [yearsOperating, setYearsOperating] = useState('');
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function togglePaymentMethod(method: string) {
    setPaymentMethods((prev) =>
      prev.includes(method) ? prev.filter((m) => m !== method) : [...prev, method]
    );
  }

  async function handleSubmit() {
    setError('');

    if (!businessName || !email || !password || !merchantType || !location || !yearsOperating) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await signup({
        business_name: businessName,
        email,
        password,
        consent_given: true,
        merchant_type: merchantType,
        location,
        years_operating: parseInt(yearsOperating, 10) || 0,
        payment_methods: paymentMethods,
      });

      await login(email, password);

      router.replace('/log-activity');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <ThemedText type="title" style={styles.title}>
            Tell us about your business
          </ThemedText>

          <TextInput
            style={styles.input}
            placeholder="Business name"
            placeholderTextColor="#999"
            value={businessName}
            onChangeText={setBusinessName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="What do you sell? (e.g. cosmetics, fashion)"
            placeholderTextColor="#999"
            value={merchantType}
            onChangeText={setMerchantType}
          />
          <TextInput
            style={styles.input}
            placeholder="Location (e.g. Lagos)"
            placeholderTextColor="#999"
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="Years operating"
            placeholderTextColor="#999"
            value={yearsOperating}
            onChangeText={setYearsOperating}
            keyboardType="number-pad"
          />

          <ThemedText style={styles.label}>How do customers pay you?</ThemedText>
          <ThemedView style={styles.chipRow}>
            {PAYMENT_OPTIONS.map((method) => (
              <Pressable
                key={method}
                onPress={() => togglePaymentMethod(method)}
                style={[
                  styles.chip,
                  paymentMethods.includes(method) && styles.chipSelected,
                ]}
              >
                <ThemedText
                  style={[
                    styles.chipText,
                    paymentMethods.includes(method) && styles.chipTextSelected,
                  ]}
                >
                  {method}
                </ThemedText>
              </Pressable>
            ))}
          </ThemedView>

          {!!error && <ThemedText style={styles.error}>{error}</ThemedText>}

          <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Continue</ThemedText>
            )}
          </Pressable>
        </ScrollView>
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
  },
  scrollContent: {
    padding: Spacing.four,
    gap: Spacing.three,
  },
  title: {
    marginBottom: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
    fontSize: 16,
  },
  label: {
    marginTop: Spacing.two,
  },
  chipRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  chip: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  chipSelected: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  chipText: {
    textTransform: 'capitalize',
  },
  chipTextSelected: {
    color: '#fff',
  },
  error: {
    color: '#dc2626',
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
});
