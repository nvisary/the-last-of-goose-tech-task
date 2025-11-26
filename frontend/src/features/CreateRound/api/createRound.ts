import type { Round } from '../../../entities/Round/model/types';

export const createRound = async (duration?: number, cooldown?: number): Promise<Round> => {
  const response = await fetch('/api/rounds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ duration, cooldown }),
  });

  if (!response.ok) {
    throw new Error('Failed to create round');
  }

  return response.json();
};
