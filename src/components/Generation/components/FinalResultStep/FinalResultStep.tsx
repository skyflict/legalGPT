import React from "react";
import Icon from "../../../Icon/Icon";
import styles from "./FinalResultStep.module.css";

type Props = {
  documentName: string;
  downloadUrl?: string;
};

const FinalResultStep: React.FC<Props> = ({ documentName, downloadUrl }) => {
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
    </div>
  );
};

export default FinalResultStep;
