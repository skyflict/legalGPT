# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Команды разработки

### Основные команды

- `npm install` - установка зависимостей
- `npm run dev` - запустить dev-сервер с горячей перезагрузкой (обычно http://localhost:5173)
- `npm run build` - собрать проект для продакшена (TypeScript компиляция + Vite сборка)
- `npm run lint` - проверить код с помощью ESLint
- `npm run preview` - запустить preview сервер для проверки production сборки

### Важные примечания по командам

- Перед коммитом запускайте `npm run build` для проверки TypeScript типов
- Используйте `npm run lint` для проверки соответствия code style
- Проект использует Vite, тесты отсутствуют

### Environment Variables

- `VITE_API_BASE_URL` - переопределить базовый URL API (по умолчанию: https://api.neuroyurist.ru)

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
├── App.tsx              # Главный компонент с роутингом и глобальным состоянием
├── main.tsx             # Точка входа приложения
├── components/          # React компоненты
│   ├── AuthModal/       # Авторизация: логин/регистрация/подтверждение
│   │   ├── components/  # LoginForm, RegisterForm, ConfirmationForm, AgreementCheckbox
│   │   └── hooks/       # useAuth, useFormValidation
│   ├── Header/          # Хедер с UserDropdown, Logo, AuthButtons
│   │   ├── components/  # UserDropdown, Logo, AuthButtons
│   │   └── hooks/       # useDropdown
│   ├── Sidebar/         # Боковая панель навигации (адаптивная)
│   ├── History/         # HistoryPage, HistoryModal
│   ├── Generation/      # Компоненты процесса генерации документов
│   │   ├── components/  # ContractTypeStep, EntitiesFormStep (с FloatingField для полей ввода)
│   │   │               # QueryInput, FinalResultStep, Spinner
│   │   │               # ContractSelectSection, FrequentQueriesSection, ContinueGenerationSection
│   │   │               # HelpText, ErrorMessage
│   │   ├── hooks/       # useUserForm, useFormValidity, useResolvedDocumentType
│   │   │               # useDocumentGeneration, useDocumentTypes, useFormSchema, useLoaderMessage
│   │   ├── constants/   # frequentQueries
│   │   └── utils/       # generationStates
│   ├── Button/          # Переиспользуемая кнопка
│   ├── Icon/            # SVG иконки (README.md с документацией по доступным иконкам)
│   ├── Loader/          # Индикаторы загрузки
│   ├── Modal/           # Базовое модальное окно
│   ├── Hero/            # Лендинг для неавторизованных
│   ├── Features/        # Блок преимуществ
│   ├── ForWhom/         # Блок "Для кого"
│   ├── HowItWorks/      # Блок "Как это работает"
│   ├── ContractTypes/   # Типы документов
│   ├── FAQ/             # Часто задаваемые вопросы
│   └── Footer/          # Подвал сайта
├── pages/               # Страницы роутинга
│   ├── HomePage.tsx     # Главная страница (/)
│   ├── GenerationPage.tsx # Страница генерации (/generation)
│   ├── HistoryPage.tsx  # История документов (/history)
│   └── generation/      # Шаги процесса генерации (используются в роутинге)
│       ├── ContractTypePage.tsx    # Шаг 1: Выбор типа документа
│       ├── EntitiesFormPage.tsx    # Шаг 2: Ввод данных сторон
│       ├── QueryInputPage.tsx      # Шаг 3: Детали документа
│       └── FinalResultPage.tsx     # Шаг 4: Результат генерации
├── hooks/               # Глобальные хуки
│   └── useLatestIncompleteDocument.ts  # Получение последнего незавершенного документа
├── utils/
│   └── api.ts          # API клиент, эндпоинты, JWT утилиты
└── assets/             # Статические ресурсы
```

### Ключевые особенности архитектуры

#### Роутинг и навигация

- **React Router**: Использует BrowserRouter с React Router Dom 7
- **Главные маршруты**: `/` (главная), `/generation` (генерация), `/history` (история)
- **Защищенные маршруты**: `/generation` и `/history` требуют авторизации
- **Редирект после авторизации**: с главной страницы на `/generation`

#### Управление состоянием (App.tsx)

Глобальное состояние управляется через useState хуки в App.tsx:
- **Авторизация**: `isLoggedIn`, `userEmail`, `userData` (UserData: id, email, role, balance)
- **Модали**: `isAuthModalOpen`, `authModalMode` ("login" | "register")
- **UI**: `isLoading`, `isSidebarOpen`, `generationKey`
- **localStorage**: authToken и userEmail для персистентности сессии
- **Боковая панель**: автоматически открывается на десктопе (>1024px), закрывается на мобильных
  - Переключение через `toggleSidebar()` (вызывается из Header)
  - Оверлей закрывает сайдбар на мобильных при клике вне его области
- **Защита маршрутов**: редирект неавторизованных пользователей на HomePage с сохранением контекста
- **Сброс состояния Generation**: при клике на "Новая генерация" в sidebar увеличивается `generationKey` (App.tsx:217), что вызывает полный remount компонента GenerationPage (App.tsx:245 через key prop)

#### API интеграция (src/utils/api.ts)

**Конфигурация:**
- Базовый URL: https://api.neuroyurist.ru (переопределяется через `VITE_API_BASE_URL`)
- createApiUrl(): создает полные URL для эндпоинтов
- API_ENDPOINTS: централизованные константы всех эндпоинтов API

**Основные функции:**
- `apiRequest(url, options)`: универсальная функция для API запросов
  - Автоматически добавляет JWT токен в Authorization заголовок
  - Проверяет срок действия токена перед каждым запросом
  - При истечении токена: logout + очистка localStorage + перезагрузка страницы
- `parseJWTToken(token)`: парсинг и валидация JWT токена
  - Возвращает payload, даты истечения/выпуска, user_id, user_role
  - Проверяет формат токена и корректность Base64
- `downloadDocument(documentId, filename)`: скачивание файлов документов в формате .docx
- `logoutAndCleanup()`: полная очистка сессии и вызов /logout
- `generateUUID()`: генерация уникальных идентификаторов

**Важно:**
- Все функции API доступны в window для отладки (testParseToken, logCurrentTokenInfo, getApiInfo, testDocumentTypeApi)
- При ошибках токена происходит автоматический logout с перезагрузкой страницы

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

Основные эндпоинты (все используют базовый URL https://api.neuroyurist.ru):

**Авторизация:**
- POST /v1/login - вход (возвращает JWT токен)
- POST /v1/register - регистрация нового пользователя
- POST /v1/register/confirm - подтверждение регистрации (код из email)
- POST /v1/logout - выход из системы

**Пользователи:**
- GET /v1/user - получить данные текущего пользователя (требует JWT)

**Документы:**
- POST /v1/document - создать новый документ
- GET /v1/document - получить список документов пользователя
- GET /v1/document/:id - получить документ по ID
- PUT /v1/document/:id - обновить документ
- GET /v1/document/:id/file - скачать файл документа (.docx)

**Типы документов:**
- GET /v1/document-type - получить список доступных типов документов

**Сброс пароля:**
- POST /v1/reset-password - запросить сброс пароля
- POST /v1/reset-password/validate-code - проверить код восстановления
- POST /v1/set-password - установить новый пароль

**Админ панель (только для пользователей с role: admin):**
- GET /v1/admin/users - список всех пользователей
- PUT /v1/admin/users/:userId/balance - изменить баланс пользователя

### Процесс генерации документов

Многошаговый процесс реализован двумя способами:

**Вариант 1: Через роутинг** (`src/pages/generation/`):
1. **ContractTypePage**: выбор типа документа из списка (GET /v1/document-type)
2. **EntitiesFormPage**: ввод данных сторон договора (имена, контакты и т.д.)
3. **QueryInputPage**: детальная информация для генерации (условия, сроки, суммы)
4. **FinalResultPage**: отображение результата, возможность скачать .docx файл

**Вариант 2: Через компонент Generation** (`src/components/Generation/`):
- Единый компонент Generation.tsx управляет состоянием генерации
- Подкомпоненты для каждого шага: ContractTypeStep, EntitiesFormStep, QueryInput, FinalResultStep, Spinner
- Вспомогательные компоненты: ContractSelectSection, FrequentQueriesSection, ContinueGenerationSection, HelpText, ErrorMessage
- Хуки:
  - useUserForm, useFormValidity (управление формами и валидация - оба в hooks/useUserForm.ts)
  - useResolvedDocumentType (работа с типами документов)
  - useDocumentGeneration (основная логика генерации документов с polling)
  - useDocumentTypes (загрузка и работа с типами документов)
  - useFormSchema (парсинг JSON Schema для динамических форм)
  - useLoaderMessage (сообщения для различных стадий генерации)
- Глобальные хуки (в src/hooks/):
  - useLatestIncompleteDocument (получение последнего незавершенного документа для продолжения работы)
- Константы: frequentQueries (часто используемые запросы)
- Утилиты: generationStates (управление состояниями процесса генерации: idle, generating, waiting_input, completed, error)

#### Детали реализации процесса генерации

**Polling механизм** (useDocumentGeneration):
- После создания документа начинается polling состояния с интервалом 2 секунды
- Polling останавливается при достижении терминального состояния (is_terminal: true)
- Tracking стадий: DOC_TYPE_DEDUCING → DOC_TYPE_DEDUCED → ENTITIES_EXTRACTING → ENTITIES_EXCTRACTED → ENTITIES_PROVIDED → DOC_GENERATING → DOC_GENERATED
- При ошибках или завершении polling автоматически останавливается

**Динамические формы** (useFormSchema):
- Формы генерируются на основе JSON Schema из required_user_input
- Поддержка группировки полей через `ui:groups`
- Разделение полей на обязательные (required) и опциональные
- Валидация через useFormValidity

**Продолжение генерации** (useLatestIncompleteDocument):
- При загрузке страницы автоматически ищется последний незавершенный документ
- Пользователю предлагается продолжить работу с этим документом
- ContinueGenerationSection показывает информацию о незавершенном документе

**Стадии генерации** (generationStates):
- `idle` - ожидание начала работы
- `generating` - идет процесс генерации
- `waiting_input` - требуется ввод данных пользователем
- `completed` - генерация завершена
- `error` - произошла ошибка

### Особенности UI

- **Адаптивность**: брейкпоинт для sidebar и мобильного меню - 1024px
- **Блокировка скролла**: при открытии мобильного sidebar добавляется класс `.no-scroll` на body
- **Overlay**: затемнение фона при открытом мобильном sidebar с возможностью закрытия по клику
- **Loader**: глобальный компонент загрузки показывается при инициализации авторизации
- **Динамические сообщения**: useLoaderMessage показывает различные сообщения в зависимости от текущей стадии генерации

### Важные замечания при разработке

#### Работа с формами
- При добавлении новых полей в динамические формы (EntitiesFormStep) используйте FloatingField компонент
- Валидация форм происходит через useFormValidity (из hooks/useUserForm.ts), которая проверяет заполненность обязательных полей из schema.required
- useUserForm управляет состоянием формы, поддерживает defaults из схемы и существующие значения из context.entities
- Группировка полей управляется через `ui:groups` в JSON Schema из API

#### Работа с API
- Все API запросы проходят через apiRequest(), который автоматически проверяет токен и добавляет Authorization заголовок
- При истечении токена происходит автоматический logout с перезагрузкой страницы
- Для отладки API доступны функции в window: testParseToken, logCurrentTokenInfo, getApiInfo, testDocumentTypeApi

#### Состояние генерации
- Используйте useDocumentGeneration для работы с процессом генерации
- Polling автоматически останавливается при is_terminal: true
- Не забывайте вызывать stopPolling при размонтировании компонента (хук делает это автоматически)

#### Работа с типами документов
- useDocumentTypes загружает типы документов при монтировании
- Используйте getDocumentTypeById или getDocumentTypeByName для поиска конкретного типа

#### Роутинг
- Защищенные маршруты (/generation, /history) автоматически редиректят на HomePage для неавторизованных
- Используйте generationKey в App.tsx для полного сброса состояния GenerationPage
- При успешной авторизации происходит автоматический редирект с "/" на "/generation" (App.tsx:48-51, 87-89)

#### Стили
- Проект использует CSS Modules для компонентов Generation (*.module.css)
- Обычные CSS файлы для остальных компонентов
- SCSS файлы для AuthModal и Header
