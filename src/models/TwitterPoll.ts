export type TwitterPoll = {
  id: string;
  duration_minutes: number;
  end_datetime: string;
  voting_status: 'open' | 'closed';
  options: {
    label: string;
    position: number;
    votes: number;
  }[];
};
