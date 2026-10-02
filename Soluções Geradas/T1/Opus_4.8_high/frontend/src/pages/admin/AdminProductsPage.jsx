import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchAdminProducts,
  toggleProduct,
  deleteProduct,
} from '../../api/products.js';
import { Loading, ErrorMessage, EmptyState } from '../../components/Feedback.jsx';

/**
 * Listagem administrativa de produtos, com ações de ativar/inativar,
 * editar e excluir.
 */
export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError('');
    try {
      setProducts(await fetchAdminProducts());
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
      await toggleProduct(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(`Excluir o produto "${product.name}"?`);
    if (!confirmed) return;
    try {
      await deleteProduct(product._id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Produtos</h1>
        <Link to="/admin/produtos/novo" className="btn btn--primary">
          Novo produto
        </Link>
      </div>

      <ErrorMessage message={error} />

      {loading && <Loading />}

      {!loading && products.length === 0 && (
        <EmptyState message="Nenhum produto cadastrado. Crie o primeiro!" />
      )}

      {!loading && products.length > 0 && (
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Status</th>
                <th className="table__actions-col">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    <strong>{product.name}</strong>
                    <div className="table__sub">{product.slug}</div>
                  </td>
                  <td>{product.price || '—'}</td>
                  <td>
                    <span
                      className={`badge ${product.active ? 'badge--on' : 'badge--off'}`}
                    >
                      {product.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="table__actions">
                    <button
                      type="button"
                      className="btn btn--small btn--ghost"
                      onClick={() => handleToggle(product._id)}
                    >
                      {product.active ? 'Inativar' : 'Ativar'}
                    </button>
                    <Link
                      to={`/admin/produtos/${product._id}/editar`}
                      className="btn btn--small btn--ghost"
                    >
                      Editar
                    </Link>
                    <button
                      type="button"
                      className="btn btn--small btn--danger"
                      onClick={() => handleDelete(product)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
