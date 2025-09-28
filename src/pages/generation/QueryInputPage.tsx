import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import QueryInput from "../../components/Generation/components/QueryInput/QueryInput";
import Loader from "../../components/Loader/Loader";
import Icon from "../../components/Icon/Icon";
import { useDocumentGeneration } from "../../components/Generation/hooks/useDocumentGeneration";
import { useLoaderMessage } from "../../components/Generation/hooks/useLoaderMessage";
import Features from "../../components/Features/Features";
import HowItWorks from "../../components/HowItWorks/HowItWorks";
import FAQ from "../../components/FAQ/FAQ";
import "../../components/Generation/Generation.css";

const QueryInputPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [openTemplates, setOpenTemplates] = useState<Record<string, boolean>>(
    {}
  );
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();

  const documentGeneration = useDocumentGeneration();
  const isLoading = documentGeneration.isLoading;
  const loaderMessage = useLoaderMessage(
    isLoading,
    documentGeneration.status as any
  );

  const frequentQueries = [
    {
      title: "Договор оказания услуг",
      prompt:
        "Хочу заключить договор услуг, по которому _____ (исполнитель по договору) окажет _____ (заказчик по договору) услуги по _____ (сфера оказываемых услуг), в рамках оказания услуг _____ (подробное описание оказываемых услуг и результата). Все услуги должны быть оказаны в течение (срок оказания услуг), вознаграждение исполнителя составит _____ (сумма вознаграждения), оплата будет _____ (наличными / переводом денежных средств).",
    },
    {
      title: "Договор купли-продажи",
      prompt:
        "Хочу заключить договор купли продажи _____ (товар), со следующими уникальными признаками _____ (описание товара) в количестве _____ (количество товара) между _____ (покупатель) и _____ (продавец). Сумма договора _____ (стоимость товара и всех сопутствующих услуг), товар будет доставлен покупателю по адресу _____ (адрес доставки), оплата _____ (наличными / переводом денежных средств) в течение _____ (количество дней для оплаты товара) после подписания договора.",
    },
    {
      title: "Договор займа",
      prompt:
        "Необходимо составить договор займа между _____ (заемщик) и _____ (займодатель), на сумму _____ (сумма займа) рублей. заемщик вернет заем в течение_____ (срок возврата займа). Процентная ставка по займу составляет _____ (процент по заему). Погашение займа _____ (когда заемщик должен вернуть сумму займа). Заем выдается _____ (наличными / переводом денежных средств).",
    },
    {
      title: "Договор найма жилого помещения",
      prompt:
        "Хочу заключить договор найма жилого помещения _____ (адрес помещения, включая город, улицу, дом, квартиру), со следующими уникальными признаками _____ (описание: площадь, количество комнат, этаж, мебель, техника, состояние и т.д.) между _____ (наймодатель - ФИО/название и реквизиты собственника) и _____ (наниматель - ФИО/паспортные данные). Сумма договора _____ (размер ежемесячной платы за наем, стоимость коммунальных услуг и других платежей, если включены) в месяц, помещение будет предоставлено нанимателю для проживания с _____ (дата начала найма) по _____ (дата окончания найма). Оплата _____ (наличными / банковским переводом на счет наймодателя) в течение _____ (количество дней каждого месяца для внесения платы) каждого календарного месяца периода найма.",
    },
    {
      title: "Договор аренды",
      prompt:
        'Хочу заключить договор аренды _____ (вид имущества/помещения: например, нежилое помещение, оборудование, транспортное средство, склад, офис), со следующими уникальными признаками _____ (описание: для помещения - адрес, площадь, назначение; для оборудования - марка, модель, серийный номер, состояние; для ТС - марка, модель, VIN, гос. номер) в количестве _____ (количество: обычно 1 для объекта, для оборудования - число единиц) между _____ (арендодатель (наймодатель) - ФИО/название и реквизиты собственника) и _____ (арендатор (наниматель) - ФИО/название и реквизиты). Сумма договора _____ (размер ежемесячной/ежегодной арендной платы, стоимость коммунальных услуг, эксплуатационных расходов, НДС - если применимо) в месяц/год/иной период, имущество/помещение будет предоставлено арендатору для использования по адресу/на территории _____ (адрес/место нахождения имущества) с _____ (дата начала аренды) по _____ (дата окончания аренды). Оплата арендной платы _____ (наличными / банковским переводом на счет арендодателя) в течение _____ (количество дней каждого периода для внесения платы) каждого расчетного периода (месяца/квартала/года), первый платеж (аванс/залог) в размере _____ (сумма) вносится _____ (срок внесения, например, "до подписания договора", "при подписании договора").',
    },
    {
      title: "Дарение",
      prompt:
        'Хочу заключить договор дарения _____ (наименование дара: имущество, вещь, например, квартира, автомобиль, акции), со следующими уникальными признаками _____ (описание: для недвижимости - адрес, кадастровый номер, площадь; для авто - марка, модель, VIN, гос. номер; для иного - детали) в количестве _____ (количество: обычно 1 для объекта, для акций/долей - число и номинал) между _____ (даритель - ФИО/название и реквизиты) и _____ (одаряемый - ФИО/название и реквизиты). Дар передается одаряемому безвозмездно. Передача дара (владения) будет осуществлена _____ (способ и срок передачи: например, "путем вручения ключей и подписания акта приема-передачи", "путем регистрации перехода права собственности в ЕГРН", "не позднее 10 дней после подписания договора"). Право собственности переходит к одаряемому _____ (момент перехода права: например, "с момента подписания акта приема-передачи", "с момента государственной регистрации").',
    },
  ];

  const toggleTemplate = (title: string) => {
    setOpenTemplates((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const handleTemplateSelect = (prompt: string) => {
    setQuery(prompt);
    setShowOverlay(false);
  };

  const handleOverlayClick = () => {
    setShowOverlay(false);
  };

  const handleInputFocus = () => {
    setShowOverlay(true);
  };

  const handleInputBlur = () => {
    // setShowOverlay(false);
  };

  const handleCancel = () => {
    setShowOverlay(false);
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;

    try {
      await documentGeneration.startGeneration(query);
    } catch (error) {
      console.error("Error starting generation:", error);
    }
  };

  // Слушаем изменения статуса для автоматического перехода
  React.useEffect(() => {
    if (!isLoading && documentGeneration.status?.stage) {
      if (documentGeneration.status.stage === "DOC_TYPE_DEDUCED") {
        navigate("/generation/contract-type");
      } else if (documentGeneration.status.stage === "ENTITIES_EXCTRACTED") {
        navigate("/generation/entities-form");
      }
    }
  }, [isLoading, documentGeneration.status?.stage, navigate]);

  // Слушаем изменения currentStep для навигации
  React.useEffect(() => {
    if (documentGeneration.currentStep === "waiting_input") {
      if (documentGeneration.status?.stage === "DOC_TYPE_DEDUCED") {
        navigate("/generation/contract-type");
      } else if (documentGeneration.status?.stage === "ENTITIES_EXCTRACTED") {
        navigate("/generation/entities-form");
      }
    } else if (documentGeneration.currentStep === "completed") {
      navigate("/generation/final");
    }
  }, [
    documentGeneration.currentStep,
    documentGeneration.status?.stage,
    navigate,
  ]);

  // Проверяем состояние при монтировании компонента
  React.useEffect(() => {
    if (documentGeneration.currentStep !== "idle") {
      if (documentGeneration.currentStep === "waiting_input") {
        if (documentGeneration.status?.stage === "DOC_TYPE_DEDUCED") {
          navigate("/generation/contract-type");
        } else if (documentGeneration.status?.stage === "ENTITIES_EXCTRACTED") {
          navigate("/generation/entities-form");
        }
      } else if (documentGeneration.currentStep === "completed") {
        navigate("/generation/final");
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div className="step-content">
        <Loader isVisible={true} message={loaderMessage} />
      </div>
    );
  }

  return (
    <>
      <section
        className={`generation ${
          showOverlay ? "generation--overlay-visible" : ""
        }`}
      >
        <div className="container">
          <div className="generation-content">
            <div className="generation-form">
              <div className="form-group">
                <QueryInput
                  value={query}
                  onChange={setQuery}
                  onSend={handleSubmit}
                  onCancel={handleCancel}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  onOverlayClick={handleOverlayClick}
                  isBusy={isLoading}
                  isFocused={showOverlay}
                  showOverlay={showOverlay}
                  disabled={false}
                />
              </div>
            </div>

            <div className="example-section">
              <div className="example-title">Пример запроса:</div>
              <div className="example-text">
                Привет! Помоги составить договор оказания услуг: я, Максим
                Игоревич Смирнов, оказываю услуги репетитора. Стоимость одного
                занятия 3 000 рублей, продолжительность 1 час. Время начала
                занятия согласовывается за 2 дня до урока. Оплата онлайн по
                карте после занятия.
              </div>
            </div>

            <div className="frequent-queries">
              <div className="frequent-queries-content">
                <div className="frequent-queries-text">
                  <h2 className="frequent-queries-title">
                    Шаблоны* запросов для составления договора:
                  </h2>
                  <div className="frequent-queries-list">
                    {frequentQueries.map((item, index) => (
                      <div key={index} className="frequent-queries-item">
                        <button
                          className={`frequent-queries-question ${
                            openTemplates[item.title] ? "active" : ""
                          }`}
                          onClick={() => toggleTemplate(item.title)}
                        >
                          <span>{item.title}</span>
                          <Icon
                            name="arrow"
                            className="frequent-queries-icon"
                          />
                        </button>
                        <div
                          className={`frequent-queries-answer ${
                            openTemplates[item.title]
                              ? "frequent-queries-answer--open"
                              : "frequent-queries-answer--closed"
                          }`}
                        >
                          <div className="frequent-queries-answer-content">
                            <p>{item.prompt}</p>
                            <button
                              className="use-template-btn"
                              onClick={() => handleTemplateSelect(item.prompt)}
                            >
                              Использовать шаблон
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="frequent-queries-text-2">
                    * Пока мы работаем только с предложенными типами договоров
                  </div>
                </div>
                <div className="frequent-queries-image"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Features isLoggedIn={true} onOpenAuthModal={() => {}} />
      <HowItWorks isLoggedIn={true} onOpenAuthModal={() => {}} />
      <FAQ />
    </>
  );
};

export default QueryInputPage;
