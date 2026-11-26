import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnuncioForm, type AnuncioFormValues } from '../components/anuncios';
import { listasService } from '../services/listasService';
import { useAppDispatch, useAppSelector } from '../store';
import { criarAnuncioThunk, limparAnuncioDetalhe } from '../store/anunciosSlice';
import type { Categoria, NovoAnuncioForm } from '../types';

export function CriarAnuncioPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { carregando, erro, errosCampos } = useAppSelector((state) => state.anuncios);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [erroCategorias, setErroCategorias] = useState('');

  useEffect(() => {
    dispatch(limparAnuncioDetalhe());
    let ativo = true;
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
    return () => { ativo = false; };
  }, [dispatch]);

  async function publicar(values: AnuncioFormValues) {
    const dados: NovoAnuncioForm = {
      titulo: values.titulo,
      descricao: values.descricao,
      modalidade: values.modalidade,
      preco: values.preco,
      estadoConservacao: values.estadoConservacao,
      categoriaId: values.categoriaId,
      localEntrega: values.localEntrega,
      fotos: values.fotos,
      capaIndice: values.capaIndice ?? 0,
    };
    const resultado = await dispatch(criarAnuncioThunk(dados));
    if (criarAnuncioThunk.fulfilled.match(resultado)) {
      navigate(`/anuncios/${resultado.payload.id}`, { replace: true });
    }
  }

  if (carregandoCategorias) {
    return <main className="anuncio-page"><div className="anuncio-page-status">Carregando categorias...</div></main>;
  }

  return (
    <main className="anuncio-page">
      <section className="anuncio-page-content">
        <header className="anuncio-page-heading">
          <h1>Criar anúncio</h1>
          <p>Preencha os dados e publique seu item para os estudantes do campus.</p>
        </header>
        {erroCategorias ? (
          <div className="anuncio-alert-error" role="alert">{erroCategorias}</div>
        ) : (
          <AnuncioForm
            categorias={categorias}
            carregando={carregando}
            erro={erro}
            errosCampos={errosCampos}
            onSubmit={publicar}
          />
        )}
      </section>
    </main>
  );
}
