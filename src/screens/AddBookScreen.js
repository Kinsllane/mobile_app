import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { useBooks, GENRES } from '../context/BooksContext';

const AddBookScreen = ({ navigation }) => {
  const { addBook } = useBooks();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState('');
  const [status, setStatus] = useState('Планирую прочитать');
  const [genre, setGenre] = useState('Другое');
  const [summary, setSummary] = useState('');

  const statuses = ['Планирую прочитать', 'Читаю', 'Прочитано', 'Отложено'];

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

    await addBook({
      title: title.trim(),
      author: author.trim(),
      rating: ratingNum,
      status,
      genre,
      summary: summary.trim(),
    });

    Alert.alert(
      'Успех!',
      `"${title}" успешно добавлена в вашу коллекцию`,
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
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Автор *</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите автора"
          value={author}
          onChangeText={setAuthor}
          placeholderTextColor="#666"
        />

        <Text style={styles.label}>Рейтинг (1-5)</Text>
        <TextInput
          style={styles.input}
          placeholder="Оцените от 1 до 5"
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
          maxLength={1}
          placeholderTextColor="#666"
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

        <Text style={styles.label}>Жанр</Text>
        <View style={styles.genreContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.genreScrollContent}
          >
            {GENRES.map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genreButton,
                  genre === g && styles.genreButtonActive,
                ]}
                onPress={() => setGenre(g)}
              >
                <Text
                  style={[
                    styles.genreText,
                    genre === g && styles.genreTextActive,
                  ]}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <Text style={styles.label}>Краткая сводка</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="О чем эта книга?"
          value={summary}
          onChangeText={setSummary}
          multiline
          numberOfLines={4}
          placeholderTextColor="#666"
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>💾 Сохранить книгу</Text>
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
  genreContainer: {
    marginBottom: 8,
  },
  genreScrollContent: {
    paddingRight: 16,
  },
  genreButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#6200ee',
    backgroundColor: '#fff',
    marginRight: 8,
  },
  genreButtonActive: {
    backgroundColor: '#6200ee',
  },
  genreText: {
    color: '#6200ee',
    fontSize: 14,
  },
  genreTextActive: {
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

export default AddBookScreen;
