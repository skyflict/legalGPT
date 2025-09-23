# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Команды разработки

### Основные команды

- `npm install` - установка зависимостей
- `npm run dev` - запустить dev-сервер с горячей перезагрузкой
- `npm run build` - собрать проект для продакшена (TypeScript компиляция + Vite сборка)
- `npm run lint` - проверить код с помощью ESLint
- `npm run preview` - запустить preview сервер для проверки production сборки

### Важные примечания по командам

- Всегда запускайте `npm run lint` после внесения изменений в код
- Используйте `npm run build` для проверки корректности TypeScript типов перед коммитом
- Проект использует Vite для сборки, поэтому тесты не настроены

## Архитектура проекта

### Общая структура

React SPA приложение для генерации юридических документов, построенное на:

- **Frontend**: React 19 + TypeScript + Vite
- **Роутинг**: React Router Dom 7
- **Стилизация**: CSS/SCSS + Sass
- **API**: Внешний REST API на https://api.neuroyurist.ru
- **Авторизация**: JWT токены в localStorage

### Структура проекта

```
src/
├── App.tsx              # Главный компонент с роутингом и состоянием
├── main.tsx             # Точка входа с BrowserRouter
├── components/          # Все React компоненты
│   ├── AuthModal/       # Модальные окна авторизации (логин/регистрация)
│   ├── Button/          # Переиспользуемые кнопки
│   ├── ContractTypes/   # Отображение типов контрактов
│   ├── FAQ/             # Часто задаваемые вопросы
│   ├── Features/        # Блок с функциями приложения
│   ├── Footer/          # Подвал сайта
│   ├── Generation/      # Основной компонент генерации документов
│   ├── Header/          # Хедер с авторизацией и навигацией
│   ├── Hero/            # Лендинг для неавторизованных пользователей
│   ├── History/         # Компоненты для истории документов
│   ├── HowItWorks/      # Блок "Как это работает"
│   ├── Icon/            # SVG иконки
│   ├── Loader/          # Компоненты загрузки
│   ├── Modal/           # Базовые модальные окна
│   └── Sidebar/         # Боковая панель для авторизованных пользователей
├── pages/               # Страницы приложения
│   ├── HomePage.tsx     # Главная страница (лендинг)
│   ├── HistoryPage.tsx  # Страница истории документов
│   ├── GenerationPage.tsx # Страница генерации документов
│   └── generation/      # Подстраницы процесса генерации
├── utils/               # Утилиты
│   └── api.ts          # API клиент и конфигурация
├── hooks/              # Кастомные React хуки
└── assets/             # Статические ресурсы (SVG, изображения)
```

### Ключевые особенности архитектуры

#### Роутинг и навигация

- **React Router**: Использует BrowserRouter с React Router Dom 7
- **Главные маршруты**: `/` (главная), `/generation` (генерация), `/history` (история)
- **Защищенные маршруты**: `/generation` и `/history` требуют авторизации
- **Редирект после авторизации**: с главной страницы на `/generation`

#### Управление состоянием

- **Глобальное состояние**: useState в App.tsx для isLoggedIn, userData, модалей
- **Авторизация**: localStorage для authToken и userEmail с автоматической проверкой при загрузке
- **Боковая панель**: адаптивная логика открытия/закрытия в зависимости от размера экрана
- **API взаимодействие**: Централизованно через utils/api.ts

#### API интеграция (src/utils/api.ts)

- **Базовый URL**: https://api.neuroyurist.ru (можно переопределить через VITE_API_BASE_URL)
- **JWT авторизация**: Автоматическое добавление Authorization заголовка
- **Токен валидация**: Автоматическая проверка срока действия и logout при истечении
- **Централизованные эндпоинты**: Все API пути определены в API_ENDPOINTS
- **Утилиты**: parseJWTToken, apiRequest, testDocumentTypeApi

#### Компонентная архитектура

- **Структура папок**: Каждый компонент в отдельной папке с файлами CSS/SCSS
- **Стилизация**: Sass (.scss) файлы для продвинутой стилизации
- **Переиспользование**: Базовые компоненты (Button, Icon, Modal, Loader)
- **Типизация**: Полная типизация с TypeScript интерфейсами

### Технические детали

#### TypeScript конфигурация

- **Основной конфиг**: tsconfig.json с references на app и node конфиги
- **App конфигурация**: tsconfig.app.json для frontend кода
- **Node конфигурация**: tsconfig.node.json для инструментов сборки

#### ESLint

- **Современная конфигурация**: eslint.config.js с TypeScript ESLint
- **Плагины**: React Hooks, React Refresh для Vite
- **Игнорирование**: dist папка исключена из проверок

#### Vite конфигурация

- **Плагины**: @vitejs/plugin-react для поддержки React
- **Sass**: Автоматическая обработка .scss файлов
- **TypeScript**: Нативная поддержка с проверкой типов

### API эндпоинты

Основные эндпоинты определены в API_ENDPOINTS:
- **Авторизация**: /v1/login, /v1/register, /v1/register/confirm, /v1/logout
- **Пользователи**: /v1/user
- **Документы**: /v1/document (CRUD операции)
- **Типы документов**: /v1/document-type
- **Сброс пароля**: /v1/reset-password, /v1/reset-password/validate-code, /v1/set-password
- **Админка**: /v1/admin/users, /v1/admin/users/{userId}/balance
