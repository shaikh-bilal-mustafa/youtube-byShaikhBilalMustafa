export interface Video {
  _id: string;
  title: string;
  thumbnail: string;
  owner: {
    username: string;
    avatar: string;
  };
}