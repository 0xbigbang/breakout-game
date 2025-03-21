import React, { useRef, useEffect, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { Button } from "@/components/ui/button";
import ProofCounter from './ProofCounter';
import GameStats from './GameStats';
import ProofTerminal from './ProofTerminal';

// Helper function to lighten a color
const lightenColor = (color: string, percent: number): string => {
  // Convert hex to RGB first if it's a hex color
  let r, g, b;
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    r = parseInt(hex.slice(0, 2), 16);
    g = parseInt(hex.slice(2, 4), 16);
    b = parseInt(hex.slice(4, 6), 16);
  } else if (color.startsWith('rgb')) {
    // Extract RGB values from rgb/rgba string
    const matches = color.match(/(\d+),\s*(\d+),\s*(\d+)/);
    if (matches) {
      r = parseInt(matches[1]);
      g = parseInt(matches[2]);
      b = parseInt(matches[3]);
    } else {
      // Default fallback if parsing fails
      r = 0; g = 0; b = 0;
    }
  } else {
    // For named colors, we'll use a default lightening
    return color; // Just return the original color as fallback
  }

  // Calculate lightened color
  r = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
  g = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
  b = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

  // Convert back to hex
  return `rgb(${r}, ${g}, ${b})`;
};

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
        const radius = 8; // Radius for rounded corners
        const x = block.position.x;
        const y = block.position.y;
        const width = block.width;
        const height = block.height;
        
        // Draw glow effect
        ctx.shadowColor = block.color;
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Draw rounded rectangle
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        
        // Fill with gradient
        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, lightenColor(block.color, 30));
        gradient.addColorStop(1, block.color);
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Reset shadow for other drawings
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        // Add glossy highlight effect at the top
        ctx.beginPath();
        ctx.moveTo(x + radius, y + 2);
        ctx.lineTo(x + width - radius, y + 2);
        ctx.quadraticCurveTo(x + width - 2, y + 2, x + width - 2, y + radius);
        ctx.lineTo(x + width - 2, y + height/3);
        ctx.quadraticCurveTo(x + width/2, y + height/2, x + 2, y + height/3);
        ctx.lineTo(x + 2, y + radius);
        ctx.quadraticCurveTo(x + 2, y + 2, x + radius, y + 2);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
      }
    });
  }, [gameState, crabImage]);
  
  return (
    <div className="relative flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-2">
        <GameStats 
          score={gameState.score} 
          lives={gameState.lives}
          level={gameState.level}
        />
        <div className="flex items-center gap-3">
          <ProofCounter 
            count={gameState.proofGenerated} 
            onGenerateProof={() => setShowProofTerminal(true)}
            gameOver={gameState.gameOver}
            gameWon={gameState.gameWon}
          />
        </div>
      </div>
      
      <div className="relative w-full rounded-lg overflow-hidden border-2 border-purple-600/50 shadow-lg">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={480} 
          className="bg-gray-900 block w-full"
        />
        
        {gameState.gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <h2 className="text-red-500 text-3xl font-bold mb-4">Game Over</h2>
            <p className="text-white mb-6">Final Score: {gameState.score}</p>
            <Button onClick={resetGame} variant="default">Play Again</Button>
          </div>
        )}
        
        {gameState.gameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <h2 className="text-green-500 text-3xl font-bold mb-4">You Win!</h2>
            <p className="text-white mb-6">Final Score: {gameState.score}</p>
            <p className="text-purple-300 mb-6">ZK Proofs Generated: {gameState.proofGenerated}</p>
            <Button 
              onClick={() => setShowProofTerminal(true)} 
              variant="outline"
              className="mb-3 bg-purple-600/20 hover:bg-purple-600/40 border-purple-500 text-purple-300"
            >
              Verify Win with SP1
            </Button>
            <Button onClick={resetGame} variant="default">Play Again</Button>
          </div>
        )}
        
        {gameState.levelComplete && !gameState.gameWon && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm">
            <h2 className="text-yellow-400 text-3xl font-bold mb-4">Level Complete!</h2>
            <p className="text-white mb-6">Score: {gameState.score}</p>
            <Button onClick={advanceLevel} variant="default">Next Level</Button>
          </div>
        )}
        
        {!gameState.ball.inPlay && !gameState.gameOver && !gameState.gameWon && !gameState.levelComplete && (
          <div className="absolute bottom-16 left-0 right-0 flex justify-center">
            <Button
              onClick={launchBall}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-4 py-2 font-medium"
              style={{ backgroundColor: '#9333EA' }}
            >
              Launch Crab
            </Button>
          </div>
        )}
      </div>
      
      {showProofTerminal && (
        <ProofTerminal 
          isOpen={showProofTerminal}
          onClose={() => setShowProofTerminal(false)}
          score={gameState.score}
          blocksDestroyed={gameState.blocks.filter(b => b.destroyed).length}
          gameWon={gameState.gameWon}
        />
      )}
    </div>
  );
};

export default GameBoard;
