import React from "react";
import { useNavigate } from "react-router-dom";
import EntitiesFormStep from "../../components/Generation/components/EntitiesFormStep/EntitiesFormStep";
import { useDocumentGeneration } from "../../components/Generation/hooks/useDocumentGeneration";
import { useFormSchema } from "../../components/Generation/hooks/useFormSchema";
import {
  useUserForm,
  useFormValidity,
} from "../../components/Generation/hooks/useUserForm";
import "../../components/Generation/Generation.css";

const EntitiesFormPage: React.FC = () => {
  const navigate = useNavigate();
  const documentGeneration = useDocumentGeneration();

  React.useEffect(() => {
    if (!documentGeneration.status?.stage) {
      navigate("/generation");
      return;
    }

    if (documentGeneration.status.stage === "DOC_TYPE_DEDUCED") {
      navigate("/generation/contract-type");
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

  const { requiredFields, optionalFields, allFields, groups } = useFormSchema(
    documentGeneration.status as any
  );

  const { values: userFormValues, setField: setUserFormField } = useUserForm(
    allFields,
    true
  );

  const isFormValid = useFormValidity(requiredFields, userFormValues);

  const handleUserFormSubmit = () => {
    const requiredInput = documentGeneration.status?.required_user_input as any;
    const eventType = requiredInput?.event_type || "ENTITIES_PROVIDED";

    documentGeneration.submitUserInput({
      event_type: eventType,
      user_input: userFormValues,
    });
  };

  React.useEffect(() => {
    if (documentGeneration.currentStep === "completed") {
      navigate("/generation/final");
    }
  }, [documentGeneration.currentStep, navigate]);

  const userQuery = documentGeneration.status?.context?.query;

  return (
    <div className="step-content">
      <EntitiesFormStep
        requiredFields={requiredFields}
        optionalFields={optionalFields}
        allFields={allFields}
        values={userFormValues}
        onChange={setUserFormField}
        onSubmit={handleUserFormSubmit}
        isValid={isFormValid}
        groups={groups}
        query={userQuery}
      />
    </div>
  );
};

export default EntitiesFormPage;
