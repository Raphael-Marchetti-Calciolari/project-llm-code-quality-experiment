import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useFetch } from '../useFetch.js';
import ProductForm from '../components/ProductForm.jsx';
import Loading from '../components/Loading.jsx';

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const productPath = `/admin/products/${encodeURIComponent(id)}`;
  const { data: product, error, loading } = useFetch(productPath);

  const save = async (form) => {
    await api(productPath, { method: 'PUT', body: form });
    navigate('/admin');
  };

  if (loading) return <Loading />;
  if (error) return <p className="error">{error.message}</p>;
  return (
    <>
      <h1>Editar produto</h1>
      <ProductForm initial={product} onSubmit={save} />
    </>
  );
}
