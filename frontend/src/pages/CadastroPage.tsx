import { useState, useEffect, type FormEvent } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { cadastroThunk } from '../store/authSlice';
import { listasService } from '../services/listasService';
import type { Curso } from '../types';
import { Button, Input } from '../components/ui';
import './Auth.css';

export function CadastroPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { token, carregando, erro, errosCampos } = useAppSelector((state) => state.auth);

  // Estado local do formulário (RF01: formulários e listas de cursos ficam fora do Redux)
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [cursoId, setCursoId] = useState<number | ''>('');
  const [telefone, setTelefone] = useState('');

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [carregandoCursos, setCarregandoCursos] = useState(false);
  const [erroEmail, setErroEmail] = useState('');
  const [erroGeral, setErroGeral] = useState('');

  // Busca cursos do campus via API ao montar a página
  useEffect(() => {
    let ativo = true;
    async function carregarCursos() {
      try {
        setCarregandoCursos(true);
        const data = await listasService.listarCursos();
        if (ativo) {
          setCursos(data);
          if (data.length > 0) {
            setCursoId(data[0].id);
          }
        }
      } catch {
        if (ativo) {
          setErroGeral('Não foi possível carregar os cursos do campus.');
        }
      } finally {
        if (ativo) setCarregandoCursos(false);
      }
    }
    carregarCursos();
    return () => {
      ativo = false;
    };
  }, []);

  if (token) {
    return <Navigate to="/vendas" replace />;
  }

  // Validação explícita de domínio institucional: @academico.ifpb.edu.br (RF01.2)
  function validarEmailInstitucional(emailValor: string): boolean {
    const limpo = emailValor.trim().toLowerCase();
    return limpo.endsWith('@academico.ifpb.edu.br');
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErroEmail('');
    setErroGeral('');

    const emailTrim = email.trim();

    if (!validarEmailInstitucional(emailTrim)) {
      setErroEmail('O e-mail deve pertencer obrigatoriamente ao domínio @academico.ifpb.edu.br');
      return;
    }

    if (!cursoId) {
      setErroGeral('Selecione o seu curso.');
      return;
    }

    try {
      const resultAction = await dispatch(
        cadastroThunk({
          nome: nome.trim(),
          email: emailTrim,
          senha,
          cursoId: Number(cursoId),
          telefone: telefone.trim() || undefined,
        })
      );

      if (cadastroThunk.fulfilled.match(resultAction)) {
        navigate('/vendas', { replace: true });
      }
    } catch {
      // Erro tratado pelo reducer
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">Criar Conta</h1>
          <p className="auth-subtitle">Exclusivo para estudantes do IFPB Campus Cajazeiras</p>
        </div>

        {(erroGeral || erro) && (
          <div className="auth-alert-error" role="alert">
            {erroGeral || erro}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <Input
            label="Nome Completo"
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            error={errosCampos['nome']}
          />

          <Input
            label="E-mail Institucional"
            type="email"
            placeholder="estudante@academico.ifpb.edu.br"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (erroEmail) setErroEmail('');
            }}
            required
            helperText="Apenas e-mails @academico.ifpb.edu.br"
            error={erroEmail || errosCampos['email']}
          />

          <Input
            label="Senha"
            type="password"
            placeholder="Crie uma senha segura"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            error={errosCampos['senha']}
          />

          <div className="auth-select-group">
            <label htmlFor="curso-select" className="auth-select-label">
              Curso <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              id="curso-select"
              className={`auth-select ${errosCampos['cursoId'] ? 'auth-select--error' : ''}`}
              value={cursoId}
              onChange={(e) => setCursoId(Number(e.target.value))}
              disabled={carregandoCursos || cursos.length === 0}
              required
            >
              {carregandoCursos ? (
                <option value="">Carregando cursos...</option>
              ) : (
                cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))
              )}
            </select>
            {errosCampos['cursoId'] && (
              <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>
                {errosCampos['cursoId']}
              </span>
            )}
          </div>

          <Input
            label="Telefone / WhatsApp (Opcional)"
            type="tel"
            placeholder="(83) 99999-9999"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            helperText="Será exibido no seu perfil para contato"
            error={errosCampos['telefone']}
          />

          <Button type="submit" variant="primary" size="lg" fullWidth loading={carregando}>
            Finalizar Cadastro
          </Button>
        </form>

        <div className="auth-footer">
          Já possui conta?
          <Link to="/login" className="auth-link">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
