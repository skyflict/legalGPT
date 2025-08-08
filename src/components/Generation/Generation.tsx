import React, { useState, useRef, useEffect } from "react";
import Icon from "../Icon/Icon";
import Loader from "../Loader/Loader";
import "./Generation.css";
import { useDocumentGeneration } from "./hooks/useDocumentGeneration";

// Компонент спиннера
const Spinner = () => (
  <div className="spinner">
    <div className="spinner-circle"></div>
  </div>
);

const Generation = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showHelpText, setShowHelpText] = useState(true);

  // Состояния для полей формы пользователя
  const [userFormData, setUserFormData] = useState<Record<string, any>>({});

  // Хук для работы с генерацией документов
  const documentGeneration = useDocumentGeneration();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  // Определяем текущее состояние UI на основе состояния генерации
  const isLoading = documentGeneration.isLoading;
  const showContractType =
    documentGeneration.currentStep === "waiting_input" &&
    documentGeneration.status?.stage === "DOC_TYPE_DEDUCED" &&
    !isLoading; // Не показываем форму если идет загрузка
  const showContractSelect = false; // Пока не используется в новой структуре
  const showEntitiesForm =
    documentGeneration.currentStep === "waiting_input" &&
    documentGeneration.status?.stage === "ENTITIES_EXCTRACTED" &&
    !isLoading; // Не показываем форму если идет загрузка
  const showFinalResult = documentGeneration.currentStep === "completed";

  // Логика показа лоадера между шагами
  const shouldShowLoader = isLoading && !showFinalResult;

  const getLoaderMessage = () => {
    const stage = documentGeneration.status?.stage;

    switch (stage) {
      case "DOC_TYPE_DEDUCING":
        return "Определяем тип документа...";
      case "ENTITIES_EXTRACTING":
      case "ENTITIES_EXCTRACTED":
        return "Извлекаем необходимые данные...";
      case "DOC_GENERATING":
      case "DOC_GENERATED":
        return "Генерируем документ...";
      case "PROCESSING":
        return "Обрабатываем ваш запрос...";
      case "VALIDATING":
        return "Проверяем данные...";
      default:
        return isLoading ? "Обрабатываем ваш запрос..." : "";
    }
  };

  const handleQueryClick = (queryText: string) => {
    setQuery(queryText);
    setIsFocused(true);
    setShowOverlay(true);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleQueryInsert = (queryText: string) => {
    setQuery(queryText);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setShowOverlay(true);
  };

  const handleBlur = () => {
    if (
      query.length === 0 &&
      !isLoading &&
      !showContractType &&
      !showContractSelect &&
      !showEntitiesForm &&
      !showFinalResult
    ) {
      setIsFocused(false);
      setShowOverlay(false);
    }
  };

  const handleOverlayClick = () => {
    if (
      query.length === 0 &&
      !isLoading &&
      !showContractType &&
      !showContractSelect &&
      !showEntitiesForm &&
      !showFinalResult
    ) {
      setIsFocused(false);
      setShowOverlay(false);
      if (textareaRef.current) {
        textareaRef.current.blur();
      }
    }
  };

  const handleSend = async () => {
    console.log("Sending query:", query);

    // Сбрасываем высоту textarea до минимальной
    if (textareaRef.current) {
      textareaRef.current.style.height = "52px";
    }

    // Запускаем генерацию документа
    await documentGeneration.startGeneration(query);
  };

  const handleCancel = () => {
    setQuery("");
    setUserFormData({});
    setIsDropdownOpen(false);
    setIsFocused(false);
    setShowOverlay(false);
    documentGeneration.reset();
    if (textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const handleContractYes = () => {
    // Отправляем подтверждение типа договора согласно схеме API
    const defaultDocumentType =
      documentGeneration.status?.required_user_input?.schema?.properties
        ?.document_type?.default;
    documentGeneration.submitUserInput({
      event_type: "DOC_TYPE_CONFIRMED",
      data: {
        document_type:
          defaultDocumentType || documentGeneration.status?.type || "dcp",
      },
    });
  };

  const handleContractNo = () => {
    // Пока что просто сбрасываем, так как доступен только ДКП
    // В будущем здесь будет логика выбора другого типа договора
    handleCancel();
  };

  const handleContractSelect = (contractType: string) => {
    setIsDropdownOpen(false);

    // Отправляем выбранный тип договора
    documentGeneration.submitUserInput({
      event_type: "contract_type_selection",
      contract_type: contractType,
    });
  };

  const handleUserFormSubmit = () => {
    // Отправляем пользовательские данные согласно схеме от сервера
    const requiredInput = documentGeneration.status?.required_user_input as any;
    const eventType = requiredInput?.event_type || "ENTITIES_PROVIDED";

    documentGeneration.submitUserInput({
      event_type: eventType,
      data: userFormData,
    });
  };

  // Обработка изменений в полях пользовательской формы
  const handleUserFormFieldChange = (fieldName: string, value: string) => {
    setUserFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Получение схемы полей от сервера
  const getFormSchema = () => {
    return documentGeneration.status?.required_user_input?.schema;
  };

  // Получение обязательных полей
  const getRequiredFields = () => {
    const schema = getFormSchema();
    return schema?.required || [];
  };

  // Получение всех полей с их свойствами
  const getAllFields = () => {
    const schema = getFormSchema();
    return schema?.properties || {};
  };

  // Получение дополнительных полей (не обязательных)
  const getOptionalFields = () => {
    const allFields = getAllFields();
    const requiredFields = getRequiredFields();

    return Object.keys(allFields).filter(
      (fieldName) => !requiredFields.includes(fieldName)
    );
  };

  // Проверка валидности формы на основе схемы от бэкенда
  const isUserFormValid = () => {
    const requiredFields = getRequiredFields();
    return requiredFields.every((field: string) => userFormData[field]?.trim());
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleBackToContractType = () => {
    // В новой логике возвращаемся к предыдущему шагу через отмену
    handleCancel();
  };

  // Функция для преобразования типа договора в читаемое название
  const getContractTypeName = (type?: string) => {
    const typeMap: Record<string, string> = {
      dcp: "Договор купли-продажи",
      arenda: "Договор аренды",
      gift: "Договор дарения",
      uslugi: "Договор оказания услуг",
      zaym: "Договор займа",
      agent: "Агентский договор",
      naym: "Трудовой договор",
    };
    return type ? typeMap[type] : undefined;
  };

  const getResolvedDocumentType = (): string | undefined => {
    const statusType = documentGeneration.status?.type;
    if (statusType) return statusType;

    const defaultType =
      documentGeneration.status?.required_user_input?.schema?.properties
        ?.document_type?.default;
    return defaultType || undefined;
  };

  const getDocumentName = () => {
    const documentUrl = documentGeneration.status?.document_url;
    if (documentUrl) {
      const parts = documentUrl.split("/");
      const fileName = parts[parts.length - 1];
      // Декодируем URL-кодированные символы
      return decodeURIComponent(fileName);
    }
    return "Документ.doc";
  };

  const contractTypes = [
    "Договор купли-продажи",
    "Договор аренды",
    "Договор подряда",
    "Договор оказания услуг",
    "Трудовой договор",
  ];

  const handleCloseHelpText = () => {
    setShowHelpText(false);
  };

  // Автоматическое растягивание textarea
  useEffect(() => {
    if (textareaRef.current) {
      // Сбрасываем высоту для правильного расчета scrollHeight
      textareaRef.current.style.height = "auto";

      // Устанавливаем минимальную высоту
      const minHeight = 52;
      const scrollHeight = textareaRef.current.scrollHeight;

      // Устанавливаем высоту равную содержимому, но не меньше минимальной
      textareaRef.current.style.height =
        Math.max(minHeight, scrollHeight) + "px";
    }
  }, [query]);

  // Закрытие dropdown при клике вне его
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Проверяем клики вне dropdown'ов
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }

      // Проверяем клики вне области ввода для скрытия overlay
      if (
        showOverlay &&
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(event.target as Node)
      ) {
        handleOverlayClick();
      }
    };

    if (isDropdownOpen || showOverlay) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, showOverlay]);

  // Также добавляем обработчик для события input (для вставки текста)
  const handleInput = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const minHeight = 52;
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height =
        Math.max(minHeight, scrollHeight) + "px";
    }
  };

  // Управление состоянием загрузки теперь происходит в хуке useDocumentGeneration

  // Инициализация полей формы default значениями при получении схемы
  useEffect(() => {
    if (showEntitiesForm) {
      const allFields = getAllFields();
      const defaultValues: Record<string, any> = {};

      Object.entries(allFields).forEach(
        ([fieldName, fieldProps]: [string, any]) => {
          if (fieldProps?.default) {
            defaultValues[fieldName] = fieldProps.default;
          }
        }
      );

      if (Object.keys(defaultValues).length > 0) {
        setUserFormData((prev) => ({
          ...defaultValues,
          ...prev, // Сохраняем уже введенные пользователем данные
        }));
      }
    }
  }, [showEntitiesForm]);

  // Очистка при размонтировании компонента
  useEffect(() => {
    return () => {
      documentGeneration.reset();
    };
  }, []);

  // Проверка заполненности обязательных полей (заменена на isUserFormValid выше)

  return (
    <section
      className={`generation ${
        isFocused ||
        isLoading ||
        showContractType ||
        showContractSelect ||
        showEntitiesForm ||
        showFinalResult
          ? "generation--focused"
          : ""
      } ${
        showOverlay &&
        !isLoading &&
        !showContractType &&
        !showContractSelect &&
        !showEntitiesForm &&
        !showFinalResult
          ? "generation--overlay-visible"
          : ""
      }`}
    >
      <div className="container">
        <div className="generation-content">
          <div className="generation-form">
            <div className="form-group">
              <div
                className={`input-wrapper ${
                  isFocused ||
                  isLoading ||
                  showContractType ||
                  showContractSelect ||
                  showEntitiesForm ||
                  showFinalResult
                    ? "input-wrapper--focused"
                    : ""
                }`}
                ref={inputWrapperRef}
              >
                {(isFocused ||
                  isLoading ||
                  showContractType ||
                  showContractSelect ||
                  showEntitiesForm ||
                  showFinalResult) && <div className="input-placeholder" />}
                <textarea
                  ref={textareaRef}
                  id="query"
                  className={`generation-input ${
                    isFocused ||
                    isLoading ||
                    showContractType ||
                    showContractSelect ||
                    showEntitiesForm ||
                    showFinalResult
                      ? "generation-input--focused"
                      : ""
                  }`}
                  placeholder="Введите запрос"
                  value={query}
                  onChange={handleInputChange}
                  onInput={handleInput}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  rows={1}
                  readOnly={isLoading}
                />
                <div className="input-actions">
                  {query.length > 0 &&
                    !isLoading &&
                    !showContractType &&
                    !showContractSelect &&
                    !showEntitiesForm &&
                    !showFinalResult && (
                      <button
                        className="action-btn action-btn--cancel"
                        onClick={handleCancel}
                      >
                        <Icon name="cancel" size="sm" />
                      </button>
                    )}
                  {(showContractType ||
                    showContractSelect ||
                    showEntitiesForm ||
                    showFinalResult) && (
                    <button
                      className="action-btn action-btn--cancel"
                      onClick={handleCancel}
                    >
                      <Icon name="cancel" size="sm" />
                    </button>
                  )}
                  {isLoading ? (
                    <div className="action-btn action-btn--loading">
                      <Spinner />
                    </div>
                  ) : (
                    !showContractType &&
                    !showContractSelect &&
                    !showEntitiesForm &&
                    !showFinalResult && (
                      <button
                        className="action-btn action-btn--send"
                        onClick={handleSend}
                        disabled={query.length === 0}
                      >
                        <Icon name="send" size="sm" />
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {showHelpText && (
              <div className="help-text">
                <div className="help-text-content">
                  Если у вас остались юридические вопросы, вы всегда можете{" "}
                  <a href="#" className="help-link">
                    обратиться
                  </a>{" "}
                  к нашим юристам за помощью
                </div>
                <button
                  className="help-text-close"
                  onClick={handleCloseHelpText}
                  aria-label="Закрыть"
                >
                  <Icon name="close" width={16} height={16} />
                </button>
              </div>
            )}

            {/* Отображение ошибок */}
            {documentGeneration.error && (
              <div
                className="error-message"
                style={{
                  color: "#ef4444",
                  background: "rgba(239, 68, 68, 0.1)",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  margin: "16px 0",
                  fontSize: "14px",
                }}
              >
                {documentGeneration.error}
                <button
                  onClick={documentGeneration.clearError}
                  style={{
                    marginLeft: "8px",
                    background: "none",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          {/* Блок определения типа договора */}
          {showContractType && (
            <div className="contract-type-section">
              <div className="step-number-container">
                <div className="step-number">1</div>
                <span>
                  <Icon name="whiteLine" width={139} height={4} />
                </span>
              </div>

              <div className="contract-question">
                <div className="contract-question-title">
                  Правильно ли определен тип договора?
                </div>
                <div className="contract-type-card">
                  <div className="contract-type-icon">
                    <Icon name="text" width={24} height={24} />
                  </div>
                  <span className="contract-type-name">
                    {getContractTypeName(getResolvedDocumentType()) ||
                      "Неизвестный тип"}
                  </span>
                </div>

                <div className="contract-buttons">
                  <button
                    className="contract-btn contract-btn--yes"
                    onClick={handleContractYes}
                  >
                    Да
                  </button>
                  <button
                    className="contract-btn contract-btn--no"
                    onClick={handleContractNo}
                  >
                    Нет
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Блок выбора типа договора */}
          {showContractSelect && (
            <div className="contract-select-section">
              <div className="step-number-container">
                <div className="step-number">1</div>
                <span>
                  <Icon name="whiteLine" width={139} height={4} />
                </span>
              </div>

              <div className="contract-select-content">
                <div className="contract-select-header">
                  <button
                    className="back-button"
                    onClick={handleBackToContractType}
                  >
                    <Icon
                      name="arrow"
                      width={24}
                      height={24}
                      className="arrow-back"
                    />
                    <span>Назад</span>
                  </button>
                </div>

                <div className="contract-select-title">
                  Выберите нужный тип договора:
                </div>

                <div className="contract-dropdown" ref={dropdownRef}>
                  <button
                    className={`dropdown-trigger ${
                      isDropdownOpen ? "dropdown-trigger--open" : ""
                    }`}
                    onClick={handleDropdownToggle}
                  >
                    <span>
                      {documentGeneration.status?.type || "Не выбрано"}
                    </span>
                    <Icon
                      name="arrow"
                      width={24}
                      height={24}
                      className={`dropdown-arrow ${
                        isDropdownOpen ? "dropdown-arrow--open" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      {contractTypes.map((contractType, index) => (
                        <div
                          key={index}
                          className={`dropdown-item ${
                            documentGeneration.status?.type === contractType
                              ? "dropdown-item--selected"
                              : ""
                          }`}
                          onClick={() => handleContractSelect(contractType)}
                        >
                          {contractType}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Блок ввода сущностей */}
          {showEntitiesForm && (
            <div className="step-two-section">
              {isLoading && (
                <div className="step-number-container">
                  <div className="step-number-no-active">1</div>
                  <span>
                    <Icon name="whiteLine" width={139} height={4} />
                  </span>
                  <div className="step-number">2</div>
                  <span>
                    <Icon name="whiteLine" width={139} height={4} />
                  </span>
                </div>
              )}

              <div className="step-two-content">
                <div className="step-two-message">
                  {isLoading ? (
                    <div className="step-two-loading">
                      <Spinner />
                      <span>Обрабатываем ваш запрос</span>
                    </div>
                  ) : (
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
                          <Icon name="helpOutlined" width={16} height={16} />
                        </div>

                        <div className="form-fields">
                          {getRequiredFields().map((fieldName: string) => {
                            const fieldProps = getAllFields()[fieldName];
                            const defaultValue = fieldProps?.default || "";
                            const value =
                              userFormData[fieldName] || defaultValue;
                            const labelText = fieldProps?.title || fieldName;

                            return (
                              <div
                                key={fieldName}
                                className={`form-field-wrapper ${
                                  value && String(value).trim() !== ""
                                    ? "has-value"
                                    : ""
                                }`}
                              >
                                <input
                                  type="text"
                                  placeholder={labelText}
                                  className="form-field"
                                  value={value}
                                  onChange={(e) =>
                                    handleUserFormFieldChange(
                                      fieldName,
                                      e.target.value
                                    )
                                  }
                                />
                                {value && String(value).trim() !== "" && (
                                  <span className="floating-label">
                                    {labelText}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {getOptionalFields().length > 0 && (
                          <div className="additional-data">
                            <div className="additional-title">
                              Дополнительные данные
                              <Icon
                                name="helpOutlined"
                                width={16}
                                height={16}
                              />
                            </div>
                            {getOptionalFields().map((fieldName: string) => {
                              const fieldProps = getAllFields()[fieldName];
                              const defaultValue = fieldProps?.default || "";
                              const value =
                                userFormData[fieldName] || defaultValue;
                              const labelText = fieldProps?.title || fieldName;

                              return (
                                <div
                                  key={fieldName}
                                  className={`form-field-wrapper ${
                                    value && String(value).trim() !== ""
                                      ? "has-value"
                                      : ""
                                  }`}
                                >
                                  <input
                                    type="text"
                                    placeholder={labelText}
                                    className="form-field"
                                    value={value}
                                    onChange={(e) =>
                                      handleUserFormFieldChange(
                                        fieldName,
                                        e.target.value
                                      )
                                    }
                                  />
                                  {value && String(value).trim() !== "" && (
                                    <span className="floating-label">
                                      {labelText}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <div className="form-actions">
                          <button
                            className="action-button action-button--primary"
                            onClick={handleUserFormSubmit}
                            disabled={!isUserFormValid()}
                          >
                            Далее
                          </button>
                        </div>

                        <div className="privacy-notice">
                          <Icon name="lock" width={16} height={16} />
                          <div>
                            <div>Ваши данные надёжно защищены.</div>
                            <div>
                              С правилами передачи данных можете ознакомиться{" "}
                              <a href="#">здесь</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Финальный результат */}
          {showFinalResult && (
            <div className="final-result-section">
              <div className="final-progress">
                <div className="step-number-no-active">
                  <Icon name="check" width={16} height={16} />
                </div>
                <span>
                  <Icon name="whiteLine" width={139} height={4} />
                </span>
                <div className="step-number-no-active">
                  <Icon name="check" width={16} height={16} />
                </div>
                <span>
                  <Icon name="whiteLine" width={139} height={4} />
                </span>
                <div className="step-number-no-active">
                  <Icon name="check" width={16} height={16} />
                </div>
                <span>
                  <Icon name="whiteLine" width={139} height={4} />
                </span>
                <div className="step-number final-step">
                  <Icon name="check" width={16} height={16} color="#fff" />
                </div>
              </div>

              <div className="final-content">
                <div className="final-title">
                  Документ сгенерирован и добавлен в историю:
                </div>

                <div className="document-card">
                  <span className="document-icon">
                    <Icon name="text" width={24} height={24} />
                  </span>
                  <span className="document-name">{getDocumentName()}</span>
                </div>

                <button
                  className="download-button"
                  onClick={() => {
                    const downloadUrl = documentGeneration.status?.document_url;
                    if (downloadUrl) {
                      window.open(downloadUrl, "_blank");
                    } else {
                      console.error("Ссылка для скачивания недоступна");
                    }
                  }}
                  disabled={!documentGeneration.status?.document_url}
                >
                  <span>Скачать</span>
                  <Icon
                    name="download"
                    width={24}
                    height={24}
                    className="download-icon"
                  />
                </button>

                <div className="consultation-section">
                  <div className="consultation-content">
                    <div className="consultation-text">
                      <div className="consultation-title">
                        Провести консультацию у юриста
                      </div>
                      <div className="consultation-description">
                        Если вам нужна профессиональная поддержка при дальнейшей
                        работе с договором или у вас остались юридические
                        вопросы, то наш специалист всегда готов вам помочь. Если
                        вас не устроит помощь специалиста, мы вернём вам токены
                      </div>

                      <button className="consultation-button">
                        Записаться
                      </button>

                      <div className="consultation-note">
                        При записи на консультацию на вашем счёту будет
                        заморожено 99 коинов для оплаты консультации
                      </div>
                    </div>

                    <div className="consultation-image" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Исходные блоки показываются только в начальном состоянии */}
          {documentGeneration.currentStep === "idle" && (
            <>
              <div className="example-section">
                <div className="example-title">Пример запроса:</div>
                <div className="example-text">
                  Привет! Составь, пожалуйста, договор оказания услуг, по
                  которому я, как индивидуальный предприниматель Максим Игоревич
                  Смирнов, буду проводить уроки английского языка. Стоимость
                  одного занятия — 3 000 рублей, продолжительность — 60 минут (1
                  час), при этом точное время начала занятия будет определяться
                  за 2 дня до занятия. Оплата моих услуг будет осуществляться
                  безналичным способом после проведения занятия
                </div>
              </div>

              <div className="frequent-queries">
                <div className="frequent-title">Частые запросы:</div>
                <div className="queries-grid">
                  <div className="query-button-wrapper">
                    <div
                      className="query-button"
                      onClick={() => handleQueryInsert("Договор дарения")}
                    >
                      <span className="query-button-text">Договор дарения</span>
                      <button
                        className="apply-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQueryClick("Договор дарения");
                        }}
                      >
                        Применить
                      </button>
                    </div>
                  </div>
                  <div className="query-button-wrapper">
                    <div
                      className="query-button"
                      onClick={() => handleQueryInsert("Доверенность")}
                    >
                      <span className="query-button-text">Доверенность</span>
                      <button
                        className="apply-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQueryClick("Доверенность");
                        }}
                      >
                        Применить
                      </button>
                    </div>
                  </div>
                  <div className="query-button-wrapper">
                    <div
                      className="query-button"
                      onClick={() => handleQueryInsert("Регистрация компании")}
                    >
                      <span className="query-button-text">
                        Регистрация компании
                      </span>
                      <button
                        className="apply-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQueryClick("Регистрация компании");
                        }}
                      >
                        Применить
                      </button>
                    </div>
                  </div>
                  <div className="query-button-wrapper">
                    <div
                      className="query-button"
                      onClick={() => handleQueryInsert("Регистрация компании")}
                    >
                      <span className="query-button-text">
                        Регистрация компании
                      </span>
                      <button
                        className="apply-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQueryClick("Регистрация компании");
                        }}
                      >
                        Применить
                      </button>
                    </div>
                  </div>
                  <div className="query-button-wrapper">
                    <div
                      className="query-button"
                      onClick={() => handleQueryInsert("Продажа машины")}
                    >
                      <span className="query-button-text">Продажа машины</span>
                      <button
                        className="apply-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQueryClick("Продажа машины");
                        }}
                      >
                        Применить
                      </button>
                    </div>
                  </div>
                  <div className="query-button-wrapper">
                    <div
                      className="query-button"
                      onClick={() => handleQueryInsert("Продажа недвижимости")}
                    >
                      <span className="query-button-text">
                        Продажа недвижимости
                      </span>
                      <button
                        className="apply-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQueryClick("Продажа недвижимости");
                        }}
                      >
                        Применить
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Overlay для затемнения фона */}
      <div
        className={`generation-overlay ${
          showOverlay &&
          !isLoading &&
          !showContractType &&
          !showContractSelect &&
          !showEntitiesForm &&
          !showFinalResult
            ? "generation-overlay--visible"
            : ""
        }`}
        onClick={handleOverlayClick}
      />

      {/* Loader между шагами */}
      <Loader isVisible={shouldShowLoader} message={getLoaderMessage()} />
    </section>
  );
};

export default Generation;
