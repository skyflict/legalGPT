import React from "react";
import Icon from "../../Icon";
import { useDropdown } from "../hooks/useDropdown";

interface UserDropdownProps {
  userEmail?: string;
  onLogout?: () => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  userEmail,
  onLogout,
}) => {
  const { isDropdownOpen, dropdownRef, handleDropdownToggle } = useDropdown();

  const formatUserEmail = (email: string) => {
    return email || "Пользователь";
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="user-dropdown" ref={dropdownRef}>
      <button
        className={`user-dropdown__trigger ${isDropdownOpen ? "open" : ""}`}
        onClick={handleDropdownToggle}
      >
        <span className="user-email">{formatUserEmail(userEmail || "")}</span>
        <span className={`dropdown__arrow ${isDropdownOpen ? "open" : ""}`}>
          <Icon name="arrow" />
        </span>
      </button>
      {isDropdownOpen && (
        <div className="user-dropdown__menu">
          <button className="dropdown__item" onClick={handleLogout}>
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};
