import { useState, useRef, useEffect } from "react";
import Icon from "../Icon/Icon";
import Loader from "../Loader/Loader";
import "./Generation.css";
import { useDocumentGeneration } from "./hooks/useDocumentGeneration";
import QueryInput from "./components/QueryInput/QueryInput";
import HelpText from "./components/HelpText/HelpText";
import ContractTypeStep from "./components/ContractTypeStep/ContractTypeStep";
import EntitiesFormStep from "./components/EntitiesFormStep/EntitiesFormStep";
import FinalResultStep from "./components/FinalResultStep/FinalResultStep";
import Spinner from "./components/Spinner/Spinner";
import { useResolvedDocumentType } from "./hooks/useResolvedDocumentType";
import { useFormSchema } from "./hooks/useFormSchema";
import { useUserForm, useFormValidity } from "./hooks/useUserForm";
import { useLoaderMessage } from "./hooks/useLoaderMessage";

const Generation = () => {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showHelpText, setShowHelpText] = useState(true);

  const documentGeneration = useDocumentGeneration();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);

  const isLoading = documentGeneration.isLoading;
  const showContractType =
    documentGeneration.currentStep === "waiting_input" &&
    documentGeneration.status?.stage === "DOC_TYPE_DEDUCED" &&
    !isLoading;
  const showContractSelect = false;
  const showEntitiesForm =
    documentGeneration.currentStep === "waiting_input" &&
    documentGeneration.status?.stage === "ENTITIES_EXCTRACTED" &&
    !isLoading;
  const showFinalResult = documentGeneration.currentStep === "completed";

  const shouldShowLoader = isLoading && !showFinalResult;
  const loaderMessage = useLoaderMessage(
    isLoading,
    documentGeneration.status as any
  );

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
    await documentGeneration.startGeneration(query);
  };

  const handleCancel = () => {
    setQuery("");
    setIsDropdownOpen(false);
    setIsFocused(false);
    setShowOverlay(false);
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
    handleCancel();
  };

  const handleContractSelect = (contractType: string) => {
    setIsDropdownOpen(false);

    documentGeneration.submitUserInput({
      event_type: "contract_type_selection",
      contract_type: contractType,
    });
  };

  const handleUserFormSubmit = () => {
    const requiredInput = documentGeneration.status?.required_user_input as any;
    const eventType = requiredInput?.event_type || "ENTITIES_PROVIDED";

    documentGeneration.submitUserInput({
      event_type: eventType,
      data: userFormValues,
    });
  };

  const { requiredFields, optionalFields, allFields } = useFormSchema(
    documentGeneration.status as any
  );
  const { values: userFormValues, setField: setUserFormField } = useUserForm(
    allFields as any,
    showEntitiesForm
  );
  const formIsValid = useFormValidity(requiredFields, userFormValues);

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleBackToContractType = () => {
    handleCancel();
  };

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
              <QueryInput
                value={query}
                isBusy={isLoading}
                isFocused={
                  isFocused ||
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

            <HelpText visible={showHelpText} onClose={handleCloseHelpText} />

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
    </section>
  );
};

export default Generation;
