import React from "react";

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  description?: string;
};

const FloatingField: React.FC<Props> = ({
  label,
  value,
  placeholder,
  onChange,
  className,
  description,
}) => {
  const hasValue = value && String(value).trim() !== "";
  return (
    <div
      className={`form-field-wrapper ${hasValue ? "has-value" : ""} ${
        className || ""
      }`.trim()}
    >
      <input
        type="text"
        placeholder={placeholder ?? label}
        className="form-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {hasValue && <span className="floating-label">{label}</span>}
      {description && (
        <div
          className="field-hint"
          style={{
            color: "#6b7280",
            fontFamily: "Inter",
            fontSize: 12,
            marginTop: 6,
          }}
        >
          {description}
        </div>
      )}
    </div>
  );
};

export default FloatingField;
