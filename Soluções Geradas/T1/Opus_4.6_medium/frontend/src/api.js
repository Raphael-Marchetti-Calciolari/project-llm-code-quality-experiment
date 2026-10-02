const API = 'http://localhost:3001/api';

async function request(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  if (res.status === 401 && path !== '/admin/login') {
    localStorage.removeItem('token');
    window.location.href = '/admin/login';
    return;
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
}

export const api = {
  getSettings: () => request('/settings'),
  getProducts: () => request('/products'),
  getProduct: (slug) => request(`/products/${slug}`),

  login: (email, password) => request('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),

  getAdminProducts: () => request('/admin/products'),
  createProduct: (data) => request('/admin/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateProduct: (id, data) => request(`/admin/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  toggleProduct: (id) => request(`/admin/products/${id}/toggle`, { method: 'PATCH' }),
  deleteProduct: (id) => request(`/admin/products/${id}`, { method: 'DELETE' }),

  getAdminSettings: () => request('/admin/settings'),
  updateSettings: (data) => request('/admin/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
};
