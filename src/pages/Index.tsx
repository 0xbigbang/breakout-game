
import GameBoard from "@/components/game/GameBoard";
import { GameProvider } from "@/context/GameContext";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2 text-purple-400">Crypto Breakout</h1>
        <p className="text-xl text-gray-300">Destroy blocks to generate proofs!</p>
      </div>
      
      <GameProvider>
        <GameBoard />
      </GameProvider>
      
      <div className="mt-6 text-sm text-gray-400">
        <p>Use left/right arrow keys or A/D to move the paddle</p>
        <p>Press Space to launch the ball</p>
      </div>
    </div>
  );
};

export default Index;
