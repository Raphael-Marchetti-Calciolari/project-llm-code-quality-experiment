import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import AdminProducts from './pages/AdminProducts';
import AdminProductForm from './pages/AdminProductForm';
import AdminSettings from './pages/AdminSettings';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/admin/login" />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produto/:slug" element={<ProductDetail />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/produtos" element={<PrivateRoute><AdminProducts /></PrivateRoute>} />
      <Route path="/admin/produtos/novo" element={<PrivateRoute><AdminProductForm /></PrivateRoute>} />
      <Route path="/admin/produtos/:id" element={<PrivateRoute><AdminProductForm /></PrivateRoute>} />
      <Route path="/admin/configuracoes" element={<PrivateRoute><AdminSettings /></PrivateRoute>} />
    </Routes>
  );
}
