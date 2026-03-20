import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';

interface FormData {
  ip: string;
  name: string;
  description: string;
}

const createAsset = async (data: FormData) => {
  const res = await api.post('/assets', data);
  return res.data;
};

export const useAssetNew = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    ip: '',
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState<string[]>([]);

  const mutation = useMutation({
    mutationFn: createAsset,
    onSuccess: () => {
      navigate('/assets');
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || ['Ошибка при создании актива'];
      setErrors(Array.isArray(message) ? message : [message]);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const newErrors: string[] = [];

    if (!form.ip.trim()) newErrors.push('IP/Домен обязателен');
    if (!form.name.trim()) newErrors.push('Имя обязательно');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    mutation.mutate(form);
  };

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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