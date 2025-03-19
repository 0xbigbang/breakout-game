
import React from 'react';
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
  return (
    <div className="border-b border-gray-700 bg-gray-800 text-gray-300 font-urbanist">
      <Menubar className="border-none bg-transparent rounded-none px-2 h-7">
        <MenubarMenu>
          <MenubarTrigger className="text-xs hover:bg-gray-700 data-[state=open]:bg-gray-700">File</MenubarTrigger>
          <MenubarContent className="bg-gray-800 border-gray-700 text-gray-300">
            <MenubarItem className="text-xs hover:bg-gray-700 focus:bg-gray-700">
              New Game
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="text-xs hover:bg-gray-700 focus:bg-gray-700">
              Open
              <MenubarShortcut>⌘O</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator className="bg-gray-700" />
            <MenubarItem className="text-xs hover:bg-gray-700 focus:bg-gray-700">
              Save
              <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator className="bg-gray-700" />
            <MenubarItem className="text-xs hover:bg-gray-700 focus:bg-gray-700">
              Exit
              <MenubarShortcut>⌘Q</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="text-xs hover:bg-gray-700 data-[state=open]:bg-gray-700">Edit</MenubarTrigger>
          <MenubarContent className="bg-gray-800 border-gray-700 text-gray-300">
            <MenubarItem className="text-xs hover:bg-gray-700 focus:bg-gray-700">
              Undo
              <MenubarShortcut>⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarItem className="text-xs hover:bg-gray-700 focus:bg-gray-700">
              Redo
              <MenubarShortcut>⇧⌘Z</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator className="bg-gray-700" />
            <MenubarItem className="text-xs hover:bg-gray-700 focus:bg-gray-700">
              Settings
              <MenubarShortcut>⌘,</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="text-xs hover:bg-gray-700 data-[state=open]:bg-gray-700">View</MenubarTrigger>
          <MenubarContent className="bg-gray-800 border-gray-700 text-gray-300">
            <MenubarItem className="text-xs hover:bg-gray-700 focus:bg-gray-700">
              Leaderboard
            </MenubarItem>
            <MenubarItem className="text-xs hover:bg-gray-700 focus:bg-gray-700">
              Stats
            </MenubarItem>
            <MenubarSeparator className="bg-gray-700" />
            <MenubarItem className="text-xs hover:bg-gray-700 focus:bg-gray-700">
              Fullscreen
              <MenubarShortcut>⌘F</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger className="text-xs hover:bg-gray-700 data-[state=open]:bg-gray-700">Help</MenubarTrigger>
          <MenubarContent className="bg-gray-800 border-gray-700 text-gray-300">
            <MenubarItem className="text-xs hover:bg-gray-700 focus:bg-gray-700">
              Documentation
            </MenubarItem>
            <MenubarItem className="text-xs hover:bg-gray-700 focus:bg-gray-700">
              View on GitHub
            </MenubarItem>
            <MenubarSeparator className="bg-gray-700" />
            <MenubarItem className="text-xs hover:bg-gray-700 focus:bg-gray-700">
              About
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default MacMenuBar;
