interface ContinueGenerationSectionProps {
  latestDocument: {
    id: string;
    context?: {
      query?: string;
    };
  };
  onContinue: () => void;
}

const ContinueGenerationSection = ({
  latestDocument,
  onContinue,
}: ContinueGenerationSectionProps) => {
  const queryText = latestDocument.context?.query;
  const truncatedQuery = queryText
    ? `"${queryText.slice(0, 80)}${queryText.length > 80 ? "..." : ""}"`
    : "Продолжите генерацию документа";

  return (
    <div className="continue-generation-section">
      <div className="continue-generation-section-content">
        <div style={{ flex: "1", minWidth: "0" }}>
          <div
            style={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#1f2937",
              marginBottom: "4px",
            }}
          >
            У вас есть незавершенная генерация
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "#6b7280",
              wordBreak: "break-word",
              lineHeight: "1.4",
            }}
          >
            {truncatedQuery}
          </div>
        </div>
        <button
          onClick={onContinue}
          style={{
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "background-color 0.2s",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "#4338ca";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "#4f46e5";
          }}
        >
          Продолжить
        </button>
      </div>
    </div>
  );
};

export default ContinueGenerationSection;