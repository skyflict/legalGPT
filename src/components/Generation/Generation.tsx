import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "../Icon/Icon";
import Loader from "../Loader/Loader";
import "./Generation.css";
import { useDocumentGeneration } from "./hooks/useDocumentGeneration";
import QueryInput from "./components/QueryInput/QueryInput";
import ContractTypeStep from "./components/ContractTypeStep/ContractTypeStep";
import EntitiesFormStep from "./components/EntitiesFormStep/EntitiesFormStep";
import FinalResultStep from "./components/FinalResultStep/FinalResultStep";
import Spinner from "./components/Spinner/Spinner";
import { useResolvedDocumentType } from "./hooks/useResolvedDocumentType";
import { useFormSchema } from "./hooks/useFormSchema";
import { useUserForm, useFormValidity } from "./hooks/useUserForm";
import { useLoaderMessage } from "./hooks/useLoaderMessage";
import { useDocumentTypes } from "./hooks/useDocumentTypes";
import { useLatestIncompleteDocument } from "../../hooks/useLatestIncompleteDocument";
import Modal from "../Modal";

const Generation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [openTemplates, setOpenTemplates] = useState<Record<string, boolean>>(
    {}
  );
  const [showManualContractSelect, setShowManualContractSelect] =
    useState(false);
  // const [showHelpText, setShowHelpText] = useState(true);

  const documentGeneration = useDocumentGeneration();
  const { documentTypes, getDocumentTypeById } = useDocumentTypes();
  const { latestDocument } = useLatestIncompleteDocument();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  const isLoading = documentGeneration.isLoading;
  const showContractType =
    documentGeneration.currentStep === "waiting_input" &&
    documentGeneration.status?.stage === "DOC_TYPE_DEDUCED" &&
    !isLoading &&
    !showManualContractSelect;
  const showContractSelect = showManualContractSelect;
  const showEntitiesForm =
    documentGeneration.currentStep === "waiting_input" &&
    (documentGeneration.status?.stage === "ENTITIES_EXCTRACTED" ||
      documentGeneration.status?.stage === "ENTITIES_PROVIDED") &&
    !isLoading;
  const showFinalResult = documentGeneration.currentStep === "completed";

  const shouldShowLoader = isLoading && !showFinalResult;
  const loaderMessage = useLoaderMessage(
    isLoading,
    documentGeneration.status as any
  );

  const isLawViolated = documentGeneration.status?.stage === "LAW_VIOLATED";

  const handleCloseLawViolatedModal = () => {
    // Возврат на главную: сбрасываем состояние генерации и форму
    documentGeneration.reset();
    setQuery("");
    setShowOverlay(false);
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {}
  };

  const handleQueryClick = (queryText: string) => {
    setQuery(queryText);
  };

  // Убрали кнопку "Применить"; клика по карточке достаточно

  const handleFocus = () => {
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
      setShowOverlay(false);
    }
  };

  const handleOverlayClick = () => {
    // При клике вне инпута сбрасываем состояние наведения/фокуса,
    // если не запущены другие шаги генерации
    if (
      !isLoading &&
      !showContractType &&
      !showContractSelect &&
      !showEntitiesForm &&
      !showFinalResult
    ) {
      setShowOverlay(false);
      if (textareaRef.current) {
        textareaRef.current.blur();
      }
    }
  };

  const handleSend = async () => {
    await documentGeneration.startGeneration(query);
  };

  const handleCancel = () => {
    setQuery("");
    setIsDropdownOpen(false);
    setShowOverlay(false);
    setShowManualContractSelect(false);
    documentGeneration.reset();
    if (textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const handleContractYes = () => {
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
    setShowManualContractSelect(true);
  };

  const handleContractSelect = (contractId: string) => {
    setIsDropdownOpen(false);
    setShowManualContractSelect(false);

    const selectedType = getDocumentTypeById(contractId);
    if (selectedType) {
      documentGeneration.submitUserInput({
        event_type: "DOC_TYPE_CONFIRMED",
        data: {
          document_type: selectedType.id,
        },
      });
    }
  };

  const handleUserFormSubmit = () => {
    const requiredInput = documentGeneration.status?.required_user_input as any;
    const eventType = requiredInput?.event_type || "ENTITIES_PROVIDED";

    documentGeneration.submitUserInput({
      event_type: eventType,
      data: userFormValues,
    });
  };

  const handleContinueGeneration = () => {
    if (latestDocument) {
      documentGeneration.continueGeneration(latestDocument.id);
      // Очищаем URL параметр
      setSearchParams({});
    }
  };

  // Обработка URL параметра document для прямого продолжения генерации
  useEffect(() => {
    const documentId = searchParams.get("document");
    if (documentId && documentGeneration.currentStep === "idle") {
      documentGeneration.continueGeneration(documentId);
      // Очищаем URL параметр
      setSearchParams({});
    }
  }, [
    searchParams,
    documentGeneration.currentStep,
    documentGeneration.continueGeneration,
    setSearchParams,
  ]);

  const { requiredFields, optionalFields, allFields, groups } = useFormSchema(
    documentGeneration.status as any
  );
  const { values: userFormValues, setField: setUserFormField } = useUserForm(
    allFields as any,
    showEntitiesForm,
    documentGeneration.status?.context?.entities
  );
  const formIsValid = useFormValidity(requiredFields, userFormValues);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleBackToContractType = () => {
    setShowManualContractSelect(false);
    setIsDropdownOpen(false);
  };

  const toggleTemplate = (title: string) => {
    setOpenTemplates((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const getContractTypeName = (type?: string) => {
    if (!type) return undefined;
    const documentType = getDocumentTypeById(type);
    return documentType?.name;
  };

  const resolvedDocType = useResolvedDocumentType(
    documentGeneration.status as any
  );

  const getDocumentName = () => {
    const documentUrl = documentGeneration.status?.document_url;
    if (documentUrl) {
      const parts = documentUrl.split("/");
      const fileName = parts[parts.length - 1];
      return decodeURIComponent(fileName);
    }
    return "Документ.doc";
  };

  // Используем данные из API вместо статического массива
  const contractTypes = documentTypes;

  const frequentQueries = [
    {
      title: "Услуги",
      prompt:
        "Хочу заключить договор услуг, по которому _____ (исполнитель по договору) окажет _____ (заказчик по договору) услуги по _____ (сфера оказываемых услуг), в рамках оказания услуг _____ (подробное описание оказываемых услуг и результата). Все услуги должны быть оказаны в течение (срок оказания услуг), вознаграждение исполнителя составит _____ (сумма вознаграждения), оплата будет _____ (наличными / переводом денежных средств).",
    },
    {
      title: "Договор займа",
      prompt:
        "Необходимо составить договор займа между _____ (заемщик) и _____ (займодатель), на сумму _____ (сумма займа) рублей. заемщик вернет заем в течение_____ (срок возврата займа). Процентная ставка по займу составляет _____ (процент по заему). Погашение займа _____ (когда заемщик должен вернуть сумму займа). Заем выдается _____ (наличными / переводом денежных средств).",
    },
    {
      title: "ДКП",
      prompt:
        "Хочу заключить договор купли продажи _____ (товар), со следующими уникальными признаками _____ (описание товара) в количестве _____ (количество товара) между _____ (покупатель) и _____ (продавец). Сумма договора _____ (стоимость товара и всех сопутствующих услуг), товар будет доставлен покупателю по адресу _____ (адрес доставки), оплата _____ (наличными / переводом денежных средств) в течение _____ (количество дней для оплаты товара) после подписания договора.",
    },
    {
      title: "Найм жилого помещения",
      prompt:
        "Хочу заключить договор найма жилого помещения _____ (адрес помещения, включая город, улицу, дом, квартиру), со следующими уникальными признаками _____ (описание: площадь, количество комнат, этаж, мебель, техника, состояние и т.д.) между _____ (наймодатель - ФИО/название и реквизиты собственника) и _____ (наниматель - ФИО/паспортные данные). Сумма договора _____ (размер ежемесячной платы за наем, стоимость коммунальных услуг и других платежей, если включены) в месяц, помещение будет предоставлено нанимателю для проживания с _____ (дата начала найма) по _____ (дата окончания найма). Оплата _____ (наличными / банковским переводом на счет наймодателя) в течение _____ (количество дней каждого месяца для внесения платы) каждого календарного месяца периода найма.",
    },
    {
      title: "Дарение",
      prompt:
        'Хочу заключить договор дарения _____ (наименование дара: имущество, вещь, например, квартира, автомобиль, акции), со следующими уникальными признаками _____ (описание: для недвижимости - адрес, кадастровый номер, площадь; для авто - марка, модель, VIN, гос. номер; для иного - детали) в количестве _____ (количество: обычно 1 для объекта, для акций/долей - число и номинал) между _____ (даритель - ФИО/название и реквизиты) и _____ (одаряемый - ФИО/название и реквизиты). Дар передается одаряемому безвозмездно. Передача дара (владения) будет осуществлена _____ (способ и срок передачи: например, "путем вручения ключей и подписания акта приема-передачи", "путем регистрации перехода права собственности в ЕГРН", "не позднее 10 дней после подписания договора"). Право собственности переходит к одаряемому _____ (момент перехода права: например, "с момента подписания акта приема-передачи", "с момента государственной регистрации").',
    },
    {
      title: "Хранение",
      prompt:
        "Хочу заключить договор хранения _____ (имущество), со следующими уникальными признаками _____ (описание имущества) в количестве _____ (количество имущества) между _____ (клиент, передающий на хранение) и _____ (охраняющая сторона, хранитель). Сумма договора _____ (стоимость услуг хранения и всех сопутствующих услуг), имущество будет принято на хранение по адресу _____ (адрес хранения), передача имущества на хранение осуществляется _____ (дата и/или порядок передачи). Оплата _____ (наличными / переводом денежных средств) производится в течение _____ (количество дней для оплаты услуги хранения) после подписания договора.",
    },
    {
      title: "Договор дарения",
      prompt:
        "Хочу заключить договор дарения _____ (предмет дарения), со следующими уникальными признаками _____ (описание предмета дарения) в количестве _____ (количество предметов) между _____ (даритель) и _____ (одаряемый). Дар передается по адресу _____ (адрес передачи дара). Дар будет передан _____ (дата передачи или порядок передачи). Стороны подтверждают безвозмездность передачи имущества.",
    },
  ];

  // const handleCloseHelpText = () => {
  //   setShowHelpText(false);
  // };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }

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

  useEffect(() => {
    return () => {
      documentGeneration.reset();
    };
  }, []);

  return (
    <section
      className={`generation ${
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
              <QueryInput
                value={query}
                isBusy={isLoading}
                disabled={documentGeneration.currentStep !== "idle"}
                isFocused={
                  isLoading ||
                  showContractType ||
                  showContractSelect ||
                  showEntitiesForm ||
                  showFinalResult
                }
                showOverlay={
                  showOverlay &&
                  !isLoading &&
                  !showContractType &&
                  !showContractSelect &&
                  !showEntitiesForm &&
                  !showFinalResult
                }
                onChange={setQuery}
                onSend={handleSend}
                onCancel={handleCancel}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onOverlayClick={handleOverlayClick}
              />
            </div>

            {/* Кнопка продолжения генерации */}
            {!isLoading &&
              !showContractType &&
              !showContractSelect &&
              !showEntitiesForm &&
              !showFinalResult &&
              latestDocument &&
              documentGeneration.currentStep === "idle" && (
                <div className="continue-generation-section">
                  <div className="continue-generation-section-content">
                    <div style={{ flex: "1", minWidth: "0" }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#1f2937",
                          marginBottom: "4px",
                        }}
                      >
                        У вас есть незавершенная генерация
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6b7280",
                          wordBreak: "break-word",
                          lineHeight: "1.4",
                        }}
                      >
                        {latestDocument.context?.query
                          ? `"${latestDocument.context.query.slice(0, 80)}${
                              latestDocument.context.query.length > 80
                                ? "..."
                                : ""
                            }"`
                          : "Продолжите генерацию документа"}
                      </div>
                    </div>
                    <button
                      onClick={handleContinueGeneration}
                      style={{
                        background: "#4f46e5",
                        color: "#fff",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 20px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: "pointer",
                        transition: "background-color 0.2s",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.background = "#4338ca";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.background = "#4f46e5";
                      }}
                    >
                      Продолжить
                    </button>
                  </div>
                </div>
              )}

            {/* <HelpText visible={showHelpText} onClose={handleCloseHelpText} /> */}

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

          {showContractType && (
            <div className="contract-type-section">
              <div className="step-number-container">
                <div className="step-number">1</div>
                <span>
                  <Icon name="whiteLine" width={139} height={4} />
                </span>
              </div>
              <ContractTypeStep
                typeName={
                  getContractTypeName(resolvedDocType) || "Неизвестный тип"
                }
                onConfirm={handleContractYes}
                onReject={handleContractNo}
              />
            </div>
          )}

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
                      {getContractTypeName(documentGeneration.status?.type) ||
                        "Не выбрано"}
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
                      {contractTypes.map((contractType) => (
                        <div
                          key={contractType.id}
                          className={`dropdown-item ${
                            documentGeneration.status?.type === contractType.id
                              ? "dropdown-item--selected"
                              : ""
                          }`}
                          onClick={() => handleContractSelect(contractType.id)}
                        >
                          {contractType.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

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

              {isLoading ? (
                <div className="step-two-loading">
                  <Spinner />
                  <span>Обрабатываем ваш запрос</span>
                </div>
              ) : (
                <EntitiesFormStep
                  requiredFields={requiredFields}
                  optionalFields={optionalFields}
                  allFields={allFields as any}
                  values={userFormValues as any}
                  onChange={(f, v) => setUserFormField(f, v)}
                  onSubmit={handleUserFormSubmit}
                  isValid={formIsValid}
                  groups={groups as any}
                />
              )}
            </div>
          )}

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

              <FinalResultStep
                documentName={getDocumentName()}
                downloadUrl={documentGeneration.status?.document_url}
              />
            </div>
          )}

          {documentGeneration.currentStep === "idle" && (
            <>
              <div className="example-section">
                <div className="example-title">Пример запроса:</div>
                <div className="example-text">
                  Привет! Помоги составить договор оказания услуг: я, Максим
                  Игоревич Смирнов, оказываю услуги репетитора. Стоимость одного
                  занятия 3 000 рублей, продолжительность 1 час. Время начала
                  занятия согласовывается за 2 дня до урока. Оплата по безналу
                  после проведения.
                </div>
              </div>

              <div className="frequent-queries">
                <div className="frequent-queries-content">
                  <div className="frequent-queries-text">
                    <h2 className="frequent-queries-title">
                      Шаблоны* запросов для составления договора:
                    </h2>
                    <div className="frequent-queries-list">
                      {frequentQueries.map((item, index) => (
                        <div key={index} className="frequent-queries-item">
                          <button
                            className={`frequent-queries-question ${
                              openTemplates[item.title] ? "active" : ""
                            }`}
                            onClick={() => toggleTemplate(item.title)}
                          >
                            <span>{item.title}</span>
                            <Icon
                              name="arrow"
                              className="frequent-queries-icon"
                            />
                          </button>
                          <div
                            className={`frequent-queries-answer ${
                              openTemplates[item.title]
                                ? "frequent-queries-answer--open"
                                : "frequent-queries-answer--closed"
                            }`}
                          >
                            <div className="frequent-queries-answer-content">
                              {item.prompt}
                              <button
                                className="use-template-btn"
                                onClick={() => handleQueryClick(item.prompt)}
                              >
                                Использовать шаблон
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="frequent-queries-image" />
                </div>
                <div className="frequent-queries-text-2">
                  *Пока мы работаем только с предложенными типами договоров
                </div>
              </div>
            </>
          )}
        </div>
      </div>

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

      <Loader isVisible={shouldShowLoader} message={loaderMessage} />

      <Modal
        isOpen={!!isLawViolated}
        onClose={handleCloseLawViolatedModal}
        title="Генерация отменена"
      >
        <div>
          <p>
            Генерация отменена, запрос нарушает требования законодательства.
          </p>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={handleCloseLawViolatedModal}
              className="modal-primary-btn"
            >
              На главную
            </button>
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default Generation;
