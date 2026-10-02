import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { api } from '../../api.js';
import AdminLayout from '../../components/AdminLayout.jsx';

const EMPTY = {
  nome: '',
  slug: '',
  descricaoCurta: '',
  descricaoCompleta: '',
  preco: '',
  imagem: '',
  ativo: true,
};

function toSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [slugManual, setSlugManual] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.adminGetProduct(id).then((p) => {
        setForm(p);
        setSlugManual(true);
      });
    }
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm((prev) => {
      const next = { ...prev, [name]: val };
      if (name === 'nome' && !slugManual) {
        next.slug = toSlug(value);
      }
      if (name === 'slug') setSlugManual(true);
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isEdit) {
        await api.adminUpdateProduct(id, form);
      } else {
        await api.adminCreateProduct(form);
      }
      navigate('/admin/produtos');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/admin/produtos" className="back-link">← Voltar</Link>
      </div>
      <h1>{isEdit ? 'Editar produto' : 'Novo produto'}</h1>

      {error && <p className="error-msg">{error}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: 620 }}>
        <div className="form-group">
          <label>Nome *</label>
          <input name="nome" value={form.nome} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Slug (URL) *</label>
          <input name="slug" value={form.slug} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Descrição curta *</label>
          <input name="descricaoCurta" value={form.descricaoCurta} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Descrição completa *</label>
          <textarea
            name="descricaoCompleta"
            value={form.descricaoCompleta}
            onChange={handleChange}
            rows={5}
            required
          />
        </div>

        <div className="form-group">
          <label>Preço (texto) *</label>
          <input name="preco" value={form.preco} onChange={handleChange} placeholder="R$ 99,90" required />
        </div>

        <div className="form-group">
          <label>URL da imagem *</label>
          <input name="imagem" value={form.imagem} onChange={handleChange} type="url" required />
        </div>

        {form.imagem && (
          <img
            src={form.imagem}
            alt="preview"
            style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8, marginBottom: '1rem' }}
          />
        )}

        <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '.5rem' }}>
          <input
            type="checkbox"
            id="ativo"
            name="ativo"
            checked={form.ativo}
            onChange={handleChange}
            style={{ width: 'auto' }}
          />
          <label htmlFor="ativo" style={{ fontWeight: 'normal' }}>Produto ativo (visível na vitrine)</label>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Salvando…' : 'Salvar'}
          </button>
          <Link to="/admin/produtos" className="btn-secondary" style={{ padding: '.55rem 1.2rem', borderRadius: 6 }}>
            Cancelar
          </Link>
        </div>
      </form>
    </AdminLayout>
  );
}
