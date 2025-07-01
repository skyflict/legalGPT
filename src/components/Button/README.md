# Button Component

Универсальный компонент кнопки для проекта НейроЮрист с поддержкой различных вариантов, размеров, цветов и состояний.

## Особенности

- ✅ Поддержка TypeScript с строгой типизацией
- ✅ 8 готовых вариантов оформления
- ✅ 5 размеров кнопок
- ✅ Кастомные размеры (width, height)
- ✅ Кастомные цвета (текст, фон, рамка)
- ✅ Поддержка иконок (слева, справа, только иконка)
- ✅ Состояния загрузки и отключения
- ✅ Полная поддержка accessibility
- ✅ Адаптивность
- ✅ Анимации и transitions

## Импорт

```tsx
import Button from "../Button";
import type { ButtonProps, ButtonVariant, ButtonSize } from "../Button";
```

## Основное использование

```tsx
// Простая кнопка
<Button>Нажмите меня</Button>

// С вариантом
<Button variant="primary">Главная кнопка</Button>

// С размером
<Button size="lg" variant="secondary">Большая кнопка</Button>

// Кастомные размеры и цвета
<Button
  variant="custom"
  width={200}
  height={50}
  textColor="#ffffff"
  backgroundColor="#ff6b6b"
>
  Кастомная кнопка
</Button>
```

## Варианты (variant)

### Готовые варианты

- `primary` - Основная кнопка (фиолетовый градиент)
- `secondary` - Вторичная кнопка (светло-серая)
- `outline` - Кнопка с рамкой (прозрачная с фиолетовой рамкой)
- `ghost` - Призрачная кнопка (прозрачная)
- `danger` - Опасное действие (красный градиент)
- `success` - Успешное действие (зеленый градиент)
- `warning` - Предупреждение (желтый градиент)
- `custom` - Кастомное оформление

```tsx
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
```

## Размеры (size)

```tsx
<Button size="xs">Extra Small</Button>    {/* 24px высота */}
<Button size="sm">Small</Button>          {/* 32px высота */}
<Button size="md">Medium</Button>         {/* 40px высота (по умолчанию) */}
<Button size="lg">Large</Button>          {/* 48px высота */}
<Button size="xl">Extra Large</Button>    {/* 56px высота */}
```

## Кастомные размеры

```tsx
// Кастомная ширина и высота
<Button width={150} height={60}>Кастомный размер</Button>

// Только ширина (высота по размеру)
<Button width="100%">Полная ширина</Button>

// Только высота (ширина по содержимому)
<Button height={80}>Высокая кнопка</Button>

// Различные единицы
<Button width="20rem" height="3rem">В rem</Button>
<Button width="50vw" height="10vh">В viewport</Button>
```

## Кастомные цвета

Для кастомных цветов используйте `variant="custom"`:

```tsx
<Button
  variant="custom"
  textColor="#ffffff"
  backgroundColor="#ff6b6b"
  borderColor="#ff5252"
>
  Красная кнопка
</Button>

<Button
  variant="custom"
  textColor="#2d3748"
  backgroundColor="#f7fafc"
  borderColor="#e2e8f0"
>
  Светлая кнопка
</Button>

// Градиенты через style
<Button
  variant="custom"
  textColor="#ffffff"
  style={{
    background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)'
  }}
>
  Градиентная кнопка
</Button>
```

## Иконки

```tsx
// Иконка слева
<Button leftIcon="plus" variant="primary">
  Создать документ
</Button>

// Иконка справа
<Button rightIcon="arrow-right" variant="outline">
  Далее
</Button>

// Обе иконки
<Button leftIcon="download" rightIcon="chevron-down" variant="secondary">
  Скачать
</Button>

// Только иконка
<Button iconOnly leftIcon="settings" variant="ghost" />

// Разные размеры иконок подстраиваются под размер кнопки
<Button size="lg" leftIcon="user" variant="primary">
  Профиль
</Button>
```

## Состояния

```tsx
// Загрузка
<Button loading variant="primary">
  Сохранение...
</Button>

// Отключено
<Button disabled variant="secondary">
  Недоступно
</Button>

// Активное состояние
<Button active variant="outline">
  Выбрано
</Button>

// Комбинирование состояний
<Button loading disabled variant="primary">
  Обработка...
</Button>
```

## HTML атрибуты

