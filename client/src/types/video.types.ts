export interface Video {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoFile: string;
  views: number;
  duration: number;
  timestamp: string;
  owner: {
    _id: string;
    username: string;
    avatar: string;
  };
}