/**
 * Cliente HTTP simples baseado em fetch.
 * Centraliza a URL base, o envio do token JWT e o tratamento de erros,
 * evitando a necessidade de uma biblioteca externa de requisições.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const TOKEN_KEY = 'catalogo_admin_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

/**
 * Executa uma requisição à API.
 * @param {string} path - caminho relativo (ex.: "/products").
 * @param {object} options - { method, body, auth }.
 */
export async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (auth) {
    const token = getToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  // 204 No Content (ex.: exclusão) não possui corpo.
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || 'Ocorreu um erro inesperado.';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}
