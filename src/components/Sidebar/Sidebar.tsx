import { useState } from "react";
import Icon from "../Icon";
import Modal from "../Modal";
import "./Sidebar.css";
import { apiRequest, API_ENDPOINTS } from "../../utils/api";

type ActiveTab = "generation" | "history";

interface SidebarProps {
  isVisible: boolean;
  userRole?: string;
  onOpenHistory?: () => void;
  onOpenGeneration?: () => void;
  active?: ActiveTab;
}

interface User {
  id: string;
  email: string;
  role: string;
  balance: number;
}

const Sidebar = ({
  isVisible,
  userRole,
  onOpenHistory,
  onOpenGeneration,
  active,
}: SidebarProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isBonusModalOpen, setIsBonusModalOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [bonusAmount, setBonusAmount] = useState<number>(0);
  const [bonusReason, setBonusReason] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // const handleItemClick = () => {
  //   setIsModalOpen(true);
  // };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAdminClick = async () => {
    setIsAdminModalOpen(true);
    await fetchUsers();
  };

  const handleCloseAdminModal = () => {
    setIsAdminModalOpen(false);
    setError(null);
    setSuccessMessage(null);
  };

  const handleCloseBonusModal = () => {
    setIsBonusModalOpen(false);
    setSelectedUser(null);
    setBonusAmount(0);
    setBonusReason("");
    setError(null);
    setSuccessMessage(null);
    setIsAdminModalOpen(true);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiRequest(API_ENDPOINTS.ADMIN_USERS);
      setUsers(response.users);
    } catch (err) {
      setError("Ошибка при загрузке списка пользователей");
      console.error("Ошибка при загрузке списка пользователей:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHistoryClick = () => {
    onOpenHistory?.();
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setIsAdminModalOpen(false);
    setIsBonusModalOpen(true);
  };

  const handleAddBonus = async () => {
    if (!selectedUser) return;

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await apiRequest(API_ENDPOINTS.ADMIN_USER_BALANCE(selectedUser.id), {
        method: "PATCH",
        body: JSON.stringify({
          amount: bonusAmount,
          reason: bonusReason,
        }),
      });

      setSuccessMessage(
        `Бонус успешно начислен пользователю ${selectedUser.email}`
      );

      // Закрываем модальное окно бонусов и возвращаемся к списку пользователей
      setTimeout(() => {
        setIsBonusModalOpen(false);
        setSelectedUser(null);
        setBonusAmount(0);
        setBonusReason("");
        setSuccessMessage(null);
        setIsAdminModalOpen(true);
      }, 2000);

      // Обновляем список пользователей
      await fetchUsers();
    } catch (err) {
      setError("Ошибка при начислении бонуса");
      console.error("Ошибка при начислении бонуса:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // На мобильных устройствах всегда рендерим, но управляем видимостью через CSS
  // На десктопе используем старую логику
  const shouldRender = window.innerWidth > 1024 ? isVisible : true;

  if (!shouldRender) return null;

  return (
    <>
      <aside className={`sidebar-embedded ${isVisible ? "visible" : ""}`}>
        <div className="sidebar-content">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${active === "generation" ? "active" : ""}`}
              onClick={() => onOpenGeneration?.()}
            >
              <Icon name="create" size="md" title="Создать" />
              <span className="nav-text">Создать</span>
            </button>
            {/* <button className="nav-item" onClick={handleItemClick}>
              <Icon name="text" size="md" title="Шаблоны" />
              <span className="nav-text">Шаблоны</span>
            </button> */}
            {/* <button className="nav-item" onClick={handleItemClick}>
              <Icon name="help" size="md" title="Помощь юриста" />
              <span className="nav-text">Помощь юриста</span>
            </button> */}
            <button
              className={`nav-item ${active === "history" ? "active" : ""}`}
              onClick={handleHistoryClick}
            >
              <Icon name="history" size="md" title="История" />
              <span className="nav-text">История</span>
            </button>

            {userRole === "admin" && (
              <button className="nav-item" onClick={handleAdminClick}>
                <Icon name="award" size="md" title="Админ.панель" />
                <span className="nav-text">Админ.панель</span>
              </button>
            )}
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

      <Modal
        isOpen={isAdminModalOpen}
        onClose={handleCloseAdminModal}
        title="Список пользователей"
      >
        <div className="admin-modal-content">
          {isLoading && <div className="loading">Загрузка...</div>}

          <div className="users-list">
            {users.length > 0 ? (
              <div className="users-table">
                <table>
                  <thead>
                    <tr>
                      <th>Email</th>
                      <th>Баланс</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.email}</td>
                        <td>{user.balance} Ю</td>
                        <td>
                          <button
                            onClick={() => handleUserSelect(user)}
                            className="select-user-btn"
                          >
                            Выбрать
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* Мобильные карточки */}
                {users.map((user) => (
                  <div key={user.id} className="user-card">
                    <div className="user-card-row">
                      <span className="user-card-label">Email:</span>
                      <span className="user-card-value user-card-email">
                        {user.email}
                      </span>
                    </div>
                    <div className="user-card-row">
                      <span className="user-card-label">Баланс:</span>
                      <span className="user-card-value">{user.balance} Ю</span>
                    </div>
                    <button
                      onClick={() => handleUserSelect(user)}
                      className="select-user-btn"
                    >
                      Выбрать
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Нет доступных пользователей</p>
            )}
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isBonusModalOpen}
        onClose={handleCloseBonusModal}
        title={`Начисление бонусов для ${selectedUser?.email || ""}`}
      >
        <div className="admin-modal-content">
          {isLoading && <div className="loading">Загрузка...</div>}

          {error && <div className="error-message">{error}</div>}

          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}

          {selectedUser && (
            <div className="bonus-form">
              <div className="form-group">
                <label htmlFor="bonus-amount">Количество бонусов:</label>
                <input
                  type="number"
                  id="bonus-amount"
                  value={bonusAmount}
                  onChange={(e) => setBonusAmount(Number(e.target.value))}
                  min="0"
                  style={{
                    maxWidth: "380px",
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bonus-reason">Причина начисления:</label>
                <textarea
                  id="bonus-reason"
                  value={bonusReason}
                  onChange={(e) => setBonusReason(e.target.value)}
                  rows={3}
                  style={{
                    maxWidth: "380px",
                  }}
                />
              </div>

              <button
                className="add-bonus-btn"
                onClick={handleAddBonus}
                disabled={isLoading || bonusAmount <= 0 || !bonusReason.trim()}
              >
                Начислить бонусы
              </button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
