import React from "react";
import "./Icon.css";

// Импорты SVG иконок
import logoSvg from "../../assets/logo.svg";
import logoNameSvg from "../../assets/logoName.svg";
import lockSvg from "../../assets/lock.svg";
import awardSvg from "../../assets/award.svg";
import arrowSvg from "../../assets/arrow.svg";
import footerLogo from "../../assets/footerLogo.svg";
import checkbox from "../../assets/checkbox.svg";
import create from "../../assets/create.svg";
import text from "../../assets/text.svg";
import help from "../../assets/help.svg";
import history from "../../assets/history.svg";
import send from "../../assets/send.svg";
import cancel from "../../assets/cancel.svg";
import whiteLine from "../../assets/whiteLine.svg";
import check from "../../assets/check.svg";
import helpOutlined from "../../assets/helpOutlined.svg";
import download from "../../assets/download.svg";
import close from "../../assets/close.svg";

export type IconName =
  | "logo"
  | "logoName"
  | "arrow"
  | "award"
  | "scales"
  | "document"
  | "shield"
  | "footerLogo"
  | "clock"
  | "check"
  | "arrow-right"
  | "user"
  | "settings"
  | "help"
  | "history"
  | "search"
  | "download"
  | "edit"
  | "delete"
  | "plus"
  | "minus"
  | "chevron-down"
  | "chevron-up"
  | "chevron-left"
  | "chevron-right"
  | "eye"
  | "eye-off"
  | "home"
  | "folder"
  | "file"
  | "star"
  | "heart"
  | "mail"
  | "phone"
  | "lock"
  | "unlock"
  | "warning"
  | "info"
  | "success"
  | "error"
  | "checkbox"
  | "create"
  | "text"
  | "help"
  | "history"
  | "send"
  | "cancel"
  | "whiteLine"
  | "check"
  | "helpOutlined"
  | "close";

// Размеры иконок
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

// Интерфейс пропсов
export interface IconProps {
  name: IconName;
  size?: IconSize;
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
  title?: string;
  "aria-label"?: string;
}

