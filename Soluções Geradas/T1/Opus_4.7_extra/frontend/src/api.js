import { getToken, clearToken } from './auth.js';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api';

async function request(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearToken();
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = (data && data.error) || `Erro na requisição (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export const api = {
  getShowcase: () => request('/showcase'),
  getProducts: () => request('/products'),
  getProduct: (slug) => request(`/products/${encodeURIComponent(slug)}`),
  login: (username, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    }),
  admin: {
    listProducts: () => request('/admin/products'),
    getProduct: (id) => request(`/admin/products/${id}`),
    createProduct: (data) =>
      request('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
    updateProduct: (id, data) =>
      request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    toggleProduct: (id) =>
      request(`/admin/products/${id}/toggle`, { method: 'PATCH' }),
    deleteProduct: (id) =>
      request(`/admin/products/${id}`, { method: 'DELETE' }),
    getShowcase: () => request('/admin/showcase'),
    updateShowcase: (data) =>
      request('/admin/showcase', { method: 'PUT', body: JSON.stringify(data) })
  }
};
