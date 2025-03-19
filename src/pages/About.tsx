
import React from 'react';
import MacWindow from "@/components/ui/mac-window";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

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
        <div className="container max-w-4xl mx-auto">
          <MacWindow title="About Crypto Breakout">
            <div className="p-6">
              <Button 
                onClick={() => navigate('/')} 
                variant="outline" 
                className="mb-6 flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Game
              </Button>

              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-2 text-purple-400">Crypto Breakout</h1>
                <p className="text-xl text-gray-300 mb-6">A ZK arcade game with WebAssembly & SP1</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-purple-300">What is Crypto Breakout?</h2>
                  <p className="text-gray-300">
                    Crypto Breakout is a modern take on the classic arcade game, enhanced with 
                    cutting-edge cryptographic technology. As you play, the game generates 
                    zero-knowledge proofs to verify your gameplay without revealing specific details.
                  </p>
                  <p className="text-gray-300">
                    Each block you destroy contributes to a cryptographic proof, creating a 
                    verifiable record of your achievements that could be used in blockchain applications.
                  </p>
                </div>
                
                <div className="bg-gray-800 p-4 rounded-lg border border-purple-700">
                  <h3 className="text-xl font-semibold text-purple-300 mb-3">Technical Features</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-300">
                    <li>WebAssembly integration for near-native performance</li>
                    <li>SP1 zero-knowledge proof generation</li>
                    <li>Verifiable gameplay achievements</li>
                    <li>React & Tailwind CSS frontend</li>
                    <li>Multi-level gameplay with increasing difficulty</li>
                  </ul>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-purple-300 mb-4">How it Works</h2>
                <div className="bg-gray-800 p-4 rounded-lg border border-purple-700">
                  <ol className="list-decimal pl-5 space-y-3 text-gray-300">
                    <li>
                      <strong>Play the Game:</strong> Control the paddle to bounce the crab and break blocks
                    </li>
                    <li>
                      <strong>Generate Proofs:</strong> As you destroy blocks, the game tracks your progress
                    </li>
                    <li>
                      <strong>WebAssembly Processing:</strong> The WASM module processes game data using cryptographic functions
                    </li>
                    <li>
                      <strong>SP1 Verification:</strong> Creates zero-knowledge proofs of your gameplay
                    </li>
                    <li>
                      <strong>Verifiable Results:</strong> Achievements that can be cryptographically verified without revealing gameplay details
                    </li>
                  </ol>
                </div>
              </div>

              <div className="text-center text-gray-400 text-sm">
                <p>Version 1.0.0 | Created with ❤️ by the Crypto Breakout Team</p>
                <p className="mt-2">
                  <a 
                    href="https://github.com/0xbigbang/pixel-proof-quest" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    View on GitHub
                  </a>
                </p>
              </div>
            </div>
          </MacWindow>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default About;
