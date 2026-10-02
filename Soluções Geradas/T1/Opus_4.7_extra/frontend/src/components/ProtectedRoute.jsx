import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../auth.js';

export default function ProtectedRoute() {
  if (!isAuthenticated()) return <Navigate to="/admin/login" replace />;
  return <Outlet />;
}
