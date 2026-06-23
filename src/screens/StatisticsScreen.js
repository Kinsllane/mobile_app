import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useBooks } from '../context/BooksContext';
import ProgressBar from '../components/ProgressBar';
import StatCard from '../components/StatCard';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

const StatisticsScreen = ({ navigation }) => {
  const { books } = useBooks();
  const [selectedPeriod, setSelectedPeriod] = useState('all'); // all, year, month

  // Базовая статистика
  const totalBooks = books.length;
  const readBooks = books.filter((book) => book.status === 'Прочитано').length;
  const readingBooks = books.filter((book) => book.status === 'Читаю').length;
  const plannedBooks = books.filter(
    (book) => book.status === 'Планирую прочитать'
  ).length;
  const postponedBooks = totalBooks - readBooks - readingBooks - plannedBooks;

  // Рейтинг
  const ratedBooks = books.filter((book) => book.rating > 0);
  const averageRating =
    ratedBooks.length > 0
      ? (
          ratedBooks.reduce((sum, book) => sum + book.rating, 0) /
          ratedBooks.length
        ).toFixed(1)
      : 0;

  const highRatedBooks = books.filter((book) => book.rating >= 4).length;

  // Цвета для статусов
  const readPercentage =
    totalBooks > 0 ? Math.round((readBooks / totalBooks) * 100) : 0;

  // Статистика по жанрам
  const genreCounts = {};
  books.forEach((book) => {
    const genre = book.genre || 'Другое';
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
  });

  const topGenres = Object.entries(genreCounts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxGenreCount = topGenres.length > 0 ? topGenres[0].count : 1;

  // Цвета для жанров (обновлённая палитра)
  const genreColors = {
    Фантастика: '#FF6B6B',
    Детектив: '#4ECDC4',
    Фэнтези: '#45B7D1',
    Романтика: '#FFA07A',
    Бизнес: '#98D8C8',
    Саморазвитие: '#F59E0B',
    Психология: '#BB8FCE',
    История: '#85C1E2',
    Биография: '#F8B739',
    Наука: '#10B981',
    Философия: '#FF8C94',
    Классика: '#A8E6CF',
    Приключения: '#FFD3B6',
    Ужасы: '#FFAAA5',
    Триллер: '#C7CEEA',
    Другое: '#B4A7D6',
  };

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Детальная статистика</Text>
        <Text style={styles.headerSubtitle}>
          Полный обзор вашей библиотеки
        </Text>
      </View>

      {/* Основные метрики - сетка 2x2 */}
      <View style={styles.mainStatsContainer}>
        <View style={styles.statsRow}>
          <StatCard
            emoji="📚"
            value={totalBooks}
            label="Всего книг"
            color="#7C3AED"
          />
          <StatCard
            emoji="✅"
            value={readBooks}
            label="Прочитано"
            color="#10B981"
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard
            emoji="⭐"
            value={averageRating}
            label="Средний рейтинг"
            color="#F59E0B"
            subtitle={`${ratedBooks.length} оценок`}
          />
          <StatCard
            emoji="📈"
            value={`${readPercentage}%`}
            label="Прогресс"
            color="#45B7D1"
            subtitle="завершено"
          />
        </View>
      </View>

      {/* Дополнительная статистика */}
      <View style={styles.section}>
        <View style={styles.statsRow}>
          <StatCard
            emoji="🔥"
            value={highRatedBooks}
            label="Высокий рейтинг"
            color="#FF6B6B"
            subtitle="4+ звёзд"
          />
          <StatCard
            emoji="📖"
            value={readingBooks}
            label="Читаю сейчас"
            color="#F59E0B"
          />
        </View>
      </View>

      {/* Распределение по статусам */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Распределение по статусам</Text>
        <ProgressBar
          label="Прочитано"
          value={readBooks}
          count={readBooks}
          color="#10B981"
          maxValue={totalBooks}
        />
        <ProgressBar
          label="Читаю сейчас"
          value={readingBooks}
          count={readingBooks}
          color="#F59E0B"
          maxValue={totalBooks}
        />
        <ProgressBar
          label="Планирую прочитать"
          value={plannedBooks}
          count={plannedBooks}
          color="#7C3AED"
          maxValue={totalBooks}
        />
        {postponedBooks > 0 && (
          <ProgressBar
            label="Отложено"
            value={postponedBooks}
            count={postponedBooks}
            color="#EF4444"
            maxValue={totalBooks}
          />
        )}
      </View>

      {/* Топ жанров */}
      {topGenres.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Топ-{topGenres.length} популярных жанров
          </Text>
          {topGenres.map((item) => (
            <ProgressBar
              key={item.genre}
              label={item.genre}
              value={item.count}
              count={item.count}
              color={genreColors[item.genre] || '#B4A7D6'}
              maxValue={maxGenreCount}
            />
          ))}
        </View>
      )}

      {/* Кнопка перехода к целям */}
      <TouchableOpacity
        style={styles.goalsButton}
        onPress={() => navigation.navigate('Goals')}
      >
        <Text style={styles.goalsButtonText}>Перейти к целям чтения</Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.secondary,
  },
  headerTitle: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.base,
    color: colors.surface,
    opacity: 0.9,
    fontWeight: typography.semibold,
  },
  mainStatsContainer: {
    padding: spacing.base,
    paddingTop: 0,
    marginTop: -20,
  },
  section: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },
  goalsButton: {
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    backgroundColor: colors.warning,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  goalsButtonText: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.surface,
  },
});

export default StatisticsScreen;
