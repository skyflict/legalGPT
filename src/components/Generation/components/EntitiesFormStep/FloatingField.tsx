import React, { useState, useRef, useEffect } from "react";
import Icon from "../../../Icon/Icon";

type EnumOption = {
  value: string;
  title: string;
};

type Props = {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  description?: string;
  enumOptions?: EnumOption[];
  examples?: string[];
};

const FloatingField: React.FC<Props> = ({
  label,
  value,
  placeholder,
  onChange,
  className,
  description,
  enumOptions,
  examples,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Отслеживаем размер экрана для адаптивного тултипа
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsDropdownOpen(false);
  };

  const getDisplayValue = () => {
    if (!enumOptions || enumOptions.length === 0) return value;
    const selectedOption = enumOptions.find((opt) => opt.value === value);
    return selectedOption ? selectedOption.title : value || "Не выбрано";
  };

  const getPlaceholderWithExamples = () => {
    if (examples && examples.length > 0) {
      return `Например: ${examples.join(", ")}`;
    }
    return placeholder ?? label;
  };

  const renderTooltip = (content: string) => {
    if (isMobile) {
      // На мобильных устройствах показываем тултип слева от иконки
      const tooltipStyle = {
        position: "absolute" as const,
        top: "0",
        right: "100%",
        marginRight: "8px",
        backgroundColor: "#1f2937",
        color: "white",
        padding: "8px 12px",
        borderRadius: "6px",
        fontSize: "12px",
        lineHeight: "1.4",
        whiteSpace: "normal" as const,
        maxWidth: "180px",
        width: "180px",
        zIndex: 1000,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        wordWrap: "break-word" as const,
        textAlign: "left" as const,
      };

      const arrowStyle = {
        position: "absolute" as const,
        top: "8px",
        right: "-4px",
        width: 0,
        height: 0,
        borderTop: "4px solid transparent",
        borderBottom: "4px solid transparent",
        borderLeft: "4px solid #1f2937",
      };

      return (
        <div style={tooltipStyle}>
          {content}
          <div style={arrowStyle} />
        </div>
      );
    } else {
      // На десктопе используем обычное позиционирование
      const tooltipStyle = {
        position: "absolute" as const,
        top: "100%",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#1f2937",
        color: "white",
        padding: "8px 12px",
        borderRadius: "6px",
        fontSize: "12px",
        lineHeight: "1.4",
        whiteSpace: "normal" as const,
        maxWidth: "280px",
        width: "max-content",
        minWidth: "120px",
        zIndex: 1000,
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        marginTop: "4px",
        wordWrap: "break-word" as const,
        textAlign: "left" as const,
      };

      const arrowStyle = {
        position: "absolute" as const,
        top: "-4px",
        left: "50%",
        transform: "translateX(-50%)",
        width: 0,
        height: 0,
        borderLeft: "4px solid transparent",
        borderRight: "4px solid transparent",
        borderBottom: "4px solid #1f2937",
      };

      return (
        <div style={tooltipStyle}>
          {content}
          <div style={arrowStyle} />
        </div>
      );
    }
  };

  if (enumOptions && enumOptions.length > 0) {
    // Render dropdown for enum fields
    return (
      <div className={`form-field-wrapper ${className || ""}`.trim()}>
        <div
          className="form-field-label-container"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <label className="form-field-label" style={{ margin: 0 }}>
            {label}
          </label>
          {description && (
            <div
              style={{
                position: "relative",
                display: "inline-block",
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Icon
                name="help"
                width={16}
                height={16}
                style={{ cursor: "help" }}
              />
              {showTooltip && renderTooltip(description)}
            </div>
          )}
        </div>
        <div
          className="form-field-dropdown"
          ref={dropdownRef}
          style={{ position: "relative" }}
        >
          <button
            type="button"
            className={`form-field dropdown-trigger ${
              isDropdownOpen ? "dropdown-trigger--open" : ""
            }`}
            onClick={handleDropdownToggle}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              textAlign: "left",
              cursor: "pointer",
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "12px 16px",
              fontSize: "14px",
              color: value ? "#1a1a1a" : "#9ca3af",
            }}
          >
            <span>{getDisplayValue()}</span>
            <Icon
              name="arrow"
              width={16}
              height={16}
              className={`dropdown-arrow ${
                isDropdownOpen ? "dropdown-arrow--open" : ""
              }`}
              style={{
                transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </button>

          {isDropdownOpen && (
            <div
              className="dropdown-menu"
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                zIndex: 1000,
                background: "white",
                border: "1px solid #e5e7eb",
                borderTop: "none",
                borderRadius: "0 0 8px 8px",
                maxHeight: "200px",
                overflowY: "auto",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              {!value && (
                <div
                  className="dropdown-item"
                  onClick={() => handleOptionSelect("")}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#9ca3af",
                    borderBottom: "1px solid #f3f4f6",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f9fafb";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "white";
                  }}
                >
                  Не выбрано
                </div>
              )}
              {enumOptions.map((option) => (
                <div
                  key={option.value}
                  className="dropdown-item"
                  onClick={() => handleOptionSelect(option.value)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "#1a1a1a",
                    borderBottom: "1px solid #f3f4f6",
                    background: value === option.value ? "#f3f4f6" : "white",
                  }}
                  onMouseEnter={(e) => {
                    if (value !== option.value) {
                      e.currentTarget.style.background = "#f9fafb";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background =
                      value === option.value ? "#f3f4f6" : "white";
                  }}
                >
                  {option.title}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render regular input for non-enum fields
  return (
    <div className={`form-field-wrapper ${className || ""}`.trim()}>
      <div
        className="form-field-label-container"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        <label className="form-field-label" style={{ margin: 0 }}>
          {label}
        </label>
        {description && (
          <div
            style={{ position: "relative", display: "inline-block" }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Icon
              name="help"
              width={16}
              height={16}
              style={{ cursor: "help" }}
            />
            {showTooltip && renderTooltip(description)}
          </div>
        )}
      </div>
      <input
        type="text"
        placeholder={getPlaceholderWithExamples()}
        className="form-field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default FloatingField;
