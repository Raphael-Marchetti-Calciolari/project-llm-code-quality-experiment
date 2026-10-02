import { useState } from 'react';
import { useSubmit } from '../useSubmit.js';
import ErrorMessage from './ErrorMessage.jsx';

const EMPTY = { name: '', slug: '', shortDescription: '', description: '', price: '', imageUrl: '', active: true };

export default function ProductForm({ initial = EMPTY, onSubmit }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const { submit, error } = useSubmit(() => onSubmit(form));

  return (
    <form className="form" onSubmit={submit}>
      <label>Nome
        <input data-testid="product-name" value={form.name} onChange={handleChange('name')} />
      </label>
      <label>Slug (opcional, gerado a partir do nome)
        <input data-testid="product-slug" value={form.slug} onChange={handleChange('slug')} />
      </label>
      <label>Descrição curta
        <input data-testid="product-short-description" value={form.shortDescription} onChange={handleChange('shortDescription')} />
      </label>
      <label>Descrição completa
        <textarea data-testid="product-description" rows={5} value={form.description} onChange={handleChange('description')} />
      </label>
      <label>Preço
        <input data-testid="product-price" value={form.price} onChange={handleChange('price')} />
      </label>
      <label>URL da imagem
        <input data-testid="product-image-url" value={form.imageUrl} onChange={handleChange('imageUrl')} />
      </label>
      <label className="check">
        <input type="checkbox" data-testid="product-active" checked={form.active} onChange={handleChange('active')} /> Ativo
      </label>
      <ErrorMessage message={error} />
      <button type="submit" data-testid="product-save">Salvar</button>
    </form>
  );
}
