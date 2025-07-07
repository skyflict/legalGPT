import React, { useState, useEffect } from "react";
import "./AuthModal.scss";
import { useAuth } from "./hooks/useAuth";
import { useFormValidation } from "./hooks/useFormValidation";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { ConfirmationForm } from "./components/ConfirmationForm";
import { AgreementCheckbox } from "./components/AgreementCheckbox";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  initialMode?: "login" | "register";
}

type RegistrationStep = "form" | "confirmation";

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  initialMode = "login",
}) => {
  const [isLoginMode, setIsLoginMode] = useState(initialMode === "login");
  const [registrationStep, setRegistrationStep] =
    useState<RegistrationStep>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmationCode, setConfirmationCode] = useState("");

  const auth = useAuth({ onLogin, onClose });
  const validation = useFormValidation({
    email,
    password,
    confirmPassword,
    isLoginMode,
  });

  useEffect(() => {
    setIsLoginMode(initialMode === "login");
    setRegistrationStep("form");
  }, [initialMode]);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setConfirmationCode("");
    setRegistrationStep("form");
    auth.clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoginMode) {
      if (validation.isFormValid) {
        await auth.handleLogin(email, password);
        resetForm();
      }
    } else {
      if (registrationStep === "form" && validation.isFormValid) {
        const result = await auth.handleRegister(email, password);
        if (result.success) {
          setRegistrationStep("confirmation");
        }
      } else if (registrationStep === "confirmation" && confirmationCode) {
        const result = await auth.handleConfirmCode(
          email,
          password,
          confirmationCode
        );
        if (result.success) {
          resetForm();
        }
      }
    }
  };

  const handleToggleMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  const handleGoBackToRegistration = () => {
    setRegistrationStep("form");
    setConfirmationCode("");
    auth.clearError();
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  const getTitle = () => {
    if (isLoginMode) return "Вход в личный кабинет";
    if (registrationStep === "form") return "Регистрация";
    return "Подтверждение регистрации";
  };

  const showModeToggle = isLoginMode || registrationStep === "form";

  const showAgreements = isLoginMode || registrationStep === "form";

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div
        className="auth-modal__container"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="auth-modal__close" onClick={handleClose}>
          ×
        </button>

        <div className="auth-modal__content">
          <h2 className="auth-modal__title">{getTitle()}</h2>

          {auth.error && <div className="auth-modal__error">{auth.error}</div>}

          <form className="auth-modal__form" onSubmit={handleSubmit}>
            {isLoginMode && (
              <LoginForm
                email={email}
                password={password}
                isLoading={auth.isLoading}
                isFormValid={validation.isFormValid}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={handleSubmit}
              />
            )}

            {!isLoginMode && registrationStep === "form" && (
              <RegisterForm
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                isLoading={auth.isLoading}
                isFormValid={validation.isFormValid}
                errors={validation.errors}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onConfirmPasswordChange={setConfirmPassword}
                onSubmit={handleSubmit}
              />
            )}

            {!isLoginMode && registrationStep === "confirmation" && (
              <ConfirmationForm
                email={email}
                confirmationCode={confirmationCode}
                isLoading={auth.isLoading}
                onConfirmationCodeChange={setConfirmationCode}
                onSubmit={handleSubmit}
                onGoBack={handleGoBackToRegistration}
              />
            )}

            {showModeToggle && (
              <button
                type="button"
                className="auth-modal__secondary-btn"
                onClick={handleToggleMode}
                disabled={auth.isLoading}
              >
                {isLoginMode ? "Создать аккаунт" : "Уже есть аккаунт? Войти"}
              </button>
            )}

            {showAgreements && <AgreementCheckbox isLoginMode={isLoginMode} />}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
