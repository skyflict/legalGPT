import { useMemo } from "react";

type Schema = {
  required?: string[];
  properties?: Record<string, any>;
};

type Status = {
  required_user_input?: { schema?: Schema };
};

export function useFormSchema(status?: Status) {
  const schema: Schema | undefined = status?.required_user_input?.schema;

  const requiredFields = useMemo(() => schema?.required || [], [schema]);
  const allFields = useMemo(() => schema?.properties || {}, [schema]);
  const optionalFields = useMemo(
    () => Object.keys(allFields).filter((f) => !requiredFields.includes(f)),
    [allFields, requiredFields]
  );

  return { schema, requiredFields, optionalFields, allFields } as const;
}
