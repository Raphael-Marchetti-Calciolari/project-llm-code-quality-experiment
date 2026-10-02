import { useEffect, useState } from 'react';
import { api } from '../api.js';

const FIELDS = [
  ['storeName', 'Nome da loja'],
  ['headline', 'Título principal'],
  ['subtitle', 'Subtítulo'],
  ['whatsapp', 'Número de WhatsApp (com DDI e DDD)'],
];

export default function AdminStore() {
  const [form, setForm] = useState(null);
  const [message, setMessage] = useState({ text: '', error: false });

  useEffect(() => { api('/store').then(setForm); }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      setForm(await api('/admin/store', { method: 'PUT', body: form }));
      setMessage({ text: 'Configurações salvas.', error: false });
    } catch (err) {
      setMessage({ text: err.message, error: true });
    }
  };

  if (!form) return <p>Carregando…</p>;
  return (
    <form className="form" onSubmit={submit}>
      <h1>Configurações da vitrine</h1>
      {FIELDS.map(([key, label]) => (
        <label key={key}>{label}
          <input data-testid={`store-${key}`} value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
        </label>
      ))}
      {message.text && <p role={message.error ? 'alert' : 'status'} className={message.error ? 'error' : 'ok'}>{message.text}</p>}
      <button type="submit" data-testid="store-save">Salvar</button>
    </form>
  );
}
