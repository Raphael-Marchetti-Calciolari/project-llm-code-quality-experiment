import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useFetch } from '../useFetch.js';
import ProductForm from '../components/ProductForm.jsx';

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useFetch(`/admin/products/${id}`);

  const save = async (form) => {
    await api(`/admin/products/${id}`, { method: 'PUT', body: form });
    navigate('/admin');
  };

  if (product.loading) return <p>Carregando…</p>;
  if (product.error) return <p className="error">{product.error.message}</p>;
  return (
    <>
      <h1>Editar produto</h1>
      <ProductForm initial={product.data} onSubmit={save} />
    </>
  );
}
