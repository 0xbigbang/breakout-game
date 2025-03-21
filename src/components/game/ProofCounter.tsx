import React from 'react';
import { Terminal } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProofCounterProps {
  count: number;
  onGenerateProof: () => void;
  gameOver: boolean;
  gameWon: boolean;
}

const ProofCounter: React.FC<ProofCounterProps> = ({ 
  count, 
  onGenerateProof,
  gameOver,
  gameWon
}) => {
  return (
    <div className="bg-indigo-900/80 rounded-lg p-3 shadow-lg flex items-center justify-between gap-4">
      <div className="flex items-center">
        <div className="mr-2">
          <span className="text-gray-300 text-xs">Proofs Available</span>
          <p className="text-3xl font-bold text-white">{count}</p>
        </div>
      </div>
      
      {count > 0 ? (
        <Button 
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md"
          onClick={onGenerateProof}
        >
          <Terminal size={18} className="mr-2" />
          Verify with SP1
        </Button>
      ) : (
        <Button 
          disabled
          className="bg-gray-700 text-gray-400 px-3 py-2 rounded-md opacity-70"
        >
          Verify with SP1
        </Button>
      )}
    </div>
  );
};

export default ProofCounter;
