import { MoreVertical } from 'lucide-react';
import { Button } from './ui/button';

export interface Video {
  id: string;
  thumbnail: string;
  title: string;
  channel: string;
  views: string;
  timestamp: string;
  duration: string;
  channelAvatar: string;
}

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

export function VideoCard({ video, onClick }: VideoCardProps) {
  return (
    <div className="cursor-pointer group" onClick={() => onClick(video)}>
      {/* Thumbnail */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 mb-3">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
          {video.duration}
        </div>
      </div>

      {/* Video info */}
      <div className="flex gap-3">
        {/* Channel avatar */}
        <div className="shrink-0">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-semibold">
            {video.channel.charAt(0)}
          </div>
        </div>

        {/* Title and meta */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm line-clamp-2 mb-1 group-hover:text-gray-600">
            {video.title}
          </h3>
          <p className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer">
            {video.channel}
          </p>
          <p className="text-sm text-gray-600">
            {video.views} • {video.timestamp}
          </p>
        </div>

        {/* More options */}
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
