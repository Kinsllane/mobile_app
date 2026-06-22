# 📚 Хобби-приложение для обзора книг

Кроссплатформенное мобильное приложение на React Native с Expo SDK 54 для учета и обзора прочитанных книг.

## 🚀 Возможности

- ✅ Список всех книг с карточками
- ✅ Детальная информация о книге
- ✅ Добавление новых книг
- ✅ Рейтинговая система
- ✅ Отслеживание статуса чтения
- ✅ Заметки и сводки по книгам

## 📱 Запуск приложения

### Вариант 1: С Expo Go (рекомендуется для SDK 54)

1. Установите Expo Go на ваш телефон из магазина приложений
2. Убедитесь, что версия Expo Go поддерживает SDK 54

3. Запустите проект:
```bash
cd book-hobby-app
npm start
```

4. Отсканируйте QR-код в приложении Expo Go

### Вариант 2: Отладка по USB с Android SDK

Если версия Expo Go не совпадает, можно настроить отладку через USB:

#### Установка Android SDK

1. **Установите Android Studio:**
   - Скачайте с https://developer.android.com/studio
   - Запустите установщик и следуйте инструкциям

2. **Настройте Android SDK:**
   - Откройте Android Studio
   - Перейдите в Tools → SDK Manager
   - Установите необходимые компоненты:
     - Android SDK Platform (последняя версия)
     - Android SDK Build-Tools
     - Android SDK Command-line Tools
     - Android SDK Platform-Tools

3. **Добавьте переменные окружения:**
   
   В PowerShell (от администратора):
   ```powershell
   [System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "C:\Users\ВашеИмя\AppData\Local\Android\Sdk", "User")
   ```
   
   Добавьте в PATH:
   ```powershell
   $path = [System.Environment]::GetEnvironmentVariable("Path", "User")
   $androidPath = ";C:\Users\ВашеИмя\AppData\Local\Android\Sdk\platform-tools;C:\Users\ВашеИмя\AppData\Local\Android\Sdk\tools"
   [System.Environment]::SetEnvironmentVariable("Path", $path + $androidPath, "User")
   ```

4. **Включите отладку по USB на телефоне:**
   - Перейдите в Настройки → О телефоне
   - Нажмите 7 раз на "Номер сборки"
   - Вернитесь и откройте "Для разработчиков"
   - Включите "Отладка по USB"

5. **Подключите телефон и проверьте:**
   ```bash
   adb devices
   ```
   
   Вы должны увидеть ваше устройство в списке.

6. **Запустите приложение:**
   ```bash
   npm run android
   ```

## 🛠 Технологический стек

- React Native 0.76.5
- Expo SDK 54
- React Navigation 6
- React 18.3.1

## 📝 Структура проекта

```
book-hobby-app/
├── App.js                          # Главный компонент с навигацией
├── src/
│   └── screens/
│       ├── BooksListScreen.js      # Список книг
│       ├── BookDetailScreen.js     # Детали книги
│       └── AddBookScreen.js        # Добавление книги
├── package.json
└── README.md
```

## 🔧 Полезные команды

```bash
# Запуск dev-сервера
npm start

# Запуск на Android
npm run android

# Запуск на iOS (только Mac)
npm run ios

# Очистка кэша
npx expo start -c
```

## 💡 Дальнейшее развитие

- [ ] Локальное хранилище (AsyncStorage)
- [ ] Поиск и фильтрация книг
- [ ] Категории и жанры
- [ ] Экспорт списка книг
- [ ] Интеграция с API для получения обложек
- [ ] Статистика чтения

## 🐛 Возможные проблемы

### Проблема: Версия Expo Go не совпадает
**Решение:** Используйте отладку по USB с Android SDK (см. выше)

### Проблема: `adb devices` не находит устройство
**Решение:** 
- Проверьте драйвера USB
- Убедитесь, что отладка по USB включена
- Попробуйте другой USB кабель/порт

### Проблема: Ошибки peer dependencies
**Решение:** Используйте `npm install --legacy-peer-deps`

## 📄 Лицензия

0BSD - свободное использование
