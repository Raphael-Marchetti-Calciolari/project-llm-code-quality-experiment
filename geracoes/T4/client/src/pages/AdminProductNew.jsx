import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import ProductForm from '../components/ProductForm.jsx';

export default function AdminProductNew() {
  const navigate = useNavigate();
  const save = async (form) => {
    await api('/admin/products', { method: 'POST', body: form });
    navigate('/admin');
  };
  return (
    <>
      <h1>Novo produto</h1>
      <ProductForm onSubmit={save} />
    </>
  );
}
