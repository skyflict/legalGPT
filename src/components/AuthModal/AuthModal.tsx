import { useState, useEffect } from "react";
import "./AuthModal.css";
import Icon from "../Icon/Icon";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  initialMode?: "login" | "register";
}

// Типы для этапов регистрации
type RegistrationStep = "form" | "confirmation";

const AuthModal = ({
  isOpen,
  onClose,
  onLogin,
  initialMode = "login",
}: AuthModalProps) => {
  const [isLoginMode, setIsLoginMode] = useState(initialMode === "login");
  const [registrationStep, setRegistrationStep] =
    useState<RegistrationStep>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");
  const [_isAccepted, setIsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempToken, setTempToken] = useState("");

  // Обновляем режим при изменении initialMode
  useEffect(() => {
    setIsLoginMode(initialMode === "login");
    setRegistrationStep("form");
  }, [initialMode]);

  if (!isOpen) return null;

  // Валидация пароля
  const isPasswordValid = password.length >= 6;
  const doPasswordsMatch = password === confirmPassword;
  const isFormValid = isLoginMode
    ? email && password
    : email &&
      password &&
      confirmPassword &&
      isPasswordValid &&
      doPasswordsMatch;

  // Функция для регистрации
  const handleRegister = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при регистрации");
      }

      const data = await response.json();
      setTempToken(data.token);
      setRegistrationStep("confirmation");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для входа
  const handleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error("Неверный email или пароль");
      }

      const data = await response.json();
      // Сохраняем токен
      localStorage.setItem("authToken", data.token);

      // Закрываем модалку и очищаем форму
      onClose();
      resetForm();

      // Вызываем callback для обновления состояния приложения
      onLogin(email, password);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Произошла ошибка при входе"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для подтверждения кода
  const handleConfirmCode = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/register/confirm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tempToken}`,
        },
        body: JSON.stringify({
          confirmation_code: parseInt(confirmationCode),
        }),
      });

      if (!response.ok) {
        throw new Error("Неверный код подтверждения");
      }

      const data = await response.json();
      // Сохраняем финальный токен
      localStorage.setItem("authToken", data.token);

      // Закрываем модалку и очищаем форму
      onClose();
      resetForm();

      // Можно вызвать callback для обновления состояния приложения
      onLogin(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setConfirmationCode("");
    setIsAccepted(false);
    setError("");
    setTempToken("");
    setRegistrationStep("form");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoginMode) {
      if (isFormValid) {
        handleLogin();
      }
    } else {
      // Режим регистрации
      if (registrationStep === "form" && isFormValid) {
        handleRegister();
      } else if (registrationStep === "confirmation" && confirmationCode) {
        handleConfirmCode();
      }
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  const goBackToRegistration = () => {
    setRegistrationStep("form");
    setConfirmationCode("");
    setError("");
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="auth-modal-content">
          <h2 className="auth-title">
            {isLoginMode ? (
              <>Вход в личный кабинет</>
            ) : registrationStep === "form" ? (
              "Регистрация"
            ) : (
              "Подтверждение регистрации"
            )}
          </h2>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            {/* Форма входа или регистрации */}
            {(isLoginMode || registrationStep === "form") && (
              <>
                <input
                  type="email"
                  placeholder="Адрес электронной почты"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  disabled={isLoading}
                />

                <input
                  type="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  disabled={isLoading}
                />

                {!isLoginMode && (
                  <>
                    <input
                      type="password"
                      placeholder="Повторите пароль"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="auth-input"
                      disabled={isLoading}
                    />

                    {/* Показываем ошибки валидации только если пользователь начал вводить */}
                    {password && !isPasswordValid && (
                      <div className="auth-error">
                        Пароль должен содержать минимум 6 символов
                      </div>
                    )}

                    {confirmPassword && !doPasswordsMatch && (
                      <div className="auth-error">Пароли не совпадают</div>
                    )}
                  </>
                )}
              </>
            )}

            {/* Форма подтверждения кода */}
            {!isLoginMode && registrationStep === "confirmation" && (
              <>
                <p className="confirmation-text">
                  На адрес {email} отправлен код подтверждения. Введите его
                  ниже:
                </p>
                <input
                  type="text"
                  placeholder="Код подтверждения"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="auth-input"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="auth-register-btn"
                  onClick={goBackToRegistration}
                  disabled={isLoading}
                >
                  Назад
                </button>
              </>
            )}

            {/* Кнопки отправки */}
            {isLoginMode && (
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? "Вход..." : "Войти"}
              </button>
            )}

            {!isLoginMode && registrationStep === "form" && (
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? "Регистрация..." : "Зарегистрироваться"}
              </button>
            )}

            {!isLoginMode && registrationStep === "confirmation" && (
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={!confirmationCode || isLoading}
              >
                {isLoading ? "Подтверждение..." : "Подтвердить"}
              </button>
            )}

            {/* Переключение между входом и регистрацией (только на первом этапе) */}
            {(isLoginMode || registrationStep === "form") && (
              <button
                type="button"
                className="auth-register-btn"
                onClick={toggleMode}
                disabled={isLoading}
              >
                {isLoginMode ? "Создать аккаунт" : "Уже есть аккаунт? Войти"}
              </button>
            )}

            {/* Соглашения (только на этапе формы) */}
            {(isLoginMode || registrationStep === "form") && (
              <label className="auth-checkbox">
                <Icon name="checkbox" size="sm" />
                <span className="checkbox-text">
                  Нажимая «{isLoginMode ? "Войти" : "Зарегистрироваться"}», вы
                  принимаете{" "}
                  <a href="#" className="auth-link">
                    пользовательское соглашение
                  </a>{" "}
                  и{" "}
                  <a href="#" className="auth-link">
                    политику конфиденциальности
                  </a>
                </span>
                <div>
                  <Icon name="checkbox" size="sm" />
                  <span className="checkbox-text">
                    Я соглашаюсь c обработкой моих персональных данных.
                  </span>
                </div>
              </label>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
