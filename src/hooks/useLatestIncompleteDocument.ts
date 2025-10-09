import { useState, useEffect } from "react";
import { apiRequest, API_ENDPOINTS } from "../utils/api";

type DocumentItem = {
  id: string;
  user_id: string;
  stage: string;
  type?: string;
  context?: { query?: string; entities?: Record<string, unknown> };
  created_at: string;
  modified_at: string;
  required_user_input?: unknown;
  is_terminal: boolean;
  public_status: string;
  public_type: string;
};

type HistoryResponse = { documents: DocumentItem[] };

export const useLatestIncompleteDocument = () => {
  const [latestDocument, setLatestDocument] = useState<DocumentItem | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLatestIncompleteDocument = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = (await apiRequest(
        API_ENDPOINTS.DOCUMENT_LIST
      )) as HistoryResponse;
      const documents = response.documents || [];

      // Фильтруем незавершенные документы
      const incompleteDocuments = documents.filter((doc) => !doc.is_terminal);

      if (incompleteDocuments.length > 0) {
        // Сортируем по дате модификации (последний модифицированный)
        const sortedDocuments = incompleteDocuments.sort(
          (a, b) =>
            new Date(b.modified_at).getTime() - new Date(a.created_at).getTime()
        );

        setLatestDocument(sortedDocuments[0]);
      } else {
        setLatestDocument(null);
      }
    } catch (e) {
      setError("Не удалось загрузить последний документ");
      console.error("[useLatestIncompleteDocument] fetch error", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestIncompleteDocument();
  }, []);

  return {
    latestDocument,
    isLoading,
    error,
    refetch: fetchLatestIncompleteDocument,
  };
};
