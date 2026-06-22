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
} from 'react-native';
import { useBooks } from '../context/BooksContext';

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
          <Text style={styles.notes}>
            {book.notes || 'Нажмите "Редактировать", чтобы добавить заметки'}
          </Text>
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
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editLink: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '600',
  },
  summary: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    fontStyle: 'italic',
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
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 32,
    borderWidth: 2,
    borderColor: '#dc3545',
  },
  deleteButtonText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  modalTextArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 200,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f0f0f0',
  },
  modalButtonSave: {
    backgroundColor: '#6200ee',
  },
  modalButtonTextCancel: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextSave: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BookDetailScreen;
