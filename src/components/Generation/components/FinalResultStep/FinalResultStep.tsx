import React, { useEffect, useState } from "react";
import Icon from "../../../Icon/Icon";
import styles from "./FinalResultStep.module.css";
import Modal from "../../../Modal/Modal";
import { downloadDocument } from "../../../../utils/api";

type Props = {
  documentName: string;
  documentId?: string;
  createdAt?: string;
  onStartNew?: () => void;
};

const FEEDBACK_FORM_URL =
  "https://forms.yandex.ru/cloud/68bab2914936399c60c1bac5/?page=1";

// Функция для форматирования даты в русский формат
const formatDate = (isoString?: string): string => {
  if (!isoString) return "";

  try {
    const date = new Date(isoString);

    // Проверяем, что дата валидна
    if (isNaN(date.getTime())) return "";

    // Форматируем дату в формат: "26 октября, 22:28"
    const day = date.getDate();
    const months = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ];
    const month = months[date.getMonth()];
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day} ${month}, ${hours}:${minutes}`;
  } catch (error) {
    console.error("Ошибка при форматировании даты:", error);
    return "";
  }
};

const FinalResultStep: React.FC<Props> = ({
  documentName,
  documentId,
  createdAt,
  onStartNew,
}) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  // Модалка фидбека открывается после нажатия на скачивание

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="final-content">
      <div className="final-title">
        Документ сгенерирован и добавлен в историю:
      </div>

      <div className={styles.card}>
        <span className="document-icon">
          <Icon name="text" width={24} height={24} />
        </span>
        <div className={styles.documentInfo}>
          <span className="document-name">{documentName}.doc</span>
          {createdAt && (
            <span className={styles.documentDate}>{formatDate(createdAt)}</span>
          )}
        </div>
      </div>

      <button
        className="download-button"
        onClick={async () => {
          if (documentId) {
            try {
              await downloadDocument(documentId);
              setIsFeedbackOpen(true);
            } catch (error) {
              console.error("Ошибка при скачивании документа:", error);
              alert("Не удалось скачать документ");
            }
          }
        }}
        disabled={!documentId}
      >
        <span>Скачать</span>
        <Icon
          name="download"
          width={24}
          height={24}
          className="download-icon"
        />
      </button>

      {/* Окно консультации юриста */}
      <div className={styles.consultationCard}>
        <div className={styles.consultationContent}>
          <h3 className={styles.consultationTitle}>
            Получить консультацию у юриста
          </h3>
          <p className={styles.consultationDescription}>
            Если вам нужна профессиональная поддержка при дальнейшей работе с
            договором или у вас остались юридические вопросы, то наш специалист
            всегда готов вам помочь. Если вас не устроит помощь специалиста, мы
            вернём вам токены
          </p>
          <button className={styles.consultationButton}>Записаться</button>
          <p className={styles.consultationNote}>
            При записи на консультацию на вашем счёту будет заморожено 99 коинов
            для оплаты консультации
          </p>
        </div>
        <div className={styles.consultationImage} />
      </div>

      {onStartNew && (
        <button
          className="action-button action-button--secondary"
          onClick={onStartNew}
          style={{ marginTop: "16px" }}
        >
          Создать новый документ
        </button>
      )}

      <Modal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        title="Спасибо!"
      >
        <div className="auth-modal__form">
          <p>
            Спасибо, что воспользовались нашим сервисом. Оставьте отзыв в форме
            обратной связи — это займет не более пары минут и поможет нам стать
            лучше
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <a
              href={FEEDBACK_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="auth-modal__submit-btn final"
              style={{ textAlign: "center", textDecoration: "none" }}
            >
              Открыть форму
            </a>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FinalResultStep;
