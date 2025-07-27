const isDevelopment = import.meta.env.DEV;
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const getApiBaseUrl = (): string => {
  const baseUrl = (() => {
    if (isDevelopment && isLocalhost) {
      return "/api";
    }

    return "/api/proxy?path=";
  })();

  return baseUrl;
};

export const createApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

  let finalUrl: string;

  if (baseUrl.includes("proxy?path=")) {
    finalUrl = `${baseUrl}${cleanEndpoint}`;
  } else {
    finalUrl = `${baseUrl}/${cleanEndpoint}`;
  }

  return finalUrl;
};

export const API_ENDPOINTS = {
  LOGIN: createApiUrl("v1/login"),
  REGISTER: createApiUrl("v1/register"),
  REGISTER_CONFIRM: createApiUrl("v1/register/confirm"),
  LOGOUT: createApiUrl("v1/logout"),
  USER: createApiUrl("v1/user"),
  DOCUMENT_CREATE: createApiUrl("v1/document"),
  DOCUMENT_GET: (id: string) => createApiUrl(`v1/document/${id}`),
  DOCUMENT_UPDATE: (id: string) => createApiUrl(`v1/document/${id}`),
  ADMIN_USERS: createApiUrl("v1/admin/users"),
  ADMIN_USER_BALANCE: (userId: string) =>
    createApiUrl(`v1/admin/users/${userId}/balance`),
} as const;

// Утилита для выполнения API запросов с авторизацией
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("authToken");

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

// Генерация UUID v4
export const generateUUID = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};
