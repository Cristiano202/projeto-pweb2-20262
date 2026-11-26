import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import type { PaginaAnuncioResumo, UsuarioLogado } from '../types';
import { Button } from '../components/ui';
import { ProfileHeader, ProfileAdCard } from '../components/profile';
import './Profile.css';

export function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const pagina = Number(searchParams.get('pagina') || '1');
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [anuncios, setAnuncios] = useState<PaginaAnuncioResumo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        setCarregando(true);
        setErro('');
        const dadosUsuario = await usuarioService.obterUsuarioLogado();
        const dadosAnuncios = await usuarioService.listarAnunciosDoUsuario(dadosUsuario.id, {
          pagina,
          tamanho: 10,
        });
        if (ativo) {
          setUsuario(dadosUsuario);
          setAnuncios(dadosAnuncios);
        }
      } catch {
        if (ativo) setErro('Não foi possível carregar o seu perfil.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [pagina]);

  function irParaPagina(novaPagina: number) {
    setSearchParams(novaPagina === 1 ? {} : { pagina: String(novaPagina) });
  }

  if (carregando) {
    return <main className="profile-page"><div className="profile-status">Carregando perfil...</div></main>;
  }

  if (erro || !usuario) {
    return <main className="profile-page"><div className="profile-alert-error" role="alert">{erro || 'Perfil não encontrado.'}</div></main>;
  }

  return (
    <main className="profile-page">
      <ProfileHeader
        nome={usuario.nome}
        curso={usuario.curso}
        telefone={usuario.telefone}
        fotoUrl={usuario.fotoUrl}
        actions={
          <Link to="/perfil/editar">
            <Button type="button" variant="secondary">Editar perfil</Button>
          </Link>
        }
      />

      <section className="profile-ad-section">
        <div className="profile-section-heading">
          <h2>Meus anúncios</h2>
          <Link to="/anuncios/novo"><Button type="button">Novo anúncio</Button></Link>
        </div>

        {anuncios?.itens.length ? (
          <>
            <div className="profile-ad-grid">
              {anuncios.itens.map((anuncio) => (
                <ProfileAdCard key={anuncio.id} anuncio={anuncio} />
              ))}
            </div>
            {anuncios.totalPaginas > 1 && (
              <nav className="profile-pagination" aria-label="Paginação dos anúncios">
                <Button type="button" variant="secondary" disabled={pagina <= 1} onClick={() => irParaPagina(pagina - 1)}>Anterior</Button>
                <span>Página {anuncios.pagina} de {anuncios.totalPaginas}</span>
                <Button type="button" variant="secondary" disabled={pagina >= anuncios.totalPaginas} onClick={() => irParaPagina(pagina + 1)}>Próxima</Button>
              </nav>
            )}
          </>
        ) : (
          <div className="profile-empty">Você ainda não publicou anúncios.</div>
        )}
      </section>
    </main>
  );
}
