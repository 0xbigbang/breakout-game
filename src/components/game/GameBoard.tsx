
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
  }, [gameState]);
  
  const handleGenerateProof = () => {
    setShowProofTerminal(true);
  };
  
  return (
    <div className="flex flex-col items-center font-urbanist">
      <div className="flex justify-between w-full mb-2">
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
      
      {gameState.levelComplete && !gameState.gameWon && (
        <div className="mt-4">
          <Button
            onClick={advanceLevel}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
          >
            Next Level
          </Button>
        </div>
      )}
      
      {!gameState.ball.inPlay && !gameState.gameOver && !gameState.gameWon && !gameState.levelComplete && (
        <div className="mt-4">
          <Button
            onClick={launchBall}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
          >
            Launch Ball
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
