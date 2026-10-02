const TOKEN_KEY = 'admin-token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const UNAUTHORIZED_EVENT = 'admin-unauthorized';

async function parseBody(res) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

function requestError(message, status) {
  return Object.assign(new Error(message), { status });
}

export async function api(path, { method = 'GET', body } = {}) {
  const token = getToken();
  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw requestError('Falha de conexão com o servidor');
  }
  if (res.status === 204) return null;
  const data = await parseBody(res);
  if (!res.ok) {
    if (res.status === 401) {
      clearToken();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    throw requestError(data?.error || 'Erro na requisição', res.status);
  }
  if (data === null) throw requestError('Resposta inválida do servidor', res.status);
  return data;
}
