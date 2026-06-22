import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useBooks } from '../context/BooksContext';

const EditBookScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const { getBookById, updateBook } = useBooks();
  const book = getBookById(bookId);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState('');
  const [status, setStatus] = useState('Планирую прочитать');
  const [summary, setSummary] = useState('');

  const statuses = ['Планирую прочитать', 'Читаю', 'Прочитано', 'Отложено'];

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setAuthor(book.author);
      setRating(book.rating ? book.rating.toString() : '');
      setStatus(book.status);
      setSummary(book.summary || '');
    }
  }, [book]);

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Книга не найдена</Text>
      </View>
    );
  }

  const handleSave = async () => {
    if (!title || !author) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните название и автора книги');
      return;
    }

    const ratingNum = parseInt(rating) || 0;
    if (rating && (ratingNum < 1 || ratingNum > 5)) {
      Alert.alert('Ошибка', 'Рейтинг должен быть от 1 до 5');
      return;
    }

    await updateBook(bookId, {
      title: title.trim(),
      author: author.trim(),
      rating: ratingNum,
      status,
      summary: summary.trim(),
    });

    Alert.alert(
      'Успех!',
      'Изменения сохранены',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Название книги *</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите название"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Автор *</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите автора"
          value={author}
          onChangeText={setAuthor}
        />

        <Text style={styles.label}>Рейтинг (1-5)</Text>
        <TextInput
          style={styles.input}
          placeholder="Оцените от 1 до 5"
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
          maxLength={1}
        />

        <Text style={styles.label}>Статус чтения</Text>
        <View style={styles.statusContainer}>
          {statuses.map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.statusButton,
                status === s && styles.statusButtonActive,
              ]}
              onPress={() => setStatus(s)}
            >
              <Text
                style={[
                  styles.statusText,
                  status === s && styles.statusTextActive,
                ]}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Краткая сводка</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="О чем эта книга?"
          value={summary}
          onChangeText={setSummary}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>💾 Сохранить изменения</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Отмена</Text>
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
  errorText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6200ee',
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
  },
  statusButtonActive: {
    backgroundColor: '#6200ee',
  },
  statusText: {
    color: '#6200ee',
    fontSize: 14,
  },
  statusTextActive: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#6200ee',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default EditBookScreen;
