export interface LoginResponse {
  user: {
    id: string;
    username: string;
    role: 'ADMIN' | 'SURVIVOR' | 'NIKITA';
  };
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  return response.json();
};
