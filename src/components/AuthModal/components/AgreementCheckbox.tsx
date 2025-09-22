import React from "react";
import Icon from "../../Icon/Icon";

interface AgreementCheckboxProps {
  isLoginMode: boolean;
  agreedPersonal: boolean;
  agreedTerms: boolean;
  agreedMarketing: boolean;
  onChangePersonal: (checked: boolean) => void;
  onChangeTerms: (checked: boolean) => void;
  onChangeMarketing: (checked: boolean) => void;
}

export const AgreementCheckbox: React.FC<AgreementCheckboxProps> = ({
  isLoginMode,
  agreedPersonal,
  agreedTerms,
  agreedMarketing,
  onChangePersonal,
  onChangeTerms,
  onChangeMarketing,
}) => {
  const personalId = isLoginMode ? "login-personal" : "register-personal";
  const termsId = isLoginMode ? "login-terms" : "register-terms";
  const marketingId = isLoginMode ? "login-marketing" : "register-marketing";

  return (
    <div className="auth-modal__checkbox">
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
          Я даю {""}
          <a href="#" className="auth-modal__link">
            согласие
          </a>{" "}
          {""}
          на обработку персональных данных и получение информационных сообщений
          о Сервисе в соответствии с {""}
          <a href="#" className="auth-modal__link">
            Политикой
          </a>
          .
        </span>
      </label>

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
          Я соглашаюсь с условиями использования сервиса, содержащимися в {""}
          <a href="#" className="auth-modal__link">
            Пользовательском соглашении
          </a>
          .
        </span>
      </label>

      <label htmlFor={marketingId} className="auth-modal__checkbox-row">
        <input
          id={marketingId}
          className="auth-modal__checkbox-input"
          type="checkbox"
          checked={agreedMarketing}
          onChange={(e) => onChangeMarketing(e.target.checked)}
        />
        <span className="auth-modal__checkbox-icon">
          {agreedMarketing ? (
            <Icon name="checkbox" size="md" />
          ) : (
            <span className="auth-modal__checkbox-empty" />
          )}
        </span>
        <span className="auth-modal__checkbox-text">
          Я даю согласие на получение рекламных сообщений от компании в
          соответствии с {""}
          <a href="#" className="auth-modal__link">
            Правилами
          </a>
          .
        </span>
      </label>
    </div>
  );
};
