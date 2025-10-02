// src/components/common/IconButton.tsx
import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
  style?: React.CSSProperties; // Add style prop
}

export const IconButton: React.FC<IconButtonProps> = ({ onClick, icon, className, style }) => {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform duration-150 ease-in-out hover:scale-110 ${className}`}
      style={style} // Apply style prop
    >
      {icon}
    </button>
  );
};