import { useState } from "react";

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
      const response = await fetch("/api/v1/register", {
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

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/v1/login", {
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
      const response = await fetch("/api/v1/register/confirm", {
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
