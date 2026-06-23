import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useBooks } from '../context/BooksContext';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

const FavoritesScreen = ({ navigation }) => {
  const { books } = useBooks();

  // Фильтруем только избранные книги
  const favoriteBooks = books.filter((book) => book.isFavorite);

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.bookCard, { borderLeftColor: item.coverColor }]}
      onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
    >
      <View style={styles.bookContent}>
        <View style={styles.bookHeader}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.favoriteIcon}>❤️</Text>
        </View>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {item.author}
        </Text>
        {item.genre && (
          <View style={styles.genreBadge}>
            <Text style={styles.genreText}>{item.genre}</Text>
          </View>
        )}
        {item.rating > 0 && (
          <Text style={styles.bookRating}>{renderStars(item.rating)}</Text>
        )}
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'Прочитано'
                  ? '#10B981'
                  : item.status === 'Читаю'
                  ? '#F59E0B'
                  : item.status === 'Планирую прочитать'
                  ? '#7C3AED'
                  : '#EF4444',
            },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Избранное</Text>
        <Text style={styles.headerSubtitle}>
          {favoriteBooks.length}{' '}
          {favoriteBooks.length === 1
            ? 'книга'
            : favoriteBooks.length >= 2 && favoriteBooks.length <= 4
            ? 'книги'
            : 'книг'}
        </Text>
      </View>

      {favoriteBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>💔</Text>
          <Text style={styles.emptyTitle}>Пока нет избранных книг</Text>
          <Text style={styles.emptyText}>
            Добавляйте книги в избранное, нажав на сердечко в деталях книги
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => navigation.navigate('BooksList')}
          >
            <Text style={styles.emptyButtonText}>К списку книг</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favoriteBooks}
          renderItem={renderBookItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
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
    backgroundColor: colors.favorite,
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
  listContent: {
    padding: spacing.base,
    paddingTop: spacing.sm,
  },
  bookCard: {
    backgroundColor: colors.surface,
    marginBottom: spacing.base,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  bookContent: {
    flex: 1,
  },
  bookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  bookTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.sm,
  },
  favoriteIcon: {
    fontSize: 22,
  },
  bookAuthor: {
    fontSize: typography.base,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: typography.regular,
  },
  genreBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  genreText: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: typography.semibold,
  },
  bookRating: {
    fontSize: typography.base,
    marginBottom: spacing.sm,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  statusText: {
    fontSize: typography.sm,
    color: colors.surface,
    fontWeight: typography.bold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
  },
  emptyIcon: {
    fontSize: 90,
    marginBottom: spacing.xl,
  },
  emptyTitle: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
    fontWeight: typography.regular,
  },
  emptyButton: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.secondary,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.xl,
    ...shadows.sm,
  },
  emptyButtonText: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.surface,
  },
});

export default FavoritesScreen;
