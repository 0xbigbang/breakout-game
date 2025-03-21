import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useGameLevels } from '@/hooks/useGameLevels';

// Game constants
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_RADIUS = 8;
const BLOCK_WIDTH = 60;
const BLOCK_HEIGHT = 20;
const BLOCK_GAP = 10;
const PADDLE_SPEED = 8;
const GAME_WIDTH = 600;
const GAME_HEIGHT = 500;
const BORDER_PADDING = 20;  // Padding from the game borders

// Types for game objects
type Position = {
  x: number;
  y: number;
};

type Velocity = {
  dx: number;
  dy: number;
};

type Block = {
  id: number;
  position: Position;
  width: number;
  height: number;
  color: string;
  destroyed: boolean;
};

type GameState = {
  paddle: {
    position: Position;
    width: number;
    height: number;
  };
  ball: {
    position: Position;
    radius: number;
    velocity: Velocity;
    inPlay: boolean;
  };
  blocks: Block[];
  score: number;
  lives: number;
  gameOver: boolean;
  gameWon: boolean;
  levelComplete: boolean;
  proofGenerated: number;
  level: number;
};

interface GameContextType {
  gameState: GameState;
  startGame: () => void;
  resetGame: () => void;
  movePaddle: (direction: 'left' | 'right') => void;
  launchBall: () => void;
  advanceLevel: () => void;
  generateProof: () => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// Initial game state
const createInitialGameState = (blocks: Block[]): GameState => ({
  paddle: {
    position: {
      x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2,
      y: GAME_HEIGHT - PADDLE_HEIGHT - 13,
    },
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
  },
  ball: {
    position: {
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT - PADDLE_HEIGHT - 13 - BALL_RADIUS,
    },
    radius: BALL_RADIUS,
    velocity: { dx: 0, dy: 0 },
    inPlay: false,
  },
  blocks,
  score: 0,
  lives: 3,
  gameOver: false,
  gameWon: false,
  levelComplete: false,
  proofGenerated: 0,
  level: 1,
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const gameLevels = useGameLevels(GAME_WIDTH, GAME_HEIGHT);
  const [gameState, setGameState] = useState<GameState>(createInitialGameState(
    gameLevels.createBlocksForLevel(1, BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_GAP)
  ));
  const [gameInterval, setGameInterval] = useState<NodeJS.Timeout | null>(null);
  const [keyPressedLeft, setKeyPressedLeft] = useState(false);
  const [keyPressedRight, setKeyPressedRight] = useState(false);
  
  // Add function to generate SP1 proof manually
  const generateProof = async () => {
    // Only generate proof if there are blocks destroyed
    if (gameState.blocks.some(block => block.destroyed)) {
      // Increment the proof counter
      setGameState(prev => ({
        ...prev,
        proofGenerated: prev.proofGenerated + 1
      }));
      
      // In a real implementation, this would actually call the SP1 proof generator
      // But we're already doing that in the ProofTerminal component
      console.log("Manual proof generation triggered");
      return Promise.resolve();
    } else {
      console.log("No blocks destroyed yet - nothing to prove");
      return Promise.resolve();
    }
  };
  
  // Reset game to initial state
  const resetGame = useCallback(() => {
    gameLevels.resetLevel();
    const blocks = gameLevels.createBlocksForLevel(1, BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_GAP);
    setGameState(createInitialGameState(blocks));
  }, [gameLevels]);
  
  // Start the game
  const startGame = useCallback(() => {
    resetGame();
  }, [resetGame]);
  
  // Advance to the next level
  const advanceLevel = useCallback(() => {
    const nextLevel = gameState.level + 1;
    const hasNextLevel = nextLevel <= gameLevels.maxLevel;
    
    if (hasNextLevel) {
      const blocks = gameLevels.createBlocksForLevel(nextLevel, BLOCK_WIDTH, BLOCK_HEIGHT, BLOCK_GAP);
      
      setGameState(prevState => ({
        ...prevState,
        level: nextLevel,
        blocks,
        paddle: {
          ...prevState.paddle,
          position: {
            x: GAME_WIDTH / 2 - PADDLE_WIDTH / 2,
            y: GAME_HEIGHT - PADDLE_HEIGHT - 13,
          },
        },
        ball: {
          ...prevState.ball,
          position: {
            x: GAME_WIDTH / 2,
            y: GAME_HEIGHT - PADDLE_HEIGHT - 13 - BALL_RADIUS,
          },
          velocity: { dx: 0, dy: 0 },
          inPlay: false,
        },
        levelComplete: false,
      }));
    } else {
      setGameState(prevState => ({
        ...prevState,
        gameWon: true,
        levelComplete: false
      }));
    }
  }, [gameState.level, gameLevels]);
  
  // Move the paddle left or right
  const movePaddle = useCallback((direction: 'left' | 'right') => {
    setGameState(prevState => {
      const newX = 
        direction === 'left' 
          ? Math.max(0, prevState.paddle.position.x - PADDLE_SPEED) 
          : Math.min(GAME_WIDTH - prevState.paddle.width, prevState.paddle.position.x + PADDLE_SPEED);
      
      const newPaddle = {
        ...prevState.paddle,
        position: { ...prevState.paddle.position, x: newX },
      };
      
      // If ball is not in play, move it with the paddle
      let newBall = { ...prevState.ball };
      if (!prevState.ball.inPlay) {
        newBall.position.x = newPaddle.position.x + (newPaddle.width / 2);
      }
      
      return {
        ...prevState,
        paddle: newPaddle,
        ball: newBall,
      };
    });
  }, []);
  
  // Launch the ball if it's not in play
  const launchBall = useCallback(() => {
    setGameState(prevState => {
      if (!prevState.ball.inPlay && !prevState.gameOver && !prevState.gameWon && !prevState.levelComplete) {
        const ballSpeed = gameLevels.getBallSpeedForCurrentLevel();
        return {
          ...prevState,
          ball: {
            ...prevState.ball,
            inPlay: true,
            velocity: { dx: ballSpeed * (Math.random() > 0.5 ? 1 : -1), dy: -ballSpeed },
          },
        };
      }
      return prevState;
    });
  }, [gameLevels]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') {
        setKeyPressedLeft(true);
      } else if (key === 'arrowright' || key === 'd') {
        setKeyPressedRight(true);
      }
      
      if (key === ' ') {
        // Prevent default spacebar behavior (scrolling)
        e.preventDefault();
        launchBall();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowleft' || key === 'a') {
        setKeyPressedLeft(false);
      } else if (key === 'arrowright' || key === 'd') {
        setKeyPressedRight(false);
      }
      
      // Also prevent default for spacebar on keyup
      if (key === ' ') {
        e.preventDefault();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [launchBall]);
  
  // Process paddle movement based on keys pressed
  useEffect(() => {
    if (gameState.gameOver || gameState.gameWon || gameState.levelComplete) return;
    
    const processPaddleMovement = () => {
      if (keyPressedLeft && !keyPressedRight) {
        movePaddle('left');
      } else if (keyPressedRight && !keyPressedLeft) {
        movePaddle('right');
      }
    };
    
    const intervalId = setInterval(processPaddleMovement, 16);
    return () => clearInterval(intervalId);
  }, [keyPressedLeft, keyPressedRight, movePaddle, gameState.gameOver, gameState.gameWon, gameState.levelComplete]);
  
  // Game loop
  useEffect(() => {
    if (gameState.gameOver || gameState.gameWon || gameState.levelComplete || !gameState.ball.inPlay) return;
    
    const gameLoop = () => {
      setGameState(prevState => {
        // Ball movement
        const newBallPosition = {
          x: prevState.ball.position.x + prevState.ball.velocity.dx,
          y: prevState.ball.position.y + prevState.ball.velocity.dy,
        };
        
        let newBallVelocity = { ...prevState.ball.velocity };
        
        // Wall collisions
        if (newBallPosition.x - BALL_RADIUS < 0 || newBallPosition.x + BALL_RADIUS > GAME_WIDTH) {
          newBallVelocity.dx = -newBallVelocity.dx;
          
          // Add a slight random adjustment to the vertical velocity to prevent strict up-down patterns
          const currentSpeed = Math.sqrt(newBallVelocity.dx ** 2 + newBallVelocity.dy ** 2);
          newBallVelocity.dy += (Math.random() - 0.5) * (currentSpeed * 0.1);
        }
        
        if (newBallPosition.y - BALL_RADIUS < 0) {
          newBallVelocity.dy = -newBallVelocity.dy;
          
          // Add a slight random adjustment to the horizontal velocity
          const currentSpeed = Math.sqrt(newBallVelocity.dx ** 2 + newBallVelocity.dy ** 2);
          newBallVelocity.dx += (Math.random() - 0.5) * (currentSpeed * 0.1);
        }
        
        // Ball fell below paddle
        if (newBallPosition.y + BALL_RADIUS > GAME_HEIGHT) {
          // Lose a life
          const newLives = prevState.lives - 1;
          const gameOver = newLives <= 0;
          
          return {
            ...prevState,
            lives: newLives,
            gameOver,
            ball: {
              ...prevState.ball,
              position: {
                x: prevState.paddle.position.x + prevState.paddle.width / 2,
                y: prevState.paddle.position.y - BALL_RADIUS,
              },
              velocity: { dx: 0, dy: 0 },
              inPlay: false,
            },
          };
        }
        
        // Paddle collision
        const paddleLeft = prevState.paddle.position.x;
        const paddleRight = prevState.paddle.position.x + prevState.paddle.width;
        const paddleTop = prevState.paddle.position.y;
        
        if (
          newBallPosition.y + BALL_RADIUS >= paddleTop &&
          newBallPosition.y - BALL_RADIUS <= paddleTop + PADDLE_HEIGHT &&
          newBallPosition.x + BALL_RADIUS >= paddleLeft &&
          newBallPosition.x - BALL_RADIUS <= paddleRight &&
          prevState.ball.velocity.dy > 0
        ) {
          // Calculate where the ball hit the paddle (0 to 1)
          const hitPosition = (newBallPosition.x - paddleLeft) / prevState.paddle.width;
          
          // Reflect ball with angle based on hit position
          const angle = (hitPosition * 2 - 1) * Math.PI / 4; // -45 to 45 degrees
          const speed = Math.sqrt(newBallVelocity.dx ** 2 + newBallVelocity.dy ** 2);
          
          newBallVelocity.dx = Math.sin(angle) * speed;
          newBallVelocity.dy = -Math.abs(Math.cos(angle) * speed);
        }
        
        // Block collisions
        let blocksChanged = false;
        let newProofGenerated = prevState.proofGenerated;
        const newBlocks = prevState.blocks.map(block => {
          if (block.destroyed) return block;
          
          const blockLeft = block.position.x;
          const blockRight = block.position.x + block.width;
          const blockTop = block.position.y;
          const blockBottom = block.position.y + block.height;
          
          if (
            newBallPosition.x + BALL_RADIUS >= blockLeft &&
            newBallPosition.x - BALL_RADIUS <= blockRight &&
            newBallPosition.y + BALL_RADIUS >= blockTop &&
            newBallPosition.y - BALL_RADIUS <= blockBottom
          ) {
            blocksChanged = true;
            
            // Determine collision direction
            const dx = newBallPosition.x - (blockLeft + block.width / 2);
            const dy = newBallPosition.y - (blockTop + block.height / 2);
            
            // Reflection based on where the ball hit the block
            if (Math.abs(dx / (block.width / 2)) > Math.abs(dy / (block.height / 2))) {
              // Hit from left or right
              newBallVelocity.dx = -newBallVelocity.dx;
            } else {
              // Hit from top or bottom
              newBallVelocity.dy = -newBallVelocity.dy;
              
              // Add a minimum horizontal velocity to prevent vertical-only movement
              const currentSpeed = Math.sqrt(newBallVelocity.dx ** 2 + newBallVelocity.dy ** 2);
              const minHorizontalVelocity = currentSpeed * 0.3;
              if (Math.abs(newBallVelocity.dx) < minHorizontalVelocity) {
                // Set a minimum horizontal velocity in a random direction
                newBallVelocity.dx = (newBallVelocity.dx >= 0 ? 1 : -1) * minHorizontalVelocity;
                // Slightly randomize the angle to prevent repeated patterns
                newBallVelocity.dx += (Math.random() - 0.5) * minHorizontalVelocity;
              }
            }
            
            return { ...block, destroyed: true };
          }
          return block;
        });
        
        // Increment proof counter only when a block was destroyed
        if (blocksChanged) {
          newProofGenerated += 1;
        }
        
        // Check if all blocks are destroyed
        const allBlocksDestroyed = newBlocks.every(block => block.destroyed);
        
        // Update score if a block was destroyed
        const newScore = blocksChanged ? prevState.score + 10 : prevState.score;
        
        // If all blocks are destroyed, check if it's the final level
        let levelComplete = false;
        let gameWon = prevState.gameWon;
        
        if (allBlocksDestroyed) {
          if (prevState.level >= gameLevels.maxLevel) {
            gameWon = true;
          } else {
            levelComplete = true;
          }
        }
        
        return {
          ...prevState,
          ball: {
            ...prevState.ball,
            position: newBallPosition,
            velocity: newBallVelocity,
          },
          blocks: newBlocks,
          score: newScore,
          gameWon,
          levelComplete,
          proofGenerated: newProofGenerated,
        };
      });
    };
    
    const gameInterval = setInterval(gameLoop, 16);
    return () => clearInterval(gameInterval);
  }, [gameState.ball.inPlay, gameState.gameOver, gameState.gameWon, gameState.levelComplete, gameLevels.maxLevel]);
  
  return (
    <GameContext.Provider
      value={{
        gameState,
        startGame,
        resetGame,
        movePaddle,
        launchBall,
        advanceLevel,
        generateProof,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
