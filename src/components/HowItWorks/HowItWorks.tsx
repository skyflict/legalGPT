import "./HowItWorks.css";
import Button from "../Button/Button";

interface HowItWorksProps {
  isLoggedIn?: boolean;
  onOpenAuthModal?: () => void;
}

const HowItWorks = ({
  isLoggedIn = false,
  onOpenAuthModal,
}: HowItWorksProps) => {
  return (
    <section className="how-it-works">
      <div className="container">
        <div className="how-it-works-content">
          <div className="how-it-works-text">
            <h2 className="section-title">Пример запроса:</h2>
            <div className="example-request">
              Привет! Помоги составить договор оказания услуг: я, Максим
              Игоревич Смирнов, оказываю услуги репетитора. Стоимость одного
              занятия 3 000 рублей, продолжительность 1 час. Время начала
              занятия согласовывается за 2 дня до урока. Оплата по безналу после
              проведения.
            </div>
          </div>

          <div className="how-it-works-image" />
        </div>

        <h2 className="section-title">Как работает наш алгоритм?</h2>

        <div className="how-it-works-steps">
          <div className="how-it-works-step">
            <div className="how-it-works-step-number">1</div>
            <div className="how-it-works-step-title">
              Определяем, какой тип договора вам нужен, проверяем соответствие
              запроса законодательству и находим возможные нарушения
            </div>
          </div>

          <div className="how-it-works-step-2">
            <div className="how-it-works-step-number">2</div>
            <div className="how-it-works-step-title">
              Распознаём ключевые данные в вашем запросе и при необходимости
              уточняем недостающую информацию
            </div>
          </div>
        </div>

        <div className="how-it-works-steps">
          <div className="how-it-works-step-3">
            <div className="how-it-works-step-number">3</div>
            <div className="how-it-works-step-title">
              Генерируем готовый договор с помощью искусственного интеллекта и
              шаблонов, разработанных опытными юристами
            </div>
          </div>

          <div className="how-it-works-step-image-3" />
        </div>

        <div className="how-it-works-steps">
          <div className="how-it-works-step-image-4" />

          <div className="how-it-works-step-3">
            <div className="how-it-works-step-number">4</div>
            <div className="how-it-works-step-title">
              Мгновенно подключаем юриста сервиса для анализа и индивидуальной
              проработки вашего кейса по запросу
            </div>
          </div>
        </div>
        {!isLoggedIn && (
          <Button
            variant="custom"
            textColor="#2E2BFF"
            backgroundColor="#FFF"
            borderRadius={16}
            noBorder
            glowing={true}
            className="how-it-works-footer-btn"
            onClick={onOpenAuthModal}
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
