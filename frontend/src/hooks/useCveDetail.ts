import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export interface CveDetail {
  id: string;
  sourceIdentifier: string;
  published: string;
  lastModified: string;
  vulnStatus: string;
  descriptions: Array<{
    lang: string;
    value: string;
  }>;
  metrics?: {
    cvssMetricV30?: Array<{
      cvssData: {
        version: string;
        vectorString: string;
        baseScore: number;
        baseSeverity?: string;
      };
      exploitabilityScore?: number;
      impactScore?: number;
    }>;
    cvssMetricV2?: Array<{
      cvssData: {
        version: string;
        vectorString: string;
        baseScore: number;
        baseSeverity?: string;
      };
    }>;
  };
  weaknesses?: Array<{
    description: Array<{ lang: string; value: string }>;
  }>;
  configurations?: {
    nodes?: Array<{
      operator: string;
      negate: boolean;
      cpeMatch?: Array<{
        criteria: string;
        vulnerable: boolean;
      }>;
    }>;
  };
  references?: Array<{
    url: string;
    tags?: string[];
  }>;
}

export interface CveDetailResponse {
  cve: CveDetail;
}

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
