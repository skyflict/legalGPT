import React from "react";
import Icon from "../../Icon/Icon";

interface AgreementCheckboxProps {
  isLoginMode: boolean;
}

export const AgreementCheckbox: React.FC<AgreementCheckboxProps> = ({
  isLoginMode,
}) => {
  return (
    <label className="auth-modal__checkbox">
      <Icon name="checkbox" size="sm" />
      <span className="auth-modal__checkbox-text">
        Нажимая «{isLoginMode ? "Войти" : "Зарегистрироваться"}», вы принимаете{" "}
        <a href="#" className="auth-modal__link">
          пользовательское соглашение
        </a>{" "}
        и{" "}
        <a href="#" className="auth-modal__link">
          политику конфиденциальности
        </a>
      </span>
      <div>
        <Icon name="checkbox" size="sm" />
        <span className="auth-modal__checkbox-text">
          Я соглашаюсь c обработкой моих персональных данных.
        </span>
      </div>
    </label>
  );
};
