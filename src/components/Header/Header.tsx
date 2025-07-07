import { useState, useRef, useEffect } from "react";
import Icon from "../Icon";
import Button from "../Button";
import "./Header.css";

interface HeaderProps {
  onOpenAuthModal?: () => void;
  onOpenRegisterModal?: () => void;
  isLoggedIn?: boolean;
  userEmail?: string;
  onLogout?: () => void;
}

const Header = ({
  onOpenAuthModal,
  onOpenRegisterModal,
  isLoggedIn = false,
  userEmail,
  onLogout,
}: HeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Функция для отображения email пользователя
  const formatUserEmail = (email: string) => {
    return email || "Пользователь";
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    if (onLogout) {
      onLogout();
    }
  };

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);
  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <Icon name="logoName" width={280} height={44} />
          </div>

          <div className="header-actions">
            {isLoggedIn ? (
              <div className="user-dropdown" ref={dropdownRef}>
                <button
                  className={`user-dropdown-trigger ${
                    isDropdownOpen ? "open" : ""
                  }`}
                  onClick={handleDropdownToggle}
                >
                  <span className="user-email">
                    {formatUserEmail(userEmail || "")}
                  </span>
                  <span
                    className={`dropdown-arrow ${isDropdownOpen ? "open" : ""}`}
                  >
                    <Icon name="arrow" />
                  </span>
                </button>
                {isDropdownOpen && (
                  <div className="user-dropdown-menu">
                    <button className="dropdown-item" onClick={handleLogout}>
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  variant="custom"
                  width={91}
                  height={48}
                  textColor="#1B1B1B"
                  backgroundColor="#1A1A1A1A"
                  borderRadius={16}
                  noBorder
                  onClick={onOpenAuthModal}
                  className="header-btn"
                >
                  Вход
                </Button>

                <Button
                  variant="custom"
                  width={160}
                  height={48}
                  textColor="#fff"
                  backgroundColor="#1A1A1A"
                  borderRadius={16}
                  noBorder
                  onClick={onOpenRegisterModal}
                  className="header-btn"
                >
                  Регистрация
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
