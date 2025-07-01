import "./ContractTypes.css";

import Button from "../Button";
import Icon from "../Icon/Icon";

const ContractTypes = () => {
  const contractTypes = [
    {
      id: 1,
      title: "Договор дарения",
      isActive: false,
    },
    {
      id: 2,
      title: "Договор аренды",
      isActive: true,
    },
    {
      id: 3,
      title: "Договор купли-продажи",
      isActive: false,
    },
    {
      id: 4,
      title: "Договор оказания услуг",
      isActive: false,
    },
  ];

  return (
    <section className="contract-types">
      <div className="container">
        <div className="contract-types-content">
          <div className="section-subtitle">
            <a href="#" className="register-link">
              Зарегистрируйтесь
            </a>
            , чтобы воспользоваться готовыми шаблонами документов:
          </div>

          <div className="section-subtitle-2-container">
            <Button
              variant="custom"
              height={40}
              textColor="#000"
              backgroundColor="rgba(255, 255, 255, 0.70)"
              borderRadius={16}
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
