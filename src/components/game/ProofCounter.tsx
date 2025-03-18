
import React from 'react';
import { BadgeCheck, Terminal } from 'lucide-react';
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
    <div className="bg-purple-900 rounded-md p-2 shadow-md transition-transform font-urbanist">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BadgeCheck size={20} className="text-purple-400 mr-2" />
          <div>
            <p className="text-sm font-medium text-purple-300">Proofs Available</p>
            <p className="text-xl font-bold text-white">{count}</p>
          </div>
        </div>
        
        {(gameOver || gameWon) && count > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            className="ml-4 bg-purple-800 hover:bg-purple-700 border-purple-600 text-white"
            onClick={onGenerateProof}
          >
            <Terminal size={16} className="mr-1" />
            Generate Proof
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProofCounter;
