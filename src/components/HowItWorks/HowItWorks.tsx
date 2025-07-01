import "./HowItWorks.css";
import Button from "../Button/Button";

interface HowItWorksProps {
  isLoggedIn?: boolean;
}

const HowItWorks = ({ isLoggedIn = false }: HowItWorksProps) => {
  return (
    <section className="how-it-works">
      <div className="container">
        <div className="how-it-works-content">
          <div className="how-it-works-text">
            <h2 className="section-title">Пример запроса:</h2>
            <div className="example-request">
              Привет! Составь, пожалуйста, договор оказания услуг, по которому
              я, как индивидуальный предприниматель Максим Игоревич Смирнов,
              буду проводить уроки английского языка. Стоимость одного занятия —
              3 000 рублей, продолжительность — 60 минут (1 час), при этом
              точное время начала занятия будет определяться за 2 дня до
              занятия. Оплата моих услуг будет осуществляться безналичным
              способом после проведения занятия
            </div>
          </div>

          <div className="how-it-works-image" />
        </div>

        <h2 className="section-title">Как работает наш алгоритм?</h2>

        <div className="how-it-works-steps">
          <div className="how-it-works-step">
            <div className="how-it-works-step-number">1</div>
            <div className="how-it-works-step-title">
              Определяем, какой тип договора вам нужен
            </div>
          </div>

          <div className="how-it-works-step-2">
            <div className="how-it-works-step-number">2</div>
            <div className="how-it-works-step-title">
              Проверяем соответствие запроса законодательству и находим
              возможные нарушения
            </div>
          </div>
        </div>

        <div className="how-it-works-steps">
          <div className="how-it-works-step-3">
            <div className="how-it-works-step-number">3</div>
            <div className="how-it-works-step-title">
              Распознаём ключевые данные в вашем запросе и при необходимости
              уточняем недостающую информацию
            </div>
          </div>

          <div className="how-it-works-step-image" />
        </div>

        <div className="how-it-works-steps">
          <div className="how-it-works-step-image" />

          <div className="how-it-works-step-3">
            <div className="how-it-works-step-number">4</div>
            <div className="how-it-works-step-title">
              Генерируем готовый договор с помощью искусственного интеллекта и
              шаблонов, разработанных опытными юристами
            </div>
          </div>
        </div>
        {!isLoggedIn && (
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
          >
            Попробовать
          </Button>
        )}

        <div className="guarantee-section">
          <div className="guarantee-card">
            <div className="guarantee-title">
              Если не устроил результат — вернём генерацию
            </div>
            <div className="guarantee-description">
              Наша задача — сделать полезный сервис, мы тщательно следим за
              качеством наших генераций и заботимся о том, чтобы вы получили
              лучший результат
            </div>
          </div>

          <div className="guarantee-image" />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
