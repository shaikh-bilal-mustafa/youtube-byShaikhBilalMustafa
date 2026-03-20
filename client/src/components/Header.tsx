import { Search, Menu, Video, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useNavigate } from 'react-router-dom';
interface HeaderProps {
  onMenuClick: () => void;
  onSearchChange: (value: string) => void;
}
//  const { user, loading, logout } = useAuth();
export function Header({ onMenuClick, onSearchChange }: HeaderProps) {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b z-50 h-14">
      <div className="flex items-center justify-between h-full px-4 gap-4">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-1 cursor-pointer">
            <Video className="h-7 w-7 text-red-600" />
            <span className="text-xl font-semibold hidden sm:inline">YouTube</span>
          </div>
        </div>

        {/* Center section - Search */}
        <div className="flex-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center">
              <Input
                type="text"
                placeholder="Search"
                className="rounded-r-none border-r-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(e) => onSearchChange(e.target.value)}
              />
              <Button
                variant="outline"
                className="rounded-l-none border-l px-6 hover:bg-gray-100"
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 pr-5">
          
          {isAuthenticated ? (
    /* 🔐 Logged in → Show profile button */
    <Button
      variant="ghost"
      size="icon"
      onClick={() => navigate("/profile")}
      className="rounded-full hover:bg-gray-100"
    >
      <User className="h-5 w-5" />
    </Button>
  ) : (
    /* 🔓 Logged out → Show login & signup */
    <>
      <Button
        variant="ghost"
        onClick={() => navigate("login")}
      >
        Log in
      </Button>

      <Button
        onClick={() => navigate("/signup")}
      >
        Sign up
      </Button>
    </>
  )}
        </div>
      </div>
    </header>
  );
}
