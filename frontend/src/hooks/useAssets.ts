import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Asset } from '../types';

export const fetchAssets = async (): Promise<Asset[]> => {
  const res = await api.get('/assets');
  return (res.data as any[]).map((asset: any) => {

    const lastScan = asset.scans?.[0]?.updatedAt ? new Date(asset.scans[0].updatedAt).toLocaleString() : 'Никогда';
    const status = asset.scans?.length ? 'Онлайн' : 'Оффлайн';

    return {
      ...asset,
      criticality: asset.criticality,
      status,
      lastScan,
      group: asset.group || 'Без группы',
      owner: asset.owner || 'Не указан',
    } as Asset;
  });
};

const scanAsset = async (id: number): Promise<void> => {
  await api.post(`/scans/${id}`);
};

export const useAssets = () => {
  const queryClient = useQueryClient();

  const { data: assets = [], isLoading, error } = useQuery<Asset[]>({
    queryKey: ['assets'],
    queryFn: fetchAssets,
  });

  const scanMutation = useMutation({
    mutationFn: scanAsset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
    },
  });

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    group: '',
    criticality: '',
    owner: '',
    status: '',
  });

  const [sort, setSort] = useState<{ key: keyof Asset; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc',
  });

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        asset.ip.toLowerCase().includes(searchLower) ||
        asset.name.toLowerCase().includes(searchLower);

      const matchesFilters =
        (!filters.group || asset.group === filters.group) &&
        (!filters.criticality || asset.criticality === filters.criticality) &&
        (!filters.owner || asset.owner === filters.owner) &&
        (!filters.status || asset.status === filters.status);

      return matchesSearch && matchesFilters;
    });
  }, [assets, search, filters]);

  const sortedAssets = useMemo(() => {
    return [...filteredAssets].sort((a, b) => {
      const key = sort.key;
      const aVal = a[key] ?? '';
      const bVal = b[key] ?? '';

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sort.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      if (aVal < bVal) return sort.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredAssets, sort]);

  const toggleSort = (key: keyof Asset) => {
    setSort((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return {
    assets: sortedAssets,
    isLoading,
    error,
    search,
    setSearch,
    filters,
    setFilters,
    sort,
    toggleSort,
    scanAsset: scanMutation.mutate,
    isScanning: scanMutation.isPending,
  };
};