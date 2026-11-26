import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store';

export function RootRedirect() {
  const { token, perfil } = useAppSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" replace />;
  if (perfil === 'ADMIN') return <Navigate to="/admin/anuncios" replace />;
  return <Navigate to="/vendas" replace />;
}
