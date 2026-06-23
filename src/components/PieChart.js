import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';

const PieChart = ({ data, size = 180, strokeWidth = 30 }) => {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Вычисляем углы для каждого сегмента
  let currentAngle = -90; // Начинаем с верха
  const segments = data.map((item) => {
    const angle = (item.value / 100) * 360;
    const segment = {
      ...item,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      strokeDasharray: `${(item.value / 100) * circumference} ${circumference}`,
      strokeDashoffset: circumference * 0.25, // Поворот на 90 градусов
    };
    currentAngle += angle;
    return segment;
  });

  // Функция для расчета позиции текста в центре сегмента
  const getTextPosition = (startAngle, endAngle, radius) => {
    const angle = ((startAngle + endAngle) / 2) * (Math.PI / 180);
    const textRadius = radius * 0.7;
    return {
      x: center + textRadius * Math.cos(angle),
      y: center + textRadius * Math.sin(angle),
    };
  };

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation={-90} origin={`${center}, ${center}`}>
          {segments.map((segment, index) => {
            const rotation = segment.startAngle + 90;
            return (
              <Circle
                key={index}
                cx={center}
                cy={center}
                r={radius}
                stroke={segment.color}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={segment.strokeDasharray}
                strokeLinecap="round"
                rotation={rotation}
                origin={`${center}, ${center}`}
              />
            );
          })}
        </G>
        {/* Проценты на диаграмме */}
        {segments.map((segment, index) => {
          if (segment.value < 5) return null; // Не показываем текст для маленьких сегментов
          const pos = getTextPosition(segment.startAngle, segment.endAngle, radius);
          return (
            <SvgText
              key={`text-${index}`}
              x={pos.x}
              y={pos.y}
              fill="white"
              fontSize="16"
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="central"
            >
              {Math.round(segment.value)}%
            </SvgText>
          );
        })}
      </Svg>
      
      {/* Легенда */}
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>
              {item.label}: {item.count}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  legend: {
    marginTop: 16,
    alignItems: 'flex-start',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#333',
  },
});

export default PieChart;
