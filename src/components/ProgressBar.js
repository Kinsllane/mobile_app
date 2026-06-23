import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

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
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  count: {
    fontSize: 13,
    color: '#666',
  },
  barContainer: {
    height: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 4,
  },
  bar: {
    height: '100%',
    borderRadius: 6,
  },
  percentage: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
});

export default ProgressBar;
