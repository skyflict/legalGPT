import { useState } from "react";
import Icon from "../../../Icon/Icon";
import { FREQUENT_QUERIES } from "../../constants/frequentQueries";

interface FrequentQueriesSectionProps {
  onQueryClick: (query: string) => void;
}

const FrequentQueriesSection = ({ onQueryClick }: FrequentQueriesSectionProps) => {
  const [openTemplates, setOpenTemplates] = useState<Record<string, boolean>>({});

  const toggleTemplate = (title: string) => {
    setOpenTemplates((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <>
      <div className="example-section">
        <div className="example-title">Пример запроса:</div>
        <div className="example-text">
          Привет! Помоги составить договор оказания услуг: я, Максим
          Игоревич Смирнов, оказываю услуги репетитора. Стоимость одного
          занятия 3 000 рублей, продолжительность 1 час. Время начала
          занятия согласовывается за 2 дня до урока. Оплата онлайн по
          карте после занятия.
        </div>
      </div>

      <div className="frequent-queries">
        <div className="frequent-queries-content">
          <div className="frequent-queries-text">
            <h2 className="frequent-queries-title">
              Шаблоны* запросов для составления договора:
            </h2>
            <div className="frequent-queries-list">
              {FREQUENT_QUERIES.map((item, index) => (
                <div key={index} className="frequent-queries-item">
                  <button
                    className={`frequent-queries-question ${
                      openTemplates[item.title] ? "active" : ""
                    }`}
                    onClick={() => toggleTemplate(item.title)}
                  >
                    <span>{item.title}</span>
                    <Icon
                      name="arrow"
                      className="frequent-queries-icon"
                    />
                  </button>
                  <div
                    className={`frequent-queries-answer ${
                      openTemplates[item.title]
                        ? "frequent-queries-answer--open"
                        : "frequent-queries-answer--closed"
                    }`}
                  >
                    <div className="frequent-queries-answer-content">
                      {item.prompt}
                      <button
                        className="use-template-btn"
                        onClick={() => onQueryClick(item.prompt)}
                      >
                        Использовать шаблон
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="frequent-queries-image" />
        </div>
        <div className="frequent-queries-text-2">
          *Пока мы работаем только с предложенными типами договоров
        </div>
      </div>
    </>
  );
};

export default FrequentQueriesSection;