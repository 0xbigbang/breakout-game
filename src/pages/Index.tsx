
import { useState } from "react";
import GameBoard from "@/components/game/GameBoard";
import { GameProvider } from "@/context/GameContext";
import MacWindow from "@/components/ui/mac-window";
import DesktopIcon from "@/components/game/DesktopIcon";
import Footer from "@/components/ui/footer";
import { Gamepad } from "lucide-react";

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
      className="min-h-screen flex flex-col items-center justify-between bg-purple-900 text-white p-4 font-urbanist"
      style={{ 
        backgroundImage: "url('/lovable-uploads/f6f145ed-5e64-43e8-ba68-74f45835404b.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <div className="flex-grow flex items-center justify-center w-full">
        {!showGame ? (
          <div className="flex flex-col items-center">
            <DesktopIcon 
              name="Crypto Breakout"
              icon={<Gamepad size={36} className="text-purple-400" />}
              onDoubleClick={handleOpenGame}
            />
            <p className="mt-8 text-gray-300 text-sm bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm">
              Double-click the icon to start the game
            </p>
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
      
      <Footer />
    </div>
  );
};

export default Index;
