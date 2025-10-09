import { useState, useCallback, useRef } from "react";
import { API_ENDPOINTS, apiRequest, generateUUID } from "../../../utils/api";

export interface RequiredUserInput {
  event_type: string;
  next_stage?: string;
  schema: {
    type: string;
    properties: Record<string, unknown>;
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
    entities?: Record<string, unknown>;
  };
  required_user_input?: RequiredUserInput;
  created_at: string;
  modified_at: string;
  result?: Record<string, unknown>;
  error?: string;
  is_terminal: boolean;
  public_status: string;
  public_type: string;
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
          }));

          if (response.required_user_input) {
            setState((prev) => ({
              ...prev,
              currentStep: "waiting_input",
              isLoading: false,
            }));
            stopPolling();
            return;
          }

          if (response.is_terminal) {
            // Документ завершен (успех или неудача)
            const isError =
              response.stage === "LAW_VIOLATED" ||
              response.stage === "ERROR" ||
              response.stage === "FAILED";
            setState((prev) => ({
              ...prev,
              currentStep: isError ? "error" : "completed",
              isLoading: false,
              error: isError
                ? response.error || "Произошла ошибка при генерации документа"
                : null,
            }));
            stopPolling();
            return;
          }

          if (response.stage === "ENTITIES_PROVIDED") {
            // Только если сервер явно требует ввод пользователя
            if (response.required_user_input) {
              setState((prev) => ({
                ...prev,
                currentStep: "waiting_input",
                isLoading: false,
              }));
              stopPolling();
              return;
            }
            // Если нет required_user_input, продолжаем поллинг
            // (сервер обработает entities автоматически)
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

      pollingRef.current = setInterval(poll, 2000);
      await poll();
    },
    [stopPolling]
  );

  // Проверка актуального статуса документа при ошибках
  const checkDocumentStatus = useCallback(
    async (documentId: string): Promise<boolean> => {
      try {
        const response = await apiRequest(
          API_ENDPOINTS.DOCUMENT_GET(documentId)
        );

        setState((prev) => ({
          ...prev,
          status: response,
        }));

        // Проверяем, изменился ли статус документа
        if (response.required_user_input) {
          setState((prev) => ({
            ...prev,
            currentStep: "waiting_input",
            isLoading: false,
            error: null,
          }));
          return true;
        }

        if (response.is_terminal) {
          const isError =
            response.stage === "LAW_VIOLATED" ||
            response.stage === "ERROR" ||
            response.stage === "FAILED";
          setState((prev) => ({
            ...prev,
            currentStep: isError ? "error" : "completed",
            isLoading: false,
            error: isError
              ? response.error || "Произошла ошибка при генерации документа"
              : null,
          }));
          return true;
        }

        // Документ в процессе обработки - запускаем поллинг
        await startPolling(documentId);
        return true;
      } catch (error) {
        console.error("Error checking document status:", error);
        return false;
      }
    },
    [startPolling]
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

        await startPolling(documentId);
      } catch (error) {
        console.error("Document generation error:", error);

        // Проверяем статус документа на случай если запрос прошел, но ответ не дошел
        const statusChecked = await checkDocumentStatus(documentId);

        if (!statusChecked) {
          // Если не удалось получить статус, показываем ошибку
          setState((prev) => ({
            ...prev,
            error: "Ошибка при создании документа",
            currentStep: "error",
            isLoading: false,
          }));
        }
      }
    },
    [startPolling, checkDocumentStatus]
  );

  const submitUserInput = useCallback(
    async (userData: Record<string, unknown>) => {
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

        // Проверяем актуальный статус документа
        // Возможно, запрос прошел, но ответ не дошел, или документ уже пошел дальше
        const statusChecked = await checkDocumentStatus(state.documentId);

        if (!statusChecked) {
          // Если не удалось получить статус, показываем ошибку
          setState((prev) => ({
            ...prev,
            error: "Ошибка при отправке данных",
            currentStep: "error",
            isLoading: false,
          }));
        }
      }
    },
    [state.documentId, startPolling, checkDocumentStatus]
  );

  const continueGeneration = useCallback(
    async (documentId: string) => {
      setState((prev) => ({
        ...prev,
        isLoading: true,
        error: null,
        currentStep: "generating",
        documentId,
      }));

      try {
        const listResponse = (await apiRequest(
          API_ENDPOINTS.DOCUMENT_LIST
        )) as { documents?: DocumentStatus[] };

        const documents = listResponse?.documents || [];

        const foundDocument = documents.find((doc) => doc.id === documentId);

        if (!foundDocument) {
          await startPolling(documentId);
          return;
        }

        // Убираем автоматическое создание синтетической схемы
        // Только если сервер явно требует ввод пользователя, показываем форму

        if (foundDocument.is_terminal) {
          // Документ завершен (успех или неудача)
          const isError =
            foundDocument.stage === "LAW_VIOLATED" ||
            foundDocument.stage === "ERROR" ||
            foundDocument.stage === "FAILED";
          setState((prev) => ({
            ...prev,
            status: foundDocument,
            currentStep: isError ? "error" : "completed",
            isLoading: false,
          }));
        } else if (
          foundDocument.required_user_input ||
          foundDocument.stage === "DOC_TYPE_DEDUCED" ||
          foundDocument.stage === "ENTITIES_EXCTRACTED"
        ) {
          setState((prev) => ({
            ...prev,
            status: foundDocument,
            currentStep: "waiting_input",
            isLoading: false,
          }));
        } else {
          setState((prev) => ({
            ...prev,
            status: foundDocument,
          }));
          await startPolling(documentId);
        }
      } catch (error) {
        console.error("Continue generation error:", error);
        setState((prev) => ({
          ...prev,
          error: "Ошибка при продолжении генерации",
          currentStep: "error",
          isLoading: false,
        }));
      }
    },
    [startPolling]
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
    continueGeneration,
    reset,
    clearError,
  };
};
