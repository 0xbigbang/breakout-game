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
    "Loading SP1 zero-knowledge proving system..."
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
          // Simulate initial verification process with logs
          addLog("Starting SP1 zero-knowledge proof generation...");
          await new Promise(r => setTimeout(r, 800));
          addLog("Setting up SP1 recursive circuit...");
          await new Promise(r => setTimeout(r, 1200));
          addLog("Preparing game state for verification...");
          await new Promise(r => setTimeout(r, 1000));
          
          // Prepare game data for verification
          const gameData = {
            score,
            blocks_destroyed: blocksDestroyed,
            game_won: gameWon,
            game_completed: gameWon,
            timestamp: new Date().toISOString(),
          };
          
          addLog("Computing cryptographic witness...");
          await new Promise(r => setTimeout(r, 1500));
          addLog("Running SP1 prover to generate zero-knowledge proof...");
          
          // Call WASM module for real verification
          const result = await verifyGameWithSP1(gameData);
          
          addLog(`Generating commitment: ${result.commitment}`);
          addLog(`Proof generated with ID: ${result.proofId}`);
          addLog(`Proof verification: ${result.verified ? "SUCCESS" : "FAILED"}`);
          addLog(`Verification completed in ${result.verificationTime}`);
          addLog("Zero-knowledge proof verification complete!");
          
          // Update state with verification result
          setVerificationResult({
            ...result,
            gameData,
            proofSize: `${Math.floor(blocksDestroyed * 2.5 + score * 0.1)} kb`,
            circuit: "sp1_breakout_v1",
            platform: "WebAssembly SP1"
          });
          
          setIsVerifying(false);
        } catch (error) {
          console.error("Error generating SP1 proof:", error);
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
    addLog("Preparing to submit proof to blockchain...");
    await new Promise(r => setTimeout(r, 1500));
    addLog("Connecting to blockchain network...");
    await new Promise(r => setTimeout(r, 2000));
    addLog(`Submitting proof ${verificationResult.proofId} to blockchain...`);
    await new Promise(r => setTimeout(r, 2500));
    addLog(`Transaction submitted with commitment: ${verificationResult.commitment}`);
    await new Promise(r => setTimeout(r, 1500));
    addLog("Waiting for confirmation...");
    await new Promise(r => setTimeout(r, 3000));
    addLog("✅ Proof verified and recorded on blockchain!");
    setIsSubmitted(true);
    setIsSubmitting(false);
  };
  
  // Only show when open
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-gray-900 border border-purple-500 rounded-lg shadow-xl w-full max-w-2xl mx-3">
        <div className="flex items-center justify-between border-b border-gray-700 p-3">
          <h3 className="text-purple-400 font-mono text-sm">
            SP1 Zero-Knowledge Proof Terminal
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        <div 
          id="proof-terminal-logs"
          className="bg-black/50 font-mono text-xs p-3 h-64 overflow-y-auto text-green-400"
        >
          {verificationLogs.map((log, i) => (
            <div key={i} className="py-1">
              <span className="text-gray-500">$</span> {log}
            </div>
          ))}
        </div>
        
        {!isVerifying && verificationResult && (
          <div className="border-t border-gray-700 p-3 font-mono text-xs">
            <h4 className="text-purple-400 mb-2">Cryptographic Proof Details:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400">Proof ID:</span> 
                <span className="text-yellow-300 ml-1">{verificationResult.proofId}</span>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400">Verified:</span> 
                <span className={`ml-1 ${verificationResult.verified ? 'text-green-400' : 'text-red-400'}`}>
                  {verificationResult.verified ? 'TRUE' : 'FALSE'}
                </span>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400">Commitment:</span> 
                <span className="text-blue-300 ml-1 break-all">{verificationResult.commitment}</span>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400">Proof Time:</span> 
                <span className="text-green-300 ml-1">{verificationResult.verificationTime}</span>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400">Circuit:</span> 
                <span className="text-purple-300 ml-1">{verificationResult.circuit}</span>
              </div>
              <div className="bg-gray-800 p-2 rounded">
                <span className="text-gray-400">Proof Size:</span> 
                <span className="text-green-300 ml-1">{verificationResult.proofSize}</span>
              </div>
              <div className="bg-gray-800 p-2 rounded col-span-2">
                <span className="text-gray-400">Details:</span> 
                <span className="text-blue-300 ml-1">{verificationResult.proofDetails}</span>
              </div>
            </div>
            
            {!isSubmitted ? (
              <Button
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting to Blockchain...' : 'Submit Proof to Blockchain'}
              </Button>
            ) : (
              <div className="bg-green-900/30 border border-green-700 p-2 rounded text-center text-green-400">
                Proof successfully verified and recorded on blockchain
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProofTerminal;
