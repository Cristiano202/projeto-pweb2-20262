import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { anuncioService } from '../services/anuncioService';
import { listasService } from '../services/listasService';
import type { Categoria, ModalidadeAnuncio, PaginaAnuncioResumo } from '../types';
import { AnuncioCard } from '../components/anuncios';
import { Button, Input, Select } from '../components/ui';
import './ListagemAnuncios.css';

interface ListagemAnunciosPageProps {
  modalidade: ModalidadeAnuncio;
}

export function ListagemAnunciosPage({ modalidade }: ListagemAnunciosPageProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [resultado, setResultado] = useState<PaginaAnuncioResumo | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const categoria = searchParams.get('categoria') || '';
  const precoMin = searchParams.get('precoMin') || '';
  const precoMax = searchParams.get('precoMax') || '';
  const ordem = (searchParams.get('ordem') === 'preco' ? 'preco' : 'data') as 'data' | 'preco';
  const direcao = (searchParams.get('direcao') === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';
  const paginaInformada = Number(searchParams.get('pagina') || 1);
  const pagina = Number.isInteger(paginaInformada) && paginaInformada >= 1 ? paginaInformada : 1;
  const tamanhoPermitido = [5, 10, 25, 50];
  const tamanhoInformado = Number(searchParams.get('tamanho') || 10);
  const tamanho = tamanhoPermitido.includes(tamanhoInformado) ? tamanhoInformado : 10;

  useEffect(() => {
    listasService.listarCategorias()
      .then(setCategorias)
      .catch(() => setErro('Não foi possível carregar as categorias.'));
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        setCarregando(true);
        setErro('');
        const dados = await anuncioService.buscar({
          modalidade,
          categoria: categoria || undefined,
          precoMin: precoMin ? Number(precoMin) : undefined,
          precoMax: precoMax ? Number(precoMax) : undefined,
          ordem,
          direcao,
          pagina,
          tamanho,
        });
        if (ativo) setResultado(dados);
      } catch {
        if (ativo) setErro('Não foi possível carregar os anúncios.');
      } finally {
        if (ativo) setCarregando(false);
      }
    }

    carregar();
    return () => { ativo = false; };
  }, [modalidade, categoria, precoMin, precoMax, ordem, direcao, pagina, tamanho]);

  function atualizarFiltros(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    const campos = ['categoria', 'precoMin', 'precoMax', 'ordem', 'direcao', 'tamanho'];
    campos.forEach((campo) => {
      const valor = String(form.get(campo) || '').trim();
      if (valor) params.set(campo, valor);
    });

    navigate({ pathname: modalidade === 'venda' ? '/vendas' : '/doacoes', search: params.toString() ? `?${params.toString()}` : '' });
  }

  function limparFiltros() {
    setSearchParams({ tamanho: String(tamanho) });
  }

  function irParaPagina(novaPagina: number) {
    const params = new URLSearchParams(searchParams);
    const total = resultado?.totalPaginas || 1;
    const paginaValida = Math.max(1, Math.min(novaPagina, total));

    if (paginaValida <= 1) params.delete('pagina');
    else params.set('pagina', String(paginaValida));

    navigate({
      pathname: modalidade === 'venda' ? '/vendas' : '/doacoes',
      search: params.toString() ? `?${params.toString()}` : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const totalPaginas = resultado?.totalPaginas || 0;
  const primeiraPaginaVisivel = Math.max(1, pagina - 2);
  const ultimaPaginaVisivel = Math.min(totalPaginas, pagina + 2);
  const paginasVisiveis = Array.from(
    { length: Math.max(0, ultimaPaginaVisivel - primeiraPaginaVisivel + 1) },
    (_, indice) => primeiraPaginaVisivel + indice
  );

  const titulo = modalidade === 'venda' ? 'Itens à venda' : 'Itens em doação';

  return (
    <main className="listagem-page">
      <div className="listagem-container">
        <header className="listagem-header">
          <div>
            <p className="listagem-eyebrow">BRICS DO IF</p>
            <h1>{titulo}</h1>
          </div>

          <div className="listagem-header-acoes">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)}>Voltar</Button>
            <Link to="/anuncios/novo"><Button type="button">Anunciar item</Button></Link>
          </div>
        </header>

        <nav className="listagem-tabs" aria-label="Tipo de anúncio">
          <Link className={modalidade === 'venda' ? 'active' : ''} to="/vendas">Vendas</Link>
          <Link className={modalidade === 'doacao' ? 'active' : ''} to="/doacoes">Doações</Link>
        </nav>

        <form className="listagem-filtros" key={searchParams.toString()} onSubmit={atualizarFiltros}>
          <Select
            label="Categoria"
            name="categoria"
            defaultValue={categoria}
            placeholder="Todas as categorias"
            options={categorias.map((item) => ({ value: item.slug, label: item.nome }))}
          />

          {modalidade === 'venda' && (
            <div className="listagem-precos">
              <Input
                label="Preço mínimo"
                name="precoMin"
                type="number"
                min="0"
                step="0.01"
                defaultValue={precoMin}
                placeholder="R$ 0"
              />
              <Input
                label="Preço máximo"
                name="precoMax"
                type="number"
                min="0"
                step="0.01"
                defaultValue={precoMax}
                placeholder="R$ 1000"
              />
            </div>
          )}

          <Select
            label="Ordenar por"
            name="ordem"
            defaultValue={ordem}
            options={[
              { value: 'data', label: 'Data de publicação' },
              ...(modalidade === 'venda' ? [{ value: 'preco', label: 'Preço' }] : []),
            ]}
          />

          <Select
            label="Direção"
            name="direcao"
            defaultValue={direcao}
            options={[
              { value: 'desc', label: 'Mais recentes / maior valor' },
              { value: 'asc', label: 'Mais antigos / menor valor' },
            ]}
          />

          <Select
            label="Itens por página"
            name="tamanho"
            defaultValue={String(tamanho)}
            options={[5, 10, 25, 50].map((valor) => ({ value: String(valor), label: String(valor) }))}
          />

          <div className="listagem-filtros-acoes">
            <Button type="submit">Buscar</Button>
            <Button type="button" variant="secondary" onClick={limparFiltros}>Limpar</Button>
          </div>
        </form>

        {carregando ? (
          <div className="listagem-status" aria-live="polite">Carregando anúncios...</div>
        ) : erro ? (
          <div className="listagem-alert" role="alert">{erro}</div>
        ) : resultado?.itens.length ? (
          <>
            <div className="listagem-resumo">
              <span>{resultado.total} anúncio{resultado.total === 1 ? '' : 's'} encontrado{resultado.total === 1 ? '' : 's'}</span>
            </div>
            <div className="listagem-grid">
              {resultado.itens.map((anuncio) => (
                <AnuncioCard key={anuncio.id} anuncio={anuncio} />
              ))}
            </div>

            {resultado.totalPaginas > 1 && (
              <nav className="listagem-paginacao" aria-label="Paginação dos anúncios">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={pagina <= 1}
                  onClick={() => irParaPagina(1)}
                  aria-label="Ir para a primeira página"
                >Primeira</Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={pagina <= 1}
                  onClick={() => irParaPagina(pagina - 1)}
                  aria-label="Ir para a página anterior"
                >Anterior</Button>

                <div className="listagem-paginas" aria-label="Números das páginas">
                  {primeiraPaginaVisivel > 1 && <span aria-hidden="true">...</span>}
                  {paginasVisiveis.map((numero) => (
                    <Button
                      key={numero}
                      type="button"
                      variant={numero === pagina ? 'primary' : 'secondary'}
                      size="sm"
                      className="listagem-pagina"
                      aria-label={`Ir para a página ${numero}`}
                      aria-current={numero === pagina ? 'page' : undefined}
                      onClick={() => irParaPagina(numero)}
                    >{numero}</Button>
                  ))}
                  {ultimaPaginaVisivel < totalPaginas && <span aria-hidden="true">...</span>}
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={pagina >= resultado.totalPaginas}
                  onClick={() => irParaPagina(pagina + 1)}
                  aria-label="Ir para a próxima página"
                >Próxima</Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={pagina >= resultado.totalPaginas}
                  onClick={() => irParaPagina(resultado.totalPaginas)}
                  aria-label="Ir para a última página"
                >Última</Button>

                <span className="listagem-paginacao-info">
                  Página {resultado.pagina} de {resultado.totalPaginas}
                </span>
              </nav>
            )}
          </>
        ) : (
          <div className="listagem-vazia">
            <h2>Nenhum anúncio encontrado</h2>
            <p>Tente ajustar os filtros ou limpar a busca.</p>
            <Button type="button" variant="secondary" onClick={limparFiltros}>Limpar filtros</Button>
          </div>
        )}
      </div>
    </main>
  );
}
