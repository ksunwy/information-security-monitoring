import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';

export const useVulnAnalytics = () => {
  return useQuery({
    queryKey: ['vuln-analytics'],
    queryFn: () => api.get('/analytics/vulnerabilities').then(res => res.data),
  });
};

export const useAssetAnalytics = () => {
  return useQuery({
    queryKey: ['asset-analytics'],
    queryFn: () => api.get('/analytics/assets').then(res => res.data),
  });
};

export const useTrendsAnalytics = () => {
  return useQuery({
    queryKey: ['trends-analytics'],
    queryFn: () => api.get('/analytics/trends').then(res => res.data),
  });
};

export const useReportAnalytics = (userId: number) => {
  return useQuery({
    queryKey: ['report-analytics', userId],
    queryFn: () => api.get('/analytics/reports', { params: { userId } }).then(res => res.data),
  });
};