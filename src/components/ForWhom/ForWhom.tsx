import React from "react";
import "./ForWhom.css";
import Button from "../Button/Button";
import weAreOpenImg from "../../assets/weAreOpen.png";
import buildingImg from "../../assets/building2.png";
import timerImg from "../../assets/timer.png";

interface ForWhomProps {
  isLoggedIn?: boolean;
  onOpenAuthModal?: () => void;
}

interface TargetCard {
  id: number;
  title: string;
  description: string;
  image: string;
}

const ForWhom: React.FC<ForWhomProps> = ({
  isLoggedIn = false,
  onOpenAuthModal,
}) => {
  const targetCards: TargetCard[] = [
    {
      id: 1,
      title: "Для начинающих предпринимателей",
      description: "Начните с правильных документов",
      image: weAreOpenImg,
    },
    {
      id: 2,
      title: "Для развивающегося бизнеса",
      description: "Масштабируйте бизнес с автоматизацией документов",
      image: buildingImg,
    },
    {
      id: 3,
      title: "Для тех, кому нужен договор сейчас",
      description: "Решите вопрос сейчас,подключив юриста, не откладывайте",
      image: timerImg,
    },
  ];

  return (
    <section className="for-whom">
      <div className="container">
        <div className="for-whom-header">
          <h2 className="for-whom-title">
            Для кого <span className="highlight">Yuri</span>?
          </h2>
        </div>

        <div className="for-whom-grid">
          {targetCards.map((card) => (
            <div key={card.id} className="for-whom-card">
              <div className="for-whom-card-image">
                <img
                  src={card.image}
                  alt={card.title}
                  className="for-whom-card-img"
                />
              </div>
              <div className="for-whom-card-content">
                <h3 className="for-whom-card-title">{card.title}</h3>
                <p className="for-whom-card-description">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

        {!isLoggedIn && (
          <div className="for-whom-footer">
            <Button
              variant="custom"
              textColor="#2E2BFF"
              backgroundColor="#FFF"
              borderRadius={16}
              noBorder
              glowing={true}
              className="for-whom-footer-btn"
              onClick={onOpenAuthModal}
            >
              Попробовать бесплатно
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ForWhom;
