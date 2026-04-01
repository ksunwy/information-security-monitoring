import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { fetchAssets } from './useAssets';
import type { AdminAssetStats, AdminRecentVulnerability, AdminVulnDistribution, Asset } from '../types';

export type AdminVulnDynamics = {
  date: string;
  count: number;
}[];

export const useAdminDashboard = () => {
  const distribution = useQuery<AdminVulnDistribution>({
    queryKey: ['vuln-distribution'],
    queryFn: () => api.get('/dashboards/vuln-distribution').then(res => res.data),
  });

  const stats = useQuery<AdminAssetStats>({
    queryKey: ['asset-stats'],
    queryFn: () => api.get('/dashboards/asset-stats').then(res => res.data),
  });

  const dynamics = useQuery<AdminVulnDynamics>({
    queryKey: ['vuln-dynamics'],
    queryFn: () => api.get('/dashboards/vuln-dynamics').then(res => res.data),
  });

  const recentVulns = useQuery<AdminRecentVulnerability[]>({
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