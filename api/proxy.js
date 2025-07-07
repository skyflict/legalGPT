// Vercel serverless function для проксирования API запросов
export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    const { path } = req.query;

    if (!path) {
      return res.status(400).json({ error: "Path parameter is required" });
    }

    const apiUrl = `http://api.neuroyurist.ru:8000/${
      Array.isArray(path) ? path.join("/") : path
    }`;

    const headers = {
      "Content-Type": "application/json",
    };

    if (req.headers.authorization) {
      headers.Authorization = req.headers.authorization;
    }

    const fetchOptions = {
      method: req.method,
      headers,
    };

    if (req.method === "POST" || req.method === "PUT") {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(apiUrl, fetchOptions);
    const data = await response.text();

    res.status(response.status);

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
