import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import type { LogEntry } from '../types';

const fetchLogs = async (type?: 'scan' | 'user_activity'): Promise<LogEntry[]> => {
  const url = type ? `/logs?type=${type}` : '/logs';
  const res = await api.get(url);
  return res.data;
};

export const useLogs = (type?: 'scan' | 'user_activity') => {
  const { data: logs = [], isLoading, error } = useQuery<LogEntry[]>({
    queryKey: ['logs', type],
    queryFn: () => fetchLogs(type),
  });

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const searchLower = search.toLowerCase();
      return (
        log.message.toLowerCase().includes(searchLower) ||
        (log.user?.name?.toLowerCase().includes(searchLower)) ||
        (log.user?.login?.toLowerCase().includes(searchLower))
      );
    });
  }, [logs, search]);

  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, page]);

  const totalPages = Math.ceil(filteredLogs.length / pageSize);

  return {
    logs: paginatedLogs,
    totalLogs: filteredLogs.length,
    totalPages,
    currentPage: page,
    setPage,
    search,
    setSearch,
    isLoading,
    error,
  };
};