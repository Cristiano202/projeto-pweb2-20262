import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = String(error.config?.url || '');
    const ehRotaAuth = url.includes('/auth/login') || url.includes('/auth/cadastro');

    if (status === 401 && !ehRotaAuth) {
      const perfilAnterior = localStorage.getItem('perfil');

      localStorage.removeItem('token');
      localStorage.removeItem('perfil');
      localStorage.removeItem('usuario');

      const destino = perfilAnterior === 'ADMIN' ? '/admin/login' : '/login';
      if (window.location.pathname !== destino) {
        window.location.replace(destino);
      }
    }

    return Promise.reject(error);
  }
);