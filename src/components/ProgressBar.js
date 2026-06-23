import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../utils/theme';

const ProgressBar = ({ label, value, count, color, maxValue = 100 }) => {
  const animatedWidth = useRef(new Animated.Value(0)).current;
  const percentage = maxValue > 0 ? Math.round((value / maxValue) * 100) : 0;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: percentage,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const width = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.count}>{count} книг</Text>
      </View>
      <View style={styles.barContainer}>
        <Animated.View 
          style={[
            styles.bar, 
            { 
              width, 
              backgroundColor: color 
            }
          ]} 
        />
      </View>
      <Text style={styles.percentage}>{percentage}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  count: {
    fontSize: typography.base,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
  },
  barContainer: {
    height: 14,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  bar: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  percentage: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    textAlign: 'right',
    fontWeight: typography.semibold,
  },
});

export default ProgressBar;
