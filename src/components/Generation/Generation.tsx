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
import {
  isIdleState,
  shouldShowOverlay,
  isFocusedState,
} from "./utils/generationStates";
import ContinueGenerationSection from "./components/ContinueGenerationSection/ContinueGenerationSection";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import FrequentQueriesSection from "./components/FrequentQueriesSection/FrequentQueriesSection";
import ContractSelectSection from "./components/ContractSelectSection/ContractSelectSection";

const Generation = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showManualContractSelect, setShowManualContractSelect] =
    useState(false);

  const documentGeneration = useDocumentGeneration();
  const { documentTypes, getDocumentTypeById } = useDocumentTypes();
  const { latestDocument } = useLatestIncompleteDocument();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

  // Состояния для утилит
  const generationStates = {
    isLoading,
    showContractType,
    showContractSelect,
    showEntitiesForm,
    showFinalResult,
  };

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
    } catch {
      // Игнорируем ошибки скроллинга
    }
  };

  const handleQueryClick = (queryText: string) => {
    setQuery(queryText);
  };

  const handleFocus = () => {
    setShowOverlay(true);
  };

  const handleBlur = () => {
    if (query.length === 0 && isIdleState(generationStates)) {
      setShowOverlay(false);
    }
  };

  const handleOverlayClick = () => {
    // При клике вне инпута сбрасываем состояние наведения/фокуса,
    // если не запущены другие шаги генерации
    if (isIdleState(generationStates)) {
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
    const properties =
      documentGeneration.status?.required_user_input?.schema?.properties;
    const documentTypeProperty = properties?.document_type as
      | { default?: string }
      | undefined;
    const defaultDocumentType = documentTypeProperty?.default;
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

  const getContractTypeName = (type?: string) => {
    if (!type) return undefined;
    const documentType = getDocumentTypeById(type);
    return documentType?.name;
  };

  const resolvedDocType = useResolvedDocumentType(
    documentGeneration.status as any
  );

  const getDocumentName = () => {
    // Имя документа для отображения
    const docType = documentGeneration.status?.public_type || "Документ";
    return docType;
  };

  // Используем данные из API вместо статического массива
  const contractTypes = documentTypes;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showOverlay &&
        inputWrapperRef.current &&
        !inputWrapperRef.current.contains(event.target as Node)
      ) {
        handleOverlayClick();
      }
    };

    if (showOverlay) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOverlay]);

  useEffect(() => {
    return () => {
      documentGeneration.reset();
    };
  }, []);

  return (
    <section
      className={`generation ${
        isFocusedState(generationStates) ? "generation--focused" : ""
      } ${
        shouldShowOverlay(showOverlay, generationStates)
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
                isFocused={isFocusedState(generationStates)}
                showOverlay={shouldShowOverlay(showOverlay, generationStates)}
                onChange={setQuery}
                onSend={handleSend}
                onCancel={handleCancel}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onOverlayClick={handleOverlayClick}
              />
            </div>

            {/* Кнопка продолжения генерации */}
            {isIdleState(generationStates) &&
              latestDocument &&
              documentGeneration.currentStep === "idle" && (
                <ContinueGenerationSection
                  latestDocument={latestDocument}
                  onContinue={handleContinueGeneration}
                />
              )}

            {documentGeneration.error && (
              <ErrorMessage
                error={documentGeneration.error}
                onClear={documentGeneration.clearError}
              />
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
            <ContractSelectSection
              contractTypes={contractTypes}
              isDropdownOpen={isDropdownOpen}
              selectedTypeId={documentGeneration.status?.type}
              selectedTypeName={getContractTypeName(
                documentGeneration.status?.type
              )}
              onDropdownToggle={handleDropdownToggle}
              onContractSelect={handleContractSelect}
              onBackToContractType={handleBackToContractType}
            />
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
                </div>
              )}

              {isLoading ? (
                <div className="step-two-loading">
                  <Spinner />
                  <span>Проверяем законы</span>
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
                <div className="step-number final-step">
                  <Icon name="check" width={16} height={16} color="#fff" />
                </div>
              </div>

              <FinalResultStep
                documentName={getDocumentName()}
                documentId={documentGeneration.status?.id}
              />
            </div>
          )}

          {documentGeneration.currentStep === "idle" && (
            <FrequentQueriesSection onQueryClick={handleQueryClick} />
          )}
        </div>
      </div>

      <div
        className={`generation-overlay ${
          shouldShowOverlay(showOverlay, generationStates)
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
