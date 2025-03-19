
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Upload, Terminal } from 'lucide-react';
import { verifyGameWithSP1, loadWasmModule } from '@/lib/wasmLoader';

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
  gameWon
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [verificationLogs, setVerificationLogs] = useState<string[]>([
    "Initializing WASM environment...",
    "Loading SP1 verification module..."
  ]);
  
  // Load WASM module when component mounts
  useEffect(() => {
    if (isOpen) {
      // Reset state
      setIsVerifying(true);
      setIsSubmitted(false);
      setVerificationLogs([
        "Initializing WASM environment...",
        "Loading SP1 verification module..."
      ]);
      
      // Simulate verification process
      const runVerification = async () => {
        try {
          // Pre-load the WASM module
          await loadWasmModule();
          addLog("WASM module loaded successfully");
          addLog("Initializing proof verification...");
          
          const gameData = {
            score,
            blocksDestroyed,
            gameWon,
            gameCompleted: gameWon,
            timestamp: new Date().toISOString()
          };
          
          addLog("Retrieving game data...");
          addLog("Preparing data for SP1 verification...");
          
          // Call the WASM verification function
          const result = await verifyGameWithSP1(gameData);
          addLog("Verification complete!");
          
          setVerificationResult({
            ...result,
            gameData,
            proofSize: `${Math.floor(blocksDestroyed * 1.5)} kb`,
            circuit: "sp1_breakout_verification_v1",
            platform: "SP1 ZK-Rollup",
          });
          
          setIsVerifying(false);
        } catch (error) {
          console.error("Verification error:", error);
          addLog("❌ Error during verification process");
          setIsVerifying(false);
        }
      };
      
      runVerification();
    }
  }, [isOpen, score, blocksDestroyed, gameWon]);
  
  const addLog = (log: string) => {
    setVerificationLogs(prev => [...prev, log]);
  };

  const handleSubmitProof = () => {
    setIsSubmitting(true);
    addLog("Submitting proof to blockchain...");
    
    // Simulate proof submission
    setTimeout(() => {
      addLog("Proof successfully submitted!");
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  if (!verificationResult && isVerifying) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="bg-gray-900 border-purple-700 max-w-3xl w-full font-urbanist">
          <DialogHeader>
            <DialogTitle className="text-purple-400">Generating Zero-Knowledge Proof</DialogTitle>
            <DialogDescription>
              Using WebAssembly to verify your game session with SP1
            </DialogDescription>
          </DialogHeader>
          
          <div className="font-mono bg-black p-4 rounded-md text-green-400 text-sm overflow-auto max-h-[60vh]">
            {verificationLogs.map((log, index) => (
              <div key={index} className="mb-1">
                <span className="text-purple-500">$</span> {log}
              </div>
            ))}
            <div className="mt-2 flex items-center">
              <Loader2 size={16} className="mr-2 animate-spin text-purple-400" />
              <span className="text-purple-400">Processing...</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-2">
            <p>WASM module is executing SP1 zero-knowledge proof generation...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 border-purple-700 max-w-3xl w-full font-urbanist">
        <DialogHeader>
          <DialogTitle className="text-purple-400">Zero-Knowledge Proof Generated</DialogTitle>
          <DialogDescription>
            WebAssembly verification complete via SP1
          </DialogDescription>
        </DialogHeader>
        
        <div className="font-mono bg-black p-4 rounded-md text-green-400 text-sm overflow-auto max-h-[60vh]">
          <div className="mb-3">
            <span className="text-purple-500">$</span> <span className="text-yellow-400">sp1_verify</span> --game=crypto_breakout --session={verificationResult?.proofId}
          </div>
          
          {verificationLogs.map((log, index) => (
            <div key={index} className="text-gray-400 mb-1">{log}</div>
          ))}
          
          {verificationResult && (
            <pre className="text-white mb-4">
{`
  +--------------------------+
  |      PROOF VERIFIED      |
  +--------------------------+
  
  • Proof ID:        ${verificationResult.proofId}
  • Timestamp:       ${verificationResult.gameData.timestamp}
  • Verification:    ${verificationResult.verified ? "VERIFIED" : "FAILED"}
  • Proof Size:      ${verificationResult.proofSize}
  • Verify Time:     ${verificationResult.verificationTime}
  
  +--------------------------+
  |       GAME RESULTS       |
  +--------------------------+
  
  • Score:           ${score}
  • Blocks Destroyed: ${blocksDestroyed}
  • Game Won:        ${gameWon ? "YES" : "NO"}
  • Game Completed:  ${verificationResult.gameData.gameCompleted ? "TRUE" : "FALSE"}
  
  +--------------------------+
  |  CRYPTOGRAPHIC DETAILS   |
  +--------------------------+
  
  • Circuit:         ${verificationResult.circuit}
  • Platform:        ${verificationResult.platform}
  • Public Inputs:   [score=${score}, blocks=${blocksDestroyed}, won=${gameWon ? 1 : 0}]
  • Commitment:      ${verificationResult.commitment}
`}
            </pre>
          )}
          
          <div className="text-gray-400">
            <span className="text-purple-500">$</span> {isSubmitted ? 'Proof successfully submitted to chain' : 'Proof ready for submission'}
          </div>
        </div>
        
        <DialogFooter>
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold"
            disabled={isSubmitting || isSubmitted}
            onClick={handleSubmitProof}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Submitting...
              </>
            ) : isSubmitted ? (
              <>
                <CheckCircle2 size={16} className="mr-2" />
                Proof Submitted
              </>
            ) : (
              <>
                <Upload size={16} className="mr-2" />
                Submit Proof
              </>
            )}
          </Button>
        </DialogFooter>
        
        <div className="text-xs text-gray-500 mt-2">
          <p>This is using WebAssembly to simulate SP1 proof generation. In a full implementation, 
          this would connect to a Rust WASM module that generates actual zero-knowledge proofs.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProofTerminal;
