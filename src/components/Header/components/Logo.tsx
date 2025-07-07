import React from "react";
import Icon from "../../Icon";

interface LogoProps {
  width?: number;
  height?: number;
}

export const Logo: React.FC<LogoProps> = ({ width = 280, height = 44 }) => {
  return (
    <div className="logo">
      <Icon name="logoName" width={width} height={height} />
    </div>
  );
};
