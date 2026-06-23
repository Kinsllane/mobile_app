import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { BooksProvider } from './src/context/BooksContext';
import BooksListScreen from './src/screens/BooksListScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import AddBookScreen from './src/screens/AddBookScreen';
import EditBookScreen from './src/screens/EditBookScreen';
import StatisticsScreen from './src/screens/StatisticsScreen';
import GoalsScreen from './src/screens/GoalsScreen';
import FavoritesScreen from './src/screens/FavoritesScreen';
import ReadingPlacesScreen from './src/screens/ReadingPlacesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <BooksProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="BooksList"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6200ee',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="BooksList" 
            component={BooksListScreen}
            options={{ title: 'Мои Книги' }}
          />
          <Stack.Screen 
            name="BookDetail" 
            component={BookDetailScreen}
            options={{ title: 'Детали книги' }}
          />
          <Stack.Screen 
            name="AddBook" 
            component={AddBookScreen}
            options={{ title: 'Добавить книгу' }}
          />
          <Stack.Screen 
            name="EditBook" 
            component={EditBookScreen}
            options={{ title: 'Редактировать книгу' }}
          />
          <Stack.Screen 
            name="Statistics" 
            component={StatisticsScreen}
            options={{ title: 'Статистика' }}
          />
          <Stack.Screen 
            name="Goals" 
            component={GoalsScreen}
            options={{ title: 'Цели чтения' }}
          />
          <Stack.Screen 
            name="Favorites" 
            component={FavoritesScreen}
            options={{ title: 'Избранное' }}
          />
          <Stack.Screen 
            name="ReadingPlaces" 
            component={ReadingPlacesScreen}
            options={{ title: 'Книжные места' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </BooksProvider>
  );
}
