const isDevelopment = import.meta.env.DEV;
const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const getApiBaseUrl = (): string => {
  const baseUrl = (() => {
    if (isDevelopment && isLocalhost) {
      return "/api";
    }

    // В продакшене используем Vercel serverless функцию как прокси
    return "/api/proxy?path=";
  })();

  return baseUrl;
};

export const createApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;

  let finalUrl: string;

  // В продакшене (через прокси) не добавляем слеш, так как он уже есть в query параметре
  if (baseUrl.includes("proxy?path=")) {
    finalUrl = `${baseUrl}${cleanEndpoint}`;
  } else {
    // В разработке добавляем слеш как обычно
    finalUrl = `${baseUrl}/${cleanEndpoint}`;
  }

  console.log(`API URL [${endpoint}]:`, finalUrl, {
    isDevelopment,
    isLocalhost,
    hostname: window.location.hostname,
  });

  return finalUrl;
};

export const API_ENDPOINTS = {
  LOGIN: createApiUrl("v1/login"),
  REGISTER: createApiUrl("v1/register"),
  REGISTER_CONFIRM: createApiUrl("v1/register/confirm"),
  LOGOUT: createApiUrl("v1/logout"),
} as const;
