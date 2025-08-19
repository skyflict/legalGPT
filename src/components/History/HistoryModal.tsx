import { useEffect, useMemo, useState } from "react";
import Modal from "../Modal";
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

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

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
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("ru-RU");
  } catch {
    return iso;
  }
}

const HistoryModal = ({ isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<DocumentItem[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen]);

  const rows = useMemo(() => items, [items]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="История документов">
      <div className="history-root">
        {isLoading && <div className="history-loading">Загрузка...</div>}
        {error && <div className="history-error">{error}</div>}

        {!isLoading && !error && (
          <div className="history-list">
            {rows.length === 0 && (
              <div className="history-empty">Документы отсутствуют</div>
            )}
            {rows.map((doc) => {
              const typeTitle =
                (doc.type && typeNameMap[doc.type]) || "Документ";
              const stageTitle = stageNameMap[doc.stage] || doc.stage;
              const queryText = doc.context?.query || "";
              const queryShort =
                queryText.length > 100
                  ? queryText.slice(0, 100) + "…"
                  : queryText;
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
                        {queryShort && (
                          <div className="history-query">{queryShort}</div>
                        )}
                      </div>
                    </div>
                    <div className="history-actions">
                      {doc.document_url && (
                        <button
                          className="history-btn"
                          onClick={() =>
                            window.open(doc.document_url, "_blank")
                          }
                        >
                          <span>Скачать</span>
                          <Icon name="download" width={20} height={20} />
                        </button>
                      )}
                      <button
                        className="history-btn history-btn--secondary"
                        onClick={() =>
                          setExpandedId(isExpanded ? null : doc.id)
                        }
                      >
                        {isExpanded ? "Скрыть" : "Подробнее"}
                      </button>
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
      </div>
    </Modal>
  );
};

export default HistoryModal;
