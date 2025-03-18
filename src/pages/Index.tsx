
import { useState } from "react";
import GameBoard from "@/components/game/GameBoard";
import { GameProvider } from "@/context/GameContext";
import MacWindow from "@/components/ui/mac-window";
import DesktopIcon from "@/components/game/DesktopIcon";
import { GameController } from "lucide-react";

const Index = () => {
  const [showGame, setShowGame] = useState(false);

  const handleOpenGame = () => {
    setShowGame(true);
  };

  const handleCloseGame = () => {
    setShowGame(false);
  };

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-white p-4 font-urbanist"
      style={{ 
        backgroundImage: "url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
      }}
    >
      {!showGame ? (
        <div className="flex flex-col items-center">
          <DesktopIcon 
            name="Crypto Breakout"
            icon={<GameController size={36} className="text-purple-400" />}
            onDoubleClick={handleOpenGame}
          />
          <p className="mt-8 text-gray-400 text-sm">Double-click the icon to start the game</p>
        </div>
      ) : (
        <div className="container max-w-4xl mx-auto">
          <MacWindow title="Crypto Breakout" onClose={handleCloseGame}>
            <div className="p-4">
              <div className="text-center mb-6">
                <h1 className="text-4xl font-bold mb-2 text-purple-400">Crypto Breakout</h1>
                <p className="text-xl text-gray-300 mb-2">Destroy blocks to generate proofs!</p>
                <p className="text-sm text-gray-400 max-w-md mx-auto">
                  A ZK arcade game that verifies your gameplay using SP1 zero-knowledge proofs
                </p>
              </div>
              
              <GameProvider>
                <GameBoard />
              </GameProvider>
              
              <div className="mt-6 text-sm text-gray-400">
                <p>Use left/right arrow keys or A/D to move the paddle</p>
                <p>Press Space to launch the ball</p>
              </div>
              
              <div className="mt-6 max-w-2xl text-center text-xs text-gray-500 bg-gray-800 p-3 rounded-md">
                <h3 className="text-purple-400 mb-1 font-semibold">About SP1 & WASM Integration</h3>
                <p className="mb-2">
                  This is a proof-of-concept implementation. In a complete version:
                </p>
                <ul className="text-left list-disc pl-5 space-y-1">
                  <li>Game state would be sent to a Rust-based WASM module</li>
                  <li>The WASM module would utilize SP1 to generate verifiable zero-knowledge proofs of gameplay</li>
                  <li>These proofs could verify achievements without revealing full gameplay details</li>
                  <li>Proofs could be used for leaderboards or rewards with cryptographic verification</li>
                </ul>
              </div>
            </div>
          </MacWindow>
        </div>
      )}
    </div>
  );
};

export default Index;
