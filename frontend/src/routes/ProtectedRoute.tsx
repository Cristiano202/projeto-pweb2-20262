import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../store';
import type { PerfilUsuario } from '../store/authSlice';

interface ProtectedRouteProps {
  perfisPermitidos?: PerfilUsuario[];
}

export function ProtectedRoute({ perfisPermitidos }: ProtectedRouteProps) {
  const location = useLocation();
  const { token, perfil } = useAppSelector((state) => state.auth);
  const isRotaAdmin = location.pathname.startsWith('/admin');

  if (!token) {
    return <Navigate to={isRotaAdmin ? '/admin/login' : '/login'} replace />;
  }

  if (perfisPermitidos && (!perfil || !perfisPermitidos.includes(perfil))) {
    return <Navigate to={perfil === 'ADMIN' ? '/admin' : '/vendas'} replace />;
  }

  return <Outlet />;
}