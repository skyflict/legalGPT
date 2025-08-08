import { useMemo } from "react";

type Status = {
  type?: string;
  required_user_input?: {
    schema?: {
      properties?: { document_type?: { default?: string } };
    };
  };
};

export function useResolvedDocumentType(status?: Status): string | undefined {
  return useMemo(() => {
    if (!status) return undefined;
    if (status.type) return status.type;
    return (
      status.required_user_input?.schema?.properties?.document_type?.default ||
      undefined
    );
  }, [status]);
}
