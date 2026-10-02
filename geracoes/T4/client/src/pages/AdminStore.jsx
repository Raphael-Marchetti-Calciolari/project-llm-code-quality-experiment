import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useFetch } from '../useFetch.js';
import { useSubmit } from '../useSubmit.js';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loading from '../components/Loading.jsx';

const FIELDS = [
  ['storeName', 'Nome da loja'],
  ['headline', 'Título principal'],
  ['subtitle', 'Subtítulo'],
  ['whatsapp', 'Número de WhatsApp (com DDI e DDD)'],
];

export default function AdminStore() {
  const { data: store, error: loadError, loading } = useFetch('/store');
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (store) setForm(store); }, [store]);

  const { submit, error: saveError } = useSubmit(async () => {
    setSaved(false);
    setForm(await api('/admin/store', { method: 'PUT', body: form }));
    setSaved(true);
  });

  if (loadError) return <ErrorMessage message={loadError.message} />;
  if (loading || !form) return <Loading />;
  return (
    <form className="form" onSubmit={submit}>
      <h1>Configurações da vitrine</h1>
      {FIELDS.map(([key, label]) => (
        <label key={key}>{label}
          <input data-testid={`store-${key}`} value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        </label>
      ))}
      <ErrorMessage message={saveError} />
      {saved && !saveError && <p role="status" className="ok">Configurações salvas.</p>}
      <button type="submit" data-testid="store-save">Salvar</button>
    </form>
  );
}
