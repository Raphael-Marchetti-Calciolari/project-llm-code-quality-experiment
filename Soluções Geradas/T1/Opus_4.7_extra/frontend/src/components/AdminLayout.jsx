import { Link, useNavigate, useLocation } from 'react-router-dom';
import { clearToken } from '../auth.js';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    clearToken();
    navigate('/admin/login');
  }

  function isActive(prefix) {
    return location.pathname.startsWith(prefix) ? 'active' : '';
  }

  return (
    <div className="admin-layout">
      <nav className="admin-nav">
        <div className="admin-nav-brand">
          <Link to="/admin/produtos">Painel administrativo</Link>
        </div>
        <div className="admin-nav-links">
          <Link to="/admin/produtos" className={isActive('/admin/produtos')}>Produtos</Link>
          <Link to="/admin/vitrine" className={isActive('/admin/vitrine')}>Vitrine</Link>
          <Link to="/" className="admin-nav-secondary">Ver vitrine</Link>
          <button onClick={handleLogout} className="admin-nav-logout">Sair</button>
        </div>
      </nav>
      <main className="admin-content">{children}</main>
    </div>
  );
}
