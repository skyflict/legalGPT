import React from "react";

interface ConfirmationFormProps {
  email: string;
  confirmationCode: string;
  isLoading: boolean;
  onConfirmationCodeChange: (code: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onGoBack: () => void;
}

export const ConfirmationForm: React.FC<ConfirmationFormProps> = ({
  email,
  confirmationCode,
  isLoading,
  onConfirmationCodeChange,
  onSubmit,
  onGoBack,
}) => {
  return (
    <>
      <p className="auth-modal__confirmation-text">
        Введите код, отправленный на ваш email, который вы указали ранее
      </p>

      <input
        type="text"
        placeholder="Код подтверждения"
        value={confirmationCode}
        onChange={(e) => onConfirmationCodeChange(e.target.value)}
        className="auth-modal__input"
        disabled={isLoading}
      />

      <button
        type="button"
        className="auth-modal__secondary-btn"
        onClick={onGoBack}
        disabled={isLoading}
      >
        Назад
      </button>

      <button
        type="submit"
        className="auth-modal__submit-btn"
        disabled={!confirmationCode || isLoading}
        onClick={onSubmit}
      >
        {isLoading ? "Проверка..." : "Продолжить"}
      </button>
    </>
  );
};
