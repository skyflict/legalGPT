import { useState, useEffect } from "react";
import { API_ENDPOINTS, apiRequest } from "../../../utils/api";

export interface DocumentType {
  id: string;
  name: string;
  description: string;
}

export interface DocumentTypesResponse {
  document_types: DocumentType[];
}

export const useDocumentTypes = () => {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocumentTypes = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response: DocumentTypesResponse = await apiRequest(
          API_ENDPOINTS.DOCUMENT_TYPE
        );
        setDocumentTypes(response.document_types);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Ошибка при загрузке типов документов"
        );
        console.error("Ошибка при загрузке типов документов:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentTypes();
  }, []);

  const getDocumentTypeById = (id: string): DocumentType | undefined => {
    return documentTypes.find((type) => type.id === id);
  };

  const getDocumentTypeByName = (name: string): DocumentType | undefined => {
    return documentTypes.find((type) => type.name === name);
  };

  return {
    documentTypes,
    isLoading,
    error,
    getDocumentTypeById,
    getDocumentTypeByName,
  };
};
