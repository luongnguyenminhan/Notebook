// components/ui/Icon.tsx
import React from 'react';
import { IconType } from 'react-icons';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';

// Define a mapping of icon names to actual icon components
const icons: { [key: string]: IconType } = {
  home: FaHome,
  user: FaUser,
  settings: FaCog,
};

type IconProps = {
  name: keyof typeof icons;
  size?: number;
  color?: string;
  className?: string;
  onClick?: () => void;
};

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color = 'currentColor',
  className = '',
  onClick,
}) => {
  const SelectedIcon = icons[name];

  return (
    <span
      className={`icon ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center' }}
    >
      {SelectedIcon ? (
        <SelectedIcon
          size={size}
          color={color}
          onClick={onClick}
          style={{ cursor: onClick ? 'pointer' : 'default' }}
        />
      ) : (
        <span style={{ fontSize: size, color }}>?</span> // Fallback if icon not found
      )}
    </span>
  );
};

export default Icon;
