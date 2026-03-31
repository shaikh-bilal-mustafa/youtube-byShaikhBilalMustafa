import { useState, useEffect, useRef, useCallback } from "react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import type { Video } from "../components/VideoCard";
import { VideoCard } from "../components/VideoCard";
import { VideoPlayer } from "../components/VideoPlayer";
import { getVideos, getAllVideos, getTrendingVideos } from "../api/video";
import { SkeletonList } from "../components/skeletonCard";

export default function HomePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const filters = [
    { id: "all", label: "All" },
    { id: "trending", label: "Trending" },
    { id: "latest", label: "Latest" },
  ];

  // 🔹 Load videos based on filter
  const loadVideos = async (filter: string = "all", pageNum: number = 1, append: boolean = false) => {
    if (!append) {
      setLoading(true);
      setError(null);
      setVideos([]);
      setPage(1);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }
    try {
      let res;
      switch (filter) {
        case "trending":
          res = await getTrendingVideos();
          break;
        case "latest":
          res = await getAllVideos(pageNum, 10);
          break;
        default:
          res = await getVideos();
      }
      console.log("Loaded videos:", res.data);
      const newVideos = Array.isArray(res.data.data) ? res.data.data : res.data.videos || [];
      if (append) {
        setVideos(prev => [...prev, ...newVideos]);
      } else {
        setVideos(newVideos);
      }
      if (newVideos.length < 10) {
        setHasMore(false);
      }
      if (!append) setPage(pageNum);
    } catch (e) {
      console.error("Error loading videos:", e);
      setError("Failed to load videos");
    } finally {
      if (!append) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  };

  // 🔹 Initial load
  useEffect(() => {
    loadVideos(activeFilter);
  }, [activeFilter]);

  // 🔹 Load more videos
  const loadMore = useCallback(() => {
    if (hasMore && !loadingMore && activeFilter === "latest" && !searchQuery.trim()) {
      const nextPage = page + 1;
      loadVideos(activeFilter, nextPage, true);
      setPage(nextPage);
    }
  }, [hasMore, loadingMore, activeFilter, page, searchQuery]);

  // 🔹 Intersection observer for infinite scroll
  const lastVideoRef = useCallback((node: HTMLDivElement | null) => {
    if (loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [loadingMore, hasMore, loadMore]);

  return (
    <div className="min-h-screen flex">
      <Header
        onMenuClick={() => setIsSidebarOpen((prev) => !prev)}
        onSearchChange={setSearchQuery}
      />

      <Sidebar
        isOpen={isSidebarOpen}
        onItemClick={() => setIsSidebarOpen(false)}
      />

      <main className="pt-14 w-full lg:pl-56 transition-all duration-300">
        <div className="p-6">
          {/* 🔹 Video Player View */}
          {selectedVideo ? (
            <div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="mb-4 text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to home
              </button>

              <VideoPlayer
                video={selectedVideo}
                onClose={() => setSelectedVideo(null)}
              />
            </div>
          ) : (
            <>
              {/* 🔹 Filter Chips */}
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeFilter === filter.id
                        ? "bg-black text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* 🔹 Error State */}
              {error && (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={() => loadVideos(activeFilter)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* 🔹 Loading State */}
              {loading && <SkeletonList />}

              {/* 🔹 Video Grid */}
              {!loading && !error && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
                  {videos.map((video, index) => (
                    <div
                      key={video._id}
                      ref={index === videos.length - 1 ? lastVideoRef : null}
                    >
                      <VideoCard
                        video={video}
                        onClick={setSelectedVideo}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 🔹 Loading More State */}
              {loadingMore && (
                <div className="text-center py-4">
                  <SkeletonList />
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}