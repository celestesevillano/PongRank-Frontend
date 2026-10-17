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

export type Page<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

export type PageParams = { page?: number; size?: number };
