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
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';
import CoverImagePicker from '../components/CoverImagePicker';

const AddBookScreen = ({ navigation }) => {
  const { addBook } = useBooks();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState('');
  const [status, setStatus] = useState('Планирую');
  const [genre, setGenre] = useState('Другое');
  const [summary, setSummary] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [coverColor] = useState(getRandomColor());
  const [totalPages, setTotalPages] = useState('');
  const [currentPage, setCurrentPage] = useState('0');

  const statuses = ['Планирую', 'Читаю', 'Прочитано', 'Отложено'];

  // Случайный цвет для обложки (если нет изображения)
  function getRandomColor() {
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E2',
      '#F8B739',
      '#52B788',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
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

    const totalPagesNum = parseInt(totalPages) || 0;
    const currentPageNum = parseInt(currentPage) || 0;

    if (totalPagesNum > 0 && currentPageNum > totalPagesNum) {
      Alert.alert('Ошибка', 'Текущая страница не может быть больше общего количества');
      return;
    }

    await addBook({
      title: title.trim(),
      author: author.trim(),
      rating: ratingNum,
      status,
      genre,
      summary: summary.trim(),
      coverImage: coverImage,
      coverColor: coverColor,
      totalPages: totalPagesNum,
      currentPage: currentPageNum,
      startDate: currentPageNum > 0 ? new Date().toISOString() : null,
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
        {/* Компонент выбора обложки */}
        <CoverImagePicker
          currentImage={coverImage}
          onImageSelected={setCoverImage}
          coverColor={coverColor}
        />

        <Text style={styles.label}>Название книги *</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите название"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor={colors.textTertiary}
        />

        <Text style={styles.label}>Автор *</Text>
        <TextInput
          style={styles.input}
          placeholder="Введите автора"
          value={author}
          onChangeText={setAuthor}
          placeholderTextColor={colors.textTertiary}
        />

        <Text style={styles.label}>Рейтинг (1-5)</Text>
        <TextInput
          style={styles.input}
          placeholder="Оцените от 1 до 5"
          value={rating}
          onChangeText={setRating}
          keyboardType="numeric"
          maxLength={1}
          placeholderTextColor={colors.textTertiary}
        />

        <Text style={styles.label}>Количество страниц</Text>
        <TextInput
          style={styles.input}
          placeholder="Всего страниц в книге"
          value={totalPages}
          onChangeText={setTotalPages}
          keyboardType="numeric"
          placeholderTextColor={colors.textTertiary}
        />

        <Text style={styles.label}>Текущая страница</Text>
        <TextInput
          style={styles.input}
          placeholder="На какой странице сейчас"
          value={currentPage}
          onChangeText={setCurrentPage}
          keyboardType="numeric"
          placeholderTextColor={colors.textTertiary}
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
          placeholderTextColor={colors.textTertiary}
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
    backgroundColor: colors.backgroundSecondary,
  },
  form: {
    padding: spacing.lg,
  },
  label: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.base,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    fontSize: typography.base,
    backgroundColor: colors.surface,
    color: colors.textPrimary,
    fontWeight: typography.regular,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  statusContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  statusButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  statusText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
  },
  statusTextActive: {
    color: colors.primary,
    fontWeight: typography.bold,
  },
  genreContainer: {
    marginBottom: spacing.sm,
  },
  genreScrollContent: {
    paddingRight: spacing.base,
  },
  genreButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.backgroundSecondary,
    marginRight: spacing.sm,
  },
  genreButtonActive: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  genreText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
  },
  genreTextActive: {
    color: colors.primary,
    fontWeight: typography.bold,
  },
  saveButton: {
    borderRadius: borderRadius.lg,
    marginTop: spacing.xl,
    backgroundColor: colors.primary,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  saveButtonText: {
    color: colors.surface,
    fontSize: typography.base,
    fontWeight: typography.bold,
  },
  cancelButton: {
    paddingVertical: spacing.base,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
});

export default AddBookScreen;
