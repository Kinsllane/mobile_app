import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BooksContext = createContext();

const STORAGE_KEY = '@books_storage';

// Дефолтные книги для первого запуска
const DEFAULT_BOOKS = [
  {
    id: '1',
    title: 'Атомные привычки',
    author: 'Джеймс Клир',
    rating: 5,
    status: 'Прочитано',
    genre: 'Саморазвитие',
    summary: 'Книга о том, как маленькие изменения приводят к большим результатам',
    coverColor: '#FF6B6B',
    isFavorite: false,
    notes: '',
    keyPoints: [],
    totalPages: 320,
    currentPage: 320,
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    title: 'Думай медленно... решай быстро',
    author: 'Даниэль Канеман',
    rating: 4,
    status: 'Читаю',
    genre: 'Психология',
    summary: 'Исследование двух систем мышления',
    coverColor: '#4ECDC4',
    isFavorite: false,
    notes: '',
    keyPoints: [],
    totalPages: 600,
    currentPage: 250,
    startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    readingHistory: [
      { date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), pages: 0 },
      { date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), pages: 100 },
      { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), pages: 180 },
      { date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), pages: 230 },
      { date: new Date().toISOString(), pages: 250 },
    ],
  },
  {
    id: '3',
    title: 'Sapiens',
    author: 'Юваль Ной Харари',
    rating: 5,
    status: 'Прочитано',
    genre: 'История',
    summary: 'Краткая история человечества',
    coverColor: '#45B7D1',
    isFavorite: true,
    notes: 'Отличная книга про эволюцию человечества!',
    keyPoints: ['История развития человека', 'Когнитивная революция', 'Появление земледелия'],
    totalPages: 512,
    currentPage: 512,
    startDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Доступные жанры
export const GENRES = [
  'Фантастика',
  'Детектив',
  'Фэнтези',
  'Романтика',
  'Бизнес',
  'Саморазвитие',
  'Психология',
  'История',
  'Биография',
  'Наука',
  'Философия',
  'Классика',
  'Приключения',
  'Ужасы',
  'Триллер',
  'Другое',
];

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Загрузка книг при запуске приложения
  useEffect(() => {
    loadBooks();
  }, []);

  // Загрузить книги из AsyncStorage
  const loadBooks = async () => {
    try {
      const storedBooks = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedBooks !== null) {
        setBooks(JSON.parse(storedBooks));
      } else {
        // Первый запуск - загружаем дефолтные книги
        setBooks(DEFAULT_BOOKS);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_BOOKS));
      }
    } catch (error) {
      console.error('Ошибка загрузки книг:', error);
      setBooks(DEFAULT_BOOKS);
    } finally {
      setLoading(false);
    }
  };

  // Сохранить книги в AsyncStorage
  const saveBooks = async (newBooks) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
      setBooks(newBooks);
    } catch (error) {
      console.error('Ошибка сохранения книг:', error);
    }
  };

  // Добавить новую книгу
  const addBook = async (book) => {
    const newBook = {
      ...book,
      id: Date.now().toString(), // Простой ID на основе времени
      coverColor: book.coverColor || getRandomColor(),
      isFavorite: book.isFavorite || false,
      notes: book.notes || '',
      keyPoints: book.keyPoints || [],
      totalPages: book.totalPages || 0,
      currentPage: book.currentPage || 0,
      startDate: book.startDate || null,
    };
    const updatedBooks = [...books, newBook];
    await saveBooks(updatedBooks);
    return newBook;
  };

  // Обновить книгу
  const updateBook = async (bookId, updatedData) => {
    const updatedBooks = books.map((book) => {
      if (book.id === bookId) {
        const updatedBook = { ...book, ...updatedData };
        
        // Если изменилась текущая страница - добавляем в историю чтения
        if (updatedData.currentPage !== undefined && updatedData.currentPage !== book.currentPage) {
          const currentHistory = book.readingHistory || [];
          const today = new Date().toISOString().split('T')[0]; // Формат: YYYY-MM-DD
          
          // Проверяем, есть ли уже запись за сегодня
          const todayIndex = currentHistory.findIndex(entry => 
            entry.date.split('T')[0] === today
          );
          
          if (todayIndex >= 0) {
            // Обновляем запись за сегодня
            currentHistory[todayIndex] = {
              date: new Date().toISOString(),
              pages: updatedData.currentPage,
            };
          } else {
            // Добавляем новую запись
            currentHistory.push({
              date: new Date().toISOString(),
              pages: updatedData.currentPage,
            });
          }
          
          updatedBook.readingHistory = currentHistory;
          
          // Устанавливаем startDate если его нет и currentPage > 0
          if (!updatedBook.startDate && updatedData.currentPage > 0) {
            updatedBook.startDate = new Date().toISOString();
          }
        }
        
        return updatedBook;
      }
      return book;
    });
    await saveBooks(updatedBooks);
  };

  // Удалить книгу
  const deleteBook = async (bookId) => {
    const updatedBooks = books.filter((book) => book.id !== bookId);
    await saveBooks(updatedBooks);
  };

  // Получить книгу по ID
  const getBookById = (bookId) => {
    return books.find((book) => book.id === bookId);
  };

  // Случайный цвет для обложки
  const getRandomColor = () => {
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
  };

  return (
    <BooksContext.Provider
      value={{
        books,
        loading,
        addBook,
        updateBook,
        deleteBook,
        getBookById,
      }}
    >
      {children}
    </BooksContext.Provider>
  );
};

// Хук для использования контекста
export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks должен использоваться внутри BooksProvider');
  }
  return context;
};
