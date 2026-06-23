import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

const ReadingProgress = ({ currentPage, totalPages, startDate, readingHistory }) => {
  // Вычисляем процент завершения
  const percentage = totalPages > 0 ? Math.round((currentPage / totalPages) * 100) : 0;
  const pagesLeft = totalPages - currentPage;

  // Вычисляем прогноз даты завершения на основе истории чтения
  const getEstimatedFinishDate = () => {
    if (!startDate || currentPage === 0 || currentPage >= totalPages) {
      return null;
    }

    // Если есть история чтения - используем её для более точного прогноза
    if (readingHistory && readingHistory.length >= 2) {
      // Берём последние записи (макс 7) для расчета среднего темпа
      const recentHistory = readingHistory.slice(-7);
      
      // Считаем средний темп чтения по последним записям
      let totalPagesRead = 0;
      let totalDays = 0;
      
      for (let i = 1; i < recentHistory.length; i++) {
        const prevEntry = recentHistory[i - 1];
        const currEntry = recentHistory[i];
        
        const pagesRead = currEntry.pages - prevEntry.pages;
        const prevDate = new Date(prevEntry.date);
        const currDate = new Date(currEntry.date);
        const daysDiff = Math.max(1, Math.ceil((currDate - prevDate) / (1000 * 60 * 60 * 24)));
        
        if (pagesRead > 0) {
          totalPagesRead += pagesRead;
          totalDays += daysDiff;
        }
      }
      
      if (totalDays > 0 && totalPagesRead > 0) {
        const pagesPerDay = totalPagesRead / totalDays;
        const daysToFinish = Math.ceil(pagesLeft / pagesPerDay);
        const finishDate = new Date();
        finishDate.setDate(finishDate.getDate() + daysToFinish);

        return {
          date: finishDate,
          daysLeft: daysToFinish,
          pagesPerDay: Math.round(pagesPerDay),
        };
      }
    }

    // Фоллбэк: используем простой расчет от startDate до сейчас
    const start = new Date(startDate);
    const now = new Date();
    const daysReading = Math.max(1, Math.ceil((now - start) / (1000 * 60 * 60 * 24)));
    const pagesPerDay = currentPage / daysReading;

    if (pagesPerDay === 0) return null;

    const daysToFinish = Math.ceil(pagesLeft / pagesPerDay);
    const finishDate = new Date();
    finishDate.setDate(finishDate.getDate() + daysToFinish);

    return {
      date: finishDate,
      daysLeft: daysToFinish,
      pagesPerDay: Math.round(pagesPerDay),
    };
  };

  const estimate = getEstimatedFinishDate();

  // Форматирование даты
  const formatDate = (date) => {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  // Цвет прогресс-бара в зависимости от процента
  const getProgressColor = () => {
    if (percentage >= 100) return colors.success;
    if (percentage >= 75) return colors.warning;
    if (percentage >= 50) return colors.primary;
    return colors.secondary;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📖 Прогресс чтения</Text>
        {percentage >= 100 && (
          <Text style={styles.completeBadge}>✓ Завершено</Text>
        )}
      </View>

      {/* Числовой прогресс */}
      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{currentPage}</Text>
          <Text style={styles.statLabel}>Прочитано</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{totalPages}</Text>
          <Text style={styles.statLabel}>Всего страниц</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={[styles.statValue, { color: getProgressColor() }]}>
            {percentage}%
          </Text>
          <Text style={styles.statLabel}>Готово</Text>
        </View>
      </View>

      {/* Визуальный прогресс-бар */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBg}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: getProgressColor(),
              },
            ]}
          />
        </View>
        <Text style={styles.pagesLeft}>
          {pagesLeft > 0 ? `Осталось: ${pagesLeft} стр.` : 'Книга прочитана!'}
        </Text>
      </View>

      {/* Прогноз завершения */}
      {estimate && percentage < 100 && (
        <View style={styles.estimateContainer}>
          <View style={styles.estimateRow}>
            <Text style={styles.estimateIcon}>📅</Text>
            <View style={styles.estimateTextContainer}>
              <Text style={styles.estimateLabel}>Прогноз завершения:</Text>
              <Text style={styles.estimateDate}>{formatDate(estimate.date)}</Text>
            </View>
          </View>
          <View style={styles.estimateDetails}>
            <Text style={styles.estimateDetail}>
              ~{estimate.daysLeft} {estimate.daysLeft === 1 ? 'день' : 'дней'}
            </Text>
            <Text style={styles.estimateDetail}>•</Text>
            <Text style={styles.estimateDetail}>
              {estimate.pagesPerDay} стр/день
            </Text>
          </View>
        </View>
      )}

      {/* Мотивирующее сообщение */}
      {percentage > 0 && percentage < 100 && (
        <Text style={styles.motivationText}>
          {percentage < 25 && '🚀 Отличное начало!'}
          {percentage >= 25 && percentage < 50 && '💪 Продолжай в том же духе!'}
          {percentage >= 50 && percentage < 75 && '🔥 Уже больше половины!'}
          {percentage >= 75 && percentage < 100 && '🎯 Почти у цели!'}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: colors.textPrimary,
  },
  completeBadge: {
    backgroundColor: colors.successLight,
    color: colors.success,
    fontSize: typography.xs,
    fontWeight: typography.bold,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.base,
    paddingVertical: spacing.sm,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: typography['2xl'],
    fontWeight: typography.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    fontWeight: typography.medium,
  },
  divider: {
    width: 1,
    backgroundColor: colors.borderLight,
    marginHorizontal: spacing.sm,
  },
  progressBarContainer: {
    marginBottom: spacing.base,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  pagesLeft: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
    textAlign: 'center',
  },
  estimateContainer: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  estimateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  estimateIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  estimateTextContainer: {
    flex: 1,
  },
  estimateLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    fontWeight: typography.medium,
    marginBottom: 2,
  },
  estimateDate: {
    fontSize: typography.base,
    color: colors.primary,
    fontWeight: typography.bold,
  },
  estimateDetails: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  estimateDetail: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
  },
  motivationText: {
    fontSize: typography.sm,
    color: colors.textSecondary,
    fontWeight: typography.semibold,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default ReadingProgress;
