
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { verifyGameWithSP1, VerificationResult } from '@/lib/wasmLoader';
import { Button } from "@/components/ui/button";

interface ProofTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  score: number;
  blocksDestroyed: number;
  gameWon: boolean;
}

const ProofTerminal: React.FC<ProofTerminalProps> = ({
  isOpen,
  onClose,
  score,
  blocksDestroyed,
  gameWon,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<VerificationResult & {
    gameData?: any;
    proofSize?: string;
    circuit?: string;
    platform?: string;
  } | null>(null);
  const [verificationLogs, setVerificationLogs] = useState<string[]>([
    "Initializing WASM environment...",
    "Loading SP1 verification module..."
  ]);
  
  const addLog = (log: string) => {
    setVerificationLogs(prev => [...prev, log]);
  };
  
  // Scroll to bottom when logs update
  useEffect(() => {
    const terminal = document.getElementById('proof-terminal-logs');
    if (terminal) {
      terminal.scrollTop = terminal.scrollHeight;
    }
  }, [verificationLogs]);
  
  // Generate proof when terminal is opened
  useEffect(() => {
    if (isOpen && !isSubmitted) {
      const generateProof = async () => {
        try {
          // Simulate a verification process with logs
          addLog("Starting proof generation...");
          await new Promise(r => setTimeout(r, 800));
          addLog("Initializing SP1 circuit...");
          await new Promise(r => setTimeout(r, 1200));
          addLog("Computing witness...");
          await new Promise(r => setTimeout(r, 1500));
          addLog("Generating ZK proof...");
          await new Promise(r => setTimeout(r, 2000));
          addLog("Running verification...");
          
          // Prepare game data for verification
          const gameData = {
            score,
            blocksDestroyed,
            gameWon,
            gameCompleted: gameWon,
            timestamp: new Date().toISOString(),
          };
          
          // Call WASM module for verification
          const result = await verifyGameWithSP1(gameData);
          addLog("Verification complete!");
          
          // Update state with verification result
          setVerificationResult({
            ...result,
            gameData,
            proofSize: `${Math.floor(blocksDestroyed * 1.5)} kb`,
            circuit: "sp1_breakout_verification_v1",
            platform: "WebAssembly SP1"
          });
          
          setIsVerifying(false);
        } catch (error) {
          console.error("Error generating proof:", error);
          addLog(`Error: ${error instanceof Error ? error.message : String(error)}`);
          setIsVerifying(false);
        }
      };
      
      generateProof();
    }
  }, [isOpen, isSubmitted, score, blocksDestroyed, gameWon]);
  
  // Simulate submitting the proof to blockchain
  const handleSubmit = async () => {
    if (isSubmitting || !verificationResult) return;
    
    setIsSubmitting(true);
    addLog("Preparing proof for submission...");
    await new Promise(r => setTimeout(r, 1000));
    addLog("Connecting to blockchain...");
    await new Promise(r => setTimeout(r, 1500));
    addLog("Submitting proof...");
    await new Promise(r => setTimeout(r, 2000));
    addLog("Waiting for confirmation...");
    await new Promise(r => setTimeout(r, 1500));
    addLog("Proof submitted successfully! Transaction hash: 0x" + Math.random().toString(16).slice(2, 10) + "...");
    setIsSubmitting(false);
    setIsSubmitted(true);
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-purple-700 rounded-lg w-full max-w-3xl max-h-[80vh] flex flex-col font-mono text-xs md:text-sm">
        <div className="flex justify-between items-center bg-gray-800 px-4 py-2 rounded-t-lg border-b border-purple-700">
          <h3 className="text-purple-400 font-medium">SP1 Zero-Knowledge Proof Terminal</h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div 
          id="proof-terminal-logs"
          className="flex-1 p-4 bg-gray-950 overflow-y-auto"
          style={{ maxHeight: "50vh" }}
        >
          {verificationLogs.map((log, index) => (
            <div key={index} className="mb-1">
              <span className="text-green-400 mr-2">$</span>
              <span className="text-gray-300">{log}</span>
            </div>
          ))}
        </div>
        
        {verificationResult && !isVerifying && (
          <div className="p-4 bg-gray-800 border-t border-gray-700 overflow-y-auto" style={{ maxHeight: "30vh" }}>
            <pre className="text-gray-300 whitespace-pre-wrap">
  {`
  +--------------------------+
  |       PROOF DETAILS      |
  +--------------------------+
  
  • Proof ID:        ${verificationResult.proofId}
  • Timestamp:       ${verificationResult.gameData?.timestamp}
  • Verification:    ${verificationResult.verified ? "VERIFIED" : "FAILED"}
  • Proof Size:      ${verificationResult.proofSize}
  • Verify Time:     ${verificationResult.verificationTime}
  
  +--------------------------+
  |       GAME DETAILS       |
  +--------------------------+
  
  • Score:           ${score}
  • Blocks Destroyed: ${blocksDestroyed}
  • Game Won:        ${gameWon ? "YES" : "NO"}
  • Game Completed:  ${verificationResult.gameData?.gameCompleted ? "TRUE" : "FALSE"}
  
  +--------------------------+
  |  CRYPTOGRAPHIC DETAILS   |
  +--------------------------+
  
  • Commitment:      ${verificationResult.commitment}
  • Circuit:         ${verificationResult.circuit}
  • Platform:        ${verificationResult.platform}
  `}
            </pre>
            
            {!isSubmitted && (
              <div className="mt-4 flex justify-center">
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
                >
                  {isSubmitting ? "Submitting..." : "Submit to Blockchain"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProofTerminal;
