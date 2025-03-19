import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from "@/components/ui/button";
import ProofCounter from './ProofCounter';
import GameStats from './GameStats';
import ProofTerminal from './ProofTerminal';

const GameBoard = () => {
  const { gameState, resetGame, launchBall, advanceLevel } = useGame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showProofTerminal, setShowProofTerminal] = useState(false);
  const [crabImage, setCrabImage] = useState<HTMLImageElement | null>(null);
  
  // Load crab image
  useEffect(() => {
    const img = new Image();
    img.src = '/image.png';
    img.onload = () => {
      setCrabImage(img);
    };
  }, []);
  
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
    const paddleGradient = ctx.createLinearGradient(
      gameState.paddle.position.x,
      gameState.paddle.position.y,
      gameState.paddle.position.x,
      gameState.paddle.position.y + gameState.paddle.height
    );
    paddleGradient.addColorStop(0, '#9b87f5');
    paddleGradient.addColorStop(1, '#7365c6');
    
    ctx.fillStyle = paddleGradient;
    ctx.fillRect(
      gameState.paddle.position.x,
      gameState.paddle.position.y,
      gameState.paddle.width,
      gameState.paddle.height
    );
    
    // Add highlight to paddle
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillRect(
      gameState.paddle.position.x,
      gameState.paddle.position.y,
      gameState.paddle.width,
      5
    );
    
    // Draw crab (instead of ball)
    if (crabImage) {
      // Calculate position to center the crab image
      const crabSize = gameState.ball.radius * 3.5; // Make crab a bit larger than the ball radius
      ctx.drawImage(
        crabImage,
        gameState.ball.position.x - crabSize/2,
        gameState.ball.position.y - crabSize/2,
        crabSize,
        crabSize
      );
    } else {
      // Fallback to circle if image isn't loaded
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
    }
    
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
    
    // Draw game over, game won, or level complete message
    if (gameState.gameOver || gameState.gameWon || gameState.levelComplete) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.font = '30px Urbanist, sans-serif';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      
      if (gameState.gameOver) {
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 15);
      } else if (gameState.gameWon) {
        ctx.fillText('YOU WIN!', canvas.width / 2, canvas.height / 2 - 15);
      } else if (gameState.levelComplete) {
        ctx.fillText(`LEVEL ${gameState.level} COMPLETE!`, canvas.width / 2, canvas.height / 2 - 15);
      }
      
      ctx.font = '20px Urbanist, sans-serif';
      ctx.fillText(
        `Score: ${gameState.score} | Proofs: ${gameState.proofGenerated} | Level: ${gameState.level}`,
        canvas.width / 2,
        canvas.height / 2 + 20
      );
    }
  }, [gameState, crabImage]);
  
  const handleGenerateProof = () => {
    setShowProofTerminal(true);
  };
  
  return (
    <div className="flex flex-col items-center font-urbanist">
      <div className="flex justify-between items-center w-full mb-4 gap-3">
        <GameStats 
          score={gameState.score} 
          lives={gameState.lives}
          level={gameState.level}
        />
        <ProofCounter 
          count={gameState.proofGenerated} 
          onGenerateProof={handleGenerateProof}
          gameOver={gameState.gameOver}
          gameWon={gameState.gameWon}
        />
      </div>
      
      <canvas
        ref={canvasRef}
        width={600}
        height={480}
        className="border-2 border-purple-500 rounded-lg shadow-lg bg-gradient-to-b from-gray-800 to-gray-900"
      />
      
      {(gameState.gameOver || gameState.gameWon) && (
        <div className="mt-3">
          <Button
            onClick={resetGame}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
          >
            Play Again
          </Button>
        </div>
      )}
      
      {gameState.levelComplete && !gameState.gameWon && (
        <div className="mt-3">
          <Button
            onClick={advanceLevel}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
          >
            Next Level
          </Button>
        </div>
      )}
      
      {!gameState.ball.inPlay && !gameState.gameOver && !gameState.gameWon && !gameState.levelComplete && (
        <div className="mt-3">
          <Button
            onClick={launchBall}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
          >
            Launch Crab
          </Button>
        </div>
      )}
      
      <ProofTerminal 
        isOpen={showProofTerminal}
        onClose={() => setShowProofTerminal(false)}
        score={gameState.score}
        blocksDestroyed={gameState.proofGenerated}
        gameWon={gameState.gameWon}
      />
    </div>
  );
};

export default GameBoard;
