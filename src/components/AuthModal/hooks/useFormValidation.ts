import { useMemo } from "react";

interface UseFormValidationProps {
  email: string;
  password: string;
  confirmPassword: string;
  isLoginMode: boolean;
}

interface ValidationErrors {
  password?: string;
  confirmPassword?: string;
}

export const useFormValidation = ({
  email,
  password,
  confirmPassword,
  isLoginMode,
}: UseFormValidationProps) => {
  const validation = useMemo(() => {
    const errors: ValidationErrors = {};

    // Валидация пароля
    const isPasswordValid = password.length >= 8;
    const doPasswordsMatch = password === confirmPassword;

    // Добавляем ошибки только если пользователь начал вводить
    if (password && !isPasswordValid) {
      errors.password = "Пароль должен содержать не менее 8 символов";
    }

    if (!isLoginMode && confirmPassword && !doPasswordsMatch) {
      errors.confirmPassword = "Пароли не совпадают";
    }

    // Определяем общую валидность формы
    const isFormValid = isLoginMode
      ? email && password
      : email &&
        password &&
        confirmPassword &&
        isPasswordValid &&
        doPasswordsMatch;

    return {
      errors,
      isPasswordValid,
      doPasswordsMatch,
      isFormValid: Boolean(isFormValid),
    };
  }, [email, password, confirmPassword, isLoginMode]);

  return validation;
};
