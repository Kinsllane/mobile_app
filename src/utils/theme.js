// Премиум светлая тема - минимализм
export const colors = {
  // Основные цвета
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  
  // Карточки и поверхности
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  
  // Границы
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  
  // Текст
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  
  // Акценты (минимально)
  primary: '#3B82F6',      // Синий
  primaryLight: '#DBEAFE',
  
  secondary: '#8B5CF6',    // Фиолетовый
  secondaryLight: '#EDE9FE',
  
  success: '#10B981',      // Зелёный
  successLight: '#D1FAE5',
  
  warning: '#F59E0B',      // Оранжевый
  warningLight: '#FEF3C7',
  
  error: '#EF4444',        // Красный
  errorLight: '#FEE2E2',
  
  // Специальные
  favorite: '#EC4899',     // Розовый для избранного
  favoriteLight: '#FCE7F3',
  
  // Рейтинг
  rating: '#FBBF24',       // Золотой
  ratingLight: '#FEF3C7',
};

// Типография
export const typography = {
  // Размеры
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  
  // Веса (кроссплатформенно)
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
};

// Отступы
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
};

// Радиусы
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};

// Тени (кроссплатформенные)
export const shadows = {
  none: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
};
