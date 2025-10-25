import React from "react";

interface FieldErrors {
  email?: string;
  password?: string;
  general?: string;
}

interface LoginFormProps {
  email: string;
  password: string;
  isLoading: boolean;
  isFormValid: boolean;
  errors?: FieldErrors;
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
  errors = {},
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
}) => {
  return (
    <>
      <div className="auth-modal__field">
        <input
          type="email"
          placeholder="Адрес электронной почты"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className={`auth-modal__input ${errors.email ? "auth-modal__input--error" : ""}`}
          disabled={isLoading}
        />
        {errors.email && (
          <div className="auth-modal__field-error">{errors.email}</div>
        )}
      </div>

      <div className="auth-modal__field">
        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className={`auth-modal__input ${errors.password || errors.general ? "auth-modal__input--error" : ""}`}
          disabled={isLoading}
        />
        {(errors.password || errors.general) && (
          <div className="auth-modal__field-error-row">
            <span className="auth-modal__field-error">
              {errors.password || errors.general}
            </span>
            {onForgotPassword && (
              <button
                type="button"
                className="auth-modal__field-link"
                onClick={onForgotPassword}
                disabled={isLoading}
              >
                Забыли пароль?
              </button>
            )}
          </div>
        )}
      </div>

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
