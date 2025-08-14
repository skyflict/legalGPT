import React from "react";

interface LoginFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  isFormValid: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  isLoading,
  isFormValid,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword: _onForgotPassword,
}) => {
  return (
    <>
      <input
        type="email"
        placeholder="Адрес электронной почты"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        className="auth-modal__input"
        disabled={isLoading}
      />

      <input
        type="password"
        placeholder="Пароль"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        className="auth-modal__input"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="auth-modal__submit-btn"
        disabled={!isFormValid || isLoading}
        onClick={onSubmit}
      >
        {isLoading ? "Вход..." : "Войти"}
      </button>
    </>
  );
};
