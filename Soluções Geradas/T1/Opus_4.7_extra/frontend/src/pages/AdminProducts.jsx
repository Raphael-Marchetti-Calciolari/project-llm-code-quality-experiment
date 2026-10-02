import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout.jsx';
import { api } from '../api.js';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.admin.listProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleToggle(id) {
    try {
      await api.admin.toggleProduct(id);
      await load();
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleDelete(id, name) {
    if (!window.confirm(`Excluir o produto "${name}"?`)) return;
    try {
      await api.admin.deleteProduct(id);
      await load();
    } catch (err) {
      alert(err.message);
    }
  }

  return (
    <AdminLayout>
      <div className="admin-toolbar">
        <h1>Produtos</h1>
        <Link to="/admin/produtos/novo" className="button-primary">
          Novo produto
        </Link>
      </div>

      {loading && <p>Carregando...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        products.length === 0 ? (
          <p>Nenhum produto cadastrado ainda.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Identificador</th>
                <th>Preço</th>
                <th>Status</th>
                <th className="admin-actions-col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td><code>{product.slug}</code></td>
                  <td>{product.price}</td>
                  <td>
                    <span className={product.active ? 'badge badge-active' : 'badge badge-inactive'}>
                      {product.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="admin-actions">
                    <Link to={`/admin/produtos/${product._id}/editar`}>Editar</Link>
                    <button type="button" onClick={() => handleToggle(product._id)}>
                      {product.active ? 'Inativar' : 'Ativar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(product._id, product.name)}
                      className="danger"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      )}
    </AdminLayout>
  );
}
