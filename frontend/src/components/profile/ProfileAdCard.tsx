import type { AnuncioResumo } from '../../types';
import { AnuncioCard } from '../anuncios/AnuncioCard';

export interface ProfileAdCardProps {
  anuncio: AnuncioResumo;
}

export function ProfileAdCard({ anuncio }: ProfileAdCardProps) {
  return <AnuncioCard anuncio={anuncio} />;
}
