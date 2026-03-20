import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { fetchAssets, type Asset } from './useAssets';

interface VulnDistribution {
  low: number;
  medium: number;
  high: number;
  critical: number;
}

interface AssetStats {
  total: number;
  withVulns: number;
}

interface VulnDynamicsEntry {
  period: string;
  new: number;
  fixed: number;
}

interface VulnDynamics {
  data: VulnDynamicsEntry[];
  granularity: string;
}

interface RecentVulnerability {
  id: number;
  cveId?: string;
  description?: string;
  criticality: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: string;
  cvssScore: string
}

export const useAdminDashboard = () => {
  const distribution = useQuery<VulnDistribution>({
    queryKey: ['vuln-distribution'],
    queryFn: () => api.get('/dashboards/vuln-distribution').then(res => res.data),
  });

  const stats = useQuery<AssetStats>({
    queryKey: ['asset-stats'],
    queryFn: () => api.get('/dashboards/asset-stats').then(res => res.data),
  });

  const dynamics = useQuery<VulnDynamics>({
    queryKey: ['vuln-dynamics'],
    queryFn: () => api.get('/dashboards/vuln-dynamics').then(res => res.data),
  });

  const recentVulns = useQuery<RecentVulnerability[]>({
    queryKey: ['recent-vulns'],
    queryFn: () => api.get('/vulnerabilities?limit=5&orderBy=detectedAt:desc').then(res => res.data),
  });

  const assetsQuery = useQuery<Asset[]>({
    queryKey: ['assets'],
    queryFn: fetchAssets,
  });

  return {
    distribution: distribution.data,
    isDistLoading: distribution.isLoading,
    stats: stats.data,
    isStatsLoading: stats.isLoading,
    dynamics: dynamics.data,
    isDynamicsLoading: dynamics.isLoading,
    recentVulns: recentVulns.data,
    isRecentLoading: recentVulns.isLoading,
    error: distribution.error || stats.error || dynamics.error || recentVulns.error || assetsQuery.error,
    assets: assetsQuery.data || [],
    isAssetsLoading: assetsQuery.isLoading,
    assetsError: assetsQuery.error,
  };
};