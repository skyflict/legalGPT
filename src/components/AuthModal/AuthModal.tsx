import React, { useState, useEffect } from "react";
import "./AuthModal.scss";
import { useAuth } from "./hooks/useAuth";
import { useFormValidation } from "./hooks/useFormValidation";
import { LoginForm } from "./components/LoginForm";
import { RegisterForm } from "./components/RegisterForm";
import { ConfirmationForm } from "./components/ConfirmationForm";
import { AgreementCheckbox } from "./components/AgreementCheckbox";
import Icon from "../Icon/Icon";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
  initialMode?: "login" | "register";
}

type RegistrationStep = "form" | "confirmation";
type ResetStep = "none" | "email" | "code" | "new_password" | "success";

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
  const [resetStep, setResetStep] = useState<ResetStep>("none");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [agreedPersonal, setAgreedPersonal] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [agreedMarketing, setAgreedMarketing] = useState(false);

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
    setResetStep("none");
    setNewPassword("");
    setNewPasswordConfirm("");
    setAgreedPersonal(false);
    setAgreedTerms(false);
    setAgreedMarketing(false);
    auth.clearError();
    if ("clearResetFlow" in auth && typeof auth.clearResetFlow === "function") {
      auth.clearResetFlow();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoginMode && resetStep === "none") {
      if (validation.isFormValid) {
        const res = await auth.handleLogin(email, password);
        if (res.success) {
          resetForm();
        }
      }
    } else if (isLoginMode && resetStep === "email") {
      if (email) {
        const res = await auth.handleStartPasswordReset(email);
        if (res.success) setResetStep("code");
      }
    } else if (isLoginMode && resetStep === "code") {
      if (confirmationCode && /^\d+$/.test(confirmationCode)) {
        const res = await auth.handleValidateResetCode(
          parseInt(confirmationCode, 10)
        );
        if (res.success) setResetStep("new_password");
      }
    } else if (isLoginMode && resetStep === "new_password") {
      if (newPassword && newPassword === newPasswordConfirm) {
        const res = await auth.handleSetNewPassword(newPassword);
        if (res.success) setResetStep("success");
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

  const handleForgotPassword = () => {
    setResetStep("email");
    auth.clearError();
  };

  const handleBackFromReset = () => {
    if (resetStep === "code") setResetStep("email");
    else if (resetStep === "new_password") setResetStep("code");
    else setResetStep("none");
    auth.clearError();
    if (resetStep === "none") {
      if (
        "clearResetFlow" in auth &&
        typeof auth.clearResetFlow === "function"
      ) {
        auth.clearResetFlow();
      }
    }
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  if (!isOpen) return null;

  const getTitle = () => {
    if (isLoginMode) {
      if (resetStep === "email")
        return "Введите email, указанный при регистрации";
      if (resetStep === "code") return "Восстановление аккаунта";
      if (resetStep === "new_password") return "Создайте новый пароль";
      if (resetStep === "success") return "Пароль изменён";
      return "Вход в личный кабинет";
    }
    if (registrationStep === "form") return "Регистрация";
    return "Подтвердите аккаунт";
  };

  const showAgreements = !isLoginMode && registrationStep === "form";

  const isAgreementsAccepted =
    !showAgreements || (agreedPersonal && agreedTerms && agreedMarketing);

  return (
    <div className="auth-modal-overlay" onClick={handleClose}>
      <div
        className="auth-modal__container"
        onClick={(e) => e.stopPropagation()}
      >
        {isLoginMode && resetStep !== "none" && (
          <button
            className="auth-modal__back"
            onClick={handleBackFromReset}
            aria-label="Назад"
          >
            <Icon
              name="arrow"
              width={24}
              height={24}
              className="auth-modal__back-icon"
            />
          </button>
        )}
        <button className="auth-modal__close" onClick={handleClose}>
          ×
        </button>

        <div className="auth-modal__content">
          <h2 className="auth-modal__title">{getTitle()}</h2>

          <form className="auth-modal__form" onSubmit={handleSubmit}>
            {isLoginMode && resetStep === "none" && (
              <LoginForm
                email={email}
                password={password}
                isLoading={auth.isLoading}
                isFormValid={validation.isFormValid && isAgreementsAccepted}
                errors={auth.fieldErrors}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onSubmit={handleSubmit}
                onForgotPassword={handleForgotPassword}
              />
            )}

            {isLoginMode && resetStep === "email" && (
              <>
                <input
                  type="email"
                  placeholder="Адрес электронной почты"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-modal__input"
                  disabled={auth.isLoading}
                />

                <button
                  type="submit"
                  className="auth-modal__submit-btn"
                  disabled={!email || auth.isLoading}
                  onClick={handleSubmit}
                >
                  {auth.isLoading ? "Отправка..." : "Далее"}
                </button>
              </>
            )}

            {isLoginMode && resetStep === "code" && (
              <>
                <p className="auth-modal__confirmation-text">
                  Введите код, отправленный на ваш email, который вы указали
                  ранее
                </p>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Код подтверждения"
                  value={confirmationCode}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, "");
                    setConfirmationCode(digitsOnly);
                  }}
                  className="auth-modal__input"
                  disabled={auth.isLoading}
                />

                <button
                  type="submit"
                  className="auth-modal__submit-btn"
                  disabled={!confirmationCode || auth.isLoading}
                  onClick={handleSubmit}
                >
                  {auth.isLoading ? "Проверка..." : "Продолжить"}
                </button>
              </>
            )}

            {isLoginMode && resetStep === "new_password" && (
              <>
                <div className="auth-modal__field">
                  <input
                    type="password"
                    placeholder="Новый пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className={`auth-modal__input ${auth.fieldErrors.password ? "auth-modal__input--error" : ""}`}
                    disabled={auth.isLoading}
                  />
                  {auth.fieldErrors.password && (
                    <div className="auth-modal__field-error">
                      {auth.fieldErrors.password}
                    </div>
                  )}
                </div>

                <div className="auth-modal__field">
                  <input
                    type="password"
                    placeholder="Повторите новый пароль"
                    value={newPasswordConfirm}
                    onChange={(e) => setNewPasswordConfirm(e.target.value)}
                    className={`auth-modal__input ${
                      newPassword && newPasswordConfirm && newPassword !== newPasswordConfirm
                        ? "auth-modal__input--error"
                        : ""
                    }`}
                    disabled={auth.isLoading}
                  />
                  {newPassword &&
                    newPasswordConfirm &&
                    newPassword !== newPasswordConfirm && (
                      <div className="auth-modal__field-error">Пароли не совпадают</div>
                    )}
                </div>

                <button
                  type="submit"
                  className="auth-modal__submit-btn"
                  disabled={
                    !newPassword ||
                    !newPasswordConfirm ||
                    newPassword !== newPasswordConfirm ||
                    auth.isLoading
                  }
                  onClick={handleSubmit}
                >
                  {auth.isLoading ? "Сохранение..." : "Сохранить"}
                </button>
              </>
            )}

            {isLoginMode && resetStep === "success" && (
              <>
                <p className="auth-modal__confirmation-text">
                  Пароль успешно изменен, войдите с новыми данными
                </p>
                <button
                  type="button"
                  className="auth-modal__submit-btn"
                  onClick={() => setResetStep("none")}
                >
                  Перейти ко входу
                </button>
              </>
            )}

            {!isLoginMode && registrationStep === "form" && (
              <RegisterForm
                email={email}
                password={password}
                confirmPassword={confirmPassword}
                isLoading={auth.isLoading}
                isFormValid={validation.isFormValid && isAgreementsAccepted}
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

            {isLoginMode && resetStep === "none" && (
              <button
                type="button"
                className="auth-modal__secondary-btn"
                onClick={handleToggleMode}
                disabled={auth.isLoading}
              >
                {"Создать аккаунт"}
              </button>
            )}

            {isLoginMode && resetStep === "none" && (
              <button
                type="button"
                className="auth-modal__link"
                onClick={handleForgotPassword}
                disabled={auth.isLoading}
                style={{
                  alignSelf: "center",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  textDecoration: "none",
                  marginTop: 8,
                }}
              >
                Забыли пароль?
              </button>
            )}

            {showAgreements && (
              <AgreementCheckbox
                isLoginMode={isLoginMode}
                agreedPersonal={agreedPersonal}
                agreedTerms={agreedTerms}
                agreedMarketing={agreedMarketing}
                onChangePersonal={setAgreedPersonal}
                onChangeTerms={setAgreedTerms}
                onChangeMarketing={setAgreedMarketing}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
