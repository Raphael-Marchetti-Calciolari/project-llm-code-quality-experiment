import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  fetchAdminProduct,
  createProduct,
  updateProduct,
} from '../../api/products.js';
import { Loading, ErrorMessage } from '../../components/Feedback.jsx';

const EMPTY_FORM = {
  name: '',
  slug: '',
  shortDescription: '',
  fullDescription: '',
  price: '',
  imageUrl: '',
  active: true,
};

/**
 * Formulário de criação e edição de produto.
 * O modo é definido pela presença do parâmetro :id na rota.
 */
export function AdminProductFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) return;
    fetchAdminProduct(id)
      .then((product) => {
        setForm({
          name: product.name || '',
          slug: product.slug || '',
          shortDescription: product.shortDescription || '',
          fullDescription: product.fullDescription || '',
          price: product.price || '',
          imageUrl: product.imageUrl || '',
          active: product.active,
        });
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isEditing) {
        await updateProduct(id, form);
      } else {
        await createProduct(form);
      }
      navigate('/admin/produtos');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <div className="form-page">
      <div className="page-header">
        <h1>{isEditing ? 'Editar produto' : 'Novo produto'}</h1>
        <Link to="/admin/produtos" className="btn btn--ghost">
          Voltar
        </Link>
      </div>

      <ErrorMessage message={error} />

      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span>Nome *</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />
        </label>

        <label className="field">
          <span>Identificador para URL (slug)</span>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => updateField('slug', e.target.value)}
            placeholder="Deixe em branco para gerar a partir do nome"
          />
        </label>

        <label className="field">
          <span>Descrição curta</span>
          <input
            type="text"
            value={form.shortDescription}
            onChange={(e) => updateField('shortDescription', e.target.value)}
          />
        </label>

        <label className="field">
          <span>Descrição completa</span>
          <textarea
            rows="5"
            value={form.fullDescription}
            onChange={(e) => updateField('fullDescription', e.target.value)}
          />
        </label>

        <label className="field">
          <span>Preço (texto)</span>
          <input
            type="text"
            value={form.price}
            onChange={(e) => updateField('price', e.target.value)}
            placeholder="Ex.: R$ 99,90"
          />
        </label>

        <label className="field">
          <span>URL da imagem</span>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => updateField('imageUrl', e.target.value)}
            placeholder="https://..."
          />
        </label>

        {form.imageUrl && (
          <div className="form__preview">
            <img src={form.imageUrl} alt="Pré-visualização" />
          </div>
        )}

        <label className="field field--checkbox">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => updateField('active', e.target.checked)}
          />
          <span>Produto ativo (visível na vitrine)</span>
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
