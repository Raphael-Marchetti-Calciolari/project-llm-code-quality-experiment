import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import AdminProductForm from './pages/AdminProductForm.jsx';
import AdminShowcase from './pages/AdminShowcase.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produto/:slug" element={<ProductDetail />} />
      <Route path="/admin" element={<Navigate to="/admin/produtos" replace />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/produtos" element={<AdminProducts />} />
        <Route path="/admin/produtos/novo" element={<AdminProductForm />} />
        <Route path="/admin/produtos/:id/editar" element={<AdminProductForm />} />
        <Route path="/admin/vitrine" element={<AdminShowcase />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
