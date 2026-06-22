import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';

const BooksListScreen = ({ navigation }) => {
  const [books, setBooks] = useState([
    {
      id: '1',
      title: 'Атомные привычки',
      author: 'Джеймс Клир',
      rating: 5,
      status: 'Прочитано',
      summary: 'Книга о том, как маленькие изменения приводят к большим результатам',
      coverColor: '#FF6B6B',
    },
    {
      id: '2',
      title: 'Думай медленно... решай быстро',
      author: 'Даниэль Канеман',
      rating: 4,
      status: 'Читаю',
      summary: 'Исследование двух систем мышления',
      coverColor: '#4ECDC4',
    },
    {
      id: '3',
      title: 'Sapiens',
      author: 'Юваль Ной Харари',
      rating: 5,
      status: 'Прочитано',
      summary: 'Краткая история человечества',
      coverColor: '#45B7D1',
    },
  ]);

  const renderBookItem = ({ item }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => navigation.navigate('BookDetail', { book: item })}
    >
      <View style={[styles.bookCover, { backgroundColor: item.coverColor }]}>
        <Text style={styles.bookCoverText}>📚</Text>
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <View style={styles.bookMeta}>
          <Text style={styles.rating}>⭐ {item.rating}/5</Text>
          <Text style={styles.status}>{item.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
  listContainer: {
    padding: 16,
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
    marginBottom: 8,
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
