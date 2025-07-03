import { useState, useEffect } from "react";
import "./AuthModal.css";
import Icon from "../Icon/Icon";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  initialMode?: "login" | "register";
}

const AuthModal = ({
  isOpen,
  onClose,
  onLogin,
  initialMode = "login",
}: AuthModalProps) => {
  const [isLoginMode, setIsLoginMode] = useState(initialMode === "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [_isAccepted, setIsAccepted] = useState(false);

  // Обновляем режим при изменении initialMode
  useEffect(() => {
    setIsLoginMode(initialMode === "login");
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      onLogin(email, password);
      onClose();
      // Очищаем форму
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setIsAccepted(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setIsAccepted(false);
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>

        <div className="auth-modal-content">
          <h2 className="auth-title">
            {isLoginMode ? <>Вход в личный кабинет</> : "Регистрация"}
          </h2>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Телефон или почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
            />

            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
            />

            {!isLoginMode && (
              <>
                <input
                  type="password"
                  placeholder="Повторите пароль"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="auth-input"
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

            {isLoginMode && (
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={!isFormValid}
              >
                Войти
              </button>
            )}

            {!isLoginMode && (
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={!isFormValid}
              >
                Зарегистрироваться
              </button>
            )}

            <button
              type="button"
              className="auth-register-btn"
              onClick={toggleMode}
            >
              {isLoginMode ? "Создать аккаунт" : "Уже есть аккаунт? Войти"}
            </button>

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
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
