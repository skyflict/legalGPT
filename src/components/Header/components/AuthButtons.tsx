import React from "react";
import Button from "../../Button";

interface AuthButtonsProps {
  onOpenAuthModal?: () => void;
  onOpenRegisterModal?: () => void;
}

export const AuthButtons: React.FC<AuthButtonsProps> = ({
  onOpenAuthModal,
  onOpenRegisterModal,
}) => {
  return (
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
        className="header__btn"
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
        className="header__btn"
      >
        Регистрация
      </Button>
    </>
  );
};
