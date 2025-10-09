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
    const documentUrl = documentGeneration.status?.document_url;
    if (documentUrl) {
      const parts = documentUrl.split("/");
      return parts[parts.length - 1] || "document.docx";
    }
    return "document.docx";
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
        downloadUrl={documentGeneration.status?.document_url}
        onStartNew={handleStartNew}
      />
    </div>
  );
};

export default FinalResultPage;
