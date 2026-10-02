import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useFetch } from '../useFetch.js';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loading from '../components/Loading.jsx';

export default function AdminProducts() {
  const { data: products, error: loadError, loading, reload } = useFetch('/admin/products');
  const [actionError, setActionError] = useState('');

  const runAndReload = async (action) => {
    try {
      await action();
      setActionError('');
      reload();
    } catch (err) {
      setActionError(err.message);
    }
  };

  const toggle = (product) => () => runAndReload(() =>
    api(`/admin/products/${encodeURIComponent(product.id)}/active`, { method: 'PATCH', body: { active: !product.active } }));

  const remove = (product) => () => {
    if (!window.confirm(`Excluir "${product.name}"?`)) return;
    return runAndReload(() => api(`/admin/products/${encodeURIComponent(product.id)}`, { method: 'DELETE' }));
  };

  if (loading && !products) return <Loading />;
  if (!products) return <ErrorMessage message={loadError?.message} />;

  return (
    <>
      <h1>Produtos</h1>
      <ErrorMessage message={actionError} />
      <table>
        <thead>
          <tr><th>Nome</th><th>Preço</th><th>Status</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} data-testid={`admin-product-row-${product.slug}`}>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.active ? 'Ativo' : 'Inativo'}</td>
              <td className="actions">
                <Link to={`/admin/produtos/${product.id}/editar`} data-testid={`product-edit-${product.slug}`}>Editar</Link>
                <button data-testid={`product-toggle-active-${product.slug}`} onClick={toggle(product)}>
                  {product.active ? 'Inativar' : 'Ativar'}
                </button>
                <button data-testid={`product-delete-${product.slug}`} onClick={remove(product)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
