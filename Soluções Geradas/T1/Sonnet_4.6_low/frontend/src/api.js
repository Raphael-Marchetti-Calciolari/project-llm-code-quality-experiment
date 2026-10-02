const BASE = '/api';

function authHeaders() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro desconhecido');
  return data;
}

export const api = {
  // Auth
  login: (usuario, senha) => request('POST', '/auth/login', { usuario, senha }),

  // Público
  getProducts: () => request('GET', '/products'),
  getProductBySlug: (slug) => request('GET', `/products/slug/${slug}`),
  getSettings: () => request('GET', '/settings'),

  // Admin – produtos
  adminGetProducts: () => request('GET', '/products/admin'),
  adminGetProduct: (id) => request('GET', `/products/admin/${id}`),
  adminCreateProduct: (data) => request('POST', '/products', data),
  adminUpdateProduct: (id, data) => request('PUT', `/products/${id}`, data),
  adminDeleteProduct: (id) => request('DELETE', `/products/${id}`),

  // Admin – configurações
  adminUpdateSettings: (data) => request('PUT', '/settings', data),
};
