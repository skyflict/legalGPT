import React from "react";

interface ValidationErrors {
  password?: string;
  confirmPassword?: string;
}

interface RegisterFormProps {
  email: string;
  password: string;
  confirmPassword: string;
  isLoading: boolean;
  isFormValid: boolean;
  errors: ValidationErrors;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  email,
  password,
  confirmPassword,
  isLoading,
  isFormValid,
  errors,
  onEmailChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onSubmit,
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

      <input
        type="password"
        placeholder="Повторите пароль"
        value={confirmPassword}
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        className="auth-modal__input"
        disabled={isLoading}
      />

      {/* Показываем ошибки валидации */}
      {errors.password && (
        <div className="auth-modal__error">{errors.password}</div>
      )}

      {errors.confirmPassword && (
        <div className="auth-modal__error">{errors.confirmPassword}</div>
      )}

      <button
        type="submit"
        className="auth-modal__submit-btn"
        disabled={!isFormValid || isLoading}
        onClick={onSubmit}
      >
        {isLoading ? "Регистрация..." : "Зарегистрироваться"}
      </button>
    </>
  );
};
