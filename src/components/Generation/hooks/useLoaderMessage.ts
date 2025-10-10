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
      case "ENTITIES_PROVIDED":
        return "Подготавливаем генерацию документа...";
      case "DOC_GENERATING":
      case "DOC_GENERATED":
        return "Генерируем документ...";
      case "PROCESSING":
        return "Проверяем законы...";
      case "VALIDATING":
        return "Проверяем данные...";
      default:
        return isLoading ? "Проверяем законы..." : "";
    }
  }, [isLoading, status?.stage]);
}
