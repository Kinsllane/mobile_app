import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const BarChart = ({ data, maxValue }) => {
  const chartHeight = 150;
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {data.map((item, index) => {
          const barHeight = maxValue > 0 
            ? (item.value / maxValue) * chartHeight 
            : 0;
          
          return (
            <View key={index} style={styles.barContainer}>
              {/* Значение над столбиком */}
              {item.value > 0 && (
                <Text style={styles.valueText}>{item.value}</Text>
              )}
              
              {/* Столбик */}
              <View style={styles.barWrapper}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      height: barHeight || 4, // Минимальная высота для визуализации
                      backgroundColor: item.color,
                    }
                  ]} 
                />
              </View>
              
              {/* Название жанра */}
              <Text 
                style={styles.labelText} 
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {item.label}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  scrollContent: {
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    marginHorizontal: 6,
    width: 60,
  },
  valueText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
    height: 20,
  },
  barWrapper: {
    height: 150,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 40,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    minHeight: 4,
  },
  labelText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    width: 60,
    height: 32,
  },
});

export default BarChart;
