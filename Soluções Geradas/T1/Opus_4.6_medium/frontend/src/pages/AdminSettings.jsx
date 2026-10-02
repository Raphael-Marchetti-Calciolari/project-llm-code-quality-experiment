import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import '../styles.css';

export default function AdminSettings() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ storeName: '', mainTitle: '', subtitle: '', whatsapp: '' });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getAdminSettings().then(setForm).catch(() => {});
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await api.updateSettings(form);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    }
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
        <div style={{ background: '#fff', borderRadius: 8, padding: 30, maxWidth: 600 }}>
          <h2>Configurações da Vitrine</h2>
          {error && <p className="error-msg">{error}</p>}
          {saved && <p style={{ color: '#059669', marginBottom: 12, fontSize: '0.9rem' }}>Configurações salvas!</p>}
          <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            <div className="form-group">
              <label>Nome da loja</label>
              <input name="storeName" value={form.storeName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Título principal</label>
              <input name="mainTitle" value={form.mainTitle} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Subtítulo</label>
              <input name="subtitle" value={form.subtitle} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>WhatsApp (com código do país, ex: 5511999999999)</label>
              <input name="whatsapp" value={form.whatsapp} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Salvar</button>
          </form>
        </div>
      </main>
    </>
  );
}
