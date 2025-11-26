import type { Round } from '../model/types';

export const getAllRounds = async (): Promise<Round[]> => {
  const response = await fetch('/api/rounds');
  if (!response.ok) {
    throw new Error('Failed to fetch rounds');
  }
  return response.json();
};

export const getRoundById = async (id: string): Promise<Round> => {
  const response = await fetch(`/api/rounds/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch round');
  }
  return response.json();
};

export interface TapResponse {
  userScore: number;
  myTaps: number;
  totalScore: number;
}

export const tapRound = async (id: string): Promise<TapResponse> => {
  const response = await fetch(`/api/rounds/${id}/tap`, {
    method: 'POST',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to tap');
  }

  return response.json();
};

export const deleteRound = async (id: string): Promise<void> => {
  const response = await fetch(`/api/rounds/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete round');
  }
};
