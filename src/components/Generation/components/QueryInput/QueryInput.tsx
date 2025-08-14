import React, { useEffect, useRef } from "react";
import Icon from "../../../Icon/Icon";
import Spinner from "../Spinner/Spinner";
import styles from "./QueryInput.module.css";

type QueryInputProps = {
  value: string;
  isBusy: boolean;
  isFocused: boolean;
  showOverlay: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
  onCancel: () => void;
  onFocus: () => void;
  onBlur: () => void;
  onOverlayClick: () => void;
};

const QueryInput: React.FC<QueryInputProps> = ({
  value,
  isBusy,
  isFocused,
  showOverlay,
  onChange,
  onSend,
  onCancel,
  onFocus,
  onBlur,
  onOverlayClick,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const minHeight = 52;
    el.style.height = Math.max(minHeight, el.scrollHeight) + "px";
  }, [value]);

  useEffect(() => {
    const onDocMouseDown = (e: MouseEvent) => {
      if (!showOverlay) return;
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        onOverlayClick();
      }
    };
    if (showOverlay) document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [showOverlay, onOverlayClick]);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <textarea
        ref={textareaRef}
        className={`${styles.textarea} ${
          isFocused || isBusy ? styles.textareaFocused : ""
        }`}
        placeholder="Введите запрос"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (!isBusy && value.trim().length > 0) {
              onSend();
            }
          }
        }}
        onInput={() => {
          const el = textareaRef.current;
          if (!el) return;
          el.style.height = "auto";
          const minHeight = 52;
          el.style.height = Math.max(minHeight, el.scrollHeight) + "px";
        }}
        rows={1}
        readOnly={isBusy}
      />
      <div className={styles.actions}>
        {value.length > 0 && !isBusy && (
          <button className={styles.btn} onClick={onCancel}>
            <Icon name="cancel" size="sm" />
          </button>
        )}
        {isBusy ? (
          <div className={styles.btn}>
            <Spinner />
          </div>
        ) : (
          <button
            className={styles.btn}
            onClick={onSend}
            disabled={value.length === 0}
          >
            <Icon name="send" size="sm" />
          </button>
        )}
      </div>
    </div>
  );
};

export default QueryInput;
