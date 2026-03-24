import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../lib/api';
import type { FormDataAsset } from '../types';

const createAsset = async (data: FormDataAsset) => {
  const res = await api.post('/assets', data);
  return res.data;
};

export const useAssetNew = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormDataAsset>({
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

  const isValidIP = (value: string) => {
    const ipRegex =
      /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/;
    return ipRegex.test(value);
  };

  const isValidDomain = (value: string) => {
    const domainRegex =
      /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.[A-Za-z]{2,}$/;
    return domainRegex.test(value);
  };

  const isValidName = (value: string) => {
    return /^[a-zA-Zа-яА-ЯёЁ0-9\s-]{3,50}$/.test(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    const newErrors: string[] = [];

    const ip = form.ip.trim();
    const name = form.name.trim();

    if (!ip) {
      newErrors.push('IP/Домен обязателен');
    } else if (!isValidIP(ip) && !isValidDomain(ip)) {
      newErrors.push('Введите корректный IP или домен (example.com)');
    }

    if (!name) {
      newErrors.push('Имя обязательно');
    } else if (!isValidName(name)) {
      newErrors.push('Имя должно быть от 3 до 50 символов (буквы, цифры, пробел, -)');
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    mutation.mutate({
      ...form,
      ip,
      name,
    });
  };

  const handleChange = (field: keyof FormDataAsset) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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