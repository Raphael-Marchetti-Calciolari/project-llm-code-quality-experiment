import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import '../styles.css';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { loadProducts(); }, []);

  async function loadProducts() {
    const data = await api.getAdminProducts();
    setProducts(data);
  }

  async function handleToggle(id) {
    await api.toggleProduct(id);
    loadProducts();
  }

  async function handleDelete(id) {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    await api.deleteProduct(id);
    loadProducts();
  }

  function logout() {
    localStorage.removeItem('token');
    navigate('/admin/login');
  }

  return (
    <>
      <header className="admin-header">
        <div className="container">
          <h1>Painel Administrativo</h1>
          <nav className="admin-nav">
            <Link to="/admin/produtos">Produtos</Link>
            <Link to="/admin/configuracoes">Configurações</Link>
            <button onClick={logout}>Sair</button>
          </nav>
        </div>
      </header>

      <main className="container">
        <div className="toolbar">
          <h2>Produtos</h2>
          <Link to="/admin/produtos/novo" className="btn btn-primary btn-sm">Novo Produto</Link>
        </div>

        <table className="admin-table">
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
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>
                  <span className={`badge ${p.active ? 'badge-active' : 'badge-inactive'}`}>
                    {p.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
                    <Link to={`/admin/produtos/${p._id}`} className="btn btn-secondary btn-sm">Editar</Link>
                    <button onClick={() => handleToggle(p._id)} className="btn btn-secondary btn-sm">
                      {p.active ? 'Inativar' : 'Ativar'}
                    </button>
                    <button onClick={() => handleDelete(p._id)} className="btn btn-danger btn-sm">Excluir</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
