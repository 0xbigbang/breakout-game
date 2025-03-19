import React from 'react';
import { Heart, Trophy, Star } from 'lucide-react';

interface GameStatsProps {
  score: number;
  lives: number;
  level?: number;
}

const GameStats: React.FC<GameStatsProps> = ({ score, lives, level = 1 }) => {
  return (
    <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-2 shadow-lg border border-gray-700 font-urbanist flex items-center justify-between w-64">
      {/* Score */}
      <div className="flex flex-col items-center">
        <div className="flex items-center mb-1">
          <Star size={14} className="text-yellow-400 mr-1" />
          <p className="text-xs font-medium text-gray-300">Score</p>
        </div>
        <p className="text-lg font-bold text-white">{score}</p>
      </div>
      
      {/* Level */}
      <div className="flex flex-col items-center">
        <div className="flex items-center mb-1">
          <Trophy size={14} className="text-yellow-500 mr-1" />
          <p className="text-xs font-medium text-gray-300">Level</p>
        </div>
        <p className="text-lg font-bold text-white">{level}</p>
      </div>
      
      {/* Lives */}
      <div className="flex flex-col items-center">
        <p className="text-xs font-medium text-gray-300 mb-1">Lives</p>
        <div className="flex">
          {[...Array(3)].map((_, i) => (
            <Heart 
              key={i} 
              size={18} 
              className={i < lives ? "text-red-500 mx-0.5" : "text-gray-600 mx-0.5"} 
              fill={i < lives ? "#ef4444" : "transparent"}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameStats;
