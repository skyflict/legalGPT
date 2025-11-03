import React, { useState, useEffect } from "react";
import "./Header.scss";
import { Logo } from "./components/Logo";
import { UserDropdown } from "./components/UserDropdown";
import { AuthButtons } from "./components/AuthButtons";
import { apiRequest, API_ENDPOINTS } from "../../utils/api";
import menuIcon from "../../assets/menu.svg";

interface HeaderProps {
  onOpenAuthModal?: () => void;
  onOpenRegisterModal?: () => void;
  isLoggedIn?: boolean;
  userEmail?: string;
  onLogout?: () => void;
  onToggleSidebar?: () => void;
}

interface UserData {
  id: string;
  email: string;
  role: string;
  balance: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuthModal,
  onOpenRegisterModal,
  isLoggedIn = false,
  userEmail,
  onLogout,
  onToggleSidebar,
}) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUserData = async () => {
        try {
          const data = await apiRequest(API_ENDPOINTS.USER);
          setUserData(data);
        } catch (error) {
          console.error("Ошибка при получении данных пользователя:", error);
        }
      };

      fetchUserData();
    }
  }, [isLoggedIn]);

  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <div className="header__left">
            {isLoggedIn && (
              <button
                className="sidebar-toggle"
                onClick={onToggleSidebar}
                aria-label="Переключить сайдбар"
              >
                <img src={menuIcon} alt="Меню" width="24" height="24" />
              </button>
            )}
            <Logo />
            <div className="header__logo-text">
              ваш партнер в мире <br /> юридических услуг
            </div>
          </div>

          <div className="header__actions">
            {isLoggedIn ? (
              <>
                {userData && (
                  <div className="user-balance">
                    <button className="user-dropdown__trigger">
                      <span
                        className="user-email"
                        style={{ cursor: "default" }}
                      >
                        Баланс: {userData.balance} Ю
                      </span>
                      {/* <span className="dropdown__arrow">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M4 6L8 10L12 6"
                            stroke="white"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span> */}
                    </button>
                  </div>
                )}
                <UserDropdown userEmail={userEmail} onLogout={onLogout} />
              </>
            ) : (
              <AuthButtons
                onOpenAuthModal={onOpenAuthModal}
                onOpenRegisterModal={onOpenRegisterModal}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
