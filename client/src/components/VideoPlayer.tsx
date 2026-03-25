import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, ChevronDown } from 'lucide-react';
import { Button } from './ui/button';
import type  { Video } from './VideoCard';
import { useState } from 'react';

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main video section */}
        <div className="lg:col-span-2">
          {/* Video player */}
          <div className="aspect-video bg-black rounded-xl overflow-hidden mb-4">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Video title */}
          <h1 className="text-xl font-semibold mb-3">{video.title}</h1>

          {/* Channel info and actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            {/* Channel info */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                {video.channel.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{video.channel}</p>
                <p className="text-sm text-gray-600">1.2M subscribers</p>
              </div>
              <Button className="ml-2 rounded-full">Subscribe</Button>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center bg-gray-100 rounded-full overflow-hidden">
                <Button variant="ghost" className="rounded-none hover:bg-gray-200">
                  <ThumbsUp className="h-5 w-5 mr-2" />
                  <span>125K</span>
                </Button>
                <div className="w-px h-6 bg-gray-300" />
                <Button variant="ghost" className="rounded-none hover:bg-gray-200">
                  <ThumbsDown className="h-5 w-5" />
                </Button>
              </div>
              <Button variant="ghost" className="bg-gray-100 rounded-full hover:bg-gray-200">
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
              <Button variant="ghost" className="bg-gray-100 rounded-full hover:bg-gray-200">
                <Download className="h-5 w-5 mr-2" />
                Download
              </Button>
              <Button variant="ghost" size="icon" className="bg-gray-100 rounded-full hover:bg-gray-200">
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
            <p className={`text-sm ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}>
              This is an amazing video about {video.title.toLowerCase()}. In this video, we explore various aspects and provide detailed insights.
              Join us as we dive deep into this fascinating topic and learn something new together!
            </p>
            <Button
              variant="ghost"
              className="mt-2 px-0 h-auto hover:bg-transparent"
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              {isDescriptionExpanded ? 'Show less' : 'Show more'}
              <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isDescriptionExpanded ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Comments section */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">1,234 Comments</h2>
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-semibold shrink-0">
                    U
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">@user{i}</span>
                      <span className="text-xs text-gray-600">{i} days ago</span>
                    </div>
                    <p className="text-sm mb-2">
                      Great video! Really enjoyed the content and learned a lot. Keep up the amazing work!
                    </p>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {i * 10}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                        <ThumbsDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-auto p-0 hover:bg-transparent">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Suggestions sidebar */}
        <div className="lg:col-span-1">
          <h2 className="font-semibold mb-4 hidden lg:block">Suggested Videos</h2>
          <div className="space-y-3">
            {mockSuggestedVideos.map((suggestedVideo) => (
              <div key={suggestedVideo.id} className="flex gap-2 cursor-pointer group">
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
                  <p className="text-xs text-gray-600">{suggestedVideo.channel}</p>
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
    id: 's1',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    title: 'Learn Web Development in 2026',
    channel: 'Tech Academy',
    views: '450K views',
    timestamp: '3 days ago',
    duration: '18:32',
  },
  {
    id: 's2',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
    title: 'JavaScript Tips and Tricks',
    channel: 'Code Master',
    views: '280K views',
    timestamp: '1 week ago',
    duration: '12:45',
  },
  {
    id: 's3',
    thumbnail: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400',
    title: 'Building Scalable Applications',
    channel: 'Dev Pro',
    views: '125K views',
    timestamp: '2 weeks ago',
    duration: '25:18',
  },
  {
    id: 's4',
    thumbnail: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400',
    title: 'The Future of Technology',
    channel: 'Tech Insights',
    views: '890K views',
    timestamp: '5 days ago',
    duration: '15:22',
  },
];
