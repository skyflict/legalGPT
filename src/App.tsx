import { useState, useEffect } from "react";
import "./App.css";
import { API_ENDPOINTS, apiRequest } from "./utils/api";
import Header from "./components/Header/Header";
import Hero from "./components/Hero/Hero";
import ContractTypes from "./components/ContractTypes/ContractTypes";
import Features from "./components/Features/Features";
import FAQ from "./components/FAQ/FAQ";
import HowItWorks from "./components/HowItWorks/HowItWorks";
import Footer from "./components/Footer/Footer";
import AuthModal from "./components/AuthModal/AuthModal";
import Sidebar from "./components/Sidebar/Sidebar";
import Generation from "./components/Generation/Generation";
import HistoryPage from "./components/History/HistoryPage";

interface UserData {
  id: string;
  email: string;
  role: string;
  balance: number;
}

type ViewName = "generation" | "history";

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">(
    "login"
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const savedEmail = localStorage.getItem("userEmail");

    if (token && savedEmail) {
      setIsLoggedIn(true);
      setUserEmail(savedEmail);
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const data = await apiRequest(API_ENDPOINTS.USER);
      setUserData(data);
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
    }
  };

  const handleOpenAuthModal = () => {
    setAuthModalMode("login");
    setIsAuthModalOpen(true);
  };

  const handleOpenRegisterModal = () => {
    setAuthModalMode("register");
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogin = async (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);

    localStorage.setItem("userEmail", email);

    await fetchUserData();
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (token) {
        await fetch(API_ENDPOINTS.LOGOUT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Ошибка при выходе:", error);
    } finally {
      setIsLoggedIn(false);
      setUserEmail("");
      setUserData(null);

      localStorage.removeItem("authToken");
      localStorage.removeItem("userEmail");
    }
  };

  const [currentView, setCurrentView] = useState<ViewName>("generation");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app">
      <Header
        onOpenAuthModal={handleOpenAuthModal}
        onOpenRegisterModal={handleOpenRegisterModal}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onLogout={handleLogout}
        onToggleSidebar={toggleSidebar}
      />

      <div className={`app-layout ${isLoggedIn ? "with-sidebar" : ""}`}>
        {isLoggedIn && (
          <Sidebar
            isVisible={isSidebarOpen}
            userRole={userData?.role}
            // пробрасываем смену вида через кастомное событие
            onOpenHistory={() => setCurrentView("history")}
            onOpenGeneration={() => setCurrentView("generation")}
            active={currentView}
          />
        )}

        <main className="main-content">
          {!isLoggedIn && (
            <div>
              <Hero onOpenAuthModal={handleOpenAuthModal} />
              <ContractTypes />
            </div>
          )}

          {isLoggedIn && currentView === "generation" && <Generation />}
          {isLoggedIn && currentView === "history" && <HistoryPage />}

          {currentView !== "history" && (
            <>
              <Features
                isLoggedIn={isLoggedIn}
                onOpenAuthModal={handleOpenAuthModal}
              />
              <HowItWorks
                isLoggedIn={isLoggedIn}
                onOpenAuthModal={handleOpenAuthModal}
              />
              <FAQ />
            </>
          )}
        </main>
      </div>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onLogin={handleLogin}
        initialMode={authModalMode}
      />
    </div>
  );
}

export default App;
