'use client';

import { useQuery } from '@tanstack/react-query';
import { socialListenerApi } from '@/lib/socialListenerApi';
import { mockEnvironments } from '@/lib/data/environments';
import { EnvironmentProfile } from '@/types/environment';

interface Filters {
  type?: string;
  location?: string;
  topic?: string;
  minEri?: number;
}

const fetchEnvironments = async (filters: Filters): Promise<EnvironmentProfile[]> => {
  try {
    const { data } = await socialListenerApi.get<EnvironmentProfile[]>('/environments', { params: filters });
    return data;
  } catch (error) {
    console.warn('Social Listener API unreachable, using mock data.', error);
    let data = [...mockEnvironments];
    const { type, location, topic, minEri } = filters;
    if (type) data = data.filter((e) => e.type === type);
    if (location) data = data.filter((e) => e.location.includes(location));
    if (topic) data = data.filter((e) => e.topics.includes(topic));
    if (minEri !== undefined) data = data.filter((e) => e.eriScore >= minEri);
    return data;
  }
};

export function useEnvironments(filters: Filters = {}) {
  return useQuery({
    queryKey: ['environments', filters],
    queryFn: () => fetchEnvironments(filters),
  });
}