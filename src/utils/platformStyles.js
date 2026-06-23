import { Platform } from 'react-native';

// Универсальные тени для iOS и Android
export const createShadow = (color, opacity = 0.3, radius = 8, elevation = 4) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: opacity,
      shadowRadius: radius,
    };
  }
  // Android
  return {
    elevation: elevation,
  };
};

// Универсальные отступы с учетом платформы
export const platformPadding = {
  top: Platform.OS === 'ios' ? 0 : 4,
  horizontal: Platform.OS === 'ios' ? 16 : 12,
};

// Универсальный borderRadius
export const platformBorderRadius = {
  small: Platform.OS === 'ios' ? 12 : 10,
  medium: Platform.OS === 'ios' ? 16 : 14,
  large: Platform.OS === 'ios' ? 20 : 18,
  xlarge: Platform.OS === 'ios' ? 24 : 20,
};

// Универсальные шрифты
export const platformFonts = {
  regular: Platform.OS === 'ios' ? '600' : '500',
  bold: Platform.OS === 'ios' ? '800' : '700',
  heavy: Platform.OS === 'ios' ? '900' : '800',
};

// Универсальная карточка
export const cardStyle = (color = '#8B92FF') => ({
  backgroundColor: 'rgba(20, 25, 60, 0.8)',
  borderRadius: platformBorderRadius.large,
  padding: 16,
  marginBottom: 16,
  borderWidth: 1,
  borderColor: 'rgba(139, 146, 255, 0.3)',
  ...createShadow(color, 0.4, 12, 6),
});

// Универсальная кнопка
export const buttonStyle = (color = '#00F5FF') => ({
  borderRadius: platformBorderRadius.medium,
  overflow: 'hidden',
  ...createShadow(color, 0.5, 12, 6),
});
