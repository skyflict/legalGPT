// Vercel serverless function для проксирования API запросов
export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Обрабатываем preflight запросы
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // Получаем путь из query параметра
    const { path } = req.query;

    if (!path) {
      return res.status(400).json({ error: "Path parameter is required" });
    }

    // Формируем URL для API
    const apiUrl = `http://api.neuroyurist.ru:8000/${
      Array.isArray(path) ? path.join("/") : path
    }`;

    console.log("Proxying request to:", apiUrl);
    console.log("Method:", req.method);
    console.log("Headers:", req.headers);

    // Подготавливаем заголовки для API запроса
    const headers = {
      "Content-Type": "application/json",
    };

    // Передаём Authorization заголовок если он есть
    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }

    // Настройки для fetch
    const fetchOptions = {
      method: req.method,
      headers,
    };

    // Добавляем body для POST/PUT запросов
    if (req.method === "POST" || req.method === "PUT") {
      fetchOptions.body = JSON.stringify(req.body);
    }

    // Делаем запрос к API
    const response = await fetch(apiUrl, fetchOptions);
    const data = await response.text();

    console.log("API Response status:", response.status);
    console.log("API Response:", data);

    // Передаём статус и заголовки
    res.status(response.status);

    // Пытаемся парсить JSON, если не получается - возвращаем как текст
    try {
      const jsonData = JSON.parse(data);
      res.json(jsonData);
    } catch {
      res.send(data);
    }
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: "Proxy server error",
      details: error.message,
    });
  }
}
