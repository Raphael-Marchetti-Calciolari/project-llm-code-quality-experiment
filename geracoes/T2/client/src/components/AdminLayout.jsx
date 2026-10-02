import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { clearToken, getToken } from '../api.js';

export default function AdminLayout() {
  const navigate = useNavigate();
  if (!getToken()) return <Navigate to="/admin/login" replace />;

  const logout = () => {
    clearToken();
    navigate('/admin/login');
  };

  return (
    <div className="page">
      <nav className="admin-nav">
        <Link to="/admin">Produtos</Link>
        <Link to="/admin/produtos/novo">Novo produto</Link>
        <Link to="/admin/loja">Vitrine</Link>
        <Link to="/">Ver loja</Link>
        <button onClick={logout}>Sair</button>
      </nav>
      <Outlet />
    </div>
  );
}
