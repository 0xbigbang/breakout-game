import { useState, useEffect } from "react";
import GameBoard from "@/components/game/GameBoard";
import { GameProvider } from "@/context/GameContext";
import MacWindow from "@/components/ui/mac-window";
import DesktopIcon from "@/components/game/DesktopIcon";
import Footer from "@/components/ui/footer";
import { Gamepad } from "lucide-react";
import { loadWasmModule } from "@/lib/wasmLoader";
import MacMenuBar from "@/components/ui/mac-menubar";

const Index = () => {
  const [showGame, setShowGame] = useState(false);
  const [wasmStatus, setWasmStatus] = useState("initializing");

  useEffect(() => {
    // Pre-load WASM module when the app starts
    const initWasm = async () => {
      try {
        setWasmStatus("loading");
        await loadWasmModule();
        setWasmStatus("loaded");
      } catch (error) {
        console.error("Failed to load WASM module:", error);
        setWasmStatus("failed");
      }
    };
    
    initWasm();
  }, []);

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
        backgroundImage: "url('/background-image.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {showGame && (
        <div className="fixed top-0 left-0 w-full z-10">
          <MacMenuBar />
        </div>
      )}
      <div className="flex-grow flex items-center justify-center w-full">
        {!showGame ? (
          <div className="flex flex-col items-center">
            <DesktopIcon 
              name="Crypto Breakout"
              icon={<Gamepad size={42} className="text-white" />}
              onDoubleClick={handleOpenGame}
            />
            <p className="mt-8 text-gray-300 text-sm bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm">
              Double-click the icon to start the game
            </p>
            <div className="mt-4 text-xs text-gray-300 bg-black/40 px-4 py-2 rounded-lg backdrop-blur-sm max-w-md text-center">
              <p className="mb-2">
                WASM Module Status: <span className={
                  wasmStatus === "loaded" ? "text-green-400" :
                  wasmStatus === "loading" ? "text-yellow-400" :
                  wasmStatus === "failed" ? "text-red-400" : "text-gray-400"
                }>
                  {wasmStatus === "loaded" ? "Ready" :
                   wasmStatus === "loading" ? "Loading..." :
                   wasmStatus === "failed" ? "Failed to Load" : "Initializing..."}
                </span>
              </p>
              <p className="text-xs opacity-75">
                Using WebAssembly for cryptographic zero-knowledge proofs via SP1
              </p>
            </div>
          </div>
        ) : (
          <div className="container max-w-4xl mx-auto pt-10">
            <MacWindow title="Crypto Breakout" onClose={handleCloseGame}>
              <div className="p-4 flex flex-col items-center">
                <div className="text-center mb-4">
                  <h1 className="text-3xl font-bold text-purple-400">Succinct Crypto Breakout Game</h1>
                  <p className="text-lg text-gray-300">Destroy blocks to generate proofs!</p>
                  <p className="text-sm text-gray-400">
                    A ZK arcade game using WebAssembly to verify your gameplay with SP1 zero-knowledge proofs
                  </p>
                </div>
                
                <div className="w-full max-w-xl">
                  <GameProvider>
                    <GameBoard />
                  </GameProvider>
                </div>
                
                <div className="mt-2 text-center text-sm text-gray-400">
                  <p>Use left/right arrow keys or A/D to move the paddle</p>
                  <p>Press Space to launch the crab</p>
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
