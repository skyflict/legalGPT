import { useState } from "react";
import Icon from "../Icon";
import Modal from "../Modal";
import "./Sidebar.css";

interface SidebarProps {
  isVisible: boolean;
}

const Sidebar = ({ isVisible }: SidebarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleItemClick = () => {
    console.log("Sidebar button clicked!");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <aside className="sidebar-embedded">
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <button className="nav-item active" onClick={handleItemClick}>
              <Icon name="create" size="md" title="Создать" />
              <span className="nav-text">Создать</span>
            </button>
            <button className="nav-item" onClick={handleItemClick}>
              <Icon name="text" size="md" title="Шаблоны" />
              <span className="nav-text">Шаблоны</span>
            </button>
            <button className="nav-item" onClick={handleItemClick}>
              <Icon name="help" size="md" title="Помощь юриста" />
              <span className="nav-text">Помощь юриста</span>
            </button>
            <button className="nav-item" onClick={handleItemClick}>
              <Icon name="history" size="md" title="История" />
              <span className="nav-text">История</span>
            </button>
          </nav>
        </div>
      </aside>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Функционал в разработке"
      >
        <div className="modal-content"></div>
      </Modal>
    </>
  );
};

export default Sidebar;