```tsx
// Типы кнопок
<Button type="submit" variant="primary">Отправить</Button>
<Button type="reset" variant="secondary">Сбросить</Button>
<Button type="button" variant="outline">Обычная</Button>

// Accessibility
<Button
  aria-label="Закрыть диалог"
  title="Закрыть"
  iconOnly
  leftIcon="close"
/>

// HTML атрибуты
<Button
  id="submit-btn"
  className="custom-class"
  data-testid="submit-button"
  tabIndex={0}
>
  Кнопка с атрибутами
</Button>
```

## Примеры в интерфейсе

### Формы

```tsx
<form>
  <div className="form-actions">
    <Button type="submit" variant="primary" loading={isSubmitting}>
      {isSubmitting ? "Сохранение..." : "Сохранить"}
    </Button>
    <Button type="reset" variant="secondary">
      Отмена
    </Button>
  </div>
</form>
```

### Панель действий

```tsx
<div className="action-panel">
  <Button leftIcon="plus" variant="primary">
    Создать
  </Button>
  <Button leftIcon="edit" variant="outline">
    Редактировать
  </Button>
  <Button leftIcon="delete" variant="danger">
    Удалить
  </Button>
</div>
```

### Навигация

```tsx
<div className="pagination">
  <Button leftIcon="chevron-left" variant="ghost" disabled={isFirstPage}>
    Назад
  </Button>
  <Button>1</Button>
  <Button active>2</Button>
  <Button>3</Button>
  <Button rightIcon="chevron-right" variant="ghost" disabled={isLastPage}>
    Вперед
  </Button>
</div>
```

### Группы кнопок

```tsx
<div className="btn-group">
  <Button variant="outline" active>
    День
  </Button>
  <Button variant="outline">Неделя</Button>
  <Button variant="outline">Месяц</Button>
</div>
```

### Адаптивные кнопки

```tsx
// Полная ширина на мобильных
<Button className="btn--responsive" variant="primary">
  Адаптивная кнопка
</Button>

// Разные размеры для разных экранов
<Button
  size={window.innerWidth < 768 ? 'sm' : 'lg'}
  variant="primary"
>
  Responsive размер
</Button>
```

## Кастомизация стилей

```css
/* Кастомный вариант кнопки */
.btn--brand {
  background: linear-gradient(45deg, #your-color1, #your-color2);
  color: #ffffff;
  border: none;
}

.btn--brand:hover {
  background: linear-gradient(45deg, #darker-color1, #darker-color2);
}

/* Полная ширина */
.btn--full-width {
  width: 100%;
}

/* Круглая кнопка */
.btn--circle {
  border-radius: 50%;
  aspect-ratio: 1;
}

/* Анимация */
.btn--bounce:hover {
  animation: bounce 0.5s ease;
}

@keyframes bounce {
  0%,
  20%,
  60%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  80% {
    transform: translateY(-5px);
  }
}
```

## TypeScript

```tsx
import type { ButtonProps, ButtonVariant, ButtonSize } from "../Button";

interface ActionButtonProps {
  action: "create" | "edit" | "delete";
  label: string;
  onClick: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  action,
  label,
  onClick,
}) => {
  const getVariant = (): ButtonVariant => {
    switch (action) {
      case "create":
        return "primary";
      case "edit":
        return "outline";
      case "delete":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getIcon = () => {
    switch (action) {
      case "create":
        return "plus";
      case "edit":
        return "edit";
      case "delete":
        return "delete";
      default:
        return undefined;
    }
  };

  return (
    <Button variant={getVariant()} leftIcon={getIcon()} onClick={onClick}>
      {label}
    </Button>
  );
};

// Компонент с кастомными цветами
interface BrandButtonProps extends Omit<ButtonProps, "variant"> {
  brandColor: string;
}

const BrandButton: React.FC<BrandButtonProps> = ({
  brandColor,
  children,
  ...props
}) => (
  <Button
    variant="custom"
    backgroundColor={brandColor}
    textColor="#ffffff"
    {...props}
  >
    {children}
  </Button>
);
```

## Лучшие практики

1. **Используйте семантические варианты** - `primary` для главных действий, `danger` для удаления
2. **Добавляйте иконки для улучшения UX** - они помогают быстрее понять назначение кнопки
3. **Используйте состояние loading** - показывайте пользователю процесс выполнения
4. **Добавляйте accessibility атрибуты** - `aria-label`, `title` для иконочных кнопок
5. **Группируйте связанные действия** - используйте `.btn-group` для связанных кнопок
6. **Используйте правильные типы** - `submit` для отправки форм, `button` для обычных действий
