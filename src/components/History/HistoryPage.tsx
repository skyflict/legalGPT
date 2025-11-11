import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon";
import "./HistoryModal.css";
import { apiRequest, API_ENDPOINTS, downloadDocument } from "../../utils/api";
import HelpText from "../Generation/components/HelpText/HelpText";

type DocumentItem = {
  id: string;
  user_id: string;
  stage: string;
  type?: string;
  context?: { query?: string; entities?: Record<string, unknown> };
  created_at: string;
  modified_at: string;
  required_user_input?: unknown;
  is_terminal: boolean;
  public_status: string;
  public_type: string;
};

type HistoryResponse = { documents: DocumentItem[] };

function formatDate(iso: string) {
  try {
    const date = new Date(iso);
    const months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${month}, ${hours}:${minutes}`;
  } catch {
    return iso;
  }
}

const HistoryPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showHelpText, setShowHelpText] = useState(true);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = (await apiRequest(
          API_ENDPOINTS.DOCUMENT_LIST
        )) as HistoryResponse;
        if (!ignore) setItems(res.documents || []);
      } catch (e) {
        if (!ignore) setError("Не удалось загрузить историю документов");
        console.error("[History] fetch error", e);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  const rows = useMemo(() => items, [items]);

  const toggleRow = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleContinueGeneration = (doc: DocumentItem) => {
    // Переход на страницу генерации с передачей ID документа
    navigate(`/generation?document=${doc.id}`);
  };

  const handleDownloadDocument = async (doc: DocumentItem) => {
    try {
      await downloadDocument(doc.id);
    } catch (error) {
      console.error("Ошибка при скачивании документа:", error);
      alert("Не удалось скачать документ");
    }
  };

  return (
    <section
      className="history-root"
      style={{
        width: "100%",
        maxWidth: "100%",
        maxHeight: "none",
        overflow: "auto",
      }}
    >
      <div className="history-container">
        <div className="history-main-content">
          <h2
            className="modal-title"
            style={{
              marginBottom: 16,
              fontFamily: "Unbounded",
              fontSize: 24,
              fontWeight: 300,
              textAlign: "left",
            }}
          >
            Ваши договоры:
          </h2>
          {isLoading && <div className="history-loading">Загрузка...</div>}
          {error && <div className="history-error">{error}</div>}

          {!isLoading && !error && (
            <div className="history-list">
              {rows.length === 0 && (
                <div className="history-empty">Документы отсутствуют</div>
              )}
              {rows.map((doc) => {
                const typeTitle = doc.public_type || "Документ";
                const queryText = doc.context?.query || "";
                const isExpanded = expandedId === doc.id;
                const canContinue = !doc.is_terminal;
                return (
                  <div className="history-item" key={doc.id}>
                    <div className="history-row">
                      <div className="history-primary">
                        <div className="history-icon">
                          <Icon name="text" width={24} height={24} />
                        </div>
                        <div className="history-main">
                          <div className="history-title">{typeTitle}</div>
                          <div className="history-meta">
                            <span className="history-date">
                              {formatDate(doc.created_at)},
                            </span>
                            <span>ID: {doc.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="history-actions">
                        {canContinue && (
                          <button
                            className="history-btn history-btn--primary"
                            onClick={() => handleContinueGeneration(doc)}
                            title="Продолжить генерацию"
                          >
                            Продолжить
                          </button>
                        )}
                        {doc.is_terminal && (
                          <>
                            <button
                              className="history-btn history-btn--secondary"
                              onClick={() => {
                                // TODO: Implement lawyer help functionality
                                console.log(
                                  "Помощь юриста для документа:",
                                  doc.id
                                );
                              }}
                              title="Помощь юриста"
                            >
                              Помощь юриста
                            </button>
                            <button
                              className="history-btn history-btn--icon"
                              onClick={() => handleDownloadDocument(doc)}
                              aria-label="Скачать"
                              title="Скачать"
                            >
                              <Icon name="download" width={20} height={20} />
                            </button>
                            {/* <button
                              className="history-btn history-btn--icon"
                              onClick={() => handleContinueGeneration(doc)}
                              aria-label="Редактировать"
                              title="Редактировать"
                            >
                              <Icon name="edit" width={20} height={20} />
                            </button> */}
                          </>
                        )}
                      </div>
                    </div>

                    {queryText && (
                      <div className="history-query-section">
                        <button
                          className="query-toggle"
                          onClick={() => toggleRow(doc.id)}
                        >
                          <span>Текст запроса</span>
                          <Icon
                            name="chevron-down"
                            width={16}
                            height={16}
                            className={`toggle-icon ${
                              isExpanded ? "open" : ""
                            }`}
                          />
                        </button>
                        {isExpanded && (
                          <div className="query-text">{queryText}</div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="history-sidebar">
          <HelpText
            visible={showHelpText}
            onClose={() => setShowHelpText(false)}
          />
        </div>
      </div>
    </section>
  );
};

export default HistoryPage;
