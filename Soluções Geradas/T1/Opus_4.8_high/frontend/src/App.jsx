import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { PublicLayout } from './components/PublicLayout.jsx';
import { AdminLayout } from './components/AdminLayout.jsx';

import { HomePage } from './pages/public/HomePage.jsx';
import { ProductDetailPage } from './pages/public/ProductDetailPage.jsx';
import { NotFoundPage } from './pages/public/NotFoundPage.jsx';

import { LoginPage } from './pages/admin/LoginPage.jsx';
import { AdminProductsPage } from './pages/admin/AdminProductsPage.jsx';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage.jsx';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.jsx';

/**
 * Configuração das rotas da aplicação (área pública e administrativa).
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Área pública */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="produto/:slug" element={<ProductDetailPage />} />
          </Route>

          {/* Login administrativo */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Área administrativa protegida */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="produtos" replace />} />
            <Route path="produtos" element={<AdminProductsPage />} />
            <Route path="produtos/novo" element={<AdminProductFormPage />} />
            <Route path="produtos/:id/editar" element={<AdminProductFormPage />} />
            <Route path="configuracoes" element={<AdminSettingsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
