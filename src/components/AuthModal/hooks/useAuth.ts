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
      console.error("Ошибка при получении данных пользователя:", err);
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
        throw new Error("Неверный email или пароль");
      }

      const data: AuthResponse = await response.json();
      localStorage.setItem("authToken", data.token);

      // Получаем данные пользователя после успешной авторизации
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

      // Получаем данные пользователя после успешного подтверждения регистрации
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

  return {
    isLoading,
    error,
    tempToken,
    handleRegister,
    handleLogin,
    handleConfirmCode,
    clearError,
  };
};
