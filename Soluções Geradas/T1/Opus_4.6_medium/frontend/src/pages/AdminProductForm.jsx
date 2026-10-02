import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import '../styles.css';

const emptyProduct = { name: '', slug: '', shortDescription: '', fullDescription: '', price: '', imageUrl: '', active: true };

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyProduct);
  const [error, setError] = useState('');
  const isEditing = Boolean(id);

  useEffect(() => {
    if (id) {
      api.getAdminProducts().then((products) => {
        const product = products.find((p) => p._id === id);
        if (product) setForm(product);
      });
    }
  }, [id]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      if (isEditing) {
        await api.updateProduct(id, form);
      } else {
        await api.createProduct(form);
      }
      navigate('/admin/produtos');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <header className="admin-header">
        <div className="container">
          <h1>Painel Administrativo</h1>
          <nav className="admin-nav">
            <Link to="/admin/produtos">Produtos</Link>
            <Link to="/admin/configuracoes">Configurações</Link>
          </nav>
        </div>
      </header>

      <main className="container">
        <Link to="/admin/produtos" className="back-link">&#8592; Voltar</Link>
        <div style={{ background: '#fff', borderRadius: 8, padding: 30, maxWidth: 600 }}>
          <h2>{isEditing ? 'Editar Produto' : 'Novo Produto'}</h2>
          {error && <p className="error-msg">{error}</p>}
          <form onSubmit={handleSubmit} style={{ marginTop: 16 }}>
            <div className="form-group">
              <label>Nome</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Slug (URL amigável)</label>
              <input name="slug" value={form.slug} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Descrição curta</label>
              <input name="shortDescription" value={form.shortDescription} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Descrição completa</label>
              <textarea name="fullDescription" value={form.fullDescription} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Preço</label>
              <input name="price" value={form.price} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>URL da imagem</label>
              <input name="imageUrl" value={form.imageUrl} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary">{isEditing ? 'Salvar' : 'Criar'}</button>
          </form>
        </div>
      </main>
    </>
  );
}
