
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
import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@/components/providers/auth-provider";
import { loginWithGoogle, logout } from "@/lib/auth";

export function Navbar() {
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error(e);
    }
  };

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
              <DropdownMenuItem className="cursor-pointer" disabled>
                <FolderGit2 className="size-4 mr-2" />
                Projects
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" disabled>
                <Info className="size-4 mr-2" />
                About
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link to="/links" className="flex flex-row gap-x-2">
                  <Mail className="size-4 mr-2" />
                  Links
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center ml-1 md:ml-4">
          <SignedIn>
            <Button variant="destructive" onClick={handleLogout} className="h-10 px-4 md:px-6 text-sm md:text-base">
              Logout
            </Button>
          </SignedIn>
          <SignedOut>
            <Button onClick={handleLogin} className="h-10 px-4 md:px-6 text-sm md:text-base">
              Login
            </Button>
          </SignedOut>
        </div>
      </Menubar>
    </div>
  );
}
