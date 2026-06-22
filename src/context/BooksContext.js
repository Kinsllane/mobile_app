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
    summary: 'Книга о том, как маленькие изменения приводят к большим результатам',
    coverColor: '#FF6B6B',
  },
  {
    id: '2',
    title: 'Думай медленно... решай быстро',
    author: 'Даниэль Канеман',
    rating: 4,
    status: 'Читаю',
    summary: 'Исследование двух систем мышления',
    coverColor: '#4ECDC4',
  },
  {
    id: '3',
    title: 'Sapiens',
    author: 'Юваль Ной Харари',
    rating: 5,
    status: 'Прочитано',
    summary: 'Краткая история человечества',
    coverColor: '#45B7D1',
  },
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
      coverColor: getRandomColor(),
    };
    const updatedBooks = [...books, newBook];
    await saveBooks(updatedBooks);
    return newBook;
  };

  // Обновить книгу
  const updateBook = async (bookId, updatedData) => {
    const updatedBooks = books.map((book) =>
      book.id === bookId ? { ...book, ...updatedData } : book
    );
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
