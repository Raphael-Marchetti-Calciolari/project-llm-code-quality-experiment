import { useEffect } from 'react';
import { Link, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { UNAUTHORIZED_EVENT, clearToken, getToken } from '../api.js';

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirectToLogin = () => navigate('/admin/login');
    window.addEventListener(UNAUTHORIZED_EVENT, redirectToLogin);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, redirectToLogin);
  }, [navigate]);

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
