import { Route, Routes } from "react-router-dom";
import RequireAdmin from "./components/RequireAdmin.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminProducts from "./pages/AdminProducts.jsx";
import AdminProductForm from "./pages/AdminProductForm.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/produtos/:slug" element={<ProductDetail />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route element={<RequireAdmin />}>
        <Route path="/admin" element={<AdminProducts />} />
        <Route path="/admin/produtos/novo" element={<AdminProductForm />} />
        <Route path="/admin/produtos/:id/editar" element={<AdminProductForm />} />
      </Route>
    </Routes>
  );
}
