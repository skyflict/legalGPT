import { useState } from "react";
import "./AuthModal.css";
import Icon from "../Icon/Icon";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
}

const AuthModal = ({ isOpen, onClose, onLogin }: AuthModalProps) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAccepted, setIsAccepted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
      onClose();
      // Очищаем форму
      setEmail("");
      setPassword("");
      setIsAccepted(false);
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setEmail("");
    setPassword("");
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
            Войти
            <br />
            или зарегистрироваться
          </h2>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Телефон или почта"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              required
            />

            <input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />

            <button type="submit" className="auth-submit-btn">
              Войти
            </button>

            <button
              type="button"
              className="auth-register-btn"
              onClick={toggleMode}
            >
              Создать аккаунт
            </button>

            <label className="auth-checkbox">
              <Icon name="checkbox" size="sm" />
              <span className="checkbox-text">
                Нажимая «Войти», вы принимаете{" "}
                <a href="#" className="auth-link">
                  пользовательское соглашение
                </a>{" "}
                и{" "}
                <a href="#" className="auth-link">
                  политику конфиденциальности
                </a>
              </span>
            </label>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
