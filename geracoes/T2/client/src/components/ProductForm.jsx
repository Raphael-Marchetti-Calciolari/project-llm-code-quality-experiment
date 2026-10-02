import { useState } from 'react';

const EMPTY = { name: '', slug: '', shortDescription: '', description: '', price: '', imageUrl: '', active: true };

export default function ProductForm({ initial = EMPTY, onSubmit }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [error, setError] = useState('');

  const set = (field) => (e) =>
    setForm({ ...form, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="form" onSubmit={submit}>
      <label>Nome
        <input data-testid="product-name" value={form.name} onChange={set('name')} />
      </label>
      <label>Slug (opcional, gerado a partir do nome)
        <input data-testid="product-slug" value={form.slug} onChange={set('slug')} />
      </label>
      <label>Descrição curta
        <input data-testid="product-short-description" value={form.shortDescription} onChange={set('shortDescription')} />
      </label>
      <label>Descrição completa
        <textarea data-testid="product-description" rows={5} value={form.description} onChange={set('description')} />
      </label>
      <label>Preço
        <input data-testid="product-price" value={form.price} onChange={set('price')} />
      </label>
      <label>URL da imagem
        <input data-testid="product-image-url" value={form.imageUrl} onChange={set('imageUrl')} />
      </label>
      <label className="check">
        <input type="checkbox" data-testid="product-active" checked={form.active} onChange={set('active')} /> Ativo
      </label>
      {error && <p role="alert" className="error">{error}</p>}
      <button type="submit" data-testid="product-save">Salvar</button>
    </form>
  );
}
