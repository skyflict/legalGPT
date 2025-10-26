import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  onReset: () => void;
}

const ErrorMessage = ({ onReset }: ErrorMessageProps) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorIcon}>
        <span className={styles.errorIconSymbol}>✕</span>
      </div>

      <h2 className={styles.errorTitle}>Упс! Что-то сломалось</h2>

      <p className={styles.errorDescription}>
        Ваша генерация в любом случае сохранилась, вы сможете вернуться к ней
        позже во вкладке История
      </p>

      <button className={styles.errorButton} onClick={onReset}>
        Начать заново
      </button>
    </div>
  );
};

export default ErrorMessage;
