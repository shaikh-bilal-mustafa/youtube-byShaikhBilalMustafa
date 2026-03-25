import { useState, useEffect } from "react";
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import type {  Video } from '../components/VideoCard';
import { VideoCard } from '../components/VideoCard';
import { VideoPlayer } from '../components/VideoPlayer';
import { useNavigate } from "react-router-dom";
import { getProfile } from "../api/user.api";
import { getVideos ,searchVideos} from "../api/video";

const Videos = Array.from({ length: 12 }).map((_, i) => ({
  id: String(i),
  title: `Sample Video Title ${i + 1}`,
  channel: "Channel Name",
  views: `${(i + 1) * 5}K views`,
  timestamp: "2 days ago",
  duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(
    Math.random() * 60,
  )
    .toString()
    .padStart(2, "0")}`,
  thumbnail: `https://picsum.photos/seed/${i}/400/250`,
  channelAvatar: `https://i.pravatar.cc/300?u=channel${i}`,
}));

export default function HomePage() {
    // const [sidebarOpen, setSidebarOpen] = useState(false);
  // const [active, setActive] = useState("Home");
  // const [search, setSearch] = useState("");
   const [videos, setVideos] = useState<Video | null>(null);;
  //  const [user, setUser] = useState<{ avatar: string } | null>(null);
  // const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const res = await getVideos();
         setVideos(res.data);
        console.log("Loaded videos:", res.data);
      } catch (e: any) {
        // setMessage(e.response?.data?.message || "Failed to load videos");
        console.error("Error loading videos:", e);
      }
    };
    loadVideos();
  }, []);

  useEffect( () => {
    const loadSearchResults = async () => {
    if (searchQuery.trim() === "") return;
     try{
      const res = await searchVideos(searchQuery);
      setVideos(res.data);
     }
      catch(e){
        console.error("Error searching videos:", e);
      }
  } ; 
  loadSearchResults();
},[]);

  const navigate = useNavigate();

  // useEffect(() => {
  //   const loadUserProfile = async () => {
  //     try {
  //       const res = await getProfile();
  //       const userdata = res.data;
  //       // setUser({
  //       //   ...userdata,
  //       //   avatar: userdata.avatar || "https://i.pravatar.cc/300",
  //       // });
  //     } catch (e) {
  //       console.error("Error loading user profile:", e);
  //     }
  //   };
  //   loadUserProfile();
  // }, []);

  return (
    <div className=" min-h-screen flex">
      <Header
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
        onSearchChange={setSearchQuery}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onItemClick={() => setIsSidebarOpen(false)}
      />
       <main
        className={`pt-14 transition-all duration-300 ${
          isSidebarOpen ? 'lg:pl-56' : 'lg:pl-56'
        }`}
      >
        <div className="p-6">
          {  videos ? (
            <div>
              <button
                onClick={() => setVideos(null)}
                className="mb-4 text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to home
              </button>
                
              <VideoPlayer video={videos} onClose={() => setVideos(null)} />
            </div>
          ) : (
            <>{/* Filter chips */}
              

              {/* Video grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {Videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onClick={setVideos}
                  />
                ))}
              </div>

              {Videos.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No videos found matching "{searchQuery}"</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}













// upper figma design
//       <div className="flex-1 flex flex-col">
//         {/* Header */}
//         <header className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
//           <div className="flex items-center gap-3">
//             <button className="text-xl" onClick={() => setSidebarOpen(true)}>
//               ☰
//             </button>
//             <h1 className="text-lg font-semibold">MyTube</h1>
//           </div>

//           <div className="flex flex-1 max-w-2xl mx-4 items-center bg-gray-900 rounded-full overflow-hidden">
//             <input
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Search videos"
//               className="flex-1 bg-transparent px-4 py-2 outline-none"
//             />
//             <button className="px-4">🔍</button>
//           </div>
//           <button className="px-4" onClick={() => navigate("/login")}>
//             {" "}
//             Sign in
//           </button>
//           <button className="px-4" onClick={() => navigate("/signup")}>
//             Sign Up
//           </button>
//           <div
//             className="w-9 h-9 rounded-full overflow-hidden cursor-pointer"
//             onClick={() => navigate("/profile")}
//           >
//             <img
//               src={user?.avatar || "https://i.pravatar.cc/300"}
//               alt="avatar"
//               className="w-full h-full rounded-full"
//             />
//           </div>
//         </header>

//         {/* Video Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 px-4 py-4">
//           {videos.map((video) => (
//             <div key={video.id} className="cursor-pointer">
//               <div className="relative">
//                 <img
//                   src={video.thumbnail}
//                   alt="thumbnail"
//                   className="w-full rounded-lg"
//                 />
//                 <span className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-xs px-1 rounded">
//                   {video.duration}
//                 </span>
//               </div>

//               <h3 className="text-sm font-semibold mt-2 line-clamp-2">
//                 {video.title}
//               </h3>
//               <p className="text-xs text-gray-400">
//                 {video.views} • 👍 {video.likes}
//               </p>
//             </div>
//           ))}
//         </div>
//         <div className="flex justify-center px-4">
//           {message && <div className="text-red-500 text-sm mt-2">{message}</div>}
//         </div>
//       </div>
      
//       {/* Expanded Sidebar (Hamburger Click) */}
//       {sidebarOpen && (
//         <>
//           <div
//             className="fixed inset-0 bg-black bg-opacity-50"
//             onClick={() => setSidebarOpen(false)}
//           />

//           <aside className="fixed top-0 left-0 w-52 h-full bg-black p-4 z-50 border-r border-gray-800">
//             <button
//               className="mb-4 text-lg"
//               onClick={() => setSidebarOpen(false)}
//             >
//               ❌
//             </button>

//             {["Home", "Subscriptions", "You"].map((item) => (
//               <button
//                 key={item}
//                 onClick={() => setActive(item)}
//                 className={`block w-full text-left p-3 rounded mb-2 ${active === item ? "bg-gray-700" : "hover:bg-gray-800"}`}
//               >
//                 {item}
//               </button>
//             ))}
//           </aside>
//         </>
//       )}
//     </div>
//   );
// }
