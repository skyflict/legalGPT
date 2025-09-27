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
  const [isEditing, setIsEditing] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({
    direction: "right",
    align: "center",
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const tooltipTriggerRef = useRef<HTMLDivElement>(null);

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

  // Вычисляем оптимальную позицию тултипа с учетом границ экрана
  useEffect(() => {
    if (showTooltip && tooltipTriggerRef.current) {
      const calculateOptimalPosition = () => {
        const triggerElement = tooltipTriggerRef.current;
        if (!triggerElement) return;

        const rect = triggerElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Примерные размеры тултипа
        const tooltipWidth = isMobile ? 180 : 280;
        const tooltipHeight = 60;

        let direction = "right";
        let align = "center";

        if (isMobile) {
          // На мобильных устройствах предпочитаем показать слева, но проверяем границы
          const spaceLeft = rect.left;
          const spaceRight = viewportWidth - rect.right;

          if (spaceLeft >= tooltipWidth + 8) {
            direction = "left";
            align = "center";
          } else if (spaceRight >= tooltipWidth + 8) {
            direction = "right";
            align = "center";
          } else {
            // Если места по бокам мало, показываем снизу
            direction = rect.top > viewportHeight / 2 ? "top" : "bottom";
            align = "center";
          }
        } else {
          // На десктопе сначала пробуем справа от иконки
          const spaceRight = viewportWidth - rect.right;
          const spaceLeft = rect.left;
          const spaceBottom = viewportHeight - rect.bottom;
          const spaceTop = rect.top;

          if (spaceRight >= tooltipWidth + 8) {
            direction = "right";
            align = "center";
          } else if (spaceLeft >= tooltipWidth + 8) {
            direction = "left";
            align = "center";
          } else if (spaceBottom >= tooltipHeight + 8) {
            direction = "bottom";
            // Проверяем, поместится ли по центру
            const spaceLeftForCenter =
              rect.left + rect.width / 2 - tooltipWidth / 2;
            const spaceRightForCenter =
              viewportWidth - (rect.left + rect.width / 2 + tooltipWidth / 2);

            if (spaceLeftForCenter >= 0 && spaceRightForCenter >= 0) {
              align = "center";
            } else if (spaceLeftForCenter < 0) {
              align = "left";
            } else {
              align = "right";
            }
          } else if (spaceTop >= tooltipHeight + 8) {
            direction = "top";
            // Аналогично для верха
            const spaceLeftForCenter =
              rect.left + rect.width / 2 - tooltipWidth / 2;
            const spaceRightForCenter =
              viewportWidth - (rect.left + rect.width / 2 + tooltipWidth / 2);

            if (spaceLeftForCenter >= 0 && spaceRightForCenter >= 0) {
              align = "center";
            } else if (spaceLeftForCenter < 0) {
              align = "left";
            } else {
              align = "right";
            }
          } else {
            // В крайнем случае показываем справа, даже если места мало
            direction = "right";
            align = "center";
          }
        }

        setTooltipPosition({ direction, align });
      };

      calculateOptimalPosition();

      // Пересчитываем при изменении размера окна
      window.addEventListener("resize", calculateOptimalPosition);
      window.addEventListener("scroll", calculateOptimalPosition);

      return () => {
        window.removeEventListener("resize", calculateOptimalPosition);
        window.removeEventListener("scroll", calculateOptimalPosition);
      };
    }
  }, [showTooltip, isMobile]);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsDropdownOpen(false);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsDropdownOpen(false);
      setIsEditing(false);
      inputRef.current?.blur();
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
      setIsEditing(false);
      inputRef.current?.blur();
    }
  };

  const handleInputFocus = () => {
    setIsEditing(true);
    setIsDropdownOpen(true);
  };

  const getDisplayValue = () => {
    if (!enumOptions || enumOptions.length === 0) return value;
    const selectedOption = enumOptions.find((opt) => opt.value === value);
    return selectedOption ? selectedOption.title : value || "";
  };

  const getFilteredOptions = () => {
    if (!enumOptions || !isEditing || !value) return enumOptions || [];
    return enumOptions.filter(
      (option) =>
        option.title.toLowerCase().includes(value.toLowerCase()) ||
        option.value.toLowerCase().includes(value.toLowerCase())
    );
  };

  const getPlaceholderWithExamples = () => {
    if (examples && examples.length > 0) {
      return `${examples.join(", ")}`;
    }
    return placeholder ?? label;
  };

  const renderTooltip = (content: string) => {
    const { direction, align } = tooltipPosition;
    const maxWidth = isMobile ? 180 : 280;

    // Базовые стили тултипа
    const baseTooltipStyle = {
      position: "absolute" as const,
      backgroundColor: "#1f2937",
      color: "white",
      padding: "8px 12px",
      borderRadius: "6px",
      fontSize: "12px",
      lineHeight: "1.4",
      whiteSpace: "normal" as const,
      maxWidth: `${maxWidth}px`,
      width: isMobile ? `${maxWidth}px` : "max-content",
      minWidth: isMobile ? `${maxWidth}px` : "120px",
      zIndex: 1000,
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      wordWrap: "break-word" as const,
      textAlign: "left" as const,
    };

    // Позиционирование в зависимости от направления и выравнивания
    let positionStyle = {};
    let arrowStyle = {};

    switch (direction) {
      case "bottom":
        positionStyle = {
          top: "100%",
          marginTop: "4px",
          ...(align === "center" && {
            left: "50%",
            transform: "translateX(-50%)",
          }),
          ...(align === "left" && {
            left: "0",
          }),
          ...(align === "right" && {
            right: "0",
          }),
        };

        arrowStyle = {
          position: "absolute" as const,
          top: "-4px",
          width: 0,
          height: 0,
          borderLeft: "4px solid transparent",
          borderRight: "4px solid transparent",
          borderBottom: "4px solid #1f2937",
          ...(align === "center" && {
            left: "50%",
            transform: "translateX(-50%)",
          }),
          ...(align === "left" && {
            left: "12px",
          }),
          ...(align === "right" && {
            right: "12px",
          }),
        };
        break;

      case "top":
        positionStyle = {
          bottom: "100%",
          marginBottom: "4px",
          ...(align === "center" && {
            left: "50%",
            transform: "translateX(-50%)",
          }),
          ...(align === "left" && {
            left: "0",
          }),
          ...(align === "right" && {
            right: "0",
          }),
        };

        arrowStyle = {
          position: "absolute" as const,
          bottom: "-4px",
          width: 0,
          height: 0,
          borderLeft: "4px solid transparent",
          borderRight: "4px solid transparent",
          borderTop: "4px solid #1f2937",
          ...(align === "center" && {
            left: "50%",
            transform: "translateX(-50%)",
          }),
          ...(align === "left" && {
            left: "12px",
          }),
          ...(align === "right" && {
            right: "12px",
          }),
        };
        break;

      case "left":
        positionStyle = {
          top: "50%",
          right: "100%",
          marginRight: "8px",
          transform: "translateY(-50%)",
        };

        arrowStyle = {
          position: "absolute" as const,
          top: "50%",
          right: "-4px",
          transform: "translateY(-50%)",
          width: 0,
          height: 0,
          borderTop: "4px solid transparent",
          borderBottom: "4px solid transparent",
          borderLeft: "4px solid #1f2937",
        };
        break;

      case "right":
        positionStyle = {
          top: "50%",
          left: "100%",
          marginLeft: "8px",
          transform: "translateY(-50%)",
        };

        arrowStyle = {
          position: "absolute" as const,
          top: "50%",
          left: "-4px",
          transform: "translateY(-50%)",
          width: 0,
          height: 0,
          borderTop: "4px solid transparent",
          borderBottom: "4px solid transparent",
          borderRight: "4px solid #1f2937",
        };
        break;
    }

    const tooltipStyle = {
      ...baseTooltipStyle,
      ...positionStyle,
    };

    return (
      <div style={tooltipStyle}>
        {content}
        <div style={arrowStyle} />
      </div>
    );
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
              ref={tooltipTriggerRef}
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                flexShrink: 0,
              }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Icon
                name="help"
                width={16}
                height={16}
                style={{ cursor: "help", flexShrink: 0 }}
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
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
            }}
          >
            <input
              ref={inputRef}
              type="text"
              className="form-field"
              value={isEditing ? value : getDisplayValue()}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholderWithExamples()}
              style={{
                paddingRight: "40px",
                color: value ? "#9ca3af" : "#9ca3af",
                fontSize: "14px",
              }}
            />
            <button
              type="button"
              onClick={handleDropdownToggle}
              style={{
                position: "absolute",
                right: "12px",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "4px",
              }}
            >
              <Icon
                name="arrow"
                width={16}
                height={16}
                style={{
                  transform: isDropdownOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                }}
              />
            </button>
          </div>

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
              {!value && !isEditing && (
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
              {(isEditing ? getFilteredOptions() : enumOptions).map(
                (option) => (
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
                )
              )}
              {isEditing &&
                value &&
                !enumOptions.find((opt) => opt.value === value) && (
                  <div
                    className="dropdown-item"
                    onClick={() => handleOptionSelect(value)}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      fontSize: "14px",
                      color: "#4f46e5",
                      borderBottom: "1px solid #f3f4f6",
                      fontWeight: "500",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#f9fafb";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                    }}
                  >
                    Использовать "{value}"
                  </div>
                )}
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
            ref={tooltipTriggerRef}
            style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              flexShrink: 0,
            }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <Icon
              name="help"
              width={16}
              height={16}
              style={{ cursor: "help", flexShrink: 0 }}
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
