import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { LoginPage } from '../pages/LoginPage';
import { CadastroPage } from '../pages/CadastroPage';
import { AdminLoginPage } from '../pages/AdminLoginPage';
import { ProfilePage } from '../pages/ProfilePage';
import { ProfileEditPage } from '../pages/ProfileEditPage';
import { PublicProfilePage } from '../pages/PublicProfilePage';
import { CriarAnuncioPage } from '../pages/CriarAnuncioPage';
import { DetalheAnuncioPage } from '../pages/DetalheAnuncioPage';
import { EditarAnuncioPage } from '../pages/EditarAnuncioPage';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Únicas rotas públicas (RF01) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* Rotas Protegidas - Estudante */}
        <Route element={<ProtectedRoute perfisPermitidos={['ESTUDANTE']} />}>
          <Route path="/" element={<Navigate to="/vendas" replace />} />
          <Route path="/vendas" element={<div>Listagem de Vendas</div>} />
          <Route path="/doacoes" element={<div>Listagem de Doações</div>} />

          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/perfil/editar" element={<ProfileEditPage />} />
          <Route path="/usuarios/:id" element={<PublicProfilePage />} />

          <Route path="/anuncios/novo" element={<CriarAnuncioPage />} />
          <Route path="/anuncios/:id" element={<DetalheAnuncioPage />} />
          <Route path="/anuncios/:id/editar" element={<EditarAnuncioPage />} />
        </Route>

        {/* Rotas Protegidas - Administrador */}
        <Route element={<ProtectedRoute perfisPermitidos={['ADMIN']} />}>
          <Route path="/admin" element={<div>Painel Administrativo</div>} />
        </Route>

        {/* Página 404 */}
        <Route path="*" element={<div>404 - Página não encontrada</div>} />
      </Routes>
    </BrowserRouter>
  );
}