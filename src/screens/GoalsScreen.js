import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBooks } from '../context/BooksContext';
import ProgressBar from '../components/ProgressBar';

const GOALS_STORAGE_KEY = '@reading_goals';

const GoalsScreen = ({ navigation }) => {
  const { books } = useBooks();
  const [goals, setGoals] = useState({
    yearlyGoal: 0,
    monthlyGoal: 0,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [editGoalType, setEditGoalType] = useState('yearly');
  const [goalInput, setGoalInput] = useState('');

  // Загрузка целей при монтировании
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const storedGoals = await AsyncStorage.getItem(GOALS_STORAGE_KEY);
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    } catch (error) {
      console.error('Ошибка загрузки целей:', error);
    }
  };

  const saveGoals = async (newGoals) => {
    try {
      await AsyncStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(newGoals));
      setGoals(newGoals);
    } catch (error) {
      console.error('Ошибка сохранения целей:', error);
    }
  };

  const openEditModal = (type) => {
    setEditGoalType(type);
    setGoalInput(
      type === 'yearly' ? goals.yearlyGoal.toString() : goals.monthlyGoal.toString()
    );
    setModalVisible(true);
  };

  const saveGoal = () => {
    const goalValue = parseInt(goalInput);
    if (isNaN(goalValue) || goalValue < 0) {
      Alert.alert('Ошибка', 'Введите корректное число');
      return;
    }

    const newGoals = { ...goals };
    if (editGoalType === 'yearly') {
      newGoals.yearlyGoal = goalValue;
    } else {
      newGoals.monthlyGoal = goalValue;
    }

    saveGoals(newGoals);
    setModalVisible(false);
  };

  // Статистика для текущего года
  const currentYear = new Date().getFullYear();
  const booksThisYear = books.filter((book) => {
    // Предполагаем, что ID книги содержит timestamp
    const bookDate = new Date(parseInt(book.id));
    return bookDate.getFullYear() === currentYear;
  });

  const readBooksThisYear = booksThisYear.filter(
    (book) => book.status === 'Прочитано'
  ).length;

  // Статистика для текущего месяца
  const currentMonth = new Date().getMonth();
  const booksThisMonth = books.filter((book) => {
    const bookDate = new Date(parseInt(book.id));
    return (
      bookDate.getFullYear() === currentYear &&
      bookDate.getMonth() === currentMonth
    );
  });

  const readBooksThisMonth = booksThisMonth.filter(
    (book) => book.status === 'Прочитано'
  ).length;

  // Прогресс по целям
  const yearlyProgress =
    goals.yearlyGoal > 0 ? (readBooksThisYear / goals.yearlyGoal) * 100 : 0;
  const monthlyProgress =
    goals.monthlyGoal > 0 ? (readBooksThisMonth / goals.monthlyGoal) * 100 : 0;

  const totalReadBooks = books.filter((book) => book.status === 'Прочитано').length;

  return (
    <ScrollView style={styles.container}>
      {/* Заголовок */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎯 Цели чтения</Text>
        <Text style={styles.headerSubtitle}>
          Ставьте цели и отслеживайте прогресс
        </Text>
      </View>

      {/* Общая статистика */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Общая статистика</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalReadBooks}</Text>
            <Text style={styles.summaryLabel}>Всего прочитано</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: '#6200ee' }]}>
              {readBooksThisYear}
            </Text>
            <Text style={styles.summaryLabel}>В этом году</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryValue, { color: '#FFA500' }]}>
              {readBooksThisMonth}
            </Text>
            <Text style={styles.summaryLabel}>В этом месяце</Text>
          </View>
        </View>
      </View>

      {/* Годовая цель */}
      <View style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>📅 Годовая цель {currentYear}</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => openEditModal('yearly')}
          >
            <Text style={styles.editButtonText}>✏️ Изменить</Text>
          </TouchableOpacity>
        </View>
        {goals.yearlyGoal > 0 ? (
          <>
            <Text style={styles.goalDescription}>
              Прочитать {goals.yearlyGoal} {goals.yearlyGoal === 1 ? 'книгу' : 'книг'} в
              этом году
            </Text>
            <ProgressBar
              label={`Прогресс: ${readBooksThisYear} из ${goals.yearlyGoal}`}
              value={readBooksThisYear}
              count={readBooksThisYear}
              color={yearlyProgress >= 100 ? '#28a745' : '#6200ee'}
              maxValue={goals.yearlyGoal}
            />
            {yearlyProgress >= 100 && (
              <Text style={styles.successMessage}>
                🎉 Поздравляем! Цель достигнута!
              </Text>
            )}
            {yearlyProgress < 100 && (
              <Text style={styles.remainingText}>
                Осталось: {goals.yearlyGoal - readBooksThisYear}{' '}
                {goals.yearlyGoal - readBooksThisYear === 1 ? 'книга' : 'книг'}
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.noGoalText}>
            Цель не установлена. Нажмите "Изменить" чтобы установить цель.
          </Text>
        )}
      </View>

      {/* Месячная цель */}
      <View style={styles.goalCard}>
        <View style={styles.goalHeader}>
          <Text style={styles.goalTitle}>📆 Месячная цель</Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => openEditModal('monthly')}
          >
            <Text style={styles.editButtonText}>✏️ Изменить</Text>
          </TouchableOpacity>
        </View>
        {goals.monthlyGoal > 0 ? (
          <>
            <Text style={styles.goalDescription}>
              Прочитать {goals.monthlyGoal}{' '}
              {goals.monthlyGoal === 1 ? 'книгу' : 'книг'} в этом месяце
            </Text>
            <ProgressBar
              label={`Прогресс: ${readBooksThisMonth} из ${goals.monthlyGoal}`}
              value={readBooksThisMonth}
              count={readBooksThisMonth}
              color={monthlyProgress >= 100 ? '#28a745' : '#FFA500'}
              maxValue={goals.monthlyGoal}
            />
            {monthlyProgress >= 100 && (
              <Text style={styles.successMessage}>
                🎉 Отлично! Месячная цель выполнена!
              </Text>
            )}
            {monthlyProgress < 100 && (
              <Text style={styles.remainingText}>
                Осталось: {goals.monthlyGoal - readBooksThisMonth}{' '}
                {goals.monthlyGoal - readBooksThisMonth === 1 ? 'книга' : 'книг'}
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.noGoalText}>
            Цель не установлена. Нажмите "Изменить" чтобы установить цель.
          </Text>
        )}
      </View>

      {/* Кнопки навигации */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.navigate('Statistics')}
        >
          <Text style={styles.navButtonText}>📊 Статистика</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, { backgroundColor: '#28a745' }]}
          onPress={() => navigation.navigate('BooksList')}
        >
          <Text style={styles.navButtonText}>📚 К списку книг</Text>
        </TouchableOpacity>
      </View>

      {/* Модальное окно редактирования цели */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editGoalType === 'yearly' ? 'Годовая цель' : 'Месячная цель'}
            </Text>
            <Text style={styles.modalDescription}>
              Сколько книг вы хотите прочитать?
            </Text>
            <TextInput
              style={styles.modalInput}
              keyboardType="number-pad"
              value={goalInput}
              onChangeText={setGoalInput}
              placeholder="Введите число"
              placeholderTextColor="#666"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSave]}
                onPress={saveGoal}
              >
                <Text style={styles.modalButtonTextSave}>Сохранить</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 20 }} />
    </ScrollView>
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
  summaryCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -10,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#28a745',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  goalCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    fontSize: 14,
    color: '#6200ee',
    fontWeight: '600',
  },
  goalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  noGoalText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  successMessage: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: 'bold',
    marginTop: 8,
    textAlign: 'center',
  },
  remainingText: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  navButton: {
    backgroundColor: '#6200ee',
    flex: 1,
    marginHorizontal: 4,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 16,
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f0f0f0',
  },
  modalButtonSave: {
    backgroundColor: '#6200ee',
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalButtonTextSave: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default GoalsScreen;
