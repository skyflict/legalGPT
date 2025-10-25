import "./Hero.css";
import Icon from "../Icon/Icon";
import Button from "../Button";

interface HeroProps {
  onOpenAuthModal?: () => void;
}

const Hero = ({ onOpenAuthModal }: HeroProps) => {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Документы <span className="highlight">быстро.</span>
            </h1>
            <p className="hero-description">
              Опишите задачу - нейросеть сгенерирует проект договора, грамотно
              оформленный и готовый к использованию. Если хотите - подключим
              юриста для проверки и объяснений по вашему кейсу.
            </p>

            <Button
              variant="custom"
              textColor="#FFF"
              backgroundColor="#2E2BFF"
              borderRadius={28}
              noBorder
              className="hero-btn"
              glowing={true}
              onClick={onOpenAuthModal}
            >
              Начать работу
            </Button>

            <div className="security-note">
              <span className="security-icon">
                <Icon name="lock" width={16} height={16} />
              </span>
              <span>
                Ваши данные надёжно защищены. <br />С правилами передачи данных
                можете ознакомиться{" "}
                <a href="#" className="security-link">
                  здесь
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
