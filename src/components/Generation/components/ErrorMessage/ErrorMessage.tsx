interface ErrorMessageProps {
  error: string;
  onClear: () => void;
}

const ErrorMessage = ({ error, onClear }: ErrorMessageProps) => {
  return (
    <div
      className="error-message"
      style={{
        color: "#ef4444",
        background: "rgba(239, 68, 68, 0.1)",
        padding: "12px 16px",
        borderRadius: "8px",
        margin: "16px 0",
        fontSize: "14px",
      }}
    >
      {error}
      <button
        onClick={onClear}
        style={{
          marginLeft: "8px",
          background: "none",
          border: "none",
          color: "#ef4444",
          cursor: "pointer",
        }}
      >
        ✕
      </button>
    </div>
  );
};

export default ErrorMessage;