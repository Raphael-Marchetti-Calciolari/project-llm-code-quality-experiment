import { request } from './client.js';

/* Área pública */

export function fetchPublicProducts() {
  return request('/products');
}

export function fetchPublicProduct(slug) {
  return request(`/products/${slug}`);
}

/* Área administrativa */

export function fetchAdminProducts() {
  return request('/admin/products', { auth: true });
}

export function fetchAdminProduct(id) {
  return request(`/admin/products/${id}`, { auth: true });
}

export function createProduct(data) {
  return request('/admin/products', { method: 'POST', body: data, auth: true });
}

export function updateProduct(id, data) {
  return request(`/admin/products/${id}`, { method: 'PUT', body: data, auth: true });
}

export function toggleProduct(id) {
  return request(`/admin/products/${id}/toggle`, { method: 'PATCH', auth: true });
}

export function deleteProduct(id) {
  return request(`/admin/products/${id}`, { method: 'DELETE', auth: true });
}
