import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
  Image,
} from 'react-native';
import { useBooks } from '../context/BooksContext';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';
import ReadingProgress from '../components/ReadingProgress';

const BookDetailScreen = ({ route, navigation }) => {
  const { bookId } = route.params;
  const { getBookById, deleteBook, updateBook } = useBooks();
  
  const book = getBookById(bookId);
  
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [editingNotes, setEditingNotes] = useState('');
  const [keyPointsModalVisible, setKeyPointsModalVisible] = useState(false);
  const [editingKeyPoints, setEditingKeyPoints] = useState('');

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Книга не найдена</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Удалить книгу?',
      `Вы уверены, что хотите удалить "${book.title}"?`,
      [
        {
          text: 'Отмена',
          style: 'cancel',
        },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await deleteBook(bookId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const handleSaveNotes = async () => {
    await updateBook(bookId, { notes: editingNotes });
    setNotesModalVisible(false);
  };

  const handleSaveKeyPoints = async () => {
    // Разделяем текст по новой строке и убираем пустые
    const points = editingKeyPoints
      .split('\n')
      .filter((point) => point.trim() !== '')
      .map((point) => point.trim());
    
    await updateBook(bookId, { keyPoints: points });
    setKeyPointsModalVisible(false);
  };

  const openNotesModal = () => {
    setEditingNotes(book.notes || '');
    setNotesModalVisible(true);
  };

  const openKeyPointsModal = () => {
    const pointsText = (book.keyPoints || []).join('\n');
    setEditingKeyPoints(pointsText);
    setKeyPointsModalVisible(true);
  };

  const toggleFavorite = async () => {
    await updateBook(bookId, { isFavorite: !book.isFavorite });
  };

  return (
    <ScrollView style={styles.container}>
      {book.coverImage ? (
        <Image
          source={{ uri: book.coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.coverContainer, { backgroundColor: book.coverColor }]}>
          <Text style={styles.coverEmoji}>📚</Text>
        </View>
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>Автор: {book.author}</Text>
        {book.genre && (
          <Text style={styles.genre}>🏷️ Жанр: {book.genre}</Text>
        )}

        {/* Прогресс чтения */}
        {book.totalPages > 0 && (
          <ReadingProgress
            currentPage={book.currentPage || 0}
            totalPages={book.totalPages}
            startDate={book.startDate}
            readingHistory={book.readingHistory}
          />
        )}

        {/* Кнопка избранного */}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={toggleFavorite}
        >
          <Text style={styles.favoriteIcon}>
            {book.isFavorite ? '❤️' : '🤍'}
          </Text>
          <Text style={styles.favoriteText}>
            {book.isFavorite ? 'В избранном' : 'Добавить в избранное'}
          </Text>
        </TouchableOpacity>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Рейтинг</Text>
            <Text style={styles.metaValue}>
              {book.rating ? `⭐ ${book.rating}/5` : '—'}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Статус</Text>
            <Text style={styles.metaValue}>{book.status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Краткая сводка</Text>
          <Text style={styles.summary}>
            {book.summary || 'Нет описания'}
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ключевые моменты</Text>
            <TouchableOpacity onPress={openKeyPointsModal}>
              <Text style={styles.editLink}>✏️ Редактировать</Text>
            </TouchableOpacity>
          </View>
          {book.keyPoints && book.keyPoints.length > 0 ? (
            book.keyPoints.map((point, index) => (
              <View key={index} style={styles.keyPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.keyPointText}>{point}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              Нажмите "Редактировать", чтобы добавить ключевые моменты
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Мои заметки</Text>
            <TouchableOpacity onPress={openNotesModal}>
              <Text style={styles.editLink}>✏️ Редактировать</Text>
            </TouchableOpacity>
          </View>
          {book.notes ? (
            <Text style={styles.notes}>{book.notes}</Text>
          ) : (
            <Text style={styles.emptyText}>
              Нажмите "Редактировать", чтобы добавить заметки
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditBook', { bookId })}
        >
          <Text style={styles.editButtonText}>✏️ Редактировать книгу</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Text style={styles.deleteButtonText}>🗑️ Удалить книгу</Text>
        </TouchableOpacity>
      </View>

      {/* Модальное окно для заметок */}
      <Modal
        visible={notesModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setNotesModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Редактировать заметки</Text>
            <TextInput
              style={styles.modalTextArea}
              placeholder="Ваши мысли и впечатления от книги..."
              value={editingNotes}
              onChangeText={setEditingNotes}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              placeholderTextColor={colors.textTertiary}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setNotesModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleSaveNotes}
              >
                <Text style={styles.modalButtonTextSave}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Модальное окно для ключевых моментов */}
      <Modal
        visible={keyPointsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setKeyPointsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ключевые моменты</Text>
            <Text style={styles.modalHint}>
              Каждый момент с новой строки
            </Text>
            <TextInput
              style={styles.modalTextArea}
              placeholder="Главная идея книги&#10;Важные выводы&#10;Практические советы"
              value={editingKeyPoints}
              onChangeText={setEditingKeyPoints}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
              placeholderTextColor={colors.textTertiary}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setKeyPointsModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={handleSaveKeyPoints}
              >
                <Text style={styles.modalButtonTextSave}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  errorText: {
    fontSize: typography.lg,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 50,
    fontWeight: typography.semibold,
  },
  coverContainer: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverImage: {
    width: '100%',
    height: 400,
  },
  coverEmoji: {
    fontSize: 100,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  title: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  author: {
    fontSize: typography.lg,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: typography.semibold,
  },
  genre: {
    fontSize: typography.base,
    color: colors.textTertiary,
    marginBottom: spacing.base,
    fontWeight: typography.medium,
  },
  favoriteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.favoriteLight,
    padding: spacing.base,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.base,
    borderWidth: 1,
    borderColor: colors.favorite,
    ...shadows.sm,
  },
  favoriteIcon: {
    fontSize: 28,
    marginRight: spacing.sm,
  },
  favoriteText: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.favorite,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontWeight: typography.semibold,
  },
  metaValue: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.xl,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  editLink: {
    fontSize: typography.base,
    color: colors.primary,
    fontWeight: typography.bold,
  },
  summary: {
    fontSize: typography.base,
    color: colors.textSecondary,
    lineHeight: 24,
    fontWeight: typography.regular,
  },
  emptyText: {
    fontSize: typography.base,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  keyPoint: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  bullet: {
    fontSize: 20,
    color: colors.primary,
    marginRight: spacing.sm,
  },
  keyPointText: {
    flex: 1,
    fontSize: typography.base,
    color: colors.textSecondary,
    lineHeight: 22,
    fontWeight: typography.regular,
  },
  notes: {
    fontSize: typography.base,
    color: colors.textSecondary,
    lineHeight: 22,
    fontStyle: 'italic',
    fontWeight: typography.regular,
  },
  editButton: {
    borderRadius: borderRadius.lg,
    marginTop: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    ...shadows.md,
  },
  editButtonText: {
    color: colors.surface,
    fontSize: typography.base,
    fontWeight: typography.bold,
  },
  deleteButton: {
    backgroundColor: colors.errorLight,
    paddingVertical: spacing.base,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing['2xl'],
    borderWidth: 1,
    borderColor: colors.error,
  },
  deleteButtonText: {
    color: colors.error,
    fontSize: typography.base,
    fontWeight: typography.bold,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '90%',
    maxHeight: '80%',
    ...shadows.lg,
  },
  modalTitle: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  modalHint: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    fontWeight: typography.regular,
  },
  modalTextArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    fontSize: typography.base,
    minHeight: 200,
    marginBottom: spacing.base,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundSecondary,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  modalButton: {
    flex: 1,
    paddingVertical: spacing.base,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalButtonSave: {
    backgroundColor: colors.primary,
    ...shadows.sm,
  },
  modalButtonTextCancel: {
    color: colors.textSecondary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  modalButtonTextSave: {
    color: colors.surface,
    fontSize: typography.base,
    fontWeight: typography.bold,
  },
});

export default BookDetailScreen;
