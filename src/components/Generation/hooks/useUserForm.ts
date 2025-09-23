import { useEffect, useMemo, useState } from "react";

type Fields = Record<string, { default?: string }>;

export function useUserForm(
  allFields: Fields,
  enableDefaults: boolean,
  existingEntities?: Record<string, any>
) {
  const [values, setValues] = useState<Record<string, string>>({});

  // Инициализация дефолтами при появлении схемы
  useEffect(() => {
    if (!enableDefaults) return;
    const defaults: Record<string, string> = {};

    // Сначала берем defaults из схемы
    Object.entries(allFields).forEach(([name, props]) => {
      if (props?.default) defaults[name] = String(props.default);
    });

    // Затем перезаписываем данными из context.entities если они есть
    if (existingEntities) {
      Object.entries(existingEntities).forEach(([name, value]) => {
        if (value != null) defaults[name] = String(value);
      });
    }

    if (Object.keys(defaults).length) {
      setValues((prev) => ({ ...defaults, ...prev }));
    }
  }, [allFields, enableDefaults, existingEntities]);

  const setField = (name: string, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  return { values, setField, setValues } as const;
}

export function useFormValidity(
  requiredFields: string[],
  values: Record<string, string>
) {
  return useMemo(
    () => requiredFields.every((f) => values[f] && values[f].trim()),
    [requiredFields, values]
  );
}
