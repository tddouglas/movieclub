export interface Member {
  id: string;
  name: string;
  bio: string;
  imageUrl: string;
  role: string;
}

export interface MovieClub {
  id: string;
  date: string;
  winningMovie: {
    title: string;
    votes: number;
  };
  options: Array<{
    title: string;
    votes: number;
  }>;
}

export interface Attendance {
  memberId: string;
  memberName: string;
  count: number;
}

export interface Poll {
  id: string;
  title: string;
  isActive: boolean;
  options: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
  voters: Array<{
    name: string;
    vote: string;
  }>;
  endDate: string;
}