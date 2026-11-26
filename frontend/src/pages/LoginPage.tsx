import { useState, type FormEvent } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { loginThunk } from '../store/authSlice';
import { Button, Input } from '../components/ui';
import './Auth.css';

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token, carregando, erro } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erroLocal, setErroLocal] = useState('');

  // Se já estiver logado, redireciona para a página principal
  if (token) {
    return <Navigate to="/vendas" replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErroLocal('');

    if (!email.trim() || !senha) {
      setErroLocal('Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const resultAction = await dispatch(loginThunk({ email: email.trim(), senha }));
      if (loginThunk.fulfilled.match(resultAction)) {
        navigate('/vendas', { replace: true });
      }
    } catch {
      // Erro tratado pelo reducer do authSlice
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">BRICS DO IF</h1>
          <p className="auth-subtitle">Acesse sua conta para comprar, doar e negociar</p>
        </div>

        {(erroLocal || erro) && (
          <div className="auth-alert-error" role="alert">
            {erroLocal || erro}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            label="E-mail Institucional"
            type="email"
            placeholder="estudante@academico.ifpb.edu.br"
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
            Entrar
          </Button>
        </form>

        <div className="auth-footer">
          Não tem uma conta?
          <Link to="/cadastro" className="auth-link">
            Cadastre-se
          </Link>
        </div>
      </div>
    </div>
  );
}
