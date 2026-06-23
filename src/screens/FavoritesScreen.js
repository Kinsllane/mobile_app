import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useBooks } from '../context/BooksContext';

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
                  ? '#28a745'
                  : item.status === 'Читаю'
                  ? '#FFA500'
                  : item.status === 'Планирую прочитать'
                  ? '#6200ee'
                  : '#dc3545',
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
        <Text style={styles.headerTitle}>❤️ Избранное</Text>
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
            <Text style={styles.emptyButtonText}>📚 К списку книг</Text>
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
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#6200ee',
    padding: 20,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  bookCard: {
    backgroundColor: '#fff',
    marginBottom: 12,
    borderRadius: 12,
    borderLeftWidth: 6,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookContent: {
    flex: 1,
  },
  bookHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  genreBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  bookRating: {
    fontSize: 16,
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#6200ee',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default FavoritesScreen;
