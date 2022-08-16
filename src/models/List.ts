export type List = {
  id: string;
  name: string;
  description: string;
  private: boolean;
  createdAt: string;
  followerCount: number;
  memberCount: number;
  owner: {
    id: string;
    name: string;
    username: string;
    avatarUrl: string;
  };
};
