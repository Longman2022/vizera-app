import { forwardRef } from 'react';
import { StyleSheet, View, Text } from 'react-native';

import { Colors, Fonts } from '@/constants/vizera-theme';

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
        <View style={styles.rule} />
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
          <View style={styles.divider} />
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
    backgroundColor: Colors.ink,
    borderRadius: 16,
    paddingVertical: 32,
    paddingHorizontal: 28,
    alignItems: 'center',
    gap: 16,
  },
  brand: {
    fontFamily: Fonts.display,
    color: Colors.paper,
    fontSize: 16,
    letterSpacing: 3,
  },
  rule: {
    width: 32,
    height: 2,
    backgroundColor: Colors.gold,
    borderRadius: 2,
  },
  businessName: {
    fontFamily: Fonts.bodyBold,
    color: Colors.paper,
    fontSize: 16,
    textAlign: 'center',
  },
  statBlock: {
    alignItems: 'center',
    marginTop: 8,
  },
  statValue: {
    fontFamily: Fonts.display,
    color: Colors.gold,
    fontSize: 32,
  },
  statLabel: {
    fontFamily: Fonts.body,
    color: Colors.paper,
    opacity: 0.7,
    fontSize: 12,
    marginTop: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
    marginTop: 8,
  },
  smallStat: {
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.paper,
    opacity: 0.2,
  },
  smallStatValue: {
    fontFamily: Fonts.bodyBold,
    color: Colors.paper,
    fontSize: 16,
  },
  smallStatLabel: {
    fontFamily: Fonts.body,
    color: Colors.paper,
    opacity: 0.6,
    fontSize: 11,
    marginTop: 2,
  },
  footer: {
    fontFamily: Fonts.body,
    color: Colors.gold,
    fontSize: 11,
    marginTop: 8,
  },
});
