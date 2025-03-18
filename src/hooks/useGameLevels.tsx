
import { useState, useCallback } from 'react';

// Types for game objects
type Position = {
  x: number;
  y: number;
};

type Block = {
  id: number;
  position: Position;
  width: number;
  height: number;
  color: string;
  destroyed: boolean;
};

interface LevelConfig {
  rows: number;
  blocksPerRow: number;
  colors: string[];
  ballSpeed: number;
}

export const useGameLevels = (gameWidth: number, gameHeight: number) => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const maxLevel = 3;

  const levels: Record<number, LevelConfig> = {
    1: {
      rows: 5,
      blocksPerRow: 8,
      colors: ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#8B5CF6'],
      ballSpeed: 5,
    },
    2: {
      rows: 6,
      blocksPerRow: 9,
      colors: ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#8B5CF6', '#B45309'],
      ballSpeed: 6,
    },
    3: {
      rows: 7,
      blocksPerRow: 10,
      colors: ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA', '#8B5CF6', '#B45309', '#9D174D'],
      ballSpeed: 7,
    }
  };

  const createBlocksForLevel = useCallback((level: number, blockWidth: number, blockHeight: number, blockGap: number): Block[] => {
    const blocks: Block[] = [];
    const levelConfig = levels[level] || levels[1];
    
    const { rows, blocksPerRow, colors } = levelConfig;
    
    let id = 0;
    for (let row = 0; row < rows; row++) {
      const y = row * (blockHeight + blockGap) + 50;
      const xOffset = (gameWidth - (blocksPerRow * (blockWidth + blockGap) - blockGap)) / 2;
      
      for (let col = 0; col < blocksPerRow; col++) {
        const x = col * (blockWidth + blockGap) + xOffset;
        blocks.push({
          id: id++,
          position: { x, y },
          width: blockWidth,
          height: blockHeight,
          color: colors[row % colors.length],
          destroyed: false,
        });
      }
    }
    
    return blocks;
  }, [gameWidth]);

  const advanceToNextLevel = useCallback(() => {
    if (currentLevel < maxLevel) {
      setCurrentLevel(prev => prev + 1);
      return true;
    }
    return false;
  }, [currentLevel, maxLevel]);

  const getBallSpeedForCurrentLevel = useCallback(() => {
    return levels[currentLevel]?.ballSpeed || 5;
  }, [currentLevel, levels]);

  const resetLevel = useCallback(() => {
    setCurrentLevel(1);
  }, []);

  return {
    currentLevel,
    maxLevel,
    getBallSpeedForCurrentLevel,
    createBlocksForLevel,
    advanceToNextLevel,
    resetLevel
  };
};
