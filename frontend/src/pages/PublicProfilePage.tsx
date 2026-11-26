import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';
import type { AnuncioResumo, Perfil } from '../types';
import { ProfileHeader, ProfileAdCard } from '../components/profile';
import './Profile.css';

export function PublicProfilePage() {
  const { id } = useParams();
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [anuncios, setAnuncios] = useState<AnuncioResumo[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      if (!id) return;
      try {
        setCarregando(true);
        setErro('');
        const dadosPerfil = await usuarioService.obterPerfil(Number(id));
        const dadosAnuncios = await usuarioService.listarAnunciosDoUsuario(Number(id), {
          tamanho: 50,
        });
        if (ativo) {
          setPerfil(dadosPerfil);
          setAnuncios(dadosAnuncios.itens.filter((anuncio) => anuncio.estado === 'ativo'));
        }
      } catch {
        if (ativo) setErro('Não foi possível carregar este perfil.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => { ativo = false; };
  }, [id]);

  if (carregando) return <main className="profile-page"><div className="profile-status">Carregando perfil...</div></main>;
  if (erro || !perfil) return <main className="profile-page"><div className="profile-alert-error" role="alert">{erro || 'Perfil não encontrado.'}</div></main>;

  return (
    <main className="profile-page">
      <ProfileHeader
        nome={perfil.nome}
        curso={perfil.curso}
        telefone={perfil.telefone}
        fotoUrl={perfil.fotoUrl}
      />

      <section className="profile-ad-section">
        <div className="profile-section-heading"><h2>Anúncios ativos</h2></div>
        {anuncios.length ? (
          <div className="profile-ad-grid">
            {anuncios.map((anuncio) => (
              <ProfileAdCard key={anuncio.id} anuncio={anuncio} />
            ))}
          </div>
        ) : <div className="profile-empty">Este estudante não possui anúncios ativos.</div>}
      </section>
    </main>
  );
}
