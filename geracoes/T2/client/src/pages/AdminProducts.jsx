import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api.js';

export default function AdminProducts() {
  const [products, setProducts] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const load = useCallback(
    () => api('/admin/products').then(setProducts).catch((err) => {
      setError(err.message);
      if (err.message === 'Não autorizado') navigate('/admin/login');
    }),
    [navigate],
  );
  useEffect(() => { load(); }, [load]);

  const run = (action) => async () => {
    try {
      await action();
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggle = (p) => run(() => api(`/admin/products/${p.id}/active`, { method: 'PATCH', body: { active: !p.active } }));
  const remove = (p) => run(async () => {
    if (window.confirm(`Excluir "${p.name}"?`)) await api(`/admin/products/${p.id}`, { method: 'DELETE' });
  });

  if (!products) return <p>{error || 'Carregando…'}</p>;

  return (
    <>
      <h1>Produtos</h1>
      {error && <p role="alert" className="error">{error}</p>}
      <table>
        <thead>
          <tr><th>Nome</th><th>Preço</th><th>Status</th><th>Ações</th></tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} data-testid={`admin-product-row-${p.slug}`}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.active ? 'Ativo' : 'Inativo'}</td>
              <td className="actions">
                <Link to={`/admin/produtos/${p.id}/editar`} data-testid={`product-edit-${p.slug}`}>Editar</Link>
                <button data-testid={`product-toggle-active-${p.slug}`} onClick={toggle(p)}>
                  {p.active ? 'Inativar' : 'Ativar'}
                </button>
                <button data-testid={`product-delete-${p.slug}`} onClick={remove(p)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
