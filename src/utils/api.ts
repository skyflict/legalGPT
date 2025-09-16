// Конфигурация API
const getApiBaseUrl = (): string => {
  const customUrl = import.meta.env.VITE_API_BASE_URL;
  if (customUrl) {
    return customUrl;
  }

  // Дефолтный URL API
  return "https://api.neuroyurist.ru";
};

export const createApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};

// Утилита для получения информации о текущей конфигурации API
export const getApiInfo = () => {
  const baseUrl = getApiBaseUrl();

  return {
    baseUrl,
    sampleUrl: createApiUrl("v1/user"),
  };
};

export const API_ENDPOINTS = {
  LOGIN: createApiUrl("v1/login"),
  REGISTER: createApiUrl("v1/register"),
  REGISTER_CONFIRM: createApiUrl("v1/register/confirm"),
  LOGOUT: createApiUrl("v1/logout"),
  USER: createApiUrl("v1/user"),
  DOCUMENT_CREATE: createApiUrl("v1/document"),
  DOCUMENT_LIST: createApiUrl("v1/document"),
  DOCUMENT_GET: (id: string) => createApiUrl(`v1/document/${id}`),
  DOCUMENT_UPDATE: (id: string) => createApiUrl(`v1/document/${id}`),
  ADMIN_USERS: createApiUrl("v1/admin/users"),
  ADMIN_USER_BALANCE: (userId: string) =>
    createApiUrl(`v1/admin/users/${userId}/balance`),

  RESET_PASSWORD: createApiUrl("v1/reset-password"),
  RESET_PASSWORD_VALIDATE_CODE: createApiUrl("v1/reset-password/validate-code"),
  SET_PASSWORD: createApiUrl("v1/set-password"),
} as const;

export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    try {
      const tokenInfo = parseJWTToken(token);

      if (tokenInfo.isExpired) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userEmail");

        try {
          await fetch(API_ENDPOINTS.LOGOUT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (logoutError) {
          // Silent fail
        }

        window.location.reload();
        throw new Error("Token expired, user logged out");
      }
    } catch (parseError) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
      window.location.reload();
      throw new Error("Invalid token, user logged out");
    }
  }

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const parseJWTToken = (token: string) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT token format");
    }

    const payload = parts[1];
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decodedPayload = atob(
      paddedPayload.replace(/-/g, "+").replace(/_/g, "/")
    );
    const parsedPayload = JSON.parse(decodedPayload);

    const now = Math.floor(Date.now() / 1000);
    const exp = parsedPayload.exp;
    const iat = parsedPayload.iat;

    const expirationDate = new Date(exp * 1000);
    const issuedDate = new Date(iat * 1000);
    const timeUntilExpiration = exp - now;
    const isExpired = timeUntilExpiration <= 0;

    const formatTimeRemaining = (seconds: number) => {
      if (seconds <= 0) return "Expired";

      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds % 86400) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;

      const parts = [];
      if (days > 0) parts.push(`${days}d`);
      if (hours > 0) parts.push(`${hours}h`);
      if (minutes > 0) parts.push(`${minutes}m`);
      if (secs > 0 || parts.length === 0) parts.push(`${secs}s`);

      return parts.join(" ");
    };

    const tokenInfo = {
      payload: parsedPayload,
      expirationDate,
      issuedDate,
      timeUntilExpiration,
      timeUntilExpirationFormatted: formatTimeRemaining(timeUntilExpiration),
      isExpired,
      userId: parsedPayload.user_id,
      userRole: parsedPayload.user_role,
      issuer: parsedPayload.iss,
      jwtId: parsedPayload.jti,
      subject: parsedPayload.sub,
    };

    return tokenInfo;
  } catch (error) {
    throw error;
  }
};

export const logCurrentTokenInfo = () => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return null;
  }

  try {
    const tokenInfo = parseJWTToken(token);
    return tokenInfo;
  } catch (error) {
    return null;
  }
};

export const testParseToken = (token: string) => {
  try {
    const tokenInfo = parseJWTToken(token);
    return tokenInfo;
  } catch (error) {
    return null;
  }
};

// Utility function to check if current token is expired
export const isCurrentTokenExpired = (): boolean => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    return true;
  }

  try {
    const tokenInfo = parseJWTToken(token);
    return tokenInfo.isExpired;
  } catch (error) {
    return true;
  }
};

export const logoutAndCleanup = async (): Promise<void> => {
  const token = localStorage.getItem("authToken");

  localStorage.removeItem("authToken");
  localStorage.removeItem("userEmail");

  if (token) {
    try {
      await fetch(API_ENDPOINTS.LOGOUT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Silent fail
    }
  }

  window.location.reload();
};

export const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

if (typeof window !== "undefined") {
  (window as any).testParseToken = testParseToken;
  (window as any).logCurrentTokenInfo = logCurrentTokenInfo;
  (window as any).parseJWTToken = parseJWTToken;
  (window as any).isCurrentTokenExpired = isCurrentTokenExpired;
  (window as any).logoutAndCleanup = logoutAndCleanup;
  (window as any).getApiInfo = getApiInfo;
}
