import React from "react";
import "./Header.scss";
import { Logo } from "./components/Logo";
import { UserDropdown } from "./components/UserDropdown";
import { AuthButtons } from "./components/AuthButtons";

interface HeaderProps {
  onOpenAuthModal?: () => void;
  onOpenRegisterModal?: () => void;
  isLoggedIn?: boolean;
  userEmail?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAuthModal,
  onOpenRegisterModal,
  isLoggedIn = false,
  userEmail,
  onLogout,
}) => {
  return (
    <header className="header">
      <div className="container">
        <div className="header__content">
          <Logo />

          <div className="header__actions">
            {isLoggedIn ? (
              <UserDropdown userEmail={userEmail} onLogout={onLogout} />
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
