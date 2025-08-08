import React from "react";

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
};

const FloatingField: React.FC<Props> = ({
  label,
  value,
  placeholder,
  onChange,
  className,
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
    </div>
  );
};

export default FloatingField;
