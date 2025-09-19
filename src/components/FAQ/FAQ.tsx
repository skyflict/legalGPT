import { useState } from "react";
import "./FAQ.css";
import Icon from "../Icon/Icon";

const FAQ = () => {
  const [openItem, setOpenItem] = useState<number | null>(0);

  const faqItems = [
    {
      id: 0,
      question: "Это безопасно?",
      answer: `Мы используем ваши данные лишь для создания договоров и строго придерживаемся всех законодательных требований. Если у вас есть сомнения относительно передачи информации, вы всегда можете самостоятельно заполнить все чувствительные данные в финальном docx. Файле на вашем устройстве.
`,
    },
    {
      id: 1,
      question: "Что делать если я ошибся в данных?",
      answer:
        "В случае если вы ошиблись в данных вы сможете скорректировать введённые данные самостоятельно, до генерации договора. В крайнем случае отдельные значения вы всегда сможете самостоятельно поменять в договоре",
    },
    {
      id: 2,
      question: "Сколько стоит генерация?",
      answer:
        "Для расчета внутри нашего сервиса используются условная внутренняя валюта, которая приобретается за рубли. Одна генерация стоит 10 LC.",
    },
    {
      id: 3,
      question: "Сколько стоит консультация юриста?",
      answer: "Консультация юриста стоит от 2000 рублей за час.",
    },
    {
      id: 4,
      question: "Как происходит оплата?",
      answer:
        "Купленная внутренняя валюта будет зачислена на ваш аккаунт. После оформления запроса необходимая сумма резервируется на вашем внутреннем счёте и будет списана через три дня после генерации. Если генерация будет неудовлетворительного качества, вы сможете обратиться к поддержке, и мы вернем вам внутреннюю валюту.",
    },
    {
      id: 5,
      question: "В каком формате будет договор?",
      answer:
        "Вы сможете его скачать в формате docx. без каких-либо ограничений",
    },
    {
      id: 6,
      question: "Куда обращаться, если нет ответа на мой вопрос?",
      answer:
        "Вы можете написать нам на почту [•] мы будем рады ответить на ваши вопросы и рассказать о наших процессах",
    },
  ];

  const toggleItem = (id: number) => {
    setOpenItem(openItem === id ? null : id);
  };

  return (
    <section className="faq">
      <div className="container">
        <div className="faq-content">
          <div className="faq-text">
            <h2 className="faq-title">Частые вопросы:</h2>
            <div className="faq-list">
              {faqItems.map((item) => (
                <div key={item.id} className="faq-item">
                  <button
                    className={`faq-question ${
                      openItem === item.id ? "active" : ""
                    }`}
                    onClick={() => toggleItem(item.id)}
                  >
                    <span>{item.question}</span>
                    <Icon name="arrow" className="faq-icon" />
                  </button>
                  <div
                    className={`faq-answer ${
                      openItem === item.id
                        ? "faq-answer--open"
                        : "faq-answer--closed"
                    }`}
                  >
                    <div className="faq-answer-content">{item.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="faq-image" />
        </div>
      </div>
    </section>
  );
};

export default FAQ;
