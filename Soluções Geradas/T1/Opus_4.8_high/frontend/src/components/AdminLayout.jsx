import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * Layout da área administrativa, com navegação e ação de sair.
 */
export function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/admin/login', { replace: true });
  }

  return (
    <div className="admin">
      <header className="admin__header">
        <div className="container admin__header-inner">
          <span className="admin__title">Administração</span>
          <nav className="admin__nav">
            <NavLink to="/admin/produtos" className="admin__nav-link">
              Produtos
            </NavLink>
            <NavLink to="/admin/configuracoes" className="admin__nav-link">
              Configurações
            </NavLink>
            <a href="/" className="admin__nav-link" target="_blank" rel="noreferrer">
              Ver vitrine
            </a>
          </nav>
          <button type="button" className="btn btn--ghost" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </header>

      <main className="container admin__main">
        <Outlet />
      </main>
    </div>
  );
}
