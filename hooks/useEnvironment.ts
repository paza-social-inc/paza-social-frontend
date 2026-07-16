'use client';

import { useQuery } from '@tanstack/react-query';
import { socialListenerApi } from '@/lib/socialListenerApi';
import { mockEnvironments } from '@/lib/data/environments';
import { EnvironmentProfile } from '@/types/environment';

const fetchEnvironment = async (id: string): Promise<EnvironmentProfile> => {
  try {
    const { data } = await socialListenerApi.get<EnvironmentProfile>(`/environments/${id}`);
    return data;
  } catch (error) {
    console.warn('Social Listener API unreachable, using mock data.', error);
    const found = mockEnvironments.find((e) => e.id === id);
    if (!found) throw new Error(`Environment ${id} not found`);
    return found;
  }
};

export function useEnvironment(id: string) {
  return useQuery({
    queryKey: ['environment', id],
    queryFn: () => fetchEnvironment(id),
    enabled: !!id,
  });
}