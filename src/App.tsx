import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import "./App.css";
import { API_ENDPOINTS, apiRequest } from "./utils/api";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import AuthModal from "./components/AuthModal/AuthModal";
import Sidebar from "./components/Sidebar/Sidebar";
import Loader from "./components/Loader/Loader";

import HomePage from "./pages/HomePage";
import HistoryPage from "./pages/HistoryPage";
import GenerationPage from "./pages/GenerationPage";

interface UserData {
  id: string;
  email: string;
  role: string;
  balance: number;
}

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "register">(
    "login"
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const savedEmail = localStorage.getItem("userEmail");

    if (token && savedEmail) {
      setIsLoggedIn(true);
      setUserEmail(savedEmail);
      fetchUserData();
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && isLoggedIn && location.pathname === "/") {
      navigate("/generation", { replace: true });
    }
  }, [isLoading, isLoggedIn, location.pathname, navigate]);

  const fetchUserData = async () => {
    try {
      const data = await apiRequest(API_ENDPOINTS.USER);
      setUserData(data);
    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error);
    } finally {
      setIsLoading(false);
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

    if (location.pathname === "/") {
      navigate("/generation");
    }
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

  // Блокируем скролл фона при открытом мобильном сайдбаре
  useEffect(() => {
    const applyNoScroll = () => {
      if (window.innerWidth <= 1024) {
        document.body.classList.toggle("no-scroll", isSidebarOpen);
      } else {
        document.body.classList.remove("no-scroll");
      }
    };

    applyNoScroll();
    window.addEventListener("resize", applyNoScroll);
    return () => {
      window.removeEventListener("resize", applyNoScroll);
      document.body.classList.remove("no-scroll");
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const getCurrentView = (): "generation" | "history" => {
    if (location.pathname.startsWith("/generation")) {
      return "generation";
    }
    if (location.pathname === "/history") {
      return "history";
    }
    return "generation";
  };

  if (isLoading) {
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
        <div className="app-layout">
          <main className="main-content">
            <Loader isVisible={true} message="Загрузка..." />
          </main>
        </div>
        <Footer />
      </div>
    );
  }

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
          <>
            <div
              className={`sidebar-overlay ${isSidebarOpen ? "visible" : ""}`}
              onClick={() => setIsSidebarOpen(false)}
            />
            <Sidebar
              isVisible={isSidebarOpen}
              userRole={userData?.role}
              onOpenHistory={() => {
                navigate("/history");
                if (window.innerWidth <= 1024) {
                  setIsSidebarOpen(false);
                }
              }}
              onOpenGeneration={() => {
                navigate("/generation");
                if (window.innerWidth <= 1024) {
                  setIsSidebarOpen(false);
                }
              }}
              active={getCurrentView()}
            />
          </>
        )}

        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  onOpenAuthModal={handleOpenAuthModal}
                  onOpenRegisterModal={handleOpenRegisterModal}
                  isLoggedIn={isLoggedIn}
                />
              }
            />

            <Route
              path="/generation"
              element={
                isLoggedIn ? (
                  <GenerationPage />
                ) : (
                  <HomePage
                    onOpenAuthModal={handleOpenAuthModal}
                    onOpenRegisterModal={handleOpenRegisterModal}
                    isLoggedIn={isLoggedIn}
                  />
                )
              }
            />

            <Route
              path="/history"
              element={
                isLoggedIn ? (
                  <HistoryPage />
                ) : (
                  <HomePage
                    onOpenAuthModal={handleOpenAuthModal}
                    onOpenRegisterModal={handleOpenRegisterModal}
                    isLoggedIn={isLoggedIn}
                  />
                )
              }
            />
          </Routes>
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
