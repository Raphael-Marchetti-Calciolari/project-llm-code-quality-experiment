import { api, getToken, setToken } from '../src/api.js';

afterEach(() => { localStorage.clear(); vi.restoreAllMocks(); });

const mockFetch = (status, body) =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue({ ok: status < 400, status, json: async () => body });

test('envia o token no header Authorization e serializa o corpo', async () => {
  setToken('abc');
  const spy = mockFetch(200, { ok: 1 });
  await api('/admin/store', { method: 'PUT', body: { a: 1 } });
  const [url, opts] = spy.mock.calls[0];
  expect(url).toBe('/api/admin/store');
  expect(opts.headers.Authorization).toBe('Bearer abc');
  expect(opts.body).toBe('{"a":1}');
});

test('lança erro com a mensagem da API', async () => {
  mockFetch(400, { error: 'inválido' });
  await expect(api('/x')).rejects.toThrow('inválido');
});

test('401 limpa o token armazenado', async () => {
  setToken('abc');
  mockFetch(401, { error: 'Não autorizado' });
  await expect(api('/admin/products')).rejects.toThrow();
  expect(getToken()).toBeNull();
});
