import React from "react";
import { useNavigate } from "react-router-dom";
import ContractTypeStep from "../../components/Generation/components/ContractTypeStep/ContractTypeStep";
import { useDocumentGeneration } from "../../components/Generation/hooks/useDocumentGeneration";
import { useResolvedDocumentType } from "../../components/Generation/hooks/useResolvedDocumentType";
import "../../components/Generation/Generation.css";

const ContractTypePage: React.FC = () => {
  const navigate = useNavigate();
  const documentGeneration = useDocumentGeneration();

  const resolvedDocType = useResolvedDocumentType(
    documentGeneration.status as any
  );

  React.useEffect(() => {
    if (!documentGeneration.status?.stage) {
      navigate("/generation");
      return;
    }

    if (documentGeneration.status.stage === "ENTITIES_EXCTRACTED") {
      navigate("/generation/entities-form");
      return;
    }

    if (documentGeneration.currentStep === "completed") {
      navigate("/generation/final");
      return;
    }
  }, [
    documentGeneration.status?.stage,
    documentGeneration.currentStep,
    navigate,
  ]);

  const handleContractTypeConfirm = () => {
    const defaultDocumentType =
      documentGeneration.status?.required_user_input?.schema?.properties
        ?.document_type?.default;

    documentGeneration.submitUserInput({
      event_type: "DOC_TYPE_CONFIRMED",
      user_input: {
        document_type:
          defaultDocumentType || documentGeneration.status?.type || "dcp",
      },
    });
  };

  const handleBackClick = () => {
    navigate("/generation");
  };

  React.useEffect(() => {
    if (documentGeneration.status?.stage === "ENTITIES_EXCTRACTED") {
      navigate("/generation/entities-form");
    }
  }, [documentGeneration.status?.stage, navigate]);

  if (!resolvedDocType) {
    return <div>Loading...</div>;
  }

  return (
    <div className="step-content">
      <ContractTypeStep
        typeName={resolvedDocType}
        onConfirm={handleContractTypeConfirm}
        onReject={handleBackClick}
      />
    </div>
  );
};

export default ContractTypePage;
