import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import type { FetchUsersParams, User } from '../types';

const fetchUsers = async (params: FetchUsersParams = {}): Promise<User[]> => {
  const queryParams = new URLSearchParams();
  
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
  if (params.search) queryParams.append('search', params.search);
  if (params.role) queryParams.append('role', params.role);
  
  const url = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  const res = await api.get(url);
  return res.data;
};

const updateUser = async ({ id, dto }: { id: number; dto: Partial<User> }) => {
  const res = await api.put(`/users/${id}`, dto);
  return res.data;
};

const deleteUser = async (id: number) => {
  await api.delete(`/users/${id}`);
};

export const useUsersAdmin = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sortBy, setSortBy] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('ASC');

  const { data: users = [], isLoading, error, isFetching } = useQuery<User[]>({
    queryKey: ['users', { sortBy, sortOrder, search, role: roleFilter }],
    queryFn: () => fetchUsers({ 
      sortBy, 
      sortOrder, 
      search: search || undefined, 
      role: roleFilter || undefined 
    }),
    placeholderData: (previousData) => previousData, 
  });

  const updateMutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setEditForm({ ...user }); 
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId || !editForm) return;

    const changes: Partial<User> = {};
    if (editForm.name !== undefined) changes.name = editForm.name;
    if (editForm.email !== undefined) changes.email = editForm.email;
    if (editForm.role !== undefined) changes.role = editForm.role;

    if (Object.keys(changes).length === 0) {
      cancelEdit();
      return;
    }

    await updateMutation.mutateAsync({ id: editingId, dto: changes });
    cancelEdit();
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      setSortBy(column);
      setSortOrder('ASC');
    }
  };

  return {
    users,
    isLoading: isLoading && !users.length, 
    isFetching, 
    error,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    sortBy,
    sortOrder,
    handleSort,
    editingId,
    editForm,
    setEditForm,
    startEdit,
    cancelEdit,
    saveEdit,
    deleteUser: deleteMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};