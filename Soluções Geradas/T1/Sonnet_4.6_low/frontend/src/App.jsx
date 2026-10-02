import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Login from './pages/admin/Login.jsx';
import AdminProducts from './pages/admin/Products.jsx';
import AdminProductForm from './pages/admin/ProductForm.jsx';
import AdminSettings from './pages/admin/Settings.jsx';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/admin/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Área pública */}
        <Route path="/" element={<Home />} />
        <Route path="/produto/:slug" element={<ProductDetail />} />

        {/* Admin */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<PrivateRoute><Navigate to="/admin/produtos" replace /></PrivateRoute>} />
        <Route path="/admin/produtos" element={<PrivateRoute><AdminProducts /></PrivateRoute>} />
        <Route path="/admin/produtos/novo" element={<PrivateRoute><AdminProductForm /></PrivateRoute>} />
        <Route path="/admin/produtos/:id/editar" element={<PrivateRoute><AdminProductForm /></PrivateRoute>} />
        <Route path="/admin/configuracoes" element={<PrivateRoute><AdminSettings /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
