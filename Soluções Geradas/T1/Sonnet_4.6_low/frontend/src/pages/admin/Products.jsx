import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../api.js';
import AdminLayout from '../../components/AdminLayout.jsx';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await api.adminGetProducts();
    setProducts(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function toggleAtivo(product) {
    await api.adminUpdateProduct(product._id, { ativo: !product.ativo });
    load();
  }

  async function remove(product) {
    if (!confirm(`Excluir "${product.nome}"?`)) return;
    await api.adminDeleteProduct(product._id);
    load();
  }

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ margin: 0 }}>Produtos</h1>
        <Link to="/admin/produtos/novo" className="btn-primary" style={{ padding: '.5rem 1rem', borderRadius: 6, color: '#fff', background: '#3a5f32' }}>
          + Novo produto
        </Link>
      </div>

      {loading ? (
        <p>Carregando…</p>
      ) : products.length === 0 ? (
        <p className="empty">Nenhum produto cadastrado.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>{p.nome}</td>
                  <td>{p.preco}</td>
                  <td>
                    <span className={`badge ${p.ativo ? 'badge-green' : 'badge-gray'}`}>
                      {p.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
                    <Link to={`/admin/produtos/${p._id}/editar`} className="btn-secondary btn-sm">
                      Editar
                    </Link>
                    <button
                      className="btn-secondary btn-sm"
                      onClick={() => toggleAtivo(p)}
                    >
                      {p.ativo ? 'Inativar' : 'Ativar'}
                    </button>
                    <button className="btn-danger btn-sm" onClick={() => remove(p)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
