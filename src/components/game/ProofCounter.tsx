
import React, { useEffect, useState } from 'react';
import { BadgeCheck } from 'lucide-react';

interface ProofCounterProps {
  count: number;
}

const ProofCounter: React.FC<ProofCounterProps> = ({ count }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (count > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [count]);
  
  return (
    <div className={`bg-purple-900 rounded-md p-2 shadow-md transition-transform ${isAnimating ? 'scale-110' : ''}`}>
      <div className="flex items-center">
        <BadgeCheck size={20} className="text-purple-400 mr-2" />
        <div>
          <p className="text-sm font-medium text-purple-300">Proofs Generated</p>
          <p className="text-xl font-bold text-white">{count}</p>
        </div>
      </div>
    </div>
  );
};

export default ProofCounter;
