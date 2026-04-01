import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { Asset } from '../types';

const fetchAsset = async (id: string): Promise<Asset> => {
  const res = await api.get(`/assets/${id}`);
  return res.data;
};

const scanAsset = async (id: number): Promise<void> => {
  await api.post(`/scans/${id}`);
};

const getReportPDF = async (id: number): Promise<void> => {
  try {
    const response = await api.get(`/reports/pdf/${id}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `asset_${id}_report.pdf`);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Ошибка при скачивании PDF:', error);
    throw error;
  }
};

const getReportCSV = async (id: number): Promise<void> => {
  try {
    const response = await api.get(`/reports/csv/${id}`, {
      responseType: 'blob',
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vulnerabilities_asset_${id}.csv`);
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Ошибка при скачивании CSV:', error);
    throw error;
  }
};

const deleteAsset = async (id: number): Promise<void> => {
  await api.delete(`/assets/${id}`);
};

const updateAsset = async (id: number, data: { name: string; description?: string }) => {
  const res = await api.put(`/assets/${id}`, data);
  return res.data;
};

export const useAssetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const query = useQuery<Asset>({
    queryKey: ['asset', id],
    queryFn: () => fetchAsset(id!),
    enabled: !!id,
  });

  const scanMutation = useMutation({
    mutationFn: () => scanAsset(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset', id] });
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Ошибка при запуске сканирования';

      alert(Array.isArray(message) ? message.join('\n') : message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAsset(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['assets'] });
      navigate('/assets');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      updateAsset(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['asset', id] });
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Ошибка обновления';

      alert(Array.isArray(message) ? message.join('\n') : message);
    },
  });

  return {
    id,
    asset: query.data,
    isLoading: query.isLoading,
    error: query.error,
    scanMutation,
    navigate,
    getReportPDF,
    getReportCSV,
    deleteMutation,
    updateMutation,
  };
};