export type RoundStatus = "COOLDOWN" | "ACTIVE" | "FINISHED";

export interface Round {
  id: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  status: RoundStatus;
  totalScore: number;
  myScore?: number;
  myTaps?: number;
  winner?: {
    username: string;
    score: number;
  };
}
