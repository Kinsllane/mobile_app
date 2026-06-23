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
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

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
        <Text style={styles.headerTitle}>Цели чтения</Text>
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
            <Text style={styles.editButtonText}>Изменить</Text>
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
              color={yearlyProgress >= 100 ? '#10B981' : '#7C3AED'}
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
            <Text style={styles.editButtonText}>Изменить</Text>
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
              color={monthlyProgress >= 100 ? '#10B981' : '#F59E0B'}
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
          style={[styles.navButton, styles.navButtonStats]}
          onPress={() => navigation.navigate('Statistics')}
        >
          <Text style={styles.navButtonText}>Статистика</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, styles.navButtonBooks]}
          onPress={() => navigation.navigate('BooksList')}
        >
          <Text style={styles.navButtonText}>К списку книг</Text>
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
              placeholderTextColor={colors.textTertiary}
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
    backgroundColor: colors.backgroundSecondary,
  },
  header: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    backgroundColor: colors.warning,
  },
  headerTitle: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: colors.surface,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: typography.base,
    color: colors.surface,
    opacity: 0.9,
    fontWeight: typography.semibold,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base,
    marginTop: spacing.base,
    marginBottom: spacing.base,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  summaryTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: typography['3xl'],
    fontWeight: typography.bold,
    color: colors.primary,
  },
  summaryLabel: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    fontWeight: typography.medium,
  },
  goalCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  goalTitle: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  editButton: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  editButtonText: {
    fontSize: typography.xs,
    color: colors.primary,
    fontWeight: typography.bold,
  },
  goalDescription: {
    fontSize: typography.base,
    color: colors.textSecondary,
    marginBottom: spacing.base,
    fontWeight: typography.regular,
  },
  noGoalText: {
    fontSize: typography.base,
    color: colors.textTertiary,
    fontStyle: 'italic',
  },
  successMessage: {
    fontSize: typography.base,
    color: colors.success,
    fontWeight: typography.bold,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  remainingText: {
    fontSize: typography.base,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    fontWeight: typography.medium,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    gap: spacing.md,
  },
  navButton: {
    flex: 1,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.base,
    alignItems: 'center',
    ...shadows.sm,
  },
  navButtonStats: {
    backgroundColor: colors.secondary,
  },
  navButtonBooks: {
    backgroundColor: colors.success,
  },
  navButtonText: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.surface,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
    borderRadius: borderRadius.xl,
    width: '90%',
    ...shadows.lg,
  },
  modalTitle: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  modalDescription: {
    fontSize: typography.base,
    color: colors.textSecondary,
    marginBottom: spacing.base,
    fontWeight: typography.regular,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.base,
    fontSize: typography.base,
    marginBottom: spacing.lg,
    color: colors.textPrimary,
    backgroundColor: colors.backgroundSecondary,
    fontWeight: typography.medium,
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
    fontSize: typography.base,
    fontWeight: typography.semibold,
    color: colors.textSecondary,
  },
  modalButtonTextSave: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.surface,
  },
});

export default GoalsScreen;
