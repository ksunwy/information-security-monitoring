import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { CveListResponse } from '../types';

export const useCveList = (keyword: string = '', page: number = 1) => {
  const resultsPerPage = 20;
  const startIndex = (page - 1) * resultsPerPage;

  const query = useQuery<CveListResponse>({
    queryKey: ['cve-list', keyword, page],
    queryFn: () =>
      api
        .get<CveListResponse>('/cves', {
          params: {
            keywordSearch: keyword || undefined,
            resultsPerPage,
            startIndex,
          },
        })
        .then(res => res.data),
    placeholderData: (previousData) => previousData,
    staleTime: 5 * 60 * 1000,
  });

  return {
    vulnerabilities: query.data?.vulnerabilities || [],
    totalResults: query.data?.totalResults || 0,
    totalPages: query.data ? Math.ceil(query.data.totalResults / resultsPerPage) : 1,
    currentPage: page,
    isLoading: query.isLoading || query.isPlaceholderData,
    error: query.error,
  };
};
