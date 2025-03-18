
import React from 'react';

interface DesktopIconProps {
  name: string;
  icon: React.ReactNode;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ name, icon, onDoubleClick }) => {
  return (
    <div 
      className="flex flex-col items-center justify-center w-24 p-2 rounded hover:bg-white/10 cursor-pointer transition-colors text-center"
      onDoubleClick={onDoubleClick}
    >
      <div className="mb-2 h-12 w-12 flex items-center justify-center">
        {icon}
      </div>
      <p className="text-white text-xs font-urbanist">{name}</p>
    </div>
  );
};

export default DesktopIcon;
