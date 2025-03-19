import React from 'react';
import { BadgeCheck, Lock, Terminal, ShieldCheck } from 'lucide-react';
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
    <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-lg p-2 shadow-lg border border-indigo-700 font-urbanist">
      <div className="flex items-center justify-between">
        <div className="flex items-center mr-3">
          <div className="bg-indigo-800 rounded-full p-1.5 mr-2">
            <ShieldCheck size={20} className="text-indigo-300" />
          </div>
          <div>
            <div className="flex items-center">
              <BadgeCheck size={14} className="text-indigo-300 mr-1" />
              <p className="text-xs font-medium text-indigo-300">Proofs Available</p>
            </div>
            <p className="text-xl font-bold text-white">{count}</p>
          </div>
        </div>
        
        {count > 0 ? (
          <Button 
            size="sm"
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 border-none text-white text-xs py-1 h-8 shadow-md"
            onClick={onGenerateProof}
            title="Generate ZK proof of your current game state"
          >
            <Terminal size={14} className="mr-1" />
            Generate Proof
          </Button>
        ) : (
          <Button 
            size="sm"
            disabled
            className="bg-gray-700 text-gray-400 border-none text-xs py-1 h-8 opacity-70"
          >
            <Lock size={14} className="mr-1" />
            No Proofs
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProofCounter;
