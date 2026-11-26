import { useState } from 'react';
import type { FotoAnuncio } from '../../types';
import './Anuncios.css';

interface AnuncioGalleryProps {
  titulo: string;
  capaUrl: string;
  fotos: FotoAnuncio[];
}

export function AnuncioGallery({ titulo, capaUrl, fotos }: AnuncioGalleryProps) {
  const imagens = fotos.length ? fotos : [{ id: 0, url: capaUrl, capa: true }];
  const [indiceSelecionado, setIndiceSelecionado] = useState(
    Math.max(0, imagens.findIndex((foto) => foto.capa))
  );

  const fotoSelecionada = imagens[indiceSelecionado] ?? imagens[0];

  return (
    <div className="anuncio-gallery">
      <div className="anuncio-gallery-main">
        <img src={fotoSelecionada.url} alt={`${titulo}, foto ${indiceSelecionado + 1}`} />
      </div>
      {imagens.length > 1 && (
        <div className="anuncio-gallery-thumbnails" role="group" aria-label="Fotos do anúncio">
          {imagens.map((foto, index) => (
            <button
              className={index === indiceSelecionado ? 'anuncio-gallery-thumbnail anuncio-gallery-thumbnail--selected' : 'anuncio-gallery-thumbnail'}
              type="button"
              key={foto.id}
              onClick={() => setIndiceSelecionado(index)}
              aria-label={`Ver foto ${index + 1}`}
              aria-pressed={index === indiceSelecionado}
            >
              <img src={foto.url} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
