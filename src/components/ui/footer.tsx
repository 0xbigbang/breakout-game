
import React from 'react';

const Footer: React.FC = () => {
  return (
    <div className="w-full text-center py-2 text-xs text-gray-400 font-urbanist">
      <p>
        Made by <a 
          href="https://twitter.com/beatdetect" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          @beatdetect
        </a> | <a 
          href="https://github.com/0xbigbang/breakout-game" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-purple-400 hover:text-purple-300 transition-colors"
        >
          Github
        </a>
      </p>
    </div>
  );
};

export default Footer;
