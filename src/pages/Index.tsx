
import GameBoard from "@/components/game/GameBoard";
import { GameProvider } from "@/context/GameContext";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
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
  );
};

export default Index;
