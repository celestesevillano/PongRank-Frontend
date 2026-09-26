import { API_BASE_URL } from '@/lib/config';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {},
): Promise<T> {
  const { method = 'GET', body, token } = options;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : undefined;

  if (!res.ok) {
    const message = (data && (data.message as string)) || `Error ${res.status}`;
    throw new ApiError(res.status, message);
  }

  return data as T;
}

export type PlayerResponse = {
  id: number;
  name: string;
  email: string;
  whatsapp: string | null;
  shareContact: boolean;
  categoryFdptm: string | null;
  federatedDeclared: boolean;
  ratingGlicko: number;
  ratingDeviation: number;
  volatility: number;
  role: string;
  status: string;
};

export type AuthResponse = {
  token: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  player: PlayerResponse;
};

export type CommunityResponse = {
  id: number;
  name: string;
  description: string | null;
  communityType: 'UNIVERSITY' | 'SCHOOL' | 'PUBLIC_PARK' | 'OTHER';
  memberCount: number;
};

export const api = {
  register(input: { name: string; email: string; password: string; federatedDeclared?: boolean }) {
    return request<AuthResponse>('/api/v1/auth/register', { method: 'POST', body: input });
  },

  login(input: { email: string; password: string }) {
    return request<AuthResponse>('/api/v1/auth/login', { method: 'POST', body: input });
  },

  forgotPassword(email: string) {
    return request<void>('/api/v1/auth/forgot-password', { method: 'POST', body: { email } });
  },

  me(token: string) {
    return request<PlayerResponse>('/api/v1/auth/me', { token });
  },

  updatePlayer(
    token: string,
    playerId: number,
    input: Partial<{ name: string; whatsapp: string; shareContact: boolean; categoryFdptm: string; federatedDeclared: boolean }>,
  ) {
    return request<PlayerResponse>(`/api/v1/players/${playerId}`, { method: 'PATCH', token, body: input });
  },

  searchCommunities(token: string, name?: string) {
    const query = name ? `?name=${encodeURIComponent(name)}` : '';
    return request<{ content: CommunityResponse[] }>(`/api/v1/communities${query}`, { token });
  },

  joinCommunity(token: string, communityId: number) {
    return request<unknown>(`/api/v1/communities/${communityId}/members`, {
      method: 'POST',
      token,
      body: {},
    });
  },
};
