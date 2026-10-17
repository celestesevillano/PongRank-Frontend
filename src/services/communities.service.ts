import { http } from '@/services/http';
import type { CommunityResponse, Page, PageParams } from '@/types/api';

export const communitiesService = {
  search: (params: PageParams & { name?: string }, signal?: AbortSignal) =>
    http.get<Page<CommunityResponse>>('/communities', { params, signal }).then((r) => r.data),

  join: (communityId: number) => http.post<unknown>(`/communities/${communityId}/members`, {}).then((r) => r.data),
};
