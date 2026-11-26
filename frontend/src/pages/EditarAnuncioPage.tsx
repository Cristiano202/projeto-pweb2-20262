import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { AnuncioForm, type AnuncioFormValues } from '../components/anuncios';
import { listasService } from '../services/listasService';
import { useAppDispatch, useAppSelector } from '../store';
import { editarAnuncioThunk, buscarAnuncioPorIdThunk, limparAnuncioDetalhe } from '../store/anunciosSlice';
import type { Categoria, EdicaoAnuncioForm } from '../types';

export function EditarAnuncioPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { usuario } = useAppSelector((state) => state.auth);
  const { anuncioDetalhe, carregando, erro, errosCampos } = useAppSelector((state) => state.anuncios);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [erroCategorias, setErroCategorias] = useState('');

  useEffect(() => {
    dispatch(limparAnuncioDetalhe());
    let ativo = true;
    if (id) dispatch(buscarAnuncioPorIdThunk(id));

    listasService.listarCategorias()
      .then((resultado) => {
        if (ativo) setCategorias(resultado);
      })
      .catch(() => {
        if (ativo) setErroCategorias('Não foi possível carregar as categorias.');
      })
      .finally(() => {
        if (ativo) setCarregandoCategorias(false);
      });

    return () => {
      ativo = false;
      dispatch(limparAnuncioDetalhe());
    };
  }, [dispatch, id]);

  async function salvar(values: AnuncioFormValues) {
    if (!id) return;
    const dados: EdicaoAnuncioForm = {
      titulo: values.titulo,
      descricao: values.descricao,
      modalidade: values.modalidade,
      preco: values.preco,
      estadoConservacao: values.estadoConservacao,
      categoriaId: values.categoriaId,
      localEntrega: values.localEntrega,
      fotosMantidas: values.fotosMantidas.map((foto) => foto.id),
      fotos: values.fotos,
      capaId: values.capaId,
      capaIndice: values.capaIndice,
    };
    const resultado = await dispatch(editarAnuncioThunk({ id, dados }));
    if (editarAnuncioThunk.fulfilled.match(resultado)) {
      navigate(`/anuncios/${id}`, { replace: true });
    }
  }

  if (carregando || carregandoCategorias) {
    return <main className="anuncio-page"><div className="anuncio-page-status">Carregando anúncio...</div></main>;
  }

  if (erro && !anuncioDetalhe) {
    return <main className="anuncio-page"><div className="anuncio-page-status anuncio-alert-error" role="alert">{erro}</div></main>;
  }

  if (!anuncioDetalhe) {
    return <main className="anuncio-page"><div className="anuncio-page-status">Anúncio não encontrado.</div></main>;
  }

  if (anuncioDetalhe.anunciante.id !== usuario?.id) {
    return <Navigate to={`/anuncios/${anuncioDetalhe.id}`} replace />;
  }

  return (
    <main className="anuncio-page">
      <section className="anuncio-page-content">
        <header className="anuncio-page-heading">
          <h1>Editar anúncio</h1>
          <p>Atualize os dados e as fotos do seu anúncio.</p>
        </header>
        {erroCategorias ? (
          <div className="anuncio-alert-error" role="alert">{erroCategorias}</div>
        ) : (
          <AnuncioForm
            key={anuncioDetalhe.id}
            categorias={categorias}
            initialAnuncio={anuncioDetalhe}
            carregando={carregando}
            erro={erro}
            errosCampos={errosCampos}
            onSubmit={salvar}
          />
        )}
      </section>
    </main>
  );
}
