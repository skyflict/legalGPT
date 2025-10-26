import React from "react";
import { useNavigate } from "react-router-dom";
import FinalResultStep from "../../components/Generation/components/FinalResultStep/FinalResultStep";
import { useDocumentGeneration } from "../../components/Generation/hooks/useDocumentGeneration";
import "../../components/Generation/Generation.css";

const FinalResultPage: React.FC = () => {
  const navigate = useNavigate();
  const documentGeneration = useDocumentGeneration();

  React.useEffect(() => {
    if (documentGeneration.currentStep !== "completed") {
      navigate("/generation");
      return;
    }
  }, [documentGeneration.currentStep, navigate]);

  const getDocumentName = () => {
    // Имя документа для отображения
    const docType = documentGeneration.status?.public_type || "Документ";
    return docType;
  };

  const handleStartNew = () => {
    documentGeneration.reset();
    navigate("/generation");
  };

  return (
    <div className="step-content">
      <FinalResultStep
        documentName={getDocumentName()}
        documentId={documentGeneration.status?.id}
        createdAt={documentGeneration.status?.created_at}
        onStartNew={handleStartNew}
      />
    </div>
  );
};

export default FinalResultPage;
