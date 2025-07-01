import "./Footer.css";
import Icon from "../Icon/Icon";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <Icon name="footerLogo" width={280} height={44} />
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <a href="#" className="footer-link">
                Контакты
              </a>
              <a href="#" className="footer-link">
                Помощь юриста
              </a>
              <a href="#" className="footer-link">
                О нас
              </a>
            </div>

            <div className="footer-column">
              <a href="#" className="footer-link">
                Политика конфиденциальности
              </a>
              <a href="#" className="footer-link">
                Политика обработки данных
              </a>
            </div>

            <div className="footer-column">
              <a href="#" className="footer-link">
                ИП Иван Сидоров
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
