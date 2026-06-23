import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

const CoverImagePicker = ({ currentImage, onImageSelected, coverColor }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Запросить разрешения и выбрать изображение с интерактивной обрезкой
  const pickImage = async (source) => {
    try {
      // Запросить разрешения
      let permissionResult;
      if (source === 'camera') {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (permissionResult.granted === false) {
        Alert.alert(
          'Нужны разрешения',
          'Разрешите доступ к галерее или камере для загрузки обложки'
        );
        return;
      }

      setIsProcessing(true);

      // Выбрать изображение с встроенным редактором обрезки (как в iPhone Photos)
      // Фиксированное соотношение 2:3 для обложки книги
      const imagePickerOptions = {
        allowsEditing: true,
        aspect: [2, 3], // Фиксированный прямоугольник 2:3 (ширина:высота)
        quality: 0.8,
        allowsMultipleSelection: false,
      };

      let result;
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync(imagePickerOptions);
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          ...imagePickerOptions,
          mediaTypes: ['images'],
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const imageUri = result.assets[0].uri;
        
        // Оптимизируем размер для хранения
        const manipResult = await ImageManipulator.manipulateAsync(
          imageUri,
          [{ resize: { width: 300 } }], // Сохраняем пропорции после обрезки
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
        );
        
        onImageSelected(manipResult.uri);
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('Ошибка выбора изображения:', error);
      Alert.alert('Ошибка', 'Не удалось выбрать изображение');
      setIsProcessing(false);
    }
  };

  // Удалить обложку
  const removeCover = () => {
    Alert.alert('Удалить обложку?', 'Вернуться к цветной плашке?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: () => onImageSelected(null),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Обложка книги</Text>

      {/* Превью обложки */}
      <View style={styles.coverPreview}>
        {currentImage ? (
          <Image source={{ uri: currentImage }} style={styles.coverImage} />
        ) : (
          <View style={[styles.coverPlaceholder, { backgroundColor: coverColor }]}>
            <Text style={styles.coverEmoji}>📚</Text>
          </View>
        )}
      </View>

      {/* Кнопки действий */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary]}
          onPress={() => pickImage('library')}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color={colors.surface} size="small" />
          ) : (
            <Text style={styles.buttonText}>Выбрать из галереи</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => pickImage('camera')}
          disabled={isProcessing}
        >
          <Text style={styles.buttonTextSecondary}>Сделать фото</Text>
        </TouchableOpacity>

        {currentImage && (
          <TouchableOpacity
            style={[styles.button, styles.buttonDanger]}
            onPress={removeCover}
            disabled={isProcessing}
          >
            <Text style={styles.buttonTextDanger}>Удалить обложку</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.base,
  },
  label: {
    fontSize: typography.base,
    fontWeight: typography.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  coverPreview: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  coverImage: {
    width: 150,
    height: 225,
    borderRadius: borderRadius.md,
    ...shadows.md,
  },
  coverPlaceholder: {
    width: 150,
    height: 225,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  coverEmoji: {
    fontSize: 64,
  },
  buttonContainer: {
    gap: spacing.sm,
  },
  button: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonSecondary: {
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonDanger: {
    backgroundColor: colors.errorLight,
    borderWidth: 1,
    borderColor: colors.error,
  },
  buttonText: {
    color: colors.surface,
    fontSize: typography.sm,
    fontWeight: typography.bold,
  },
  buttonTextSecondary: {
    color: colors.textPrimary,
    fontSize: typography.sm,
    fontWeight: typography.bold,
  },
  buttonTextDanger: {
    color: colors.error,
    fontSize: typography.sm,
    fontWeight: typography.bold,
  },
});

export default CoverImagePicker;
