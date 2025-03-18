
import React from 'react';
import { Heart } from 'lucide-react';

interface GameStatsProps {
  score: number;
  lives: number;
}

const GameStats: React.FC<GameStatsProps> = ({ score, lives }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="bg-gray-800 rounded-md p-2 shadow-md">
        <p className="text-sm font-medium text-gray-400">Score</p>
        <p className="text-xl font-bold text-white">{score}</p>
      </div>
      
      <div className="bg-gray-800 rounded-md p-2 shadow-md flex items-center">
        <p className="text-sm font-medium text-gray-400 mr-2">Lives</p>
        <div className="flex">
          {[...Array(3)].map((_, i) => (
            <Heart 
              key={i} 
              size={20} 
              className={i < lives ? "text-red-500 mr-1" : "text-gray-600 mr-1"} 
              fill={i < lives ? "#ef4444" : "transparent"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameStats;
