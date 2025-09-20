import React, { useState } from "react";
import Icon from "../../../Icon/Icon";
import FloatingField from "./FloatingField";
import styles from "./EntitiesFormStep.module.css";

type FieldProps = {
  title?: string;
  default?: string;
  description?: string;
  enum?: string[];
  enumTitles?: Record<string, string>;
  examples?: string[];
};

type Group = { name: string; properties: string[] };

type Props = {
  requiredFields: string[];
  optionalFields: string[];
  allFields: Record<string, FieldProps>;
  values: Record<string, string>;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  isValid: boolean;
  groups?: Group[];
};

const EntitiesFormStep: React.FC<Props> = ({
  requiredFields,
  optionalFields,
  allFields,
  values,
  onChange,
  onSubmit,
  isValid,
  groups = [],
}) => {
  const [openOptionalGroups, setOpenOptionalGroups] = useState<
    Record<string, boolean>
  >({});

  const toggleOptionalGroup = (name: string) => {
    setOpenOptionalGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const getEnumOptions = (fieldProps: FieldProps) => {
    if (!fieldProps.enum || fieldProps.enum.length === 0) {
      return undefined;
    }

    return fieldProps.enum.map((enumValue) => ({
      value: enumValue,
      title: fieldProps.enumTitles?.[enumValue] || enumValue,
    }));
  };
  return (
    <div className="step-two-content">
      <div className="step-two-message">
        <div className="step-three-form">
          <div className="step-progress">
            <div className="step-number-no-active">
              <Icon name="check" width={16} height={16} />
            </div>
            <span>
              <Icon name="whiteLine" width={139} height={4} />
            </span>
            <div className="step-number">2</div>
          </div>

          <div className="step-three-content">
            <div className="step-three-title">
              Введите обязательные недостающие данные
              {/* <Icon name="helpOutlined" width={16} height={16} /> */}
            </div>

            {groups.length > 0 ? (
              <>
                <div className={styles.fields}>
                  {(() => {
                    const grouped = new Set(
                      groups.flatMap((g) => g.properties)
                    );
                    const ungroupedRequired = requiredFields.filter(
                      (n) => !grouped.has(n)
                    );
                    return ungroupedRequired.map((fieldName) => {
                      const fieldProps = allFields[fieldName] || {};
                      const defaultValue = fieldProps.default || "";
                      const value = values[fieldName] ?? defaultValue;
                      const labelText = fieldProps.title || fieldName;
                      return (
                        <FloatingField
                          key={`req-ungrouped-${fieldName}`}
                          label={labelText}
                          value={value}
                          placeholder={labelText}
                          onChange={(v) => onChange(fieldName, v)}
                          description={fieldProps.description}
                          enumOptions={getEnumOptions(fieldProps)}
                          examples={fieldProps.examples}
                        />
                      );
                    });
                  })()}

                  {groups.map((group) => {
                    const requiredInGroup = group.properties.filter((n) =>
                      requiredFields.includes(n)
                    );
                    if (requiredInGroup.length === 0) return null;
                    return (
                      <div
                        key={`req-${group.name}`}
                        className="additional-data"
                      >
                        <div className="additional-title">{group.name}</div>
                        <div className={styles.additional}>
                          {requiredInGroup.map((fieldName) => {
                            const fieldProps = allFields[fieldName] || {};
                            const defaultValue = fieldProps.default || "";
                            const value = values[fieldName] ?? defaultValue;
                            const labelText = fieldProps.title || fieldName;
                            return (
                              <FloatingField
                                key={fieldName}
                                label={labelText}
                                value={value}
                                placeholder={labelText}
                                onChange={(v) => onChange(fieldName, v)}
                                description={fieldProps.description}
                                enumOptions={getEnumOptions(fieldProps)}
                                examples={fieldProps.examples}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div
                  className="additional-title"
                  style={{
                    marginTop: 8,
                    borderTop: "1px solid #000",
                    paddingTop: 16,
                  }}
                >
                  Дополнительные данные
                </div>
                <div className="additional-description">
                  Это необязательно, но позволяет более детально зафиксировать
                  положения договора, отражающие ваши запросы
                </div>
                <div className={styles.fields}>
                  {/* Сначала необязательные поля вне групп */}
                  {(() => {
                    const grouped = new Set(
                      groups.flatMap((g) => g.properties)
                    );
                    const ungroupedOptional = optionalFields.filter(
                      (n) => !grouped.has(n)
                    );
                    return ungroupedOptional.map((fieldName) => {
                      const fieldProps = allFields[fieldName] || {};
                      const defaultValue = fieldProps.default || "";
                      const value = values[fieldName] ?? defaultValue;
                      const labelText = fieldProps.title || fieldName;
                      return (
                        <FloatingField
                          key={`opt-ungrouped-${fieldName}`}
                          label={labelText}
                          value={value}
                          placeholder={labelText}
                          onChange={(v) => onChange(fieldName, v)}
                          description={fieldProps.description}
                          enumOptions={getEnumOptions(fieldProps)}
                          examples={fieldProps.examples}
                        />
                      );
                    });
                  })()}

                  {groups.map((group) => {
                    const optionalInGroup = group.properties.filter(
                      (n) => !requiredFields.includes(n)
                    );
                    if (optionalInGroup.length === 0) return null;
                    return (
                      <div
                        key={`opt-${group.name}`}
                        className="additional-data"
                        style={{
                          fontSize: "14px",
                          borderBottom: "1px solid #000",
                          paddingTop: 16,
                        }}
                      >
                        <button
                          type="button"
                          className={styles.spoilerHeader}
                          onClick={() => toggleOptionalGroup(group.name)}
                          aria-expanded={!!openOptionalGroups[group.name]}
                        >
                          <span className="additional-title">{group.name}</span>
                          <Icon
                            name="arrow"
                            width={16}
                            height={16}
                            className={`${styles.spoilerIcon} ${
                              openOptionalGroups[group.name] ? styles.open : ""
                            }`}
                          />
                        </button>
                        {openOptionalGroups[group.name] && (
                          <div className={styles.additional}>
                            {optionalInGroup.map((fieldName) => {
                              const fieldProps = allFields[fieldName] || {};
                              const defaultValue = fieldProps.default || "";
                              const value = values[fieldName] ?? defaultValue;
                              const labelText = fieldProps.title || fieldName;
                              return (
                                <FloatingField
                                  key={fieldName}
                                  label={labelText}
                                  value={value}
                                  placeholder={labelText}
                                  onChange={(v) => onChange(fieldName, v)}
                                  description={fieldProps.description}
                                  enumOptions={getEnumOptions(fieldProps)}
                                  examples={fieldProps.examples}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className={styles.fields}>
                {requiredFields.map((fieldName) => {
                  const fieldProps = allFields[fieldName] || {};
                  const defaultValue = fieldProps.default || "";
                  const value = values[fieldName] ?? defaultValue;
                  const labelText = fieldProps.title || fieldName;
                  return (
                    <FloatingField
                      key={fieldName}
                      label={labelText}
                      value={value}
                      placeholder={labelText}
                      onChange={(v) => onChange(fieldName, v)}
                      description={fieldProps.description}
                      enumOptions={getEnumOptions(fieldProps)}
                      examples={fieldProps.examples}
                    />
                  );
                })}
              </div>
            )}

            {groups.length === 0 && optionalFields.length > 0 && (
              <div className="additional-data">
                <div className="additional-title">
                  Дополнительные данные
                  {/* <Icon name="helpOutlined" width={16} height={16} /> */}
                </div>
                <div className={styles.additional}>
                  {optionalFields.map((fieldName) => {
                    const fieldProps = allFields[fieldName] || {};
                    const defaultValue = fieldProps.default || "";
                    const value = values[fieldName] ?? defaultValue;
                    const labelText = fieldProps.title || fieldName;
                    return (
                      <FloatingField
                        key={fieldName}
                        label={labelText}
                        value={value}
                        placeholder={labelText}
                        onChange={(v) => onChange(fieldName, v)}
                        description={fieldProps.description}
                        enumOptions={getEnumOptions(fieldProps)}
                        examples={fieldProps.examples}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            <div className="form-actions">
              <button
                className="action-button action-button--primary"
                onClick={onSubmit}
                disabled={!isValid}
              >
                Далее
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntitiesFormStep;
