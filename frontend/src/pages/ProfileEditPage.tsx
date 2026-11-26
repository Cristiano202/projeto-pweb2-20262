import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import { listasService } from '../services/listasService';
import { useAppDispatch } from '../store';
import { atualizarUsuarioLogado } from '../store/authSlice';
import type { Curso } from '../types';
import { Button, Input } from '../components/ui';
import './Profile.css';

export function ProfileEditPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [cursoId, setCursoId] = useState<number | ''>('');
  const [telefone, setTelefone] = useState('');
  const [fotoAtual, setFotoAtual] = useState<string | null>(null);
  const [fotoNova, setFotoNova] = useState<File | null>(null);
  const [previewFoto, setPreviewFoto] = useState<string | null>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        const [usuario, listaCursos] = await Promise.all([
          usuarioService.obterUsuarioLogado(),
          listasService.listarCursos(),
        ]);
        if (ativo) {
          setNome(usuario.nome);
          setCursoId(usuario.curso.id);
          setTelefone(usuario.telefone || '');
          setFotoAtual(usuario.fotoUrl);
          setCursos(listaCursos);
        }
      } catch {
        if (ativo) setErro('Não foi possível carregar os dados do perfil.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => { ativo = false; };
  }, []);

  useEffect(() => {
    return () => {
      if (previewFoto) URL.revokeObjectURL(previewFoto);
    };
  }, [previewFoto]);

  function selecionarFoto(event: ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(arquivo.type)) {
      setErro('Selecione uma imagem JPG, PNG ou WebP.');
      return;
    }
    if (previewFoto) URL.revokeObjectURL(previewFoto);
    setFotoNova(arquivo);
    setPreviewFoto(URL.createObjectURL(arquivo));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setErro('');
    setSucesso('');

    if (!nome.trim()) {
      setErro('Informe o seu nome.');
      return;
    }
    if (!cursoId) {
      setErro('Selecione o seu curso.');
      return;
    }

    try {
      setSalvando(true);
      let usuarioAtualizado = await usuarioService.atualizarDados({
        nome: nome.trim(),
        cursoId: Number(cursoId),
        telefone: telefone.trim() || null,
      });

      if (fotoNova) {
        usuarioAtualizado = await usuarioService.atualizarFoto(fotoNova);
      }

      const cursoAtual = cursos.find((curso) => curso.id === usuarioAtualizado.curso.id);
      dispatch(atualizarUsuarioLogado({
        id: usuarioAtualizado.id,
        nome: usuarioAtualizado.nome,
        curso: cursoAtual?.nome,
        telefone: usuarioAtualizado.telefone || undefined,
        fotoUrl: usuarioAtualizado.fotoUrl || undefined,
      }));

      setSucesso('Perfil atualizado com sucesso.');
      setFotoNova(null);
      setFotoAtual(usuarioAtualizado.fotoUrl);
      setPreviewFoto(null);
      window.setTimeout(() => navigate('/perfil', { replace: true }), 400);
    } catch (err: any) {
      setErro(err.response?.data?.mensagem || 'Não foi possível atualizar o perfil.');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return <main className="profile-page"><div className="profile-status">Carregando perfil...</div></main>;
  }

  return (
    <main className="profile-page">
      <section className="profile-edit-card">
        <div className="profile-edit-heading">
          <h1>Editar perfil</h1>
          <p>Atualize seus dados e a foto exibida no marketplace.</p>
        </div>

        {erro && <div className="profile-alert-error" role="alert">{erro}</div>}
        {sucesso && <div className="profile-alert-success" role="status">{sucesso}</div>}

        <form className="profile-edit-form" onSubmit={handleSubmit}>
          <div className="profile-photo-editor">
            <div className="profile-avatar profile-avatar--large">
              {previewFoto || fotoAtual
                ? <img src={previewFoto || fotoAtual || ''} alt="Prévia da foto de perfil" />
                : <span aria-hidden="true">{nome.charAt(0).toUpperCase() || '?'}</span>}
            </div>
            <div>
              <label className="profile-photo-label" htmlFor="foto-perfil">Alterar foto</label>
              <input
                id="foto-perfil"
                className="profile-photo-input"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={selecionarFoto}
              />
              <p>JPG, PNG ou WebP.</p>
            </div>
          </div>

          <Input
            label="Nome"
            value={nome}
            onChange={(event) => setNome(event.target.value)}
            required
          />

          <div className="auth-select-group">
            <label htmlFor="perfil-curso" className="auth-select-label">
              Curso <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <select
              id="perfil-curso"
              className="auth-select"
              value={cursoId}
              onChange={(event) => setCursoId(Number(event.target.value))}
              required
              disabled={cursos.length === 0}
            >
              {cursos.map((curso) => (
                <option key={curso.id} value={curso.id}>{curso.nome}</option>
              ))}
            </select>
          </div>

          <Input
            label="Telefone / WhatsApp"
            type="tel"
            value={telefone}
            onChange={(event) => setTelefone(event.target.value)}
            placeholder="(83) 99999-9999"
          />

          <div className="profile-edit-actions">
            <Button type="button" variant="secondary" onClick={() => navigate('/perfil')}>Cancelar</Button>
            <Button type="submit" loading={salvando}>Salvar alterações</Button>
          </div>
        </form>
      </section>
    </main>
  );
}
