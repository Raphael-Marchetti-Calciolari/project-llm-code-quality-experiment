import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import AdminProductNew from './pages/AdminProductNew.jsx';
import AdminProductEdit from './pages/AdminProductEdit.jsx';
import AdminStore from './pages/AdminStore.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produtos/:slug" element={<ProductDetail />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminProducts />} />
        <Route path="produtos/novo" element={<AdminProductNew />} />
        <Route path="produtos/:id/editar" element={<AdminProductEdit />} />
        <Route path="loja" element={<AdminStore />} />
      </Route>
      <Route path="*" element={<p className="page">Página não encontrada.</p>} />
    </Routes>
  );
}
