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
      title: "Договоры за минуты - просто и удобно ",
      description:
        "Создавайте профессиональные документы быстро и без лишних сложностей. Наш сервис поможет вам оформить договор в несколько шагов, экономя время и силы",
    },
    {
      id: 2,
      title: "С опорой на закон",
      description:
        "Перед созданием мы автоматически проверяем запросы на соответствие действующим правилам и нормам",
    },
    {
      id: 3,
      title: "Думать, как юрист",
      description:
        "Мощная нейросеть, адаптированная юристами, специализируется на создании договоров",
    },
    {
      id: 4,
      title: "Ваша приватность - превыше всего",
      description:
        "Вы сами определяете какие данные отправлять в нейросеть, а какие заполнять самостоятельно",
    },
  ];

  return (
    <section className="features">
      <div className="container">
        <div className="features-header">
          <h2 className="features-title">
            Что умеет <span className="highlight">Yuri</span>?
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
