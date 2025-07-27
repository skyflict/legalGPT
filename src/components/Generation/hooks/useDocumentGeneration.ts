import { useState, useCallback, useRef } from "react";
import { API_ENDPOINTS, apiRequest, generateUUID } from "../../../utils/api";

export interface RequiredUserInput {
  next_stage: string;
  schema: {
    type: string;
    properties: any;
    required: string[];
    additionalProperties: boolean;
  };
}

export interface DocumentStatus {
  id: string;
  user_id: string;
  stage: string;
  type?: string;
  context: {
    query: string;
  };
  required_user_input?: RequiredUserInput;
  created_at: string;
  modified_at: string;
  result?: any;
  error?: string;
}

export interface DocumentGenerationState {
  isLoading: boolean;
  error: string | null;
  documentId: string | null;
  status: DocumentStatus | null;
  currentStep: "idle" | "generating" | "waiting_input" | "completed" | "error";
}

export const useDocumentGeneration = () => {
  const [state, setState] = useState<DocumentGenerationState>({
    isLoading: false,
    error: null,
    documentId: null,
    status: null,
    currentStep: "idle",
  });

  const pollingRef = useRef<number | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startPolling = useCallback(
    async (documentId: string) => {
      stopPolling();

      const poll = async () => {
        try {
          const response = await apiRequest(
            API_ENDPOINTS.DOCUMENT_GET(documentId)
          );

          setState((prev) => ({
            ...prev,
            status: response,
            isLoading: false,
          }));

          // Если есть required_user_input, останавливаем поллинг и ждем ввода
          if (response.required_user_input) {
            setState((prev) => ({
              ...prev,
              currentStep: "waiting_input",
              isLoading: false,
            }));
            stopPolling();
            return;
          }

          // Если документ готов, останавливаем поллинг
          if (response.stage === "COMPLETED" || response.stage === "FINISHED") {
            setState((prev) => ({
              ...prev,
              currentStep: "completed",
              isLoading: false,
            }));
            stopPolling();
            return;
          }

          // Если ошибка, останавливаем поллинг
          if (response.stage === "ERROR" || response.stage === "FAILED") {
            setState((prev) => ({
              ...prev,
              currentStep: "error",
              error:
                response.error || "Произошла ошибка при генерации документа",
              isLoading: false,
            }));
            stopPolling();
            return;
          }
        } catch (error) {
          console.error("Polling error:", error);
          setState((prev) => ({
            ...prev,
            error: "Ошибка при получении статуса документа",
            currentStep: "error",
            isLoading: false,
          }));
          stopPolling();
        }
      };

      // Начинаем поллинг каждые 2 секунды
      pollingRef.current = setInterval(poll, 2000);
      // Сразу делаем первый запрос
      await poll();
    },
    [stopPolling]
  );

  const startGeneration = useCallback(
    async (query: string) => {
      const documentId = generateUUID();

      setState({
        isLoading: true,
        error: null,
        documentId,
        status: null,
        currentStep: "generating",
      });

      try {
        await apiRequest(API_ENDPOINTS.DOCUMENT_CREATE, {
          method: "POST",
          body: JSON.stringify({
            id: documentId,
            query,
          }),
        });

        // Начинаем поллинг
        await startPolling(documentId);
      } catch (error) {
        console.error("Document generation error:", error);
        setState((prev) => ({
          ...prev,
          error: "Ошибка при создании документа",
          currentStep: "error",
          isLoading: false,
        }));
      }
    },
    [startPolling]
  );

  const submitUserInput = useCallback(
    async (userData: any) => {
      if (!state.documentId) {
        setState((prev) => ({
          ...prev,
          error: "Документ не найден",
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        currentStep: "generating",
      }));

      try {
        await apiRequest(API_ENDPOINTS.DOCUMENT_UPDATE(state.documentId), {
          method: "PATCH",
          body: JSON.stringify(userData),
        });

        // Продолжаем поллинг
        await startPolling(state.documentId);
      } catch (error) {
        console.error("User input submission error:", error);
        setState((prev) => ({
          ...prev,
          error: "Ошибка при отправке данных",
          currentStep: "error",
          isLoading: false,
        }));
      }
    },
    [state.documentId, startPolling]
  );

  const reset = useCallback(() => {
    stopPolling();
    setState({
      isLoading: false,
      error: null,
      documentId: null,
      status: null,
      currentStep: "idle",
    });
  }, [stopPolling]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    startGeneration,
    submitUserInput,
    reset,
    clearError,
  };
};
