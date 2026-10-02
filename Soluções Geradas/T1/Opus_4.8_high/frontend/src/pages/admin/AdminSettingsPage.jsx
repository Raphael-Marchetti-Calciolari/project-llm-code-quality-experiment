import { useEffect, useState } from 'react';
import { fetchSettings, updateSettings } from '../../api/settings.js';
import { Loading, ErrorMessage } from '../../components/Feedback.jsx';

const EMPTY_FORM = {
  storeName: '',
  mainTitle: '',
  subtitle: '',
  whatsappNumber: '',
};

/**
 * Tela de edição das configurações principais da vitrine.
 */
export function AdminSettingsPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then((settings) => {
        setForm({
          storeName: settings.storeName || '',
          mainTitle: settings.mainTitle || '',
          subtitle: settings.subtitle || '',
          whatsappNumber: settings.whatsappNumber || '',
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await updateSettings(form);
      setSuccess('Configurações salvas com sucesso.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="form-page">
      <div className="page-header">
        <h1>Configurações da vitrine</h1>
      </div>

      <ErrorMessage message={error} />
      {success && <p className="feedback feedback--success">{success}</p>}

      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Nome da loja</span>
          <input
            type="text"
            value={form.storeName}
            onChange={(e) => updateField('storeName', e.target.value)}
          />
        </label>

        <label className="field">
          <span>Título principal</span>
          <input
            type="text"
            value={form.mainTitle}
            onChange={(e) => updateField('mainTitle', e.target.value)}
          />
        </label>

        <label className="field">
          <span>Subtítulo</span>
          <input
            type="text"
            value={form.subtitle}
            onChange={(e) => updateField('subtitle', e.target.value)}
          />
        </label>

        <label className="field">
          <span>Número de WhatsApp (com DDI e DDD)</span>
          <input
            type="text"
            value={form.whatsappNumber}
            onChange={(e) => updateField('whatsappNumber', e.target.value)}
            placeholder="Ex.: 5511999999999"
          />
        </label>

        <div className="form__actions">
          <button type="submit" className="btn btn--primary" disabled={submitting}>
            {submitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}
