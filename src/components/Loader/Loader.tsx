import React from "react";
import "./Loader.css";

interface LoaderProps {
  isVisible: boolean;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ isVisible, message }) => {
  if (!isVisible) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <div className="loader-spinner">
          <div className="loader-circle"></div>
          <div className="loader-circle"></div>
          <div className="loader-circle"></div>
        </div>
        {message && <div className="loader-message">{message}</div>}
      </div>
    </div>
  );
};

export default Loader;
