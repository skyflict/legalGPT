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
  onForgotPassword,
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

      {onForgotPassword && (
        <button
          type="button"
          className="auth-modal__link"
          onClick={onForgotPassword}
          disabled={isLoading}
          style={{
            alignSelf: "flex-start",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          Забыли пароль?
        </button>
      )}

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
