import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { getToken, setUnauthorizedHandler } from "../api.js";

export default function RequireAdmin() {
  const navigate = useNavigate();

  useEffect(() => {
    setUnauthorizedHandler(() => navigate("/admin/login", { replace: true }));
    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  return getToken() ? <Outlet /> : <Navigate to="/admin/login" replace />;
}
