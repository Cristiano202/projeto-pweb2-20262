import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Únicas rotas públicas (RF01) */}
        <Route path="/login" element={<div>Login Estudante</div>} />
        <Route path="/cadastro" element={<div>Cadastro Estudante</div>} />
        <Route path="/admin/login" element={<div>Login Administrador</div>} />

        {/* Rotas Protegidas - Estudante */}
        <Route element={<ProtectedRoute perfisPermitidos={['ESTUDANTE']} />}>
          <Route path="/" element={<Navigate to="/vendas" replace />} />
          <Route path="/vendas" element={<div>Listagem de Vendas</div>} />
          <Route path="/doacoes" element={<div>Listagem de Doações</div>} />

          <Route path="/perfil" element={<div>Meu Perfil</div>} />
          <Route path="/perfil/editar" element={<div>Editar Perfil</div>} />
          <Route path="/usuarios/:id" element={<div>Perfil Público do Estudante</div>} />

          <Route path="/anuncios/novo" element={<div>Criar Anúncio</div>} />
          <Route path="/anuncios/:id" element={<div>Detalhe do Anúncio</div>} />
          <Route path="/anuncios/:id/editar" element={<div>Editar Anúncio</div>} />
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