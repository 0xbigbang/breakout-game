
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Upload } from 'lucide-react';

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
  
  // Simulate an SP1 proof with game data
  const proofData = {
    id: `proof_${Date.now().toString(16)}`,
    timestamp: new Date().toISOString(),
    gameData: {
      score,
      blocksDestroyed,
      gameWon,
      gameCompleted: true
    },
    verificationStatus: "VERIFIED",
    proofSize: `${Math.floor(blocksDestroyed * 1.5)} kb`,
    verificationTime: `${Math.floor(Math.random() * 500 + 800)}ms`,
    circuit: "sp1_breakout_verification_v1",
    platform: "SP1 ZK-Rollup",
  };

  const handleSubmitProof = () => {
    setIsSubmitting(true);
    // Simulate proof submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-gray-900 border-purple-700 max-w-3xl w-full font-urbanist">
        <DialogHeader>
          <DialogTitle className="text-purple-400">Proof Generation Complete</DialogTitle>
          <DialogDescription>
            Generated and verified proof of your game session
          </DialogDescription>
        </DialogHeader>
        
        <div className="font-mono bg-black p-4 rounded-md text-green-400 text-sm overflow-auto max-h-[60vh]">
          <div className="mb-3">
            <span className="text-purple-500">$</span> <span className="text-yellow-400">sp1_verify</span> --game=crypto_breakout --session={proofData.id}
          </div>
          
          <div className="text-gray-400 mb-1">Initializing proof verification...</div>
          <div className="text-gray-400 mb-1">Loading circuit: {proofData.circuit}</div>
          <div className="text-gray-400 mb-1">Retrieving game data...</div>
          <div className="text-gray-400 mb-3">Verifying proof on {proofData.platform}...</div>
          
          <pre className="text-white mb-4">
{`
  +--------------------------+
  |      PROOF VERIFIED      |
  +--------------------------+
  
  • Proof ID:        ${proofData.id}
  • Timestamp:       ${proofData.timestamp}
  • Verification:    ${proofData.verificationStatus}
  • Proof Size:      ${proofData.proofSize}
  • Verify Time:     ${proofData.verificationTime}
  
  +--------------------------+
  |       GAME RESULTS       |
  +--------------------------+
  
  • Score:           ${score}
  • Blocks Destroyed: ${blocksDestroyed}
  • Game Won:        ${gameWon ? "YES" : "NO"}
  • Game Completed:  TRUE
  
  +--------------------------+
  |  CRYPTOGRAPHIC DETAILS   |
  +--------------------------+
  
  • Circuit:         ${proofData.circuit}
  • Platform:        ${proofData.platform}
  • Public Inputs:   [score=${score}, blocks=${blocksDestroyed}, won=${gameWon ? 1 : 0}]
  • Commitment:      0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}
`}
          </pre>
          
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
          <p>Note: This is a simulation of SP1 proof generation. In a real implementation, 
          this would connect to a Rust WASM module that generates actual zero-knowledge proofs using SP1.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProofTerminal;
