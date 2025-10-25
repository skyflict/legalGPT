import React from "react";
import Icon from "../Icon";
import type { IconName } from "../Icon";
import "./Button.css";

// Типы вариантов кнопок
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "warning"
  | "custom";

// Размеры кнопок
export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl";

// Интерфейс пропсов
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Основные пропсы
  children?: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;

  // Кастомные размеры
  width?: number | string;
  height?: number | string;

  // Кастомные цвета
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;

  // Нет границы
  noBorder?: boolean;

  // Иконки
  leftIcon?: IconName;
  rightIcon?: IconName;
  iconOnly?: boolean;

  // Радиус границы
  borderRadius?: number;

  // Светящийся ореол
  glowing?: boolean;

  // Состояния
  loading?: boolean;
  disabled?: boolean;
  active?: boolean;

  // HTML атрибуты
  type?: "button" | "submit" | "reset";
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;

  // Дополнительные стили
  className?: string;
  style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  width,
  height,
  textColor,
  backgroundColor,
  borderColor,
  noBorder = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  glowing = false,
  loading = false,
  disabled = false,
  active = false,
  borderRadius = 0,
  type = "button",
  onClick,
  className = "",
  style,
  ...props
}) => {
  // Обработчик клика
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading || disabled) {
      event.preventDefault();
      return;
    }

    if (onClick) {
      onClick(event);
    }
  };

  // Создаем кастомные стили
  const customStyle: React.CSSProperties = {
    ...style,
  };

  // Применяем кастомные размеры
  if (width !== undefined) {
    customStyle.width = width;
  }
  if (height !== undefined) {
    customStyle.height = height;
  }

  // Применяем кастомные цвета
  if (textColor && variant === "custom") {
    customStyle.color = textColor;
  }
  if (backgroundColor && variant === "custom") {
    customStyle.backgroundColor = backgroundColor;
  }
  if (borderColor && variant === "custom") {
    customStyle.borderColor = borderColor;
  }

  // Определяем CSS классы
  const buttonClasses = [
    "btn",
    `btn--${variant}`,
    width === undefined && height === undefined ? `btn--${size}` : "",
    iconOnly ? "btn--icon-only" : "",
    glowing ? "btn--glowing" : "",
    loading ? "btn--loading" : "",
    disabled ? "btn--disabled" : "",
    active ? "btn--active" : "",
    noBorder ? "btn--no-border" : "",
    borderRadius ? `btn--radius-${borderRadius}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // Определяем размер иконок в зависимости от размера кнопки
  const getIconSize = () => {
    if (iconOnly) {
      switch (size) {
        case "xs":
          return "xs";
        case "sm":
          return "sm";
        case "md":
          return "md";
        case "lg":
          return "lg";
        case "xl":
          return "xl";
        default:
          return "md";
      }
    }

    switch (size) {
      case "xs":
        return "xs";
      case "sm":
        return "sm";
      case "md":
        return "sm";
      case "lg":
        return "md";
      case "xl":
        return "lg";
      default:
        return "sm";
    }
  };

  const iconSize = getIconSize();

  return (
    <button
      type={type}
      className={buttonClasses}
      style={customStyle}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-pressed={active}
      {...props}
    >
      {/* Левая иконка */}
      {leftIcon && (
        <Icon
          name={leftIcon}
          size={iconSize}
          className="btn__icon btn__icon--left"
        />
      )}

      {/* Индикатор загрузки */}
      {loading && (
        <Icon
          name="settings"
          size={iconSize}
          className="btn__icon btn__icon--loading"
        />
      )}

      {/* Текст кнопки */}
      {!iconOnly && children && <span className="btn__text">{children}</span>}

      {/* Правая иконка */}
      {rightIcon && !loading && (
        <Icon
          name={rightIcon}
          size={iconSize}
          className="btn__icon btn__icon--right"
        />
      )}
    </button>
  );
};

export default Button;
