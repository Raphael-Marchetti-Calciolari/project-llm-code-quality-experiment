import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import AdminLayout from "../components/AdminLayout.jsx";
import ErrorMessage from "../components/ErrorMessage.jsx";
import SettingsForm from "../components/SettingsForm.jsx";
import { useAsync } from "../hooks/useAsync.js";

export default function AdminDashboard() {
  const products = useAsync(api.adminGetProducts);
  const [error, setError] = useState("");

  async function runWithErrorHandling(action) {
    setError("");
    try {
      await action();
    } catch (err) {
      setError(err.message);
    }
  }

  const toggleProductActive = (product) =>
    runWithErrorHandling(async () => {
      const updated = await api.adminUpdateProduct(product._id, { active: !product.active });
      products.setData((items) => items.map((item) => (item._id === product._id ? updated : item)));
    });

  const deleteProduct = (product) => {
    if (!window.confirm(`Excluir "${product.name}"?`)) return;
    runWithErrorHandling(async () => {
      await api.adminDeleteProduct(product._id);
      products.setData((items) => items.filter((item) => item._id !== product._id));
    });
  };

  return (
    <AdminLayout title="Produtos">
      <ErrorMessage>{error}</ErrorMessage>
      {products.loading && <p>Carregando...</p>}
      <ErrorMessage>{products.error?.message}</ErrorMessage>
      {products.data && (
        <table>
          <thead>
            <tr><th>Nome</th><th>Slug</th><th>Preço</th><th>Status</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {products.data.map((product) => (
              <tr key={product._id} data-testid={`admin-product-row-${product.slug}`}>
                <td>{product.name}</td>
                <td>{product.slug}</td>
                <td>{product.price}</td>
                <td>{product.active ? "Ativo" : "Inativo"}</td>
                <td className="actions">
                  <Link to={`/admin/produtos/${product._id}/editar`} data-testid={`product-edit-${product.slug}`}>Editar</Link>
                  <button data-testid={`product-toggle-active-${product.slug}`} onClick={() => toggleProductActive(product)}>
                    {product.active ? "Inativar" : "Ativar"}
                  </button>
                  <button data-testid={`product-delete-${product.slug}`} className="danger" onClick={() => deleteProduct(product)}>Excluir</button>
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
