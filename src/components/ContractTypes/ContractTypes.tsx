import React from "react";
import "./ContractTypes.css";

import Button from "../Button";
import Icon from "../Icon/Icon";

interface ContractTypesProps {
  onOpenRegisterModal: () => void;
}

const ContractTypes: React.FC<ContractTypesProps> = ({
  onOpenRegisterModal,
}) => {
  const contractTypes = [
    { id: 1, title: "Агентский договор", isActive: false },
    { id: 2, title: "Договор аренды", isActive: true },
    { id: 3, title: "Договор купли-продажи", isActive: false },
    { id: 4, title: "Договор дарения", isActive: false },
    { id: 5, title: "Договор найма жилого помещения", isActive: false },
    { id: 6, title: "Договор хранения", isActive: false },
    { id: 7, title: "Договор оказания услуг", isActive: false },
    { id: 8, title: "Договор займа", isActive: false },
  ];

  return (
    <section className="contract-types">
      <div className="container">
        <div className="contract-types-content">
          <div className="section-subtitle">
            <a href="#" className="register-link" onClick={onOpenRegisterModal}>
              Зарегистрируйтесь
            </a>
            , чтобы воспользоваться нейро-конструктором документов
          </div>

          <div className="section-subtitle-2-container">
            <Button
              variant="custom"
              height={40}
              textColor="#000"
              backgroundColor="rgba(255, 255, 255, 0.70)"
              borderRadius={16}
              style={{
                cursor: "default",
                border: "none",
                color: "#000",
                fontFamily: "Jura",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              <Icon
                name="award"
                width={16}
                height={16}
                className="award-icon"
              />
              проверено командой юристов
            </Button>
          </div>
        </div>
        <div className="contract-grid">
          {contractTypes.map((contract) => (
            <div
              key={contract.id}
              className={`contract-card ${contract.isActive ? "active" : ""}`}
              onClick={onOpenRegisterModal}
              style={{ cursor: "pointer" }}
            >
              <span className="contract-title">{contract.title}</span>
            </div>
          ))}
          {contractTypes.map((contract) => (
            <div
              key={`duplicate-${contract.id}`}
              className={`contract-card duplicate ${
                contract.isActive ? "active" : ""
              }`}
              onClick={onOpenRegisterModal}
              style={{ cursor: "pointer" }}
            >
              <span className="contract-title">{contract.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContractTypes;
