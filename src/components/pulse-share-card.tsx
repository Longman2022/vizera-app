import { forwardRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';

type PulseShareCardProps = {
  businessName: string;
  averageSales: number;
  daysLogged: number;
  bestDaySales: number;
};

export const PulseShareCard = forwardRef<View, PulseShareCardProps>(
  ({ businessName, averageSales, daysLogged, bestDaySales }, ref) => {
    return (
      <View ref={ref} style={styles.card} collapsable={false}>
        <Text style={styles.brand}>VIZERA</Text>
        <Text style={styles.businessName}>{businessName}</Text>

        <View style={styles.statBlock}>
          <Text style={styles.statValue}>₦{Math.round(averageSales).toLocaleString()}</Text>
          <Text style={styles.statLabel}>average daily sales</Text>
        </View>

        <View style={styles.row}>
          <View style={styles.smallStat}>
            <Text style={styles.smallStatValue}>{daysLogged}</Text>
            <Text style={styles.smallStatLabel}>days tracked</Text>
          </View>
          <View style={styles.smallStat}>
            <Text style={styles.smallStatValue}>₦{bestDaySales.toLocaleString()}</Text>
            <Text style={styles.smallStatLabel}>best day</Text>
          </View>
        </View>

        <Text style={styles.footer}>My business, tracked with Vizera</Text>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  card: {
    width: 320,
    backgroundColor: '#1e3a8a',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  brand: {
    color: '#93c5fd',
    fontWeight: '800',
    fontSize: 14,
    letterSpacing: 4,
  },
  businessName: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 20,
    textAlign: 'center',
  },
  statBlock: {
    alignItems: 'center',
    marginTop: 8,
  },
  statValue: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 36,
  },
  statLabel: {
    color: '#bfdbfe',
    fontSize: 13,
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 32,
    marginTop: 8,
  },
  smallStat: {
    alignItems: 'center',
  },
  smallStatValue: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  smallStatLabel: {
    color: '#bfdbfe',
    fontSize: 12,
    marginTop: 2,
  },
  footer: {
    color: '#93c5fd',
    fontSize: 11,
    marginTop: 12,
  },
});
