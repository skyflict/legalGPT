import { useMemo } from "react";

type Schema = {
  required?: string[];
  properties?: Record<string, any>;
  [key: string]: any;
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

  const groups = useMemo(() => {
    const raw = (schema && (schema["ui:groups"] as Array<any>)) || [];
    if (!Array.isArray(raw))
      return [] as Array<{ name: string; properties: string[] }>;
    return raw
      .map((g) => ({
        name: String(g?.name ?? ""),
        properties: Array.isArray(g?.properties)
          ? (g.properties as string[])
          : [],
      }))
      .filter((g) => g.properties.length > 0);
  }, [schema]);

  return { schema, requiredFields, optionalFields, allFields, groups } as const;
}
