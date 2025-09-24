import { useState, useCallback, useRef } from "react";
import { API_ENDPOINTS, apiRequest, generateUUID } from "../../../utils/api";

export interface RequiredUserInput {
  event_type: string;
  next_stage?: string;
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
    entities?: any;
  };
  required_user_input?: RequiredUserInput;
  document_url?: string;
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

          if (
            response.stage === "COMPLETED" ||
            response.stage === "FINISHED" ||
            response.stage === "DOC_GENERATED"
          ) {
            setState((prev) => ({
              ...prev,
              currentStep: "completed",
              isLoading: false,
            }));
            stopPolling();
            return;
          }

          if (response.stage === "ENTITIES_PROVIDED") {
            if (!response.required_user_input && response.context?.entities) {
              const syntheticSchema = {
                type: "object",
                properties: {} as Record<string, any>,
                required: [] as string[],
                additionalProperties: false,
              };

              Object.entries(response.context.entities).forEach(
                ([key, value]) => {
                  syntheticSchema.properties[key] = {
                    type: "string",
                    title: key,
                    default: String(value),
                  };
                  syntheticSchema.required.push(key);
                }
              );

              response.required_user_input = {
                event_type: "ENTITIES_PROVIDED",
                schema: syntheticSchema,
              };
            }

            setState((prev) => ({
              ...prev,
              currentStep: "waiting_input",
              isLoading: false,
            }));
            stopPolling();
            return;
          }

          if (response.stage === "LAW_VIOLATED") {
            setState((prev) => ({
              ...prev,
              currentStep: "error",
              isLoading: false,
            }));
            stopPolling();
            return;
          }

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

      pollingRef.current = setInterval(poll, 2000);
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

        if (
          foundDocument.stage === "ENTITIES_PROVIDED" &&
          !foundDocument.required_user_input &&
          foundDocument.context?.entities
        ) {
          const entities = foundDocument.context.entities as Record<
            string,
            unknown
          >;
          const syntheticSchema = {
            type: "object",
            properties: {} as Record<string, any>,
            required: [] as string[],
            additionalProperties: false,
          };

          Object.entries(entities).forEach(([key, value]) => {
            syntheticSchema.properties[key] = {
              type: "string",
              title: key,
              default: String(value ?? ""),
            };
            syntheticSchema.required.push(key);
          });

          (foundDocument as any).required_user_input = {
            event_type: "ENTITIES_PROVIDED",
            schema: syntheticSchema,
          };
        }

        const completedStages = [
          "DOC_GENERATED",
          "DOC_APPROVED",
          "COMPLETED",
          "FINISHED",
        ];

        if (completedStages.includes(foundDocument.stage)) {
          setState((prev) => ({
            ...prev,
            status: foundDocument,
            currentStep: "completed",
            isLoading: false,
          }));
        } else if (foundDocument.stage === "LAW_VIOLATED") {
          setState((prev) => ({
            ...prev,
            status: foundDocument,
            currentStep: "error",
            isLoading: false,
          }));
        } else if (
          foundDocument.required_user_input ||
          foundDocument.stage === "DOC_TYPE_DEDUCED" ||
          foundDocument.stage === "ENTITIES_EXCTRACTED" ||
          foundDocument.stage === "ENTITIES_PROVIDED"
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
