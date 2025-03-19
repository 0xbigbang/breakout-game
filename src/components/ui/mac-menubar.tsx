import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from "@/components/ui/menubar";

const MacMenuBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="border-b border-gray-700 bg-gray-800 text-gray-300 font-urbanist">
      <Menubar className="border-none bg-transparent rounded-none px-2 h-9 flex items-center">
        <div className="flex items-center mr-4">
          <img src="/succinct-icon-pink.svg" alt="Succinct Logo" className="h-5 mr-2" />
        </div>
        
        <MenubarMenu>
          <MenubarTrigger className="text-xs hover:bg-gray-700 data-[state=open]:bg-gray-700">Help</MenubarTrigger>
          <MenubarContent className="bg-gray-800 border-gray-700 text-gray-300">
            <MenubarItem className="text-xs hover:bg-gray-700 focus:bg-gray-700">
              Documentation
            </MenubarItem>
            <MenubarItem 
              className="text-xs hover:bg-gray-700 focus:bg-gray-700"
              onClick={() => window.open("https://github.com/0xbigbang/breakout-game", "_blank")}
            >
              View on GitHub
            </MenubarItem>
            <MenubarSeparator className="bg-gray-700" />
            <MenubarItem 
              className="text-xs hover:bg-gray-700 focus:bg-gray-700"
              onClick={() => navigate('/about')}
            >
              About
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default MacMenuBar;
