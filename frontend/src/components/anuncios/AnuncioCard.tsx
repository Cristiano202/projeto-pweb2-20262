import { Link } from 'react-router-dom';
import type { AnuncioResumo } from '../../types';
import { BadgeConservacao, BadgeEstado, BadgeModalidade } from '../ui';
import './Anuncios.css';

export interface AnuncioCardProps {
  anuncio: AnuncioResumo;
  mostrarEstado?: boolean;
  mostrarConservacao?: boolean;
  mostrarAnunciante?: boolean;
  className?: string;
}

export function AnuncioCard({
  anuncio,
  mostrarEstado = true,
  mostrarConservacao = true,
  mostrarAnunciante = false,
  className = '',
}: AnuncioCardProps) {
  const preco = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(anuncio.preco ?? 0);

  return (
    <article className={`anuncio-card ${className}`.trim()}>
      <Link className="anuncio-card__link" to={`/anuncios/${anuncio.id}`} aria-label={`Ver anúncio ${anuncio.titulo}`}>
        <div className="anuncio-card__image">
          {anuncio.capaUrl ? (
            <img src={anuncio.capaUrl} alt={anuncio.titulo} />
          ) : (
            <span>Sem foto</span>
          )}
        </div>

        <div className="anuncio-card__body">
          <div className="anuncio-card__badges">
            <BadgeModalidade modalidade={anuncio.modalidade} />
            {mostrarEstado && <BadgeEstado estado={anuncio.estado} />}
            {mostrarConservacao && (
              <BadgeConservacao conservacao={anuncio.estadoConservacao} />
            )}
          </div>

          <h3 className="anuncio-card__title">{anuncio.titulo}</h3>

          <p className="anuncio-card__price">
            {anuncio.modalidade === 'doacao' ? 'Doação gratuita' : preco}
          </p>

          <p className="anuncio-card__category">{anuncio.categoria.nome}</p>

          {mostrarAnunciante && (
            <p className="anuncio-card__owner">Anunciado por {anuncio.anunciante.nome}</p>
          )}

          {anuncio.motivoRemocao && (
            <p className="anuncio-card__removed">
              Removido pelo administrador: {anuncio.motivoRemocao}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}
