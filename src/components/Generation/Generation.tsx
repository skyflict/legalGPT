import React, { useState, useRef, useEffect } from "react";
import Icon from "../Icon/Icon";
import "./Generation.css";

// Компонент спиннера
const Spinner = () => (
  <div className="spinner">
    <div className="spinner-circle"></div>
  </div>
);

const Generation = () => {
  const [query, setQuery] = useState("");
  const [provider, setProvider] = useState("yandexgpt");
  const [isFocused, setIsFocused] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showContractType, setShowContractType] = useState(false);
  const [showContractSelect, setShowContractSelect] = useState(false);
  const [selectedContract, setSelectedContract] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProviderDropdownOpen, setIsProviderDropdownOpen] = useState(false);
  const [showStepTwo, setShowStepTwo] = useState(false);
  const [stepTwoLoading, setStepTwoLoading] = useState(false);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [showHelpText, setShowHelpText] = useState(true);

  // Состояния для полей формы
  const [fullName, setFullName] = useState("");
  const [requestText, setRequestText] = useState("");
  const [address, setAddress] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const providerDropdownRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  const handleQueryClick = (queryText: string) => {
    setQuery(queryText);
    setIsFocused(true);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
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
      !showStepTwo &&
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
      !showStepTwo &&
      !showFinalResult
    ) {
      setIsFocused(false);
      setShowOverlay(false);
      if (textareaRef.current) {
        textareaRef.current.blur();
      }
    }
  };

  const handleSend = () => {
    console.log("Sending query:", query, "with provider:", provider);
    setIsLoading(true);
    setShowContractType(false);

    // Сбрасываем высоту textarea до минимальной
    if (textareaRef.current) {
      textareaRef.current.style.height = "52px";
    }

    // Симуляция загрузки
    setTimeout(() => {
      setIsLoading(false);
      setShowContractType(true);
    }, 2000);
  };

  const handleCancel = () => {
    setQuery("");
    setIsLoading(false);
    setShowContractType(false);
    setShowContractSelect(false);
    setShowStepTwo(false);
    setStepTwoLoading(false);
    setShowFinalResult(false);
    setSelectedContract("");
    setIsDropdownOpen(false);
    setIsProviderDropdownOpen(false);
    setIsFocused(false);
    setShowOverlay(false);
    if (textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const handleContractNo = () => {
    setShowContractType(false);
    setShowContractSelect(true);
  };

  const handleBackToContractType = () => {
    setShowContractSelect(false);
    setShowContractType(true);
    setSelectedContract("");
    setIsDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProviderDropdownToggle = () => {
    setIsProviderDropdownOpen(!isProviderDropdownOpen);
  };

  const handleProviderSelect = (providerValue: string) => {
    setProvider(providerValue);
    setIsProviderDropdownOpen(false);
  };

  const handleContractSelect = (contractType: string) => {
    setSelectedContract(contractType);
    setIsDropdownOpen(false);

    // Переход ко второму этапу
    setShowContractSelect(false);
    setStepTwoLoading(true);
    setShowStepTwo(true);

    // Симуляция загрузки
    setTimeout(() => {
      setStepTwoLoading(false);
    }, 5000);
  };

  const handleContractYes = () => {
    // Переход ко второму этапу
    setShowContractType(false);
    setStepTwoLoading(true);
    setShowStepTwo(true);

    // Симуляция загрузки
    setTimeout(() => {
      setStepTwoLoading(false);
    }, 2000);
  };

  const contractTypes = [
    "Договор купли-продажи",
    "Договор аренды",
    "Договор подряда",
    "Договор оказания услуг",
    "Трудовой договор",
  ];

  const providerOptions = [
    { value: "yandexgpt", label: "YandexGPT" },
    { value: "chatgpt", label: "ChatGPT" },
    { value: "gigachat", label: "GigaChat" },
  ];

  const handleStepThreeNext = () => {
    setShowStepTwo(false);
    setShowFinalResult(true);
  };

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
      if (
        providerDropdownRef.current &&
        !providerDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProviderDropdownOpen(false);
      }

      // Проверяем клики вне области ввода для скрытия overlay
      if (
        showOverlay &&
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(event.target as Node) &&
        providerDropdownRef.current &&
        !providerDropdownRef.current.contains(event.target as Node)
      ) {
        handleOverlayClick();
      }
    };

    if (isDropdownOpen || isProviderDropdownOpen || showOverlay) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isProviderDropdownOpen, showOverlay]);

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

  // Проверка заполненности обязательных полей
  const isFormValid = fullName.trim() !== "" && requestText.trim() !== "";

  // Обработчики изменения полей формы
  const handleFullNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFullName(e.target.value);
  };

  const handleRequestTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRequestText(e.target.value);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
  };

  return (
    <section
      className={`generation ${
        isFocused ||
        isLoading ||
        showContractType ||
        showContractSelect ||
        showStepTwo ||
        showFinalResult
          ? "generation--focused"
          : ""
      } ${
        showOverlay &&
        !isLoading &&
        !showContractType &&
        !showContractSelect &&
        !showStepTwo &&
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
                  showStepTwo ||
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
                  showStepTwo ||
                  showFinalResult) && <div className="input-placeholder" />}
                <textarea
                  ref={textareaRef}
                  id="query"
                  className={`generation-input ${
                    isFocused ||
                    isLoading ||
                    showContractType ||
                    showContractSelect ||
                    showStepTwo ||
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
                    !showStepTwo &&
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
                    showStepTwo ||
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
                    !showStepTwo &&
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

            <div className="form-group">
              <div className="custom-select-wrapper" ref={providerDropdownRef}>
                <div
                  className={`custom-select ${
                    isProviderDropdownOpen ? "open" : ""
                  }`}
                  onClick={handleProviderDropdownToggle}
                >
                  <span className="select-value">
                    {providerOptions.find((option) => option.value === provider)
                      ?.label || "Выберите провайдера"}
                  </span>
                  <span
                    className={`select-arrow ${
                      isProviderDropdownOpen ? "open" : ""
                    }`}
                  >
                    <Icon name="arrow" />
                  </span>
                </div>
                {isProviderDropdownOpen && (
                  <div className="custom-select-dropdown">
                    {providerOptions.map((option) => (
                      <div
                        key={option.value}
                        className={`select-option ${
                          option.value === provider ? "selected" : ""
                        }`}
                        onClick={() => handleProviderSelect(option.value)}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                )}
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
                    Договор купли-продажи
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
                    <span>{selectedContract || "Не выбрано"}</span>
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
                            selectedContract === contractType
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

          {/* Второй этап - проверка на соответствие законам */}
          {showStepTwo && (
            <div className="step-two-section">
              {stepTwoLoading && (
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
                  {stepTwoLoading ? (
                    <div className="step-two-loading">
                      <Spinner />
                      <span>Проверяем запрос на соответствие законам</span>
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
                        <div className="step-number-no-active">
                          <Icon name="check" width={16} height={16} />
                        </div>
                        <span>
                          <Icon name="whiteLine" width={139} height={4} />
                        </span>
                        <div className="step-number">3</div>
                      </div>

                      <div className="step-three-content">
                        <div className="step-three-title">
                          Введите обязательные недостающие данные
                          <Icon name="helpOutlined" width={16} height={16} />
                        </div>

                        <div className="form-fields">
                          <input
                            type="text"
                            placeholder="ФИО"
                            className="form-field"
                            value={fullName}
                            onChange={handleFullNameChange}
                          />
                          <input
                            type="text"
                            placeholder="Введите запрос"
                            className="form-field"
                            value={requestText}
                            onChange={handleRequestTextChange}
                          />
                        </div>

                        <div className="additional-data">
                          <div className="additional-title">
                            Дополнительные данные
                            <Icon name="helpOutlined" width={16} height={16} />
                          </div>
                          <input
                            type="text"
                            placeholder="Адрес регистрации"
                            className="form-field"
                            value={address}
                            onChange={handleAddressChange}
                          />
                        </div>

                        <div className="form-actions">
                          <button
                            className="action-button action-button--primary"
                            onClick={handleStepThreeNext}
                            disabled={!isFormValid}
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
                  <span className="document-name">
                    Договор продажи недвижимости.doc
                  </span>
                </div>

                <button className="download-button">
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

          {/* Исходные блоки показываются только когда нет загрузки и не показан блок определения типа */}
          {!isLoading &&
            !showContractType &&
            !showContractSelect &&
            !showStepTwo &&
            !showFinalResult && (
              <>
                <div className="example-section">
                  <div className="example-title">Пример запроса:</div>
                  <div className="example-text">
                    Привет! Составь, пожалуйста, договор оказания услуг, по
                    которому я, как индивидуальный предприниматель Максим
                    Игоревич Смирнов, буду проводить уроки английского языка.
                    Стоимость одного занятия — 3 000 рублей, продолжительность —
                    60 минут (1 час), при этом точное время начала занятия будет
                    определяться за 2 дня до занятия. Оплата моих услуг будет
                    осуществляться безналичным способом после проведения занятия
                  </div>
                </div>

                <div className="frequent-queries">
                  <div className="frequent-title">Частые запросы:</div>
                  <div className="queries-grid">
                    <div
                      className="query-button"
                      onClick={() => handleQueryClick("Договор дарения")}
                    >
                      Договор дарения
                    </div>
                    <div
                      className="query-button"
                      onClick={() => handleQueryClick("Доверенность")}
                    >
                      Доверенность
                    </div>
                    <div
                      className="query-button"
                      onClick={() => handleQueryClick("Регистрация компании")}
                    >
                      Регистрация компании
                    </div>
                    <div
                      className="query-button"
                      onClick={() => handleQueryClick("Регистрация компании")}
                    >
                      Регистрация компании
                    </div>
                    <div
                      className="query-button"
                      onClick={() => handleQueryClick("Продажа машины")}
                    >
                      Продажа машины
                    </div>
                    <div
                      className="query-button"
                      onClick={() => handleQueryClick("Продажа недвижимости")}
                    >
                      Продажа недвижимости
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
          !showStepTwo &&
          !showFinalResult
            ? "generation-overlay--visible"
            : ""
        }`}
        onClick={handleOverlayClick}
      />
    </section>
  );
};

export default Generation;
