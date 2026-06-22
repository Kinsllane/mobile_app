import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

const BookDetailScreen = ({ route, navigation }) => {
  const { book } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={[styles.coverContainer, { backgroundColor: book.coverColor }]}>
        <Text style={styles.coverEmoji}>📚</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>Автор: {book.author}</Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Рейтинг</Text>
            <Text style={styles.metaValue}>⭐ {book.rating}/5</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Статус</Text>
            <Text style={styles.metaValue}>{book.status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Краткая сводка</Text>
          <Text style={styles.summary}>{book.summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ключевые моменты</Text>
          <View style={styles.keyPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.keyPointText}>
              Главная идея книги и её практическое применение
            </Text>
          </View>
          <View style={styles.keyPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.keyPointText}>
              Важные выводы и рекомендации автора
            </Text>
          </View>
          <View style={styles.keyPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.keyPointText}>
              Что можно применить в жизни сразу
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Мои заметки</Text>
          <Text style={styles.notes}>
            Здесь можно добавить личные мысли и впечатления от прочтения книги...
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => alert('Функция редактирования будет добавлена')}
        >
          <Text style={styles.editButtonText}>✏️ Редактировать</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  coverContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverEmoji: {
    fontSize: 100,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  author: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  summary: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  keyPoint: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  bullet: {
    fontSize: 20,
    color: '#6200ee',
    marginRight: 8,
  },
  keyPointText: {
    flex: 1,
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  notes: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
    fontStyle: 'italic',
  },
  editButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookDetailScreen;
