import { useState } from "react";
import { API_ENDPOINTS, apiRequest } from "../../../utils/api";

interface UseAuthProps {
  onLogin: (email: string, password: string) => void;
  onClose: () => void;
}

interface AuthResponse {
  token: string;
}

export const useAuth = ({ onLogin, onClose }: UseAuthProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [tempToken, setTempToken] = useState("");
  const [resetToken, setResetToken] = useState("");

  const handleRegister = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при регистрации");
      }

      const data: AuthResponse = await response.json();
      setTempToken(data.token);
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Произошла ошибка";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const userData = await apiRequest(API_ENDPOINTS.USER);
      return userData;
    } catch (err) {
      return null;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(API_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        // Пытаемся распарсить тело ошибки от бэкенда, чтобы отдать понятное сообщение
        let friendlyError = "Неверный email или пароль";
        try {
          const errorBody = (await response.clone().json()) as {
            code?: number;
            message?: string;
          };
          if (
            errorBody?.code === 16 ||
            (typeof errorBody?.message === "string" &&
              /Invalid Password/i.test(errorBody.message))
          ) {
            friendlyError = "Неверный пароль";
          }
        } catch {
          // Если пришёл не-JSON, пробуем текст
          try {
            const text = await response.text();
            if (/Invalid Password/i.test(text)) {
              friendlyError = "Неверный пароль";
            }
          } catch {
            // игнорируем
          }
        }
        throw new Error(friendlyError);
      }

      const data: AuthResponse = await response.json();
      localStorage.setItem("authToken", data.token);

      await fetchUserData();

      onLogin(email, password);
      onClose();
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Произошла ошибка при входе";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCode = async (
    email: string,
    password: string,
    confirmationCode: string
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER_CONFIRM, {
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

      const data: AuthResponse = await response.json();
      localStorage.setItem("authToken", data.token);

      await fetchUserData();

      onLogin(email, password);
      onClose();
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Произошла ошибка";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError("");

  // --- Password reset flow ---
  const handleStartPasswordReset = async (email: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при отправке кода на почту");
      }
      const data = (await response.json()) as { token?: string };
      if (data?.token) {
        setResetToken(data.token);
      }
      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Произошла ошибка";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateResetCode = async (code: number) => {
    setIsLoading(true);
    setError("");

    try {
      if (!resetToken) {
        throw new Error("Отсутствует токен восстановления");
      }
      const response = await fetch(API_ENDPOINTS.RESET_PASSWORD_VALIDATE_CODE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resetToken}`,
        },
        body: JSON.stringify({ code }),
      });

      if (!response.ok) {
        throw new Error("Неверный код подтверждения");
      }

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Произошла ошибка";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetNewPassword = async (password: string) => {
    setIsLoading(true);
    setError("");

    try {
      if (!resetToken) {
        throw new Error("Отсутствует токен восстановления");
      }
      const response = await fetch(API_ENDPOINTS.SET_PASSWORD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resetToken}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при смене пароля");
      }

      return { success: true };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Произошла ошибка";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const clearResetFlow = () => {
    setResetToken("");
  };

  return {
    isLoading,
    error,
    tempToken,
    handleRegister,
    handleLogin,
    handleConfirmCode,
    handleStartPasswordReset,
    handleValidateResetCode,
    handleSetNewPassword,
    clearResetFlow,
    clearError,
  };
};
