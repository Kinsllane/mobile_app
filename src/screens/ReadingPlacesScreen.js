import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Modal,
  TextInput,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBooks } from '../context/BooksContext';
import { colors, typography, spacing, borderRadius, shadows } from '../utils/theme';

const PLACES_STORAGE_KEY = '@reading_places';

const ReadingPlacesScreen = ({ navigation }) => {
  const { books, getBookById } = useBooks();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [placeNote, setPlaceNote] = useState('');
  const [addingPlace, setAddingPlace] = useState(false);

  useEffect(() => {
    loadPlaces();
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Нужен доступ', 'Для сохранения геолокации необходимо разрешение');
        setLoading(false);
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      
      // Получаем адрес текущего местоположения
      let currentAddress = 'Определение адреса...';
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        if (reverseGeocode && reverseGeocode.length > 0) {
          const addr = reverseGeocode[0];
          const parts = [];
          if (addr.street) parts.push(addr.street);
          if (addr.streetNumber) parts.push(addr.streetNumber);
          if (addr.district) parts.push(addr.district);
          if (addr.city) parts.push(addr.city);
          
          currentAddress = parts.length > 0 ? parts.join(', ') : 'Адрес не определён';
        }
      } catch (geoError) {
        console.log('Не удалось получить адрес:', geoError);
        currentAddress = 'Адрес не определён';
      }

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: currentAddress,
      });
      setLoading(false);
    } catch (error) {
      console.error('Ошибка получения геолокации:', error);
      setCurrentLocation(null);
      setLoading(false);
    }
  };

  const loadPlaces = async () => {
    try {
      const storedPlaces = await AsyncStorage.getItem(PLACES_STORAGE_KEY);
      if (storedPlaces) {
        setPlaces(JSON.parse(storedPlaces));
      }
    } catch (error) {
      console.error('Ошибка загрузки мест:', error);
    }
  };

  const savePlaces = async (newPlaces) => {
    try {
      await AsyncStorage.setItem(PLACES_STORAGE_KEY, JSON.stringify(newPlaces));
      setPlaces(newPlaces);
    } catch (error) {
      console.error('Ошибка сохранения мест:', error);
    }
  };

  const openAddPlaceModal = () => {
    if (books.length === 0) {
      Alert.alert('Нет книг', 'Сначала добавьте книги в библиотеку');
      return;
    }
    setModalVisible(true);
  };

  const addPlace = async () => {
    if (!selectedBook) {
      Alert.alert('Ошибка', 'Выберите книгу');
      return;
    }

    setAddingPlace(true);

    try {
      const location = await Location.getCurrentPositionAsync({});
      const book = getBookById(selectedBook);

      // Получаем адрес из координат (Reverse Geocoding)
      let address = 'Адрес не определён';
      try {
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
        
        if (reverseGeocode && reverseGeocode.length > 0) {
          const addr = reverseGeocode[0];
          // Формируем красивый адрес
          const parts = [];
          if (addr.street) parts.push(addr.street);
          if (addr.streetNumber) parts.push(addr.streetNumber);
          if (addr.district) parts.push(addr.district);
          if (addr.city) parts.push(addr.city);
          
          address = parts.length > 0 ? parts.join(', ') : 'Адрес не определён';
        }
      } catch (geoError) {
        console.log('Не удалось получить адрес:', geoError);
      }

      const newPlace = {
        id: Date.now().toString(),
        bookId: selectedBook,
        bookTitle: book.title,
        bookAuthor: book.author,
        bookColor: book.coverColor,
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address, // Добавляем адрес!
        note: placeNote.trim(),
        timestamp: new Date().toISOString(),
      };

      const updatedPlaces = [...places, newPlace];
      await savePlaces(updatedPlaces);

      setModalVisible(false);
      setSelectedBook(null);
      setPlaceNote('');
      
      Alert.alert('Успех!', `Место чтения добавлено 📍\n${address}`);
    } catch (error) {
      console.error('Ошибка добавления места:', error);
      Alert.alert('Ошибка', 'Не удалось получить текущую геолокацию');
    } finally {
      setAddingPlace(false);
    }
  };

  const deletePlace = (placeId) => {
    Alert.alert('Удалить место?', 'Вы уверены?', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          const updatedPlaces = places.filter((p) => p.id !== placeId);
          await savePlaces(updatedPlaces);
        },
      },
    ]);
  };

  const openInMaps = (latitude, longitude) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    Linking.openURL(url);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00F5FF" />
        <Text style={styles.loadingText}>Получение геолокации...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentLocation && (
        <View style={styles.locationInfo}>
          <Text style={styles.locationTitle}>📍 Вы сейчас здесь:</Text>
          <Text style={styles.currentAddressText}>
            {currentLocation.address || 'Определение адреса...'}
          </Text>
          <Text style={styles.locationCoords}>
            GPS: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
          </Text>
        </View>
      )}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>
          🗺️ Мои места чтения ({places.length})
        </Text>

        {places.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>Пока нет сохраненных мест</Text>
            <Text style={styles.emptySubtext}>
              Нажмите кнопку ниже, чтобы отметить место, где вы читаете книгу
            </Text>
          </View>
        ) : (
          places.map((place) => (
            <View key={place.id} style={styles.placeCard}>
              <View style={[styles.colorBar, { backgroundColor: place.bookColor }]} />
              <View style={styles.placeContent}>
                <Text style={styles.placeBookTitle}>{place.bookTitle}</Text>
                <Text style={styles.placeAuthor}>{place.bookAuthor}</Text>
                
                {place.note && (
                  <View style={styles.noteContainer}>
                    <Text style={styles.noteLabel}>📝 Заметка:</Text>
                    <Text style={styles.noteText}>{place.note}</Text>
                  </View>
                )}

                <View style={styles.placeDetails}>
                  <Text style={styles.coordsLabel}>📍 Адрес:</Text>
                  <Text style={styles.addressText}>
                    {place.address || 'Адрес не определён'}
                  </Text>
                  <Text style={styles.coordsText}>
                    GPS: {place.latitude.toFixed(6)}, {place.longitude.toFixed(6)}
                  </Text>
                  <Text style={styles.dateText}>
                    📅 {new Date(place.timestamp).toLocaleDateString('ru-RU')} в{' '}
                    {new Date(place.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>

                <View style={styles.placeActions}>
                  <TouchableOpacity 
                    style={styles.mapButton} 
                    onPress={() => openInMaps(place.latitude, place.longitude)}
                  >
                    <Text style={styles.mapButtonText}>🗺️ Открыть на карте</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deletePlace(place.id)}
                  >
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.addButtonContainer}>
        <TouchableOpacity style={styles.addButton} onPress={openAddPlaceModal}>
          <Text style={styles.addButtonText}>+ Добавить место</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Добавить место чтения</Text>
            <Text style={styles.modalSubtitle}>Будет сохранена ваша текущая GPS геолокация</Text>

            <Text style={styles.label}>Выберите книгу:</Text>
            <ScrollView style={styles.booksList}>
              {books.map((book) => (
                <TouchableOpacity key={book.id} style={[styles.bookItem, selectedBook === book.id && styles.bookItemSelected]} onPress={() => setSelectedBook(book.id)}>
                  <View style={[styles.bookColorIndicator, { backgroundColor: book.coverColor }]} />
                  <View style={styles.bookItemText}>
                    <Text style={styles.bookItemTitle}>{book.title}</Text>
                    <Text style={styles.bookItemAuthor}>{book.author}</Text>
                  </View>
                  {selectedBook === book.id && <Text style={styles.checkMark}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.label}>Заметка (опционально):</Text>
            <TextInput style={styles.noteInput} placeholder="Например: Читал в любимом кафе" value={placeNote} onChangeText={setPlaceNote} multiline placeholderTextColor="#8B92FF" />

            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={() => { setModalVisible(false); setSelectedBook(null); setPlaceNote(''); }}>
                <Text style={styles.modalButtonTextCancel}>Отмена</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.modalButtonSave]} onPress={addPlace} disabled={addingPlace}>
                {addingPlace ? (
                  <ActivityIndicator color={colors.primary} />
                ) : (
                  <Text style={styles.modalButtonTextSave}>Сохранить</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.backgroundSecondary,
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: colors.backgroundSecondary,
  },
  loadingText: { 
    marginTop: spacing.md, 
    fontSize: typography.base, 
    color: colors.textSecondary, 
    fontWeight: typography.semibold,
  },
  locationInfo: { 
    backgroundColor: colors.surface,
    margin: spacing.base, 
    marginBottom: spacing.sm, 
    padding: spacing.base,
    borderRadius: borderRadius.lg, 
    borderWidth: 1, 
    borderColor: colors.border,
    ...shadows.sm,
  },
  locationTitle: { 
    fontSize: typography.base, 
    color: colors.primary, 
    fontWeight: typography.bold, 
    marginBottom: spacing.sm,
  },
  currentAddressText: { 
    fontSize: typography.lg, 
    color: colors.textPrimary, 
    fontWeight: typography.semibold, 
    marginBottom: spacing.sm,
  },
  locationCoords: { 
    fontSize: typography.sm, 
    color: colors.textTertiary, 
    fontWeight: typography.regular,
  },
  scrollView: { flex: 1 },
  scrollContent: { 
    padding: spacing.base, 
    paddingTop: spacing.sm, 
    paddingBottom: 100,
  },
  sectionTitle: { 
    fontSize: typography['2xl'], 
    fontWeight: typography.bold, 
    color: colors.textPrimary, 
    marginBottom: spacing.base,
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingVertical: 60,
  },
  emptyIcon: { fontSize: 64, marginBottom: spacing.lg },
  emptyText: { 
    fontSize: typography.xl, 
    fontWeight: typography.semibold, 
    color: colors.textPrimary, 
    marginBottom: spacing.sm, 
    textAlign: 'center',
  },
  emptySubtext: { 
    fontSize: typography.base, 
    color: colors.textSecondary, 
    textAlign: 'center', 
    paddingHorizontal: spacing['2xl'],
    fontWeight: typography.regular,
  },
  placeCard: { 
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg, 
    marginBottom: spacing.base, 
    flexDirection: 'row', 
    borderWidth: 1, 
    borderColor: colors.border,
    ...shadows.sm,
  },
  colorBar: { width: 4 },
  placeContent: { 
    flex: 1, 
    padding: spacing.base,
  },
  placeBookTitle: { 
    fontSize: typography.lg, 
    fontWeight: typography.semibold, 
    color: colors.textPrimary, 
    marginBottom: spacing.xs,
  },
  placeAuthor: { 
    fontSize: typography.base, 
    color: colors.textSecondary, 
    marginBottom: spacing.md,
    fontWeight: typography.regular,
  },
  noteContainer: { 
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md, 
    borderRadius: borderRadius.md, 
    marginBottom: spacing.md,
    borderWidth: 1, 
    borderColor: colors.borderLight,
  },
  noteLabel: { 
    fontSize: typography.sm, 
    color: colors.textSecondary, 
    fontWeight: typography.semibold, 
    marginBottom: spacing.xs,
  },
  noteText: { 
    fontSize: typography.base, 
    color: colors.textPrimary, 
    fontWeight: typography.regular,
  },
  placeDetails: { marginBottom: spacing.md },
  coordsLabel: { 
    fontSize: typography.sm, 
    color: colors.primary, 
    fontWeight: typography.semibold, 
    marginBottom: spacing.xs,
  },
  addressText: { 
    fontSize: typography.base, 
    color: colors.textPrimary, 
    fontWeight: typography.medium, 
    marginBottom: spacing.xs,
  },
  coordsText: { 
    fontSize: typography.xs, 
    color: colors.textTertiary, 
    fontWeight: typography.regular, 
    marginBottom: spacing.xs,
  },
  dateText: { 
    fontSize: typography.sm, 
    color: colors.textSecondary, 
    fontWeight: typography.regular,
  },
  placeActions: { 
    flexDirection: 'row', 
    gap: spacing.sm,
  },
  mapButton: { 
    flex: 1, 
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    ...shadows.sm,
  },
  mapButtonText: { 
    fontSize: typography.sm, 
    fontWeight: typography.semibold, 
    color: colors.surface,
  },
  deleteButton: { 
    width: 44, 
    backgroundColor: colors.errorLight,
    borderRadius: borderRadius.md, 
    justifyContent: 'center', 
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: colors.error,
  },
  deleteButtonText: { fontSize: 20 },
  addButtonContainer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    padding: spacing.base,
    backgroundColor: 'transparent',
  },
  addButton: { 
    backgroundColor: colors.primary,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.base,
    alignItems: 'center',
    ...shadows.md,
  },
  addButtonText: { 
    color: colors.surface, 
    fontSize: typography.base, 
    fontWeight: typography.semibold,
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
    maxHeight: '80%', 
    ...shadows.lg,
  },
  modalTitle: { 
    fontSize: typography['2xl'], 
    fontWeight: typography.bold, 
    color: colors.textPrimary, 
    marginBottom: spacing.xs,
  },
  modalSubtitle: { 
    fontSize: typography.sm, 
    color: colors.textSecondary, 
    marginBottom: spacing.lg,
    fontWeight: typography.regular,
  },
  label: { 
    fontSize: typography.base, 
    fontWeight: typography.semibold, 
    color: colors.textPrimary, 
    marginBottom: spacing.sm,
  },
  booksList: { 
    maxHeight: 200, 
    marginBottom: spacing.base,
  },
  bookItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.backgroundSecondary,
    padding: spacing.md, 
    borderRadius: borderRadius.md, 
    marginBottom: spacing.sm,
    borderWidth: 1, 
    borderColor: colors.border,
  },
  bookItemSelected: { 
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    borderWidth: 2,
  },
  bookColorIndicator: { 
    width: 32, 
    height: 48, 
    borderRadius: borderRadius.sm, 
    marginRight: spacing.md,
  },
  bookItemText: { flex: 1 },
  bookItemTitle: { 
    fontSize: typography.base, 
    fontWeight: typography.semibold, 
    color: colors.textPrimary, 
    marginBottom: spacing.xs,
  },
  bookItemAuthor: { 
    fontSize: typography.sm, 
    color: colors.textSecondary, 
    fontWeight: typography.regular,
  },
  checkMark: { 
    fontSize: 20, 
    color: colors.primary, 
    fontWeight: typography.bold,
  },
  noteInput: { 
    borderWidth: 1, 
    borderColor: colors.border,
    borderRadius: borderRadius.md, 
    padding: spacing.md, 
    fontSize: typography.base, 
    minHeight: 80, 
    color: colors.textPrimary, 
    backgroundColor: colors.backgroundSecondary,
    marginBottom: spacing.lg,
    textAlignVertical: 'top',
  },
  modalButtons: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    gap: spacing.md,
  },
  modalButton: { 
    flex: 1, 
    borderRadius: borderRadius.md,
    paddingVertical: spacing.base,
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
    color: colors.textPrimary,
  },
  modalButtonTextSave: { 
    fontSize: typography.base, 
    fontWeight: typography.semibold, 
    color: colors.surface,
  },
});

export default ReadingPlacesScreen;
