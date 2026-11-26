import { Link } from 'react-router-dom';
import type { AnuncioResumo } from '../../types';
import { BadgeEstado, BadgeModalidade } from '../ui';
import '../../pages/Profile.css';

export interface ProfileAdCardProps {
  anuncio: AnuncioResumo;
}

export function ProfileAdCard({ anuncio }: ProfileAdCardProps) {
  const preco = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(anuncio.preco ?? 0);

  return (
    <article className="profile-ad-card">
      <Link to={`/anuncios/${anuncio.id}`}>
        <img src={anuncio.capaUrl} alt={anuncio.titulo} />
      </Link>
      <div className="profile-ad-content">
        <div className="profile-ad-badges">
          <BadgeModalidade modalidade={anuncio.modalidade} />
          <BadgeEstado estado={anuncio.estado} />
        </div>
        <h3>
          <Link to={`/anuncios/${anuncio.id}`}>{anuncio.titulo}</Link>
        </h3>
        <p>{anuncio.modalidade === 'doacao' ? 'Doação' : preco}</p>
        <p className="profile-ad-category">{anuncio.categoria.nome}</p>
        {anuncio.motivoRemocao && (
          <p className="profile-removed">
            Removido pelo administrador: {anuncio.motivoRemocao}
          </p>
        )}
      </div>
    </article>
  );
}
