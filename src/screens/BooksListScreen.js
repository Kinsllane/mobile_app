import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useBooks, GENRES } from '../context/BooksContext';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

const BooksListScreen = ({ navigation }) => {
  const { books, loading, updateBook } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Все');
  const [filterGenre, setFilterGenre] = useState('Все');
  const [sortBy, setSortBy] = useState('dateAdded'); // dateAdded, rating, title, author
  const [showFilters, setShowFilters] = useState(false);

  const statuses = ['Все', 'Планирую прочитать', 'Читаю', 'Прочитано', 'Отложено'];
  const genres = ['Все', ...GENRES];
  const sortOptions = [
    { value: 'dateAdded', label: '📅 Дата' },
    { value: 'rating', label: '⭐ Рейтинг' },
    { value: 'title', label: '🔤 Название' },
    { value: 'author', label: '✍️ Автор' },
  ];

  // Подсчет активных фильтров
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterStatus !== 'Все') count++;
    if (filterGenre !== 'Все') count++;
    if (sortBy !== 'dateAdded') count++;
    return count;
  }, [filterStatus, filterGenre, sortBy]);

  // Фильтрация и сортировка книг
  const filteredAndSortedBooks = useMemo(() => {
    let result = [...books];

    // Поиск по названию и автору
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      );
    }

    // Фильтр по статусу
    if (filterStatus !== 'Все') {
      result = result.filter((book) => book.status === filterStatus);
    }

    // Фильтр по жанру
    if (filterGenre !== 'Все') {
      result = result.filter((book) => book.genre === filterGenre);
    }

    // Сортировка
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'title':
          return a.title.localeCompare(b.title, 'ru');
        case 'author':
          return a.author.localeCompare(b.author, 'ru');
        case 'dateAdded':
        default:
          return parseInt(b.id) - parseInt(a.id); // Новые сверху
      }
    });

    return result;
  }, [books, searchQuery, filterStatus, filterGenre, sortBy]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Загрузка книг...</Text>
      </View>
    );
  }

  const renderBookItem = ({ item }) => {
    const toggleFavorite = async (e) => {
      e.stopPropagation(); // Предотвращаем открытие деталей книги
      await updateBook(item.id, { isFavorite: !item.isFavorite });
    };

    return (
      <TouchableOpacity
        style={styles.bookCard}
        onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
      >
        <View style={[styles.bookCover, { backgroundColor: item.coverColor }]}>
          <Text style={styles.bookCoverText}>📚</Text>
        </View>
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{item.title}</Text>
          <Text style={styles.bookAuthor}>{item.author}</Text>
          {item.genre && (
            <Text style={styles.bookGenre}>🏷️ {item.genre}</Text>
          )}
          <View style={styles.bookMeta}>
            <Text style={styles.rating}>
              {item.rating ? `⭐ ${item.rating}/5` : '⭐ —'}
            </Text>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        </View>
        {/* Кнопка избранного в углу карточки */}
        <TouchableOpacity
          style={styles.favoriteButtonCard}
          onPress={toggleFavorite}
        >
          <Text style={styles.favoriteIconCard}>
            {item.isFavorite ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Кнопки быстрой навигации */}
        <View style={styles.quickNavContainer}>
          <TouchableOpacity
            style={[styles.quickNavButton, styles.statsButton]}
            onPress={() => navigation.navigate('Statistics')}
          >
            <Text style={styles.quickNavText}>Статистика</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickNavButton, styles.goalsButton]}
            onPress={() => navigation.navigate('Goals')}
          >
            <Text style={styles.quickNavText}>Цели</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.quickNavButton, styles.favoritesButton]}
            onPress={() => navigation.navigate('Favorites')}
          >
            <Text style={styles.quickNavText}>Избранное</Text>
          </TouchableOpacity>
        </View>

        {/* Новая кнопка: Книжные места */}
        <TouchableOpacity
          style={styles.placesButton}
          onPress={() => navigation.navigate('ReadingPlaces')}
        >
          <Text style={styles.placesButtonText}>Книжные места на карте</Text>
        </TouchableOpacity>

        {/* Поиск */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Поиск по названию или автору..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textTertiary}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Кнопка показа фильтров */}
        <TouchableOpacity
          style={styles.filtersToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filtersToggleIcon}>
            {showFilters ? '🎛️ ▼' : '🎛️ ▶'}
          </Text>
          <Text style={styles.filtersToggleText}>
            {showFilters ? 'Скрыть фильтры и сортировку' : 'Показать фильтры и сортировку'}
          </Text>
          {activeFiltersCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFiltersCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Фильтры и сортировка (сворачиваемые) */}
        {showFilters && (
          <>
            {/* Кнопка сброса фильтров */}
            {activeFiltersCount > 0 && (
              <TouchableOpacity
                style={styles.resetFiltersButton}
                onPress={() => {
                  setFilterStatus('Все');
                  setFilterGenre('Все');
                  setSortBy('dateAdded');
                }}
              >
                <Text style={styles.resetFiltersText}>
                  🔄 Сбросить все фильтры
                </Text>
              </TouchableOpacity>
            )}

            {/* Сортировка */}
            <View style={styles.sortContainer}>
              <Text style={styles.sortLabel}>Сортировка:</Text>
              <View style={styles.sortButtons}>
                {sortOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.sortButton,
                      sortBy === option.value && styles.sortButtonActive,
                    ]}
                    onPress={() => setSortBy(option.value)}
                  >
                    <Text
                      style={[
                        styles.sortButtonText,
                        sortBy === option.value && styles.sortButtonTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Фильтр по статусу */}
            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>Статус:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
              >
                {statuses.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.filterButton,
                      filterStatus === item && styles.filterButtonActive,
                    ]}
                    onPress={() => setFilterStatus(item)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        filterStatus === item && styles.filterButtonTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Фильтр по жанру */}
            <View style={styles.filterContainer}>
              <Text style={styles.filterLabel}>Жанр:</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterScroll}
              >
                {genres.map((item) => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.filterButton,
                      filterGenre === item && styles.filterButtonActive,
                    ]}
                    onPress={() => setFilterGenre(item)}
                  >
                    <Text
                      style={[
                        styles.filterButtonText,
                        filterGenre === item && styles.filterButtonTextActive,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}

        {/* Список книг */}
        {filteredAndSortedBooks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>
              {books.length === 0 ? '📚' : '🔍'}
            </Text>
            <Text style={styles.emptyText}>
              {books.length === 0 ? 'Пока нет книг' : 'Ничего не найдено'}
            </Text>
            <Text style={styles.emptySubtext}>
              {books.length === 0
                ? 'Добавьте свою первую книгу!'
                : 'Попробуйте изменить фильтры или поиск'}
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.resultCount}>
              Найдено книг: {filteredAndSortedBooks.length}
            </Text>
            <View style={styles.booksContainer}>
              {filteredAndSortedBooks.map((item) => {
                const toggleFavorite = async (e) => {
                  e.stopPropagation();
                  await updateBook(item.id, { isFavorite: !item.isFavorite });
                };

                return (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.bookCard}
                    onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
                  >
                    <View style={[styles.bookCover, { backgroundColor: item.coverColor }]}>
                      <Text style={styles.bookCoverText}>📚</Text>
                    </View>
                    <View style={styles.bookInfo}>
                      <Text style={styles.bookTitle}>{item.title}</Text>
                      <Text style={styles.bookAuthor}>{item.author}</Text>
                      {item.genre && (
                        <Text style={styles.bookGenre}>🏷️ {item.genre}</Text>
                      )}
                      <View style={styles.bookMeta}>
                        <Text style={styles.rating}>
                          {item.rating ? `⭐ ${item.rating}/5` : '⭐ —'}
                        </Text>
                        <Text style={styles.status}>{item.status}</Text>
                      </View>
                    </View>
                    {/* Кнопка избранного в углу карточки */}
                    <TouchableOpacity
                      style={styles.favoriteButtonCard}
                      onPress={toggleFavorite}
                    >
                      <Text style={styles.favoriteIconCard}>
                        {item.isFavorite ? '❤️' : '🤍'}
                      </Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* Отступ снизу для кнопки */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Кнопка добавления (фиксированная) */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddBook')}
        >
          <Text style={styles.addButtonText}>+ Добавить книгу</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.base,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
  },
  filtersToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  filtersToggleIcon: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  filtersToggleText: {
    fontSize: typography.base,
    color: colors.primary,
    fontWeight: typography.bold,
    flex: 1,
  },
  filterBadge: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.md,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  filterBadgeText: {
    color: colors.surface,
    fontSize: typography.xs,
    fontWeight: typography.bold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    margin: spacing.base,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  searchIcon: {
    fontSize: 22,
    marginRight: spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: spacing.base,
    fontSize: typography.base,
    color: colors.textPrimary,
    fontWeight: typography.medium,
  },
  clearButton: {
    padding: spacing.sm,
  },
  clearButtonText: {
    fontSize: 22,
    color: colors.textTertiary,
  },
  quickNavContainer: {
    flexDirection: 'row',
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  quickNavButton: {
    flex: 1,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  statsButton: {
    backgroundColor: colors.primary,
  },
  goalsButton: {
    backgroundColor: colors.primary,
  },
  favoritesButton: {
    backgroundColor: colors.primary,
  },
  quickNavText: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.surface,
    textAlign: 'center',
  },
  placesButton: {
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.success,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  placesButtonText: {
    fontSize: typography.sm,
    fontWeight: typography.bold,
    color: colors.surface,
    textAlign: 'center',
  },
  sortContainer: {
    paddingHorizontal: spacing.base,
    marginBottom: spacing.sm,
  },
  sortLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: typography.semibold,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sortButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sortButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  sortButtonText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
  },
  sortButtonTextActive: {
    color: colors.primary,
    fontWeight: typography.bold,
  },
  filterContainer: {
    paddingLeft: spacing.base,
    marginBottom: spacing.sm,
  },
  filterLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: typography.semibold,
  },
  filterScroll: {
    flexGrow: 0,
  },
  filterButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  filterButtonText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
  },
  filterButtonTextActive: {
    color: colors.primary,
    fontWeight: typography.bold,
  },
  resetFiltersButton: {
    backgroundColor: colors.backgroundSecondary,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  resetFiltersText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
  },
  resultCount: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing['2xl'],
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: spacing.lg,
  },
  emptyText: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: typography.base,
    color: colors.textSecondary,
    textAlign: 'center',
    fontWeight: typography.regular,
  },
  booksContainer: {
    padding: spacing.base,
    paddingTop: spacing.sm,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
    ...shadows.sm,
  },
  bookCover: {
    width: 95,
    height: 140,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookCoverText: {
    fontSize: 48,
  },
  bookInfo: {
    flex: 1,
    marginLeft: spacing.base,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  bookAuthor: {
    fontSize: typography.base,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: typography.regular,
  },
  bookGenre: {
    fontSize: typography.sm,
    color: colors.textTertiary,
    marginBottom: spacing.sm,
    fontWeight: typography.medium,
  },
  bookMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rating: {
    fontSize: typography.sm,
    color: colors.rating,
    fontWeight: typography.semibold,
  },
  status: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: typography.semibold,
  },
  favoriteButtonCard: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.favoriteLight,
    borderRadius: borderRadius.full,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.favorite,
  },
  favoriteIconCard: {
    fontSize: 18,
  },
  bottomSpacer: {
    height: 20,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.base,
    backgroundColor: 'transparent',
  },
  addButton: {
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    paddingVertical: spacing.base,
    alignItems: 'center',
    ...shadows.md,
  },
  addButtonText: {
    color: colors.surface,
    fontSize: typography.base,
    fontWeight: typography.bold,
  },
});

export default BooksListScreen;
