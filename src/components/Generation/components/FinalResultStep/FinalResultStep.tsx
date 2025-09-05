import React, { useEffect, useState } from "react";
import Icon from "../../../Icon/Icon";
import styles from "./FinalResultStep.module.css";
import Modal from "../../../Modal/Modal";

type Props = {
  documentName: string;
  downloadUrl?: string;
};

const FEEDBACK_FORM_URL =
  "https://forms.yandex.ru/cloud/68bab2914936399c60c1bac5/?page=1";

const FinalResultStep: React.FC<Props> = ({ documentName, downloadUrl }) => {
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
        <span className={styles.name}>{documentName}</span>
      </div>

      <button
        className="download-button"
        onClick={() => {
          if (downloadUrl) {
            window.open(downloadUrl, "_blank");
            setIsFeedbackOpen(true);
          }
        }}
        disabled={!downloadUrl}
      >
        <span>Скачать</span>
        <Icon
          name="download"
          width={24}
          height={24}
          className="download-icon"
        />
      </button>

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
