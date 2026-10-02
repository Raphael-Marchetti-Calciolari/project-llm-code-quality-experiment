import { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { fetchSettings } from '../api/settings.js';
import { Loading, ErrorMessage } from './Feedback.jsx';

/**
 * Layout da área pública.
 * Carrega as configurações da vitrine uma única vez e as disponibiliza
 * para as páginas filhas através do contexto do Outlet.
 */
export function PublicLayout() {
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="public">
      <header className="public__header">
        <div className="container public__header-inner">
          <Link to="/" className="public__brand">
            {settings?.storeName || 'Catálogo'}
          </Link>
          <Link to="/admin" className="public__admin-link">
            Área administrativa
          </Link>
        </div>
      </header>

      <main className="container public__main">
        {loading && <Loading />}
        <ErrorMessage message={error} />
        {!loading && !error && <Outlet context={{ settings }} />}
      </main>

      <footer className="public__footer">
        <div className="container">
          <p>
            © {new Date().getFullYear()} {settings?.storeName || 'Catálogo'}
          </p>
        </div>
      </footer>
    </div>
  );
}
