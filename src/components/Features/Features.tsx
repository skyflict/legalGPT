import "./Features.css";

const Features: React.FC = () => {
  const features = [
    {
      id: 1,
      title: "Качественно, просто, быстро",
      description:
        "Получите профессионально подготовленные документы, экономя свои время и ресурсы",
    },
    {
      id: 2,
      title: "Предупреждение рисков",
      description:
        "Проверим запрос на легальность, если найдём недопустимые условия — уведомим вас",
    },
    {
      id: 3,
      title: "Автоматизация ваших договоров",
      description:
        "Нейросеть, разработанная совместно с юристами, легко адаптируется под ваши корпоративные документы",
    },
    {
      id: 4,
      title: "Приватность персональных данных",
      description:
        "Все данные защищены согласно требованиям ФЗ № 152 «О персональных данных»",
    },
  ];

  return (
    <section className="features">
      <div className="container">
        <div className="features-header">
          <h2 className="features-title">
            Почему <span className="highlight">Yuri</span>?
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
      </div>
    </section>
  );
};

export default Features;
