import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import type { FormData } from '../types';

const createUser = async (data: FormData) => {
  const res = await api.post('/users', data);
  return res.data;
};

export const useUserCreate = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    email: '',
    login: '',
    name: '',
    password: '',
    role: 'observer',
  });

  const [errors, setErrors] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      navigate('/admin/users');
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || ['Ошибка при создании пользователя'];
      setErrors(Array.isArray(message) ? message : [message]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const newErrors: string[] = [];

    if (!form.email.trim()) newErrors.push('Email обязателен');
    if (!form.login.trim()) newErrors.push('Логин обязателен');
    if (!form.name.trim()) newErrors.push('Имя обязательно');
    if (!form.password.trim()) newErrors.push('Пароль обязателен');
    if (form.password.length < 6) newErrors.push('Пароль должен быть минимум 6 символов');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    mutation.mutate(form);
  };

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  return {
    form,
    errors,
    isPending: mutation.isPending,
    handleSubmit,
    handleChange,
    navigateBack: () => navigate(-1),
  };
};