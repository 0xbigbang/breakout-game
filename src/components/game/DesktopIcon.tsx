import React from 'react';

interface DesktopIconProps {
  name: string;
  icon: React.ReactNode;
  onDoubleClick: () => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ name, icon, onDoubleClick }) => {
  return (
    <div 
      className="flex flex-col items-center justify-center w-28 p-3 rounded-xl backdrop-blur-md bg-black/40 hover:bg-black/60 cursor-pointer transition-all text-center border-2 border-purple-500/30 hover:border-purple-500/70 hover:scale-105 shadow-lg"
      onDoubleClick={onDoubleClick}
    >
      <div className="mb-2 h-16 w-16 flex items-center justify-center bg-gradient-to-br from-purple-900 to-purple-600 rounded-full p-3 shadow-inner">
        {icon}
      </div>
      <p className="text-white text-sm font-urbanist font-semibold">{name}</p>
    </div>
  );
};

export default DesktopIcon;
