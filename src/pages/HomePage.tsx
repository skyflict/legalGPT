import React from "react";
import Hero from "../components/Hero/Hero";
import ContractTypes from "../components/ContractTypes/ContractTypes";
import ForWhom from "../components/ForWhom/ForWhom";
import Features from "../components/Features/Features";
import HowItWorks from "../components/HowItWorks/HowItWorks";
import FAQ from "../components/FAQ/FAQ";

interface Props {
  onOpenAuthModal: () => void;
  onOpenRegisterModal: () => void;
  isLoggedIn: boolean;
}

const HomePage: React.FC<Props> = ({
  onOpenAuthModal,
  onOpenRegisterModal,
  isLoggedIn,
}) => {
  return (
    <>
      {!isLoggedIn && <Hero onOpenAuthModal={onOpenAuthModal} />}
      {!isLoggedIn && (
        <ContractTypes onOpenRegisterModal={onOpenRegisterModal} />
      )}
      <ForWhom isLoggedIn={isLoggedIn} onOpenAuthModal={onOpenAuthModal} />
      <Features isLoggedIn={isLoggedIn} onOpenAuthModal={onOpenAuthModal} />
      <HowItWorks isLoggedIn={isLoggedIn} onOpenAuthModal={onOpenAuthModal} />
      <FAQ />
    </>
  );
};

export default HomePage;
