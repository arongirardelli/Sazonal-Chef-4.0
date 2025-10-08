import React from 'react';

interface LogoProps {
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 80, 
  color = "white", 
  className = "",
  style = {}
}) => {
  return (
    <img
      src="/icons/logo sem fundo.png"
      alt="Sazonal Chef Logo"
      width={size}
      height={size}
      className={className}
      style={{
        objectFit: 'contain',
        animation: 'pulse 2s ease-in-out infinite',
        ...style
      }}
    />
  );
};

export default Logo;
