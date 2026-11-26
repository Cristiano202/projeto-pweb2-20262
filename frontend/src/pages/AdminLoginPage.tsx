import { useState, type FormEvent } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { loginAdminThunk } from '../store/authSlice';
import { Button, Input } from '../components/ui';
import './Auth.css';

export function AdminLoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token, perfil, carregando, erro } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erroLocal, setErroLocal] = useState('');

  // Se já estiver logado, redireciona de acordo com o perfil
  if (token) {
    return <Navigate to={perfil === 'ADMIN' ? '/admin' : '/vendas'} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErroLocal('');

    if (!email.trim() || !senha) {
      setErroLocal('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const resultAction = await dispatch(loginAdminThunk({ email: email.trim(), senha }));
      if (loginAdminThunk.fulfilled.match(resultAction)) {
        navigate('/admin', { replace: true });
      }
    } catch {
      // Erro tratado pelo reducer do authSlice
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Painel Administrativo</h1>
          <p className="auth-subtitle">Acesso restrito à equipe gestora do Marketplace IFPB</p>
        </div>

        {(erroLocal || erro) && (
          <div className="auth-alert-error" role="alert">
            {erroLocal || erro}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            label="E-mail Administrativo"
            type="email"
            placeholder="admin@ifpb.edu.br"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />

          <Input
            label="Senha"
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            autoComplete="current-password"
          />

          <Button type="submit" variant="primary" size="lg" fullWidth loading={carregando}>
            Entrar como Administrador
          </Button>
        </form>

        <div className="auth-footer">
          É estudante?
          <Link to="/login" className="auth-link">
            Ir para login do estudante
          </Link>
        </div>
      </div>
    </div>
  );
}