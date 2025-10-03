import { useRef } from "react";
import Icon from "../../../Icon/Icon";

interface DocumentType {
  id: string;
  name: string;
}

interface ContractSelectSectionProps {
  contractTypes: DocumentType[];
  isDropdownOpen: boolean;
  selectedTypeId?: string;
  selectedTypeName?: string;
  onDropdownToggle: () => void;
  onContractSelect: (contractId: string) => void;
  onBackToContractType: () => void;
}

const ContractSelectSection = ({
  contractTypes,
  isDropdownOpen,
  selectedTypeId,
  selectedTypeName,
  onDropdownToggle,
  onContractSelect,
  onBackToContractType,
}: ContractSelectSectionProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  return (
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
            onClick={onBackToContractType}
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
            onClick={onDropdownToggle}
          >
            <span>{selectedTypeName || "Не выбрано"}</span>
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
                    selectedTypeId === contractType.id
                      ? "dropdown-item--selected"
                      : ""
                  }`}
                  onClick={() => onContractSelect(contractType.id)}
                >
                  {contractType.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractSelectSection;