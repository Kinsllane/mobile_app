import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatisticsCard = ({ books }) => {
  const totalBooks = books.length;
  const readBooks = books.filter((book) => book.status === 'Прочитано').length;
  const readingBooks = books.filter((book) => book.status === 'Читаю').length;
  const plannedBooks = books.filter(
    (book) => book.status === 'Планирую прочитать'
  ).length;

  // Средний рейтинг прочитанных книг
  const ratedBooks = books.filter((book) => book.rating > 0);
  const averageRating =
    ratedBooks.length > 0
      ? (
          ratedBooks.reduce((sum, book) => sum + book.rating, 0) /
          ratedBooks.length
        ).toFixed(1)
      : 0;

  // Процент прочитанных книг
  const readPercentage =
    totalBooks > 0 ? Math.round((readBooks / totalBooks) * 100) : 0;

  if (totalBooks === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Моя статистика</Text>

      <View style={styles.mainStats}>
        <View style={styles.mainStatItem}>
          <Text style={styles.mainStatValue}>{totalBooks}</Text>
          <Text style={styles.mainStatLabel}>Всего книг</Text>
        </View>
        <View style={styles.mainStatItem}>
          <Text style={[styles.mainStatValue, { color: '#28a745' }]}>
            {readBooks}
          </Text>
          <Text style={styles.mainStatLabel}>Прочитано</Text>
        </View>
        <View style={styles.mainStatItem}>
          <Text style={[styles.mainStatValue, { color: '#FFA500' }]}>
            {averageRating}
          </Text>
          <Text style={styles.mainStatLabel}>Средний рейтинг</Text>
        </View>
      </View>

      {/* Прогресс-бар */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressFill, { width: `${readPercentage}%` }]}
          />
        </View>
        <Text style={styles.progressText}>{readPercentage}% прочитано</Text>
      </View>

      {/* Детальная статистика */}
      <View style={styles.detailStats}>
        <View style={styles.detailStatItem}>
          <Text style={styles.detailStatEmoji}>📖</Text>
          <Text style={styles.detailStatValue}>{readingBooks}</Text>
          <Text style={styles.detailStatLabel}>Читаю</Text>
        </View>
        <View style={styles.detailStatItem}>
          <Text style={styles.detailStatEmoji}>📚</Text>
          <Text style={styles.detailStatValue}>{plannedBooks}</Text>
          <Text style={styles.detailStatLabel}>Планирую</Text>
        </View>
        <View style={styles.detailStatItem}>
          <Text style={styles.detailStatEmoji}>⏸️</Text>
          <Text style={styles.detailStatValue}>
            {totalBooks - readBooks - readingBooks - plannedBooks}
          </Text>
          <Text style={styles.detailStatLabel}>Отложено</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  mainStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  mainStatItem: {
    alignItems: 'center',
  },
  mainStatValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  mainStatLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#28a745',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontWeight: '600',
  },
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  detailStatItem: {
    alignItems: 'center',
  },
  detailStatEmoji: {
    fontSize: 20,
    marginBottom: 2,
  },
  detailStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  detailStatLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
  },
});

export default StatisticsCard;
