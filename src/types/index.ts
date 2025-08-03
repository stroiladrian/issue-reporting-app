export interface Issue {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
  comments: Comment[];
}

export interface Comment {
  id: string;
  issueId: string;
  text: string;
  author: string;
  createdAt: Date;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}
