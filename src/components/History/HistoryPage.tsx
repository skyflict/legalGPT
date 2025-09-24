import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../Icon";
import "./HistoryModal.css";
import { apiRequest, API_ENDPOINTS } from "../../utils/api";

type DocumentItem = {
  id: string;
  user_id: string;
  stage: string;
  type?: string;
  context?: { query?: string; entities?: Record<string, unknown> };
  document_url?: string;
  created_at: string;
  modified_at: string;
  required_user_input?: unknown;
};

type HistoryResponse = { documents: DocumentItem[] };

const typeNameMap: Record<string, string> = {
  dcp: "Договор купли-продажи",
  arenda: "Договор аренды",
  gift: "Договор дарения",
  uslugi: "Договор оказания услуг",
  zaym: "Договор займа",
  agent: "Агентский договор",
  naym: "Договор найма жилого помещения",
  storage: "Договор хранения",
};

const stageNameMap: Record<string, string> = {
  DOC_TYPE_DEDUCED: "Определён тип",
  ENTITIES_EXCTRACTED: "Нужны данные",
  DOC_GENERATED: "Сгенерирован",
  DOC_APPROVED: "Подтверждён",
  PROCESSING: "Обработка",
  LAW_VIOLATED: "Нарушение закона, генерация невозможна",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("ru-RU");
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

  const isGenerationIncomplete = (stage: string): boolean => {
    // Документ не завершен, если статус не "Сгенерирован", "Подтверждён" и не является финальным состоянием
    // Также исключаем LAW_VIOLATED - такие документы нельзя продолжить
    const completedStages = [
      "DOC_GENERATED",
      "DOC_APPROVED",
      "COMPLETED",
      "FINISHED",
    ];
    const cannotContinueStages = ["LAW_VIOLATED"];

    return (
      !completedStages.includes(stage) && !cannotContinueStages.includes(stage)
    );
  };

  return (
    <section
      className="history-root"
      style={{
        width: "100%",
        maxWidth: 824,
        maxHeight: "none",
        overflow: "auto",
      }}
    >
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
        Ваши договоры
      </h2>
      {isLoading && <div className="history-loading">Загрузка...</div>}
      {error && <div className="history-error">{error}</div>}

      {!isLoading && !error && (
        <div className="history-list">
          {rows.length === 0 && (
            <div className="history-empty">Документы отсутствуют</div>
          )}
          {rows.map((doc) => {
            const typeTitle = (doc.type && typeNameMap[doc.type]) || "Документ";
            const stageTitle = stageNameMap[doc.stage] || doc.stage;
            const queryText = doc.context?.query || "";
            const isExpanded = expandedId === doc.id;
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
                        <span className="history-stage">{stageTitle}</span>
                        <span className="history-dot">•</span>
                        <span className="history-date">
                          {formatDate(doc.created_at)}
                        </span>
                      </div>
                      <button
                        className="history-toggle"
                        onClick={() => toggleRow(doc.id)}
                        aria-expanded={isExpanded}
                      >
                        <span className="toggle-text">Текст запроса</span>
                        <Icon
                          name="chevron-down"
                          width={16}
                          height={16}
                          className={`toggle-icon ${isExpanded ? "open" : ""}`}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="history-actions">
                    {isGenerationIncomplete(doc.stage) && (
                      <button
                        className="history-btn history-btn--primary"
                        onClick={() => handleContinueGeneration(doc)}
                        title="Продолжить генерацию"
                      >
                        Продолжить
                      </button>
                    )}
                    {doc.document_url && (
                      <button
                        className="history-btn history-btn--icon"
                        onClick={() => window.open(doc.document_url, "_blank")}
                        aria-label="Скачать"
                        title="Скачать"
                      >
                        <Icon name="download" width={20} height={20} />
                      </button>
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="history-details">
                    <div className="details-grid">
                      <div className="details-label">Тип</div>
                      <div className="details-value">{typeTitle}</div>

                      <div className="details-label">Статус</div>
                      <div className="details-value">{stageTitle}</div>

                      {queryText && (
                        <>
                          <div className="details-label">Запрос</div>
                          <div className="details-value details-mono">
                            {queryText}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default HistoryPage;
