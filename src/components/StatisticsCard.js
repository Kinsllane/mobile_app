import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { GENRES } from '../context/BooksContext';
import ProgressBar from './ProgressBar';
import StatCard from './StatCard';

const StatisticsCard = ({ books }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const totalBooks = books.length;
  const readBooks = books.filter((book) => book.status === 'Прочитано').length;
  const readingBooks = books.filter((book) => book.status === 'Читаю').length;
  const plannedBooks = books.filter(
    (book) => book.status === 'Планирую прочитать'
  ).length;
  const postponedBooks = totalBooks - readBooks - readingBooks - plannedBooks;

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

  // Подсчет жанров
  const genreCounts = {};
  books.forEach(book => {
    const genre = book.genre || 'Другое';
    genreCounts[genre] = (genreCounts[genre] || 0) + 1;
  });

  // Топ-5 жанров для прогресс-баров
  const topGenres = Object.entries(genreCounts)
    .map(([genre, count]) => ({ genre, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxGenreCount = topGenres.length > 0 ? topGenres[0].count : 1;

  // Цвета для жанров
  const genreColors = {
    'Фантастика': '#FF6B6B',
    'Детектив': '#4ECDC4',
    'Фэнтези': '#45B7D1',
    'Романтика': '#FFA07A',
    'Бизнес': '#98D8C8',
    'Саморазвитие': '#F7DC6F',
    'Психология': '#BB8FCE',
    'История': '#85C1E2',
    'Биография': '#F8B739',
    'Наука': '#52B788',
    'Философия': '#FF8C94',
    'Классика': '#A8E6CF',
    'Приключения': '#FFD3B6',
    'Ужасы': '#FFAAA5',
    'Триллер': '#C7CEEA',
    'Другое': '#B4A7D6',
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Моя статистика</Text>

      {/* Основные карточки-метрики 2x2 */}
      <View style={styles.statsGrid}>
        <View style={styles.statsRow}>
          <StatCard 
            emoji="📚" 
            value={totalBooks} 
            label="Всего книг" 
            color="#6200ee"
          />
          <StatCard 
            emoji="✅" 
            value={readBooks} 
            label="Прочитано" 
            color="#28a745"
          />
        </View>
        <View style={styles.statsRow}>
          <StatCard 
            emoji="⭐" 
            value={averageRating} 
            label="Средний рейтинг" 
            color="#FFA500"
            subtitle={`из ${ratedBooks.length} оценённых`}
          />
          <StatCard 
            emoji="📈" 
            value={`${readPercentage}%`} 
            label="Прогресс" 
            color="#45B7D1"
            subtitle="прочитано"
          />
        </View>
      </View>

      {/* Кнопка показа детализации */}
      <TouchableOpacity
        style={styles.detailsToggle}
        onPress={() => setShowDetails(!showDetails)}
      >
        <Text style={styles.detailsToggleText}>
          {showDetails ? '📊 Скрыть детали' : '📊 Показать детальную статистику'}
        </Text>
      </TouchableOpacity>

      {/* Детальная статистика с прогресс-барами */}
      {showDetails && (
        <View style={styles.detailsContainer}>
          {/* Статусы */}
          <Text style={styles.sectionTitle}>По статусам</Text>
          <ProgressBar 
            label="Прочитано" 
            value={readBooks} 
            count={readBooks}
            color="#28a745" 
            maxValue={totalBooks}
          />
          <ProgressBar 
            label="Читаю сейчас" 
            value={readingBooks} 
            count={readingBooks}
            color="#FFA500" 
            maxValue={totalBooks}
          />
          <ProgressBar 
            label="Планирую прочитать" 
            value={plannedBooks} 
            count={plannedBooks}
            color="#6200ee" 
            maxValue={totalBooks}
          />
          {postponedBooks > 0 && (
            <ProgressBar 
              label="Отложено" 
              value={postponedBooks} 
              count={postponedBooks}
              color="#dc3545" 
              maxValue={totalBooks}
            />
          )}

          {/* Топ жанров */}
          {topGenres.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                Топ-{topGenres.length} жанров
              </Text>
              {topGenres.map((item, index) => (
                <ProgressBar 
                  key={item.genre}
                  label={item.genre} 
                  value={item.count} 
                  count={item.count}
                  color={genreColors[item.genre] || '#B4A7D6'} 
                  maxValue={maxGenreCount}
                />
              ))}
            </>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(20, 25, 60, 0.6)',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 146, 255, 0.3)',
    shadowColor: '#8B92FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  statsGrid: {
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailsToggle: {
    marginTop: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(139, 146, 255, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(139, 146, 255, 0.3)',
  },
  detailsToggleText: {
    fontSize: 15,
    color: '#00F5FF',
    fontWeight: '800',
  },
  detailsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 146, 255, 0.2)',
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
});

export default StatisticsCard;
