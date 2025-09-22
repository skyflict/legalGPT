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
- **Стилизация**: CSS/SCSS модули + обычные CSS файлы
- **API**: Внешний REST API на https://api.neuroyurist.ru
- **Авторизация**: JWT токены в localStorage

### Структура компонентов

```
src/
├── components/          # Все React компоненты
│   ├── App.tsx         # Главный компонент с роутингом состояний
│   ├── Header/         # Хедер с авторизацией и навигацией
│   ├── AuthModal/      # Модальные окна авторизации (логин/регистрация)
│   ├── Generation/     # Основной компонент генерации документов
│   ├── Sidebar/        # Боковая панель для авторизованных пользователей
│   ├── History/        # Страница истории документов
│   ├── Hero/           # Лендинг для неавторизованных пользователей
│   ├── Features/       # Блок с функциями приложения
│   ├── ContractTypes/  # Отображение типов контрактов
│   ├── HowItWorks/     # Блок "Как это работает"
│   └── FAQ/            # Часто задаваемые вопросы
├── utils/              # Утилиты (API клиент, хелперы)
└── assets/             # Статические ресурсы (SVG, изображения)
```

### Ключевые особенности архитектуры

#### Управление состоянием

- **Глобальное состояние**: useState в App.tsx для isLoggedIn, currentView, userData
- **Авторизация**: localStorage для authToken и userEmail
- **API взаимодействие**: Кастомные хуки в компонентах (useDocumentGeneration, useAuth)

#### Роутинг состояний

Приложение использует состояния вместо React Router:
- `currentView`: "generation" | "history" для переключения между разделами
- `isLoggedIn`: boolean для отображения разного контента

#### Компонент Generation

Центральный многошаговый процесс генерации документов:

1. **QueryInput** - ввод запроса пользователем
2. **ContractTypeStep** - подтверждение типа документа
3. **EntitiesFormStep** - заполнение формы с данными
4. **FinalResultStep** - результат с возможностью скачивания

#### API интеграция (src/utils/api.ts)

- Базовый URL: https://api.neuroyurist.ru (можно переопределить через VITE_API_BASE_URL)
- JWT авторизация с автоматической проверкой срока действия токена
- Автоматический logout при истечении токена
- Все запросы через apiRequest() с добавлением Authorization заголовка

#### Компонентная структура

- Каждый крупный компонент имеет папку с index.ts для экспорта
- Хуки выносятся в подпапку hooks/
- Стили: mix CSS модулей (.module.css) и обычных CSS/SCSS файлов
- Подкомпоненты в папке components/ внутри основного компонента

### Технические детали

#### TypeScript конфигурация

- Строгая типизация с конфигурацией в tsconfig.json
- Отдельные конфиги для app (tsconfig.app.json) и node (tsconfig.node.json)

#### ESLint

- Конфигурация в eslint.config.js
- Использует TypeScript ESLint, React Hooks и React Refresh плагины

#### Стилизация

- Sass поддержка для .scss файлов
- CSS модули для изолированных стилей компонентов
- Глобальные стили в src/index.css

### API эндпоинты

Основные эндпоинты определены в API_ENDPOINTS:
- Авторизация: /v1/login, /v1/register, /v1/logout
- Пользователи: /v1/user
- Документы: /v1/document (CRUD операции)
- Типы документов: /v1/document-type
- Админка: /v1/admin/users
