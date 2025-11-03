import React from "react";
import "./ContractTypes.css";

interface ContractTypesProps {
  onOpenRegisterModal: () => void;
}

interface FeatureCard {
  id: number;
  title: string;
  description: string;
}

const ContractTypes: React.FC<ContractTypesProps> = ({
  onOpenRegisterModal,
}) => {
  const features: FeatureCard[] = [
    {
      id: 1,
      title: "Помощь юристов",
      description:
        "Опытные юристы проверят договор, выявят риски и предложат правки.",
    },
    {
      id: 2,
      title: "Подготовит договоров",
      description:
        "Нейросеть подготовит договор под задачу, учтет детали и требования.",
    },
    {
      id: 3,
      title: "Оформление исков",
      description:
        "Нейросеть оформит исковое заявление с которым можно идти в суд.",
    },
    {
      id: 4,
      title: "Автоматизация ваших документов",
      description:
        "Разработчики адаптируют нейросеть для задач вашей компании.",
    },
  ];

  return (
    <section className="contract-types">
      <div className="container">
        <div className="section-subtitle">
          <span className="section-subtitle-text-bold">Возможности</span>{" "}
          сервиса
        </div>
        <div className="section-subtitle-text">
          Yuri — больше чем генератор шаблонов. Это ваш личный юридический
          отдел: быстрый AI <br />
          создаёт основу, а опытные юристы подключаются, когда нужна экспертиза
        </div>
        <div className="contract-grid">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="contract-card"
              onClick={onOpenRegisterModal}
              style={{ cursor: "pointer" }}
            >
              <div className="contract-card-content">
                <span className="contract-title">{feature.title}</span>
                <span className="contract-description">
                  {feature.description}
                </span>
              </div>
            </div>
          ))}
          {features.map((feature) => (
            <div
              key={`duplicate-${feature.id}`}
              className="contract-card duplicate"
              onClick={onOpenRegisterModal}
              style={{ cursor: "pointer" }}
            >
              <div className="contract-card-content">
                <span className="contract-title">{feature.title}</span>
                <span className="contract-description">
                  {feature.description}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContractTypes;
