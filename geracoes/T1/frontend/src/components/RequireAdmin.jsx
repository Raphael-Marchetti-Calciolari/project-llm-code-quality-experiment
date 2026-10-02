import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../api.js";

export default function RequireAdmin() {
  return getToken() ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
