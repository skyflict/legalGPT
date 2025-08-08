import React from "react";
import Icon from "../../../Icon/Icon";
import styles from "./ContractTypeStep.module.css";

type Props = {
  typeName: string;
  onConfirm: () => void;
  onReject: () => void;
};

const ContractTypeStep: React.FC<Props> = ({
  typeName,
  onConfirm,
  onReject,
}) => {
  return (
    <div className={styles.root}>
      <div className="contract-question-title">
        Правильно ли определен тип договора?
      </div>
      <div className={styles.card}>
        <div className={styles.iconBox}>
          <Icon name="text" width={24} height={24} />
        </div>
        <span className={styles.name}>{typeName}</span>
      </div>
      <div className={styles.actions}>
        <button className="contract-btn contract-btn--yes" onClick={onConfirm}>
          Да
        </button>
        <button className="contract-btn contract-btn--no" onClick={onReject}>
          Нет
        </button>
      </div>
    </div>
  );
};

export default ContractTypeStep;
