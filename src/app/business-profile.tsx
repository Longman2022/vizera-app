import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts } from '@/constants/vizera-theme';
import { completeProfile } from '@/lib/api';

const PAYMENT_OPTIONS = ['cash', 'transfer', 'pos'];

export default function BusinessProfileScreen() {
  const router = useRouter();

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

    if (!merchantType || !location || !yearsOperating) {
      setError('Fill in every field to continue.');
      return;
    }

    setLoading(true);
    try {
      await completeProfile({
        merchant_type: merchantType,
        location,
        years_operating: parseInt(yearsOperating, 10) || 0,
        payment_methods: paymentMethods,
      });

      router.replace('/log-activity');
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Tell us about your business</Text>

          <TextInput style={styles.input} placeholder="What do you sell? (e.g. cosmetics, fashion)" placeholderTextColor={Colors.inkMuted} value={merchantType} onChangeText={setMerchantType} />
          <TextInput style={styles.input} placeholder="Location (e.g. Lagos)" placeholderTextColor={Colors.inkMuted} value={location} onChangeText={setLocation} />
          <TextInput style={styles.input} placeholder="Years operating" placeholderTextColor={Colors.inkMuted} value={yearsOperating} onChangeText={setYearsOperating} keyboardType="number-pad" />

          <Text style={styles.label}>How do customers pay you?</Text>
          <View style={styles.chipRow}>
            {PAYMENT_OPTIONS.map((method) => (
              <Pressable key={method} onPress={() => togglePaymentMethod(method)} style={[styles.chip, paymentMethods.includes(method) && styles.chipSelected]}>
                <Text style={[styles.chipText, paymentMethods.includes(method) && styles.chipTextSelected]}>{method}</Text>
              </Pressable>
            ))}
          </View>

          {!!error && <Text style={styles.error}>{error}</Text>}

          <Pressable style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color={Colors.paper} /> : <Text style={styles.buttonText}>Continue</Text>}
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.paper },
  safeArea: { flex: 1 },
  scrollContent: { padding: 24, gap: 16 },
  title: { fontFamily: Fonts.display, fontSize: 22, color: Colors.ink, marginBottom: 8 },
  input: { backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.hairline, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 14, fontFamily: Fonts.body, fontSize: 16, color: Colors.ink },
  label: { fontFamily: Fonts.bodyMedium, color: Colors.ink, marginTop: 8 },
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { borderWidth: 1, borderColor: Colors.hairline, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8, backgroundColor: Colors.white },
  chipSelected: { backgroundColor: Colors.ink, borderColor: Colors.ink },
  chipText: { fontFamily: Fonts.body, color: Colors.ink, textTransform: 'capitalize' },
  chipTextSelected: { color: Colors.paper },
  error: { fontFamily: Fonts.body, color: Colors.brick },
  button: { backgroundColor: Colors.ink, paddingVertical: 16, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  buttonText: { fontFamily: Fonts.bodyBold, color: Colors.paper, fontSize: 16 },
});
