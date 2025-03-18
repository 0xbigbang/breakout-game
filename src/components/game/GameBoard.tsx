
import React, { useRef, useEffect } from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from "@/components/ui/button";
import ProofCounter from './ProofCounter';
import GameStats from './GameStats';

const GameBoard = () => {
  const { gameState, resetGame, launchBall } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Draw game on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    ctx.fillStyle = '#1A1F2C';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw paddle
    ctx.fillStyle = '#9b87f5';
    ctx.fillRect(
      gameState.paddle.position.x,
      gameState.paddle.position.y,
      gameState.paddle.width,
      gameState.paddle.height
    );
    
    // Draw ball
    ctx.fillStyle = '#FEC6A1';
    ctx.beginPath();
    ctx.arc(
      gameState.ball.position.x,
      gameState.ball.position.y,
      gameState.ball.radius,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    // Draw blocks
    gameState.blocks.forEach(block => {
      if (!block.destroyed) {
        ctx.fillStyle = block.color;
        ctx.fillRect(
          block.position.x,
          block.position.y,
          block.width,
          block.height
        );
        
        // Add highlight effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(
          block.position.x,
          block.position.y,
          block.width,
          5
        );
      }
    });
    
    // Draw game over or game won message
    if (gameState.gameOver || gameState.gameWon) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '30px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      
      if (gameState.gameOver) {
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 15);
      } else if (gameState.gameWon) {
        ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2 - 15);
      }
      
      ctx.font = '20px Arial';
      ctx.fillText(
        `Final Score: ${gameState.score} | Proofs: ${gameState.proofGenerated}`,
        canvas.width / 2,
        canvas.height / 2 + 20
      );
    }
  }, [gameState]);
  
  return (
    <div className="flex flex-col items-center">
      <div className="flex justify-between w-full mb-2">
        <GameStats 
          score={gameState.score} 
          lives={gameState.lives} 
        />
        <ProofCounter 
          count={gameState.proofGenerated} 
        />
      </div>
      
      <canvas
        ref={canvasRef}
        width={600}
        height={500}
        className="border-2 border-purple-700 rounded-lg shadow-lg"
      />
      
      {(gameState.gameOver || gameState.gameWon) && (
        <div className="mt-4">
          <Button
            onClick={resetGame}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
          >
            Play Again
          </Button>
        </div>
      )}
      
      {!gameState.ball.inPlay && !gameState.gameOver && !gameState.gameWon && (
        <div className="mt-4">
          <Button
            onClick={launchBall}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
          >
            Launch Ball
          </Button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
