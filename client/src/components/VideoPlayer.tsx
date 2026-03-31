import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { Button } from "./ui/button";
import type { Video } from "./VideoCard";
import { useState, useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { toggleLike, getLikeCount, getLikeStatus } from "../api/like";
import { fetchComments, addComment, deleteComment } from "../api/comment";
import { toggleSubscription, getSubscriptionCount, getSubscriptionStatus } from "../api/subscription";

interface VideoPlayerProps {
  video: VideoWithOwner;
  onClose: () => void;
}

interface VideoOwner {
  _id?: string;
  username: string;
  avatar?: string;
  fullName?: string;
}

interface VideoUser extends Pick<VideoOwner, "username" | "avatar"> {
  fullName: string;
}

interface CommentItem {
  _id: string;
  content: string;
  owner: VideoOwner;
  createdAt: string;
}

interface VideoWithOwner extends Omit<Video, "user"> {
  owner?: VideoOwner;
  user?: VideoUser;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const { user } = useAuth();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [newComment, setNewComment] = useState("");
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const ownerId = video.owner?._id || "";

    const loadSubscriptionData = async () => {
      if (!ownerId) return;
      try {
        const status = await getSubscriptionStatus(ownerId);
        setSubscribed(status);
        const count = await getSubscriptionCount(ownerId);
        setSubscriberCount(count);
      } catch (error) {
        console.error("Error loading subscription data:", error);
      }
    };

    const loadComments = async () => {
      try {
        const fetchedComments = await fetchComments(video._id);
        setComments(fetchedComments || []);
      } catch (error) {
        console.error("Error loading comments:", error);
      }
    };

    const loadLikeData = async () => {
      try {
        const count = await getLikeCount(video._id);
        setLikeCount(count);
        const status = await getLikeStatus(video._id);
        setLiked(status);
      } catch (error) {
        console.error("Error loading like data:", error);
      }
    };

    loadSubscriptionData();
    loadComments();
    loadLikeData();
  }, [video._id, video.owner, video.user]);

  const handleSubscribe = async () => {
    const ownerId = video.owner?._id || "";
    if (!ownerId) return;

    try {
      await toggleSubscription(ownerId);
      setSubscribed((prev) => !prev);
      setSubscriberCount((prev) => (subscribed ? prev - 1 : prev + 1));
    } catch (error) {
      console.error("Error toggling subscription:", error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const addedComment = await addComment(video._id, newComment);
      if (addedComment) {
        setComments(prev => [addedComment, ...prev]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleLike = async () => {
    try {
      await toggleLike(video._id);
      setLiked(prev => !prev);
      const newCount = await getLikeCount(video._id);
      setLikeCount(newCount);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main video section */}
        <div className="lg:col-span-2">
          {/* Video player */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
            {!isPlaying ? (
              <>
                {/* thumbnail */}
                <img
                  src={ video.thumbnailUrl || ""}
                  alt={video.title}
                  className="w-full h-full object-cover"
                  onClick={() => setIsPlaying(true)}
                />
                {/* play button */}
                <button
                  onClick={() => setIsPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="bg-white/80 rounded-full p-4">▶</div>
                </button>
              </>
            ) : (
              <video controls autoPlay className="w-full h-full">
                <source src={video.videoFile} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>

          {/* Video title */}
          <h1 className="text-xl font-semibold mb-3">{video.title}</h1>

          {/* Channel info and actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            {/* Channel info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                {(video.owner?.username || video.user?.username || video.channel || "?")[0]?.toUpperCase()}
              </div>
              <div>
                <p className="font-semibold">{video.owner?.username || video.user?.username || video.channel || "Unknown"}</p>
                <p className="text-sm text-gray-600">{subscriberCount} subscribers</p>
              </div>
              <Button 
                className={`ml-2 rounded-full ${subscribed ? 'bg-gray-200 text-gray-800' : ''}`}
                onClick={handleSubscribe}
              >
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </Button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                <button
                  className={`
        flex items-center gap-2 px-4 py-2 rounded-full
        transition-all duration-200
        border
        ${liked 
          ? "bg-blue-50 border-blue-200 text-blue-600 shadow-md scale-105" 
          : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"}
        active:scale-90`} 
                  onClick={handleLike}
                >
                  <ThumbsUp className={`h-5 w-5 transition-transform duration-200 ${
          liked ? "fill-blue-600 scale-110" : ""
        }`} />
                  <span className="text-sm font-medium">
        {likeCount}k
      </span>
                </button>
                
                <div className="w-px h-6 bg-gray-300" />
                <Button
                  variant="ghost"
                  className="rounded-none hover:bg-gray-200"
                >
                  <ThumbsDown className="h-5 w-5" />
                </Button>
              </div>
              <Button
                variant="ghost"
                className="bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
              <Button
                variant="ghost"
                className="bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <Download className="h-5 w-5 mr-2" />
                Download
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="bg-gray-100 rounded-full hover:bg-gray-200"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-semibold">{video.views}</span>
              <span className="text-gray-600">{video.timestamp}</span>
            </div>
            <p
              className={`text-sm ${isDescriptionExpanded ? "" : "line-clamp-2"}`}
            >
              This is an amazing video about {video.title}. In this video, we
              explore various aspects and provide detailed insights. Join us as
              we dive deep into this fascinating topic and learn something new
              together!
            </p>
            <Button
              variant="ghost"
              className="mt-2 px-0 h-auto hover:bg-transparent"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              {isDescriptionExpanded ? "Show less" : "Show more"}
              <ChevronDown
                className={`ml-1 h-4 w-4 transition-transform ${isDescriptionExpanded ? "rotate-180" : ""}`}
              />
            </Button>
          </div>

          {/* Comments section */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">{comments.length} Comments</h2>
            
            {/* Add comment */}
            <div className="flex gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold shrink-0">
                U
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="ghost" onClick={() => setNewComment("")}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                    Comment
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold shrink-0">
                    {comment.owner.username[0].toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{comment.owner.username}</span>
                      <span className="text-xs text-gray-600">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm mb-2">
                      {comment.content}
                    </p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        10
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                      >
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-auto p-0 hover:bg-transparent"
                      >
                        Reply
                      </Button>
                      {user && comment.owner._id === user._id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 hover:bg-transparent text-red-600"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestions sidebar */}
        <div className="lg:col-span-1">
          <h2 className="font-semibold mb-4 hidden lg:block">
            Suggested Videos
          </h2>
          <div className="space-y-3">
            {mockSuggestedVideos.map((suggestedVideo) => (
              <div
                key={suggestedVideo.id}
                className="flex gap-2 cursor-pointer group"
              >
                <div className="relative w-40 shrink-0 aspect-video rounded-lg overflow-hidden bg-gray-200">
                  <img
                    src={suggestedVideo.thumbnail}
                    alt={suggestedVideo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
                    {suggestedVideo.duration}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold line-clamp-2 mb-1 group-hover:text-gray-600">
                    {suggestedVideo.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    {suggestedVideo.channel}
                  </p>
                  <p className="text-xs text-gray-600">
                    {suggestedVideo.views} • {suggestedVideo.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const mockSuggestedVideos = [
  {
    id: "s1",
    thumbnail:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400",
    title: "Learn Web Development in 2026",
    channel: "Tech Academy",
    views: "450K views",
    timestamp: "3 days ago",
    duration: "18:32",
  },
  {
    id: "s2",
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
    title: "JavaScript Tips and Tricks",
    channel: "Code Master",
    views: "280K views",
    timestamp: "1 week ago",
    duration: "12:45",
  },
  {
    id: "s3",
    thumbnail:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400",
    title: "Building Scalable Applications",
    channel: "Dev Pro",
    views: "125K views",
    timestamp: "2 weeks ago",
    duration: "25:18",
  },
  {
    id: "s4",
    thumbnail:
      "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400",
    title: "The Future of Technology",
    channel: "Tech Insights",
    views: "890K views",
    timestamp: "5 days ago",
    duration: "15:22",
  },
];
