import { Link, useNavigate } from "react-router-dom";
import { clearToken } from "../api.js";

export default function AdminLayout({ title, children }) {
  const navigate = useNavigate();

  function logout() {
    clearToken();
    navigate("/admin/login");
  }

  return (
    <div className="container">
      <header className="admin-header">
        <nav>
          <Link to="/admin">Produtos</Link>
          <Link to="/admin/produtos/novo">Novo produto</Link>
          <Link to="/">Ver vitrine</Link>
        </nav>
        <button onClick={logout}>Sair</button>
      </header>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
