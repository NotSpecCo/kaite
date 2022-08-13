export type Poll = {
  id: string;
  duration: number;
  endsAt: string;
  status: 'open' | 'closed';
  options: {
    label: string;
    position: number;
    votes: number;
  }[];
};
