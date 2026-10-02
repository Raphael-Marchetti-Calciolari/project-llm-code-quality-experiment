import { request } from './client.js';

export function fetchSettings() {
  return request('/settings');
}

export function updateSettings(data) {
  return request('/admin/settings', { method: 'PUT', body: data, auth: true });
}
