import { useState } from "react";
import "./App.css";
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

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const handleOpenAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleLogin = (email: string, password: string) => {
    // Здесь будет логика аутентификации
    // Пока просто сохраняем email и устанавливаем состояние входа
    setUserEmail(email);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
  };

  return (
    <div className="app">
      <Header
        onOpenAuthModal={handleOpenAuthModal}
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      <div className={`app-layout ${isLoggedIn ? "with-sidebar" : ""}`}>
        {isLoggedIn && <Sidebar isVisible={true} />}

        <main className="main-content">
          {!isLoggedIn && (
            <div>
              <Hero />
              <ContractTypes />
            </div>
          )}

          {isLoggedIn && <Generation />}

          <Features />
          <HowItWorks />
          <FAQ />
        </main>
      </div>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;
