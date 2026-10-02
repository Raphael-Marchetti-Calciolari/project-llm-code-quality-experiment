import { NavLink, useNavigate } from 'react-router-dom';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    navigate('/admin/login');
  }

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Painel Admin</h2>
        <NavLink to="/admin/produtos" className={({ isActive }) => isActive ? 'active' : ''}>
          Produtos
        </NavLink>
        <NavLink to="/admin/configuracoes" className={({ isActive }) => isActive ? 'active' : ''}>
          Configurações
        </NavLink>
        <NavLink to="/" target="_blank">Ver vitrine ↗</NavLink>
        <button onClick={logout} style={{ marginTop: 'auto' }}>Sair</button>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
