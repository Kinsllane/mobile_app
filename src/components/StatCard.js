import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

const StatCard = ({ emoji, value, label, color = colors.primary, subtitle }) => {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: spacing.xs,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
    minHeight: 140,
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 40,
    marginBottom: spacing.md,
  },
  value: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: typography.semibold,
  },
  subtitle: {
    fontSize: typography.xs,
    color: colors.textTertiary,
    marginTop: spacing.xs,
    textAlign: 'center',
    fontWeight: typography.regular,
  },
});

export default StatCard;
