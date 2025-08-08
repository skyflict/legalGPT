import { useMemo } from "react";

type Status = { stage?: string };

export function useLoaderMessage(isLoading: boolean, status?: Status): string {
  return useMemo(() => {
    const stage = status?.stage;
    switch (stage) {
      case "DOC_TYPE_DEDUCING":
        return "Определяем тип документа...";
      case "ENTITIES_EXTRACTING":
      case "ENTITIES_EXCTRACTED":
        return "Извлекаем необходимые данные...";
      case "DOC_GENERATING":
      case "DOC_GENERATED":
        return "Генерируем документ...";
      case "PROCESSING":
        return "Обрабатываем ваш запрос...";
      case "VALIDATING":
        return "Проверяем данные...";
      default:
        return isLoading ? "Обрабатываем ваш запрос..." : "";
    }
  }, [isLoading, status?.stage]);
}
