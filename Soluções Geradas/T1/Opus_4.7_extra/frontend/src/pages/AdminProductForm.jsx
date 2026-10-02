import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout.jsx';
import { api } from '../api.js';

const EMPTY_FORM = {
  name: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  price: '',
  imageUrl: '',
  active: true
};

function slugify(value) {
  return value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api.admin
      .getProduct(id)
      .then((data) => setForm({ ...EMPTY_FORM, ...data }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleNameBlur() {
    if (!isEdit && !form.slug && form.name) {
      handleChange('slug', slugify(form.name));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = { ...form, slug: slugify(form.slug || form.name) };
      if (isEdit) {
        await api.admin.updateProduct(id, payload);
      } else {
        await api.admin.createProduct(payload);
      }
      navigate('/admin/produtos');
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
      <h1>{isEdit ? 'Editar produto' : 'Novo produto'}</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <label>
          Nome
          <input
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={handleNameBlur}
            required
          />
        </label>
        <label>
          Identificador amigável (slug)
          <input
            value={form.slug}
            onChange={(e) => handleChange('slug', e.target.value)}
            placeholder="exemplo-de-slug"
            required
          />
          <small>Usado na URL pública do produto.</small>
        </label>
        <label>
          Descrição curta
          <input
            value={form.shortDescription}
            onChange={(e) => handleChange('shortDescription', e.target.value)}
            required
          />
        </label>
        <label>
          Descrição completa
          <textarea
            value={form.fullDescription}
            onChange={(e) => handleChange('fullDescription', e.target.value)}
            rows={6}
            required
          />
        </label>
        <label>
          Preço (texto)
          <input
            value={form.price}
            onChange={(e) => handleChange('price', e.target.value)}
            placeholder="R$ 99,90"
            required
          />
        </label>
        <label>
          URL da imagem
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            required
          />
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={!!form.active}
            onChange={(e) => handleChange('active', e.target.checked)}
          />
          Produto ativo na vitrine
        </label>

        {error && <p className="error">{error}</p>}

        <div className="form-actions">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Salvando...' : 'Salvar'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/produtos')}
            className="secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </AdminLayout>
  );
}
