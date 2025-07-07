const isDevelopment = import.meta.env.DEV;
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const getApiBaseUrl = (): string => {
  const baseUrl = (() => {
    if (isDevelopment && isLocalhost) {
      return "/api";
    }

    return "http://api.neuroyurist.ru:8000";
  })();

  return baseUrl;
};

export const createApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};

export const API_ENDPOINTS = {
  LOGIN: createApiUrl("v1/login"),
  REGISTER: createApiUrl("v1/register"),
  REGISTER_CONFIRM: createApiUrl("v1/register/confirm"),
  LOGOUT: createApiUrl("v1/logout"),
} as const;
