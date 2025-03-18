
import React, { useState } from 'react';
import { X, Minus, CircleIcon } from 'lucide-react';

interface MacWindowProps {
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const MacWindow: React.FC<MacWindowProps> = ({ 
  title, 
  children,
  onClose 
}) => {
  const [isMinimized, setIsMinimized] = useState(false);

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden w-full">
      {/* Window title bar */}
      <div className="bg-gray-700 px-4 py-2 flex items-center justify-between drag-handle">
        <div className="flex space-x-2">
          <button 
            onClick={onClose} 
            className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center"
          >
            <X size={8} className="opacity-0 group-hover:opacity-100" />
          </button>
          <button 
            onClick={handleMinimize}
            className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center"
          >
            <Minus size={8} className="opacity-0 group-hover:opacity-100" />
          </button>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-sm text-gray-300 font-urbanist">{title}</div>
        <div className="w-14"></div> {/* Spacer to center the title */}
      </div>
      
      {/* Window content */}
      <div className={`transition-all duration-300 ${isMinimized ? 'h-0 overflow-hidden' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default MacWindow;
