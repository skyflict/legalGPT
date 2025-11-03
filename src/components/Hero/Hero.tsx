import { useState, useEffect, useRef } from "react";
import Icon from "../Icon/Icon";
import "./Hero.css";

interface HeroProps {
  onOpenAuthModal: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenAuthModal }) => {
  const [queryText, setQueryText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Загрузка сохраненного текста из localStorage при монтировании
  useEffect(() => {
    const savedQuery = localStorage.getItem("pendingDocumentQuery");
    if (savedQuery) {
      setQueryText(savedQuery);
    }
  }, []);

  // Автоматическое изменение высоты textarea при изменении текста
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.max(96, textareaRef.current.scrollHeight) + "px";
    }
  }, [queryText]);

  // Обработчик ввода текста
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setQueryText(value);

    // Сохраняем в localStorage
    if (value.trim()) {
      localStorage.setItem("pendingDocumentQuery", value);
    } else {
      localStorage.removeItem("pendingDocumentQuery");
    }
  };

  // Обработчик отправки (открытие модального окна)
  const handleSubmit = () => {
    if (queryText.trim()) {
      // Сохраняем текст в localStorage
      localStorage.setItem("pendingDocumentQuery", queryText);
      // Открываем модальное окно авторизации
      onOpenAuthModal();
    }
  };

  // Обработчик для кнопки "Создать договор услуг"
  const handleServiceContractClick = () => {
    const contractText =
      "Хочу заключить договор услуг, по которому _____ (исполнитель по договору) окажет _____ (заказчик по договору) услуги по _____ (сфера оказываемых услуг), в рамках оказания услуг _____ (подробное описание оказываемых услуг и результата). Все услуги должны быть оказаны в течение (срок оказания услуг), вознаграждение исполнителя составит _____ (сумма вознаграждения), оплата будет _____ (наличными / переводом денежных средств).";
    setQueryText(contractText);
    localStorage.setItem("pendingDocumentQuery", contractText);
  };

  // Обработчик нажатия Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Какой документ вы хотите <br /> создать?
            </h1>
            <p className="hero-description">
              Нейросеть создаст документ с опорой на законы, а опытные юристы
              проконсультируют
            </p>

            {/* Секция с инпутом */}
            <div className="hero-input-section">
              <div className="input-wrapper">
                <textarea
                  ref={textareaRef}
                  className="hero-input"
                  placeholder="Введите запрос"
                  value={queryText}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  rows={1}
                />
                <div className="hero-input-actions">
                  <button
                    className="hero-send-btn"
                    onClick={handleSubmit}
                    disabled={!queryText.trim()}
                  >
                    <Icon name="send" size="sm" />
                  </button>
                </div>
              </div>

              {/* Кнопки быстрых действий */}
              <div className="hero-quick-actions">
                <button
                  className="hero-action-btn"
                  onClick={handleServiceContractClick}
                >
                  <span className="hero-action-icon">+</span>
                  Создать договор услуг
                </button>
                <button className="hero-action-btn" disabled>
                  <span className="hero-action-icon">+</span>
                  Автоматизировать договор моей компани
                </button>
                <button className="hero-action-btn" disabled>
                  <span className="hero-action-icon">+</span>
                  Составить иск возмещения ущерба
                </button>
                <button className="hero-action-btn hero-action-btn--dark" disabled>
                  <span className="hero-action-icon">+</span>
                  Обратиться к юристу
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
