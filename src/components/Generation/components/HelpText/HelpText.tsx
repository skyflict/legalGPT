import React from "react";
import Icon from "../../../Icon/Icon";
import styles from "./HelpText.module.css";

type HelpTextProps = {
  visible: boolean;
  onClose: () => void;
};

const HelpText: React.FC<HelpTextProps> = ({ visible, onClose }) => {
  if (!visible) return null;
  return (
    <div className={styles.root}>
      <div className={styles.content}>
        Если у вас остались юридические вопросы, вы всегда можете{" "}
        <span className={styles.helpTextLink}>обратиться</span> к нашим юристам
        за помощью
      </div>
      <button className={styles.close} onClick={onClose} aria-label="Закрыть">
        <Icon name="close" width={16} height={16} />
      </button>
    </div>
  );
};

export default HelpText;