// Объект с SVG иконками
const iconMap: Record<IconName, string> = {
  logo: logoSvg,
  logoName: logoNameSvg,
  footerLogo: footerLogo,
  lock: lockSvg,
  award: awardSvg,
  arrow: arrowSvg,
  checkbox: checkbox,
  create: create,
  text: text,
  help: help,
  history: history,
  send: send,
  cancel: cancel,
  whiteLine: whiteLine,
  check: check,
  helpOutlined: helpOutlined,
  download: download,
  close: close,
  "arrow-right": `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"/>
  </svg>`,
  scales: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C11.5 2 11 2.19 10.59 2.59L2.59 10.59C2.21 10.97 2 11.5 2 12H11V21C11.5 21 12 20.81 12.41 20.41L20.41 12.41C20.79 12.03 21 11.5 21 11H12V2Z"/>
    <path d="M7 14L10 17L17 10"/>
  </svg>`,
  document: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,17.4 15.4,18 14.8,18H9.2C8.6,18 8,17.4 8,16V13C8,12.4 8.6,11.5 9.2,11.5V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.5,8.7 10.5,10V11.5H13.5V10C13.5,8.7 12.8,8.2 12,8.2Z"/>
  </svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z"/>
  </svg>`,
  user: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
  </svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
  </svg>`,
  search: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
  </svg>`,

  edit: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
  </svg>`,
  delete: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
  </svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
  </svg>`,
  minus: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M19,13H5V11H19V13Z"/>
  </svg>`,
  "chevron-down": `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/>
  </svg>`,
  "chevron-up": `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z"/>
  </svg>`,
  "chevron-left": `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"/>
  </svg>`,
  "chevron-right": `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"/>
  </svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
  </svg>`,
  "eye-off": `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M11.83,9L15,12.16C15,12.11 15,12.05 15,12A3,3 0 0,0 12,9C11.94,9 11.89,9 11.83,9M7.53,9.8L9.08,11.35C9.03,11.56 9,11.77 9,12A3,3 0 0,0 12,15C12.22,15 12.44,14.97 12.65,14.92L14.2,16.47C13.53,16.8 12.79,17 12,17A5,5 0 0,1 7,12C7,11.21 7.2,10.47 7.53,9.8M2,4.27L4.28,6.55L4.73,7C3.08,8.3 1.78,10 1,12C2.73,16.39 7,19.5 12,19.5C13.55,19.5 15.03,19.2 16.38,18.66L16.81,19.09L19.73,22L21,20.73L3.27,3M12,7A5,5 0 0,1 17,12C17,12.64 16.87,13.26 16.64,13.82L19.57,16.75C21.07,15.5 22.27,13.86 23,12C21.27,7.61 17,4.5 12,4.5C10.6,4.5 9.26,4.75 8,5.2L10.17,7.35C10.76,7.13 11.37,7 12,7Z"/>
  </svg>`,
  home: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
  </svg>`,
  folder: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"/>
  </svg>`,
  file: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
  </svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"/>
  </svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z"/>
  </svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20,8L12,13L4,8V6L12,11L20,6M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.11,4 20,4Z"/>
  </svg>`,
  phone: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z"/>
  </svg>`,
  unlock: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18Z"/>
  </svg>`,
  warning: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M13,14H11V10H13M13,18H11V16H13M1,21H23L12,2L1,21Z"/>
  </svg>`,
  info: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
  </svg>`,
  success: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M11,16.5L18,9.5L16.59,8.09L11,13.67L7.41,10.09L6,11.5L11,16.5Z"/>
  </svg>`,
  error: `<svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M15.59,7L12,10.59L8.41,7L7,8.41L10.59,12L7,15.59L8.41,17L12,13.41L15.59,17L17,15.59L13.41,12L17,8.41L15.59,7Z"/>
  </svg>`,
};

const Icon: React.FC<IconProps> = ({
  name,
  size = "md",
  width,
  height,
  color,
  className = "",
  onClick,
  style,
  title,
  "aria-label": ariaLabel,
}) => {
  const iconSvg = iconMap[name];

  if (!iconSvg) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  // Создаем стили с кастомными размерами или используем размерные классы
  const iconStyle: React.CSSProperties = {
    color,
    ...style,
  };

  // Если переданы кастомные размеры, используем их вместо размерных классов
  if (width !== undefined || height !== undefined) {
    iconStyle.width = width;
    iconStyle.height = height;
  }

  // Определяем CSS классы - если есть кастомные размеры, не добавляем размерный класс
  const iconClasses = [
    "icon",
    width === undefined && height === undefined ? `icon--${size}` : "",
    className,
    onClick ? "icon--clickable" : "",
  ]
    .filter(Boolean)
    .join(" ");

  // Для SVG файлов (logo, logoName) используем img
  if (
    name === "logo" ||
    name === "logoName" ||
    name === "lock" ||
    name === "award" ||
    name === "arrow" ||
    name === "footerLogo" ||
    name === "checkbox" ||
    name === "create" ||
    name === "text" ||
    name === "help" ||
    name === "history" ||
    name === "send" ||
    name === "cancel" ||
    name === "whiteLine" ||
    name === "check" ||
    name === "helpOutlined" ||
    name === "download" ||
    name === "close"
  ) {
    return (
      <img
        src={iconSvg}
        alt={title || name}
        className={iconClasses}
        style={iconStyle}
        onClick={handleClick}
        title={title}
        aria-label={ariaLabel || title || name}
      />
    );
  }

  // Для inline SVG используем dangerouslySetInnerHTML
  return (
    <span
      className={iconClasses}
      style={iconStyle}
      onClick={handleClick}
      title={title}
      aria-label={ariaLabel || title || name}
      dangerouslySetInnerHTML={{ __html: iconSvg }}
    />
  );
};

export default Icon;
