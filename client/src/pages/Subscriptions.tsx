import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import { VideoCard } from "../components/VideoCard";
import type { Video } from "../components/VideoCard";
import { getSubscriptionVideos } from "../api/subscription"; // assume API exists

export default function SubscriptionsPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true);
      try {
        const res = await getSubscriptionVideos();
        setVideos(res.data.videos || []);
      } catch (e) {
        console.error("Error loading videos:", e);
        setError("Failed to load videos");
      } finally {
        setLoading(false);
      }
    };
    loadVideos();
  }, []);

  return (
    <div className="min-h-screen flex">
      <Header
        onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
        onSearchChange={() => {}}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onItemClick={() => setIsSidebarOpen(false)}
      />

      <main className="pt-14 w-full lg:pl-56 transition-all duration-300">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Subscriptions</h1>

          {error && (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          )}

          {loading && <div>Loading...</div>}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
              {videos.map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  onClick={() => {}}
                />
              ))}
            </div>
          )}

          {!loading && !error && videos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600">No videos from subscriptions yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}