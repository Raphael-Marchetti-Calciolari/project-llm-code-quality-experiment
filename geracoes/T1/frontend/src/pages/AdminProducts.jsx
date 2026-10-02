import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, clearToken } from "../api.js";
import AdminLayout from "../components/AdminLayout.jsx";
import { useAsync } from "../components/useAsync.js";
import SettingsForm from "../components/SettingsForm.jsx";

export default function AdminProducts() {
  const navigate = useNavigate();
  const products = useAsync(api.adminGetProducts);
  const [error, setError] = useState("");

  async function run(action) {
    setError("");
    try {
      await action();
    } catch (err) {
      if (err.status === 401) {
        clearToken();
        navigate("/admin/login");
      } else {
        setError(err.message);
      }
    }
  }

  const toggle = (p) =>
    run(async () => {
      const updated = await api.adminUpdateProduct(p._id, { active: !p.active });
      products.setData(products.data.map((x) => (x._id === p._id ? updated : x)));
    });

  const remove = (p) =>
    run(async () => {
      if (!window.confirm(`Excluir "${p.name}"?`)) return;
      await api.adminDeleteProduct(p._id);
      products.setData(products.data.filter((x) => x._id !== p._id));
    });

  return (
    <AdminLayout title="Produtos">
      {error && <p className="error">{error}</p>}
      {products.loading && <p>Carregando...</p>}
      {products.error && <p className="error">{products.error.message}</p>}
      {products.data && (
        <table>
          <thead>
            <tr><th>Nome</th><th>Slug</th><th>Preço</th><th>Status</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {products.data.map((p) => (
              <tr key={p._id} data-testid={`admin-product-row-${p.slug}`}>
                <td>{p.name}</td>
                <td>{p.slug}</td>
                <td>{p.price}</td>
                <td>{p.active ? "Ativo" : "Inativo"}</td>
                <td className="actions">
                  <Link to={`/admin/produtos/${p._id}/editar`} data-testid={`product-edit-${p.slug}`}>Editar</Link>
                  <button data-testid={`product-toggle-active-${p.slug}`} onClick={() => toggle(p)}>
                    {p.active ? "Inativar" : "Ativar"}
                  </button>
                  <button data-testid={`product-delete-${p.slug}`} className="danger" onClick={() => remove(p)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <h2>Configurações da vitrine</h2>
      <SettingsForm />
    </AdminLayout>
  );
}
