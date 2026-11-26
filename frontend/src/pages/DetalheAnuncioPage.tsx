import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnuncioGallery, AnuncioStateControl } from '../components/anuncios';
import { BadgeConservacao, BadgeEstado, BadgeModalidade, Button } from '../components/ui';
import { useAppDispatch, useAppSelector } from '../store';
import {
  alterarEstadoAnuncioThunk,
  buscarAnuncioPorIdThunk,
  limparAnuncioDetalhe,
} from '../store/anunciosSlice';
import type { EstadoAnuncio } from '../types';

export function DetalheAnuncioPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { usuario } = useAppSelector((state) => state.auth);
  const { anuncioDetalhe, carregando, erro } = useAppSelector((state) => state.anuncios);

  useEffect(() => {
    dispatch(limparAnuncioDetalhe());
    if (!id) return;
    const request = dispatch(buscarAnuncioPorIdThunk(id));
    return () => {
      request.abort();
      dispatch(limparAnuncioDetalhe());
    };
  }, [dispatch, id]);

  async function alterarEstado(estado: EstadoAnuncio) {
    if (!id) return;
    await dispatch(alterarEstadoAnuncioThunk({ id, dados: { estado } }));
  }

  if (carregando && !anuncioDetalhe) {
    return <main className="anuncio-page"><div className="anuncio-page-status">Carregando anúncio...</div></main>;
  }

  if (erro && !anuncioDetalhe) {
    return <main className="anuncio-page"><div className="anuncio-page-content anuncio-alert-error" role="alert">{erro}</div></main>;
  }

  if (!anuncioDetalhe) {
    return <main className="anuncio-page"><div className="anuncio-page-status">Anúncio não encontrado.</div></main>;
  }

  const anuncio = anuncioDetalhe;
  const ehDono = anuncio.anunciante.id === usuario?.id;
  const preco = anuncio.preco === null
    ? 'Doação'
    : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(anuncio.preco);

  return (
    <main className="anuncio-page">
      <article className="anuncio-page-content">
        <div className="anuncio-detail-layout">
          <AnuncioGallery
            titulo={anuncio.titulo}
            capaUrl={anuncio.capaUrl}
            fotos={anuncio.fotos}
          />

          <section className="anuncio-detail-info">
            <div className="anuncio-detail-meta">
              <BadgeModalidade modalidade={anuncio.modalidade} />
              <BadgeEstado estado={anuncio.estado} />
              <BadgeConservacao conservacao={anuncio.estadoConservacao} />
            </div>
            <h1>{anuncio.titulo}</h1>
            <p className="anuncio-detail-price">{preco}</p>
            <p className="anuncio-detail-category"><strong>Categoria:</strong> {anuncio.categoria.nome}</p>
            <p className="anuncio-detail-local"><strong>Local de entrega:</strong> {anuncio.localEntrega}</p>
            <p className="anuncio-detail-date">
              Publicado em {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(anuncio.publicadoEm))}
            </p>

            <div className="anuncio-detail-actions">
              {!ehDono && (
                <Button type="button" disabled title="A lista de interesse será disponibilizada em RF05">
                  Tenho interesse
                </Button>
              )}
              <Button type="button" variant="secondary" disabled title="Disponível na etapa 3">
                Negociar
              </Button>
              {ehDono && (
                <Button type="button" onClick={() => navigate(`/anuncios/${anuncio.id}/editar`)}>
                  Editar anúncio
                </Button>
              )}
            </div>
            {!ehDono && (
              <p className="anuncio-interest-note">
                A lista de interesse ainda não está disponível nesta etapa.
              </p>
            )}

            <div className="anuncio-seller-card">
              <strong>Anunciante</strong>
              <Link to={`/usuarios/${anuncio.anunciante.id}`}>{anuncio.anunciante.nome}</Link>
            </div>

            {ehDono && (
              <AnuncioStateControl
                modalidade={anuncio.modalidade}
                estadoAtual={anuncio.estado}
                carregando={carregando}
                erro={erro}
                onChange={alterarEstado}
              />
            )}
          </section>
        </div>

        <section className="anuncio-detail-description">
          <h2>Descrição</h2>
          <p>{anuncio.descricao}</p>
        </section>
      </article>
    </main>
  );
}
