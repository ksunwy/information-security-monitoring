import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { CveDetailResponse } from '../types';

export const useCveDetail = (id?: string) => {
  const enabled = Boolean(id && /^CVE-\d{4}-\d{4,7}$/i.test(id));

  const query = useQuery<CveDetailResponse>({
    queryKey: ['cve-detail', id],
    enabled,
    queryFn: async () => {
      const { data } = await api.get<CveDetailResponse>(`/cves/${id}`);
      return data;
    },
    staleTime: 60 * 60 * 1000,
    retry: 1,
  });

  return {
    cve: query.data?.cve ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
};
