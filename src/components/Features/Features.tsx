import "./Features.css";
import Button from "../Button/Button";

interface FeaturesProps {
  isLoggedIn?: boolean;
  onOpenAuthModal?: () => void;
}

const Features = ({ isLoggedIn = false, onOpenAuthModal }: FeaturesProps) => {
  const features = [
    {
      id: 1,
      title: "Договоры за минуты, а не часы",
      description:
        "Создавайте профессиональные документы мгновенно — без ожиданий и сложностей",
    },
    {
      id: 2,
      title: "Следить за законом",
      description:
        "Каждый договор проходит автоматическую проверку на соответствие актуальному законодательству",
    },
    {
      id: 3,
      title: "Думать, как юрист",
      description:
        "Мощная нейросеть, адаптированная юристами, специализируется на создании договоров",
    },
    {
      id: 4,
      title: "Минимум ввода — максимум результата",
      description: "Только нужные данные, без лишних формальностей",
    },
  ];

  return (
    <section className="features">
      <div className="container">
        <div className="features-header">
          <h2 className="features-title">
            Что умеет <span className="highlight">НейроЮрист</span>?
          </h2>
        </div>
        <div className="features-grid">
          {features.map((feature) => (
            <div key={feature.id} className="feature-card">
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
        {!isLoggedIn && (
          <div className="features-footer">
            <Button
              variant="custom"
              width={890}
              height={68}
              textColor="#2E2BFF"
              backgroundColor="#FFF"
              borderRadius={16}
              noBorder
              glowing={true}
              className="features-footer-btn"
              onClick={onOpenAuthModal}
            >
              Попробовать
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Features;
