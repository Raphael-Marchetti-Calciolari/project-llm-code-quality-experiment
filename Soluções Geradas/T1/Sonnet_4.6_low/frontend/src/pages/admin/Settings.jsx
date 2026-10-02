import { useEffect, useState } from 'react';
import { api } from '../../api.js';
import AdminLayout from '../../components/AdminLayout.jsx';

export default function AdminSettings() {
  const [form, setForm] = useState({
    nomeLoja: '',
    tituloPrincipal: '',
    subtitulo: '',
    whatsapp: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getSettings().then((s) => {
      setForm({
        nomeLoja: s.nomeLoja,
        tituloPrincipal: s.tituloPrincipal,
        subtitulo: s.subtitulo,
        whatsapp: s.whatsapp,
      });
      setLoading(false);
    });
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      await api.adminUpdateSettings(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <AdminLayout>
      <h1>Configurações da vitrine</h1>

      {loading ? (
        <p>Carregando…</p>
      ) : (
        <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
          {error && <p className="error-msg">{error}</p>}
          {success && <p style={{ color: '#155724', marginBottom: '1rem' }}>Configurações salvas com sucesso!</p>}

          <div className="form-group">
            <label>Nome da loja</label>
            <input name="nomeLoja" value={form.nomeLoja} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Título principal</label>
            <input name="tituloPrincipal" value={form.tituloPrincipal} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Subtítulo</label>
            <input name="subtitulo" value={form.subtitulo} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>WhatsApp (somente números, com DDD e código do país)</label>
            <input
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="5511912345678"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      )}
    </AdminLayout>
  );
}
