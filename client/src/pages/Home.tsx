import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/user.api";


const videos = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  title: `Sample Video Title ${i + 1}`,
  channel: "Channel Name",
  views: `${(i + 1) * 5}K views`,
  likes: `${(i + 1) * 200}`,
  time: "2 days ago",
  duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, "0")}`,
  thumbnail: `https://picsum.photos/seed/${i}/400/250`
}));

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [active, setActive] = useState("Home");
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<{ avatar: string } | null>(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const res = await getProfile();
        const userdata = res.data
        setUser({
          ...userdata,
          avatar: userdata.avatar || "https://i.pravatar.cc/300"
        });
      } catch (e) {
        console.error("Error loading user profile:", e);
      }
    };
    loadUserProfile();
  }, []);
  
  return (
    <div className="bg-black text-white min-h-screen flex">
      {/* Collapsed Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col items-center w-20 border-r border-gray-800 py-4 gap-6">
        {["Home", "Subscriptions", "You"].map((item) => (
          <button
            key={item}
            onClick={() => setActive(item)}
            className={`flex flex-col items-center text-xs ${active === item ? "text-white" : "text-gray-400"}`}
          >
            <span className="text-xl">
              {item === "Home" && "🏠"}
              {item === "Subscriptions" && "📺"}
              {item === "You" && "👤"}
            </span>
            {item}
          </button>
        ))}
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <button
              className="text-xl"
              onClick={() => setSidebarOpen(true)}
            >
              ☰
            </button>
            <h1 className="text-lg font-semibold">MyTube</h1>
          </div>

          <div className="flex flex-1 max-w-2xl mx-4 items-center bg-gray-900 rounded-full overflow-hidden">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search videos"
              className="flex-1 bg-transparent px-4 py-2 outline-none"
            />
            <button className="px-4">🔍</button>
            
          </div>
          <button  className="px-4"  onClick={() => navigate("/login")}> Sign in</button>
          <button className="px-4" onClick={() => navigate("/signup")}>Sign Up</button>
          <div className="w-9 h-9 rounded-full overflow-hidden cursor-pointer"
            onClick={() => navigate("/profile")}>
            <img
              src={user?.avatar || "https://i.pravatar.cc/300"}
              alt="avatar"
              className="w-full h-full rounded-full"
              
            />
          </div>
        </header>

        {/* Video Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 py-4">
          {videos.map((video) => (
            <div key={video.id} className="cursor-pointer">
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt="thumbnail"
                  className="w-full rounded-lg"
                />
                <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-xs px-1 rounded">
                  {video.duration}
                </span>
              </div>

              <h3 className="text-sm font-semibold mt-2 line-clamp-2">
                {video.title}
              </h3>
              <p className="text-xs text-gray-400">{video.views} • 👍 {video.likes}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Sidebar (Hamburger Click) */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          />

          <aside className="fixed top-0 left-0 w-52 h-full bg-black p-4 z-50 border-r border-gray-800">
            <button
              className="mb-4 text-lg"
              onClick={() => setSidebarOpen(false)}
            >
              ❌
            </button>

            {["Home", "Subscriptions", "You"].map((item) => (
              <button
                key={item}
                onClick={() => setActive(item)}
                className={`block w-full text-left p-3 rounded mb-2 ${active === item ? "bg-gray-700" : "hover:bg-gray-800"}`}
              >
                {item}
              </button>
            ))}
          </aside>
        </>
      )}
    </div>
  );
}
