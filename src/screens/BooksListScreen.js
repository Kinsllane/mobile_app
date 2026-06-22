import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useBooks, GENRES } from '../context/BooksContext';
import StatisticsCard from '../components/StatisticsCard';

const BooksListScreen = ({ navigation }) => {
  const { books, loading } = useBooks();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Все');
  const [filterGenre, setFilterGenre] = useState('Все');
  const [sortBy, setSortBy] = useState('dateAdded'); // dateAdded, rating, title, author

  const statuses = ['Все', 'Планирую прочитать', 'Читаю', 'Прочитано', 'Отложено'];
  const genres = ['Все', ...GENRES];
  const sortOptions = [
    { value: 'dateAdded', label: '📅 Дата' },
    { value: 'rating', label: '⭐ Рейтинг' },
    { value: 'title', label: '🔤 Название' },
    { value: 'author', label: '✍️ Автор' },
  ];

  const [showStatistics, setShowStatistics] = useState(false);

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
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Загрузка книг...</Text>
      </View>
    );
  }

  const renderBookItem = ({ item }) => (
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
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Кнопка показа статистики */}
      <TouchableOpacity
        style={styles.statisticsToggle}
        onPress={() => setShowStatistics(!showStatistics)}
      >
        <Text style={styles.statisticsToggleIcon}>
          {showStatistics ? '📊 ▼' : '📊 ▶'}
        </Text>
        <Text style={styles.statisticsToggleText}>
          {showStatistics ? 'Скрыть статистику' : 'Показать статистику'}
        </Text>
      </TouchableOpacity>

      {/* Статистика (сворачиваемая) */}
      {showStatistics && <StatisticsCard books={books} />}

      {/* Поиск */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Поиск по названию или автору..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
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
        <FlatList
          horizontal
          data={statuses}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
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
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Фильтр по жанру */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Жанр:</Text>
        <FlatList
          horizontal
          data={genres}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
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
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

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
          <FlatList
            data={filteredAndSortedBooks}
            renderItem={renderBookItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        </>
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddBook')}
      >
        <Text style={styles.addButtonText}>+ Добавить книгу</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  statisticsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  statisticsToggleIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  statisticsToggleText: {
    fontSize: 15,
    color: '#6200ee',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 20,
    color: '#999',
  },
  sortContainer: {
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  sortLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  sortButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sortButtonActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
  },
  sortButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  filterContainer: {
    paddingLeft: 16,
    marginBottom: 6,
  },
  filterLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
    fontWeight: '600',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterButtonActive: {
    backgroundColor: '#6200ee',
    borderColor: '#6200ee',
  },
  filterButtonText: {
    fontSize: 13,
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  resultCount: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookCover: {
    width: 80,
    height: 120,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookCoverText: {
    fontSize: 40,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  bookGenre: {
    fontSize: 12,
    color: '#6200ee',
    marginBottom: 6,
  },
  bookMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rating: {
    fontSize: 14,
    color: '#FFA500',
  },
  status: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    margin: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BooksListScreen;
