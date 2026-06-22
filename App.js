import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import BooksListScreen from './src/screens/BooksListScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import AddBookScreen from './src/screens/AddBookScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
