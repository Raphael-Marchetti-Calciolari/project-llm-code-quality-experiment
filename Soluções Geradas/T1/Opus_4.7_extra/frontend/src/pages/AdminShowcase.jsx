import { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout.jsx';
import { api } from '../api.js';

const EMPTY_FORM = {
  storeName: '',
  heading: '',
  subheading: '',
  whatsappNumber: ''
};

export default function AdminShowcase() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.admin
      .getShowcase()
      .then((data) => {
        if (data) setForm({ ...EMPTY_FORM, ...data });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);
    try {
      const updated = await api.admin.updateShowcase(form);
      setForm({ ...EMPTY_FORM, ...updated });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <p>Carregando...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1>Configurações da vitrine</h1>
      <p className="muted">
        Estas informações aparecem na página inicial e são usadas no botão de WhatsApp.
      </p>

      <form onSubmit={handleSubmit} className="admin-form">
        <label>
          Nome da loja
          <input
            value={form.storeName}
            onChange={(e) => handleChange('storeName', e.target.value)}
            required
          />
        </label>
        <label>
          Título principal
          <input
            value={form.heading}
            onChange={(e) => handleChange('heading', e.target.value)}
            required
          />
        </label>
        <label>
          Subtítulo
          <input
            value={form.subheading}
            onChange={(e) => handleChange('subheading', e.target.value)}
            required
          />
        </label>
        <label>
          Número de WhatsApp
          <input
            value={form.whatsappNumber}
            onChange={(e) => handleChange('whatsappNumber', e.target.value)}
            placeholder="5511999999999"
            required
          />
          <small>Apenas dígitos, com código do país e DDD. Ex.: 5511999999999</small>
        </label>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">Configurações salvas com sucesso.</p>}

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Salvando...' : 'Salvar configurações'}
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
