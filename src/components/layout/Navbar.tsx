
import {
  Menubar,
} from "@/components/ui/8bit/menubar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/8bit/dropdown-menu";
import { Button } from "@/components/ui/8bit/button";
import { Menu, Home as HomeIcon, FolderGit2, Info, Mail } from "lucide-react";
import type { User } from "firebase/auth";

interface NavbarProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

export function Navbar({ user, onLogin, onLogout }: NavbarProps) {
  return (
    <div className="absolute bottom-6 md:bottom-auto md:top-6 w-full flex justify-center z-50 px-4">
      <Menubar className="w-full md:w-auto justify-between md:justify-center gap-4 md:gap-12 px-4 py-3 sm:px-6 sm:py-3 space-x-0 h-auto">
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-10 px-4 md:px-6 text-sm md:text-base">
                <Menu className="size-5 mr-2" />
                Menu
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem className="cursor-pointer">
                <HomeIcon className="size-4 mr-2" />
                Home
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <FolderGit2 className="size-4 mr-2" />
                Projects
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Info className="size-4 mr-2" />
                About
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Mail className="size-4 mr-2" />
                Contact
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center ml-1 md:ml-4">
          {user ? (
            <Button variant="destructive" onClick={onLogout} className="h-10 px-4 md:px-6 text-sm md:text-base">
              Logout
            </Button>
          ) : (
            <Button onClick={onLogin} className="h-10 px-4 md:px-6 text-sm md:text-base">
              Login
            </Button>
          )}
        </div>
      </Menubar>
    </div>
  );
}
