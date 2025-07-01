# Icon Component

Универсальный компонент для отображения SVG иконок в проекте НейроЮрист.

## Особенности

- ✅ Поддержка TypeScript с строгой типизацией
- ✅ Большая библиотека встроенных иконок
- ✅ Поддержка пользовательских SVG файлов
- ✅ Различные размеры (xs, sm, md, lg, xl, xxl)
- ✅ Настраиваемые цвета и стили
- ✅ Интерактивные состояния
- ✅ Поддержка accessibility
- ✅ Адаптивность
- ✅ Анимации

## Импорт

```tsx
import Icon from "../Icon";
import type { IconName, IconSize } from "../Icon";
```

## Основное использование

```tsx
// Простая иконка
<Icon name="document" />

// С размером
<Icon name="user" size="lg" />

// С кастомными размерами
<Icon name="user" width={32} height={32} />
<Icon name="user" width="2rem" />

// С кастомным цветом
<Icon name="check" color="#10b981" />

// Кликабельная иконка
<Icon
  name="close"
  onClick={() => handleClose()}
  title="Закрыть"
/>
```

## Доступные иконки

### Логотипы

- `logo` - Логотип НейроЮрист
- `logoName` - Логотип с названием

### Основные

- `scales` - Весы правосудия
- `document` - Документ
- `shield` - Щит/защита
- `clock` - Время
- `check` - Галочка
- `arrow-right` - Стрелка вправо

### Интерфейс

- `user` - Пользователь
- `settings` - Настройки
- `help` - Помощь
- `history` - История
- `close` - Закрыть
- `menu` - Меню
- `search` - Поиск

### Действия

- `download` - Скачать
- `edit` - Редактировать
- `delete` - Удалить
- `plus` - Добавить
- `minus` - Убрать

### Навигация

- `chevron-down` - Стрелка вниз
- `chevron-up` - Стрелка вверх
- `chevron-left` - Стрелка влево
- `chevron-right` - Стрелка вправо

### Видимость

- `eye` - Показать
- `eye-off` - Скрыть

### Файлы

- `home` - Дом
- `folder` - Папка
- `file` - Файл

### Состояния

- `star` - Звезда
- `heart` - Сердце
- `lock` - Заблокировано
- `unlock` - Разблокировано

### Уведомления

- `warning` - Предупреждение
- `info` - Информация
- `success` - Успех
- `error` - Ошибка

### Контакты

- `mail` - Почта
- `phone` - Телефон

## Размеры

### Предустановленные размеры

```tsx
<Icon name="user" size="xs" />   {/* 12px */}
<Icon name="user" size="sm" />   {/* 16px */}
<Icon name="user" size="md" />   {/* 20px (по умолчанию) */}
<Icon name="user" size="lg" />   {/* 24px */}
<Icon name="user" size="xl" />   {/* 32px */}
<Icon name="user" size="xxl" />  {/* 48px */}
```

### Кастомные размеры

```tsx
// Только ширина (высота адаптируется)
<Icon name="user" width={30} />
<Icon name="user" width="2rem" />

// Только высота (ширина адаптируется)
<Icon name="user" height={40} />
<Icon name="user" height="3rem" />

// И ширина и высота
<Icon name="user" width={50} height={30} />
<Icon name="user" width="4rem" height="2rem" />

// Смешанные единицы
<Icon name="user" width="100%" height={24} />
```

### Приоритет размеров

Если указаны `width` или `height`, они имеют приоритет над `size`:

```tsx
// Использует кастомные размеры, size игнорируется
<Icon name="user" size="lg" width={100} height={50} />

// Использует предустановленный размер lg (24px)
<Icon name="user" size="lg" />
```

## Цвета

```tsx
// Использование текущего цвета
<Icon name="heart" />

// Кастомный цвет
<Icon name="heart" color="#ef4444" />

// CSS классы для цветов
<Icon name="success" className="icon--success" />
<Icon name="warning" className="icon--warning" />
<Icon name="error" className="icon--error" />
```

## Интерактивность

```tsx
// Кликабельная иконка
<Icon
  name="settings"
  onClick={() => openSettings()}
  className="icon--clickable"
  title="Открыть настройки"
/>

// С обработчиком и стилями
<Icon
  name="close"
  onClick={handleClose}
  size="lg"
  color="#6b7280"
  style={{ cursor: 'pointer' }}
/>
```

## Accessibility

```tsx
<Icon
  name="info"
  title="Дополнительная информация"
  aria-label="Показать справку"
/>
```

## Примеры в интерфейсе

### Навигация

```tsx
const menuItems = [
  { icon: "plus", label: "Создать" },
  { icon: "document", label: "Шаблоны" },
  { icon: "help", label: "Помощь" },
  { icon: "history", label: "История" },
];

{
  menuItems.map((item) => (
    <button key={item.label}>
      <Icon name={item.icon} size="md" />
      <span>{item.label}</span>
    </button>
  ));
}
```

### Кнопки действий

```tsx
<div className="actions">
  <Icon name="edit" onClick={handleEdit} title="Редактировать" />
  <Icon name="download" onClick={handleDownload} title="Скачать" />
  <Icon name="delete" onClick={handleDelete} title="Удалить" />
</div>
```

### Статусы

```tsx
<div className="status">
  <Icon name="success" className="icon--success" />
  <span>Документ создан успешно</span>
</div>
```

### Адаптивные иконки

```tsx
// Иконка, которая меняет размер в зависимости от экрана
<Icon
  name="menu"
  width="clamp(16px, 4vw, 24px)"
  height="clamp(16px, 4vw, 24px)"
/>

// Большая иконка для главной страницы
<Icon name="scales" width={120} height={120} />

// Маленькие иконки в таблице
<Icon name="edit" width={14} height={14} />
<Icon name="delete" width={14} height={14} />

// Иконки с процентными размерами
<Icon name="logo" width="100%" height="auto" />

// Responsive иконки для мобильных устройств
<Icon
  name="user"
  width={window.innerWidth < 768 ? 16 : 24}
  height={window.innerWidth < 768 ? 16 : 24}
/>
```

## Кастомизация стилей

```css
/* Кастомные размеры */
.icon--custom {
  width: 28px;
  height: 28px;
}

/* Анимации */
.icon--rotating {
  animation: spin 1s linear infinite;
}

/* Состояния */
.icon--disabled {
  opacity: 0.5;
  pointer-events: none;
}
```

## TypeScript

```tsx
import type { IconName, IconSize, IconProps } from "../Icon";

interface ButtonProps {
  icon: IconName;
  size?: IconSize;
  width?: number | string;
  height?: number | string;
  onClick: () => void;
}

const IconButton: React.FC<ButtonProps> = ({
  icon,
  size,
  width,
  height,
  onClick,
}) => (
  <button onClick={onClick}>
    <Icon name={icon} size={size} width={width} height={height} />
  </button>
);

// Пример компонента с кастомными размерами
interface CustomIconProps {
  name: IconName;
  dimensions: {
    width: number | string;
    height: number | string;
  };
}

const CustomIcon: React.FC<CustomIconProps> = ({ name, dimensions }) => (
  <Icon name={name} width={dimensions.width} height={dimensions.height} />
);
```
