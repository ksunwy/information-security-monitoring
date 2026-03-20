import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export interface CveItem {
  cve: {
    id: string;
    sourceIdentifier: string;
    published: string;
    lastModified: string;
    vulnStatus: string;
    descriptions: Array<{ lang: string; value: string }>;
    metrics?: {
      cvssMetricV2?: Array<{
        cvssData: {
          version: string;
          vectorString: string;
          baseScore: number;
          baseSeverity?: string;
        };
        baseSeverity?: string;
      }>;
      cvssMetricV31?: Array<{
        cvssData: {
          version: string;
          vectorString: string;
          baseScore: number;
          baseSeverity?: string;
        };
        baseSeverity?: string;
      }>;
    };
    weaknesses?: Array<{ description: Array<{ lang: string; value: string }> }>;
    configurations?: any;
    references?: Array<{ url: string; tags?: string[] }>;
  };
}

export interface CveListResponse {
  resultsPerPage: number;
  startIndex: number;
  totalResults: number;
  format: string;
  version: string;
  timestamp: string;
  vulnerabilities: CveItem[];
}

export interface CveDetailResponse {
  vulnerabilities: CveItem[];
  totalResults: number;
}

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
