import { Search, Menu, Video, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProfile } from "../api/user.api";
import { useAuth } from "../Context/AuthContext";
interface HeaderProps {
  onMenuClick: () => void;
  onSearchChange: (value: string) => void;
}

export function Header({ onMenuClick, onSearchChange }: HeaderProps) {
  const isAuthenticated = !!localStorage.getItem("accessToken");
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<{ avatar?: string } | null>(null);
  const navigate = useNavigate();
  const { logout } = useAuth();
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await getProfile();
        const userdata = res.data.data;
        setUser({
          avatar: userdata.avatar,
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };
    fetchUserProfile();
  }, []);
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
            <span className="text-xl font-semibold hidden sm:inline">
              YouTube
            </span>
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
            <div className="flex items-center gap-3 md:gap-4">
              {/* Create Button + Dropdown */}
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition"
                >
                  <Plus className="h-5 w-5" />
                  <span className="hidden sm:inline text-sm font-medium">
                    Create
                  </span>
                </Button>

                {open && (
                  <div className="absolute right-0 top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 animate-in fade-in zoom-in-95">
                    {/* Arrow */}
                    <div className="absolute -top-2 right-4 w-3 h-3 bg-white border-l border-t border-gray-200 rotate-45"></div>

                    <ul className="py-2 text-sm text-gray-700">
                      <li className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition">
                        📤 <Button
                        title="Upload Video"
                          onClick={() => navigate("/upload")}
                        >
                          <span>Upload Video</span>
                        </Button>
                      </li>
                      <li className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition">
                        📝 <span>Create Post</span>
                      </li>
                      <li className="flex items-center gap-3 px-4 py-2 hover:bg-gray-100 cursor-pointer transition">
                        📺 <span>Go Live</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Hadiya Button */}
              <Button
                variant="ghost"
                onClick={() => navigate("/pay")}
                className="px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100"
              >
                💰 Hadiya
              </Button>

              {/* Profile Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/profile")}
                className="rounded-full p-1 hover:bg-gray-100 transition"
              >
                <img
                  src={
                    user?.avatar ||
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }
                  alt="profile"
                  className="h-8 w-8 rounded-full object-cover border border-gray-200"
                />
                
              </Button>

              {/* Logout Button */}
              <Button
                variant="ghost"
                onClick={logout}
                className="px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100"
              >
                Logout
              </Button>
            </div>
          ) : (
            /* 🔓 Logged out → Show login & signup */
            <>
              <Button variant="ghost" onClick={() => navigate("login")}>
                Log in
              </Button>

              <Button onClick={() => navigate("/signup")}>Sign up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
