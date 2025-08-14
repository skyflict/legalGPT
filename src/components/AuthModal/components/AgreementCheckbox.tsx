import React from "react";
import Icon from "../../Icon/Icon";

interface AgreementCheckboxProps {
  isLoginMode: boolean;
  agreedTerms: boolean;
  agreedPersonal: boolean;
  onChangeTerms: (checked: boolean) => void;
  onChangePersonal: (checked: boolean) => void;
}

export const AgreementCheckbox: React.FC<AgreementCheckboxProps> = ({
  isLoginMode,
  agreedTerms,
  agreedPersonal,
  onChangeTerms,
  onChangePersonal,
}) => {
  const actionLabel = isLoginMode ? "Войти" : "Создать аккаунт";
  const termsId = isLoginMode ? "login-terms" : "register-terms";
  const personalId = isLoginMode ? "login-personal" : "register-personal";

  return (
    <div className="auth-modal__checkbox">
      <label htmlFor={termsId} className="auth-modal__checkbox-row">
        <input
          id={termsId}
          className="auth-modal__checkbox-input"
          type="checkbox"
          checked={agreedTerms}
          onChange={(e) => onChangeTerms(e.target.checked)}
        />
        <span className="auth-modal__checkbox-icon">
          {agreedTerms ? (
            <Icon name="checkbox" size="md" />
          ) : (
            <span className="auth-modal__checkbox-empty" />
          )}
        </span>
        <span className="auth-modal__checkbox-text">
          Нажимая «{actionLabel}», вы принимаете {""}
          <a href="#" className="auth-modal__link">
            пользовательское соглашение
          </a>{" "}
          и {""}
          <a href="#" className="auth-modal__link">
            политику конфиденциальности
          </a>
        </span>
      </label>

      <label htmlFor={personalId} className="auth-modal__checkbox-row">
        <input
          id={personalId}
          className="auth-modal__checkbox-input"
          type="checkbox"
          checked={agreedPersonal}
          onChange={(e) => onChangePersonal(e.target.checked)}
        />
        <span className="auth-modal__checkbox-icon">
          {agreedPersonal ? (
            <Icon name="checkbox" size="md" />
          ) : (
            <span className="auth-modal__checkbox-empty" />
          )}
        </span>
        <span className="auth-modal__checkbox-text">
          Я соглашаюсь c обработкой моих персональных данных
        </span>
      </label>
    </div>
  );
};
