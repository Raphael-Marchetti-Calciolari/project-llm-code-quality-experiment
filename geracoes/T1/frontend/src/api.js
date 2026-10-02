const TOKEN_KEY = "admin-token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

async function request(path, { method = "GET", body } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`/api${path}`, { method, headers, body: body && JSON.stringify(body) });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.error || "Erro na requisição");
    error.status = res.status;
    throw error;
  }
  return data;
}

export const api = {
  getSettings: () => request("/settings"),
  getProducts: () => request("/products"),
  getProduct: (slug) => request(`/products/${slug}`),

  login: (email, password) => request("/auth/login", { method: "POST", body: { email, password } }),

  adminGetProducts: () => request("/admin/products"),
  adminGetProduct: (id) => request(`/admin/products/${id}`),
  adminCreateProduct: (product) => request("/admin/products", { method: "POST", body: product }),
  adminUpdateProduct: (id, product) => request(`/admin/products/${id}`, { method: "PUT", body: product }),
  adminDeleteProduct: (id) => request(`/admin/products/${id}`, { method: "DELETE" }),
  adminGetSettings: () => request("/admin/settings"),
  adminUpdateSettings: (settings) => request("/admin/settings", { method: "PUT", body: settings }),
};
