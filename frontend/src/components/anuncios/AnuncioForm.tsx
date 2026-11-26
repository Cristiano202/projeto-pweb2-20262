import { useEffect, useRef, useState, type FormEvent } from 'react';
import type {
  AnuncioDetalhe,
  Categoria,
  EstadoConservacaoValor,
  FotoAnuncio,
  ModalidadeAnuncio,
} from '../../types';
import { Button, Input } from '../ui';
import './Anuncios.css';

export interface AnuncioFormValues {
  titulo: string;
  descricao: string;
  modalidade: ModalidadeAnuncio;
  preco?: number;
  estadoConservacao: EstadoConservacaoValor;
  categoriaId: number;
  localEntrega: string;
  fotos: File[];
  fotosMantidas: FotoAnuncio[];
  capaId?: number;
  capaIndice?: number;
}

interface AnuncioFormProps {
  categorias: Categoria[];
  initialAnuncio?: AnuncioDetalhe;
  initialModalidade?: ModalidadeAnuncio;
  carregando?: boolean;
  erro?: string | null;
  errosCampos?: Record<string, string>;
  onSubmit: (values: AnuncioFormValues) => void;
}

const estadosConservacao: { valor: EstadoConservacaoValor; rotulo: string }[] = [
  { valor: 'novo', rotulo: 'Novo' },
  { valor: 'seminovo', rotulo: 'Seminovo' },
  { valor: 'usado', rotulo: 'Usado' },
];

const tiposFotoPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
const tamanhoMaximoFoto = 5 * 1024 * 1024;
const quantidadeMaximaFotos = 10;

export function AnuncioForm({
  categorias,
  initialAnuncio,
  initialModalidade = 'venda',
  carregando = false,
  erro,
  errosCampos = {},
  onSubmit,
}: AnuncioFormProps) {
  const [titulo, setTitulo] = useState(initialAnuncio?.titulo ?? '');
  const [descricao, setDescricao] = useState(initialAnuncio?.descricao ?? '');
  const [modalidade, setModalidade] = useState<ModalidadeAnuncio>(initialAnuncio?.modalidade ?? initialModalidade);
  const [preco, setPreco] = useState(initialAnuncio?.preco?.toString() ?? '');
  const [estadoConservacao, setEstadoConservacao] = useState<EstadoConservacaoValor>(
    initialAnuncio?.estadoConservacao ?? 'usado'
  );
  const [categoriaId, setCategoriaId] = useState(
    initialAnuncio?.categoria.id ?? categorias[0]?.id ?? 0
  );
  const [localEntrega, setLocalEntrega] = useState(initialAnuncio?.localEntrega ?? '');
  const [fotosMantidas, setFotosMantidas] = useState<FotoAnuncio[]>(initialAnuncio?.fotos ?? []);
  const [fotosNovas, setFotosNovas] = useState<{ arquivo: File; previewUrl: string }[]>([]);
  const [capaSelecionada, setCapaSelecionada] = useState(
    initialAnuncio?.fotos.find((foto) => foto.capa)
      ? `mantida:${initialAnuncio.fotos.find((foto) => foto.capa)?.id}`
      : initialAnuncio?.fotos.length
        ? `mantida:${initialAnuncio.fotos[0].id}`
        : ''
  );
  const [erroLocal, setErroLocal] = useState('');
  const urlsFotosRef = useRef(new Set<string>());

  useEffect(() => {
    const urls = urlsFotosRef.current;
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
      urls.clear();
    };
  }, []);

  function adicionarFotos(files: FileList | null) {
    if (!files?.length) return;
    const selecionadas = Array.from(files);
    const invalidas = selecionadas.find((foto) => !tiposFotoPermitidos.includes(foto.type));
    if (invalidas) {
      setErroLocal('As fotos devem estar no formato JPEG, PNG ou WebP.');
      return;
    }
    const acimaDoLimite = selecionadas.find((foto) => foto.size > tamanhoMaximoFoto);
    if (acimaDoLimite) {
      setErroLocal('Cada foto deve ter no máximo 5 MB.');
      return;
    }
    if (fotosMantidas.length + fotosNovas.length + selecionadas.length > quantidadeMaximaFotos) {
      setErroLocal('O anúncio pode ter no máximo 10 fotos.');
      return;
    }
    setErroLocal('');
    const novas = selecionadas.map((arquivo) => {
      const previewUrl = URL.createObjectURL(arquivo);
      urlsFotosRef.current.add(previewUrl);
      return { arquivo, previewUrl };
    });
    if (!capaSelecionada) {
      setCapaSelecionada(`nova:${fotosNovas.length}`);
    }
    setFotosNovas((atuais) => [...atuais, ...novas]);
  }

  function removerFotoMantida(id: number) {
    const restantes = fotosMantidas.filter((foto) => foto.id !== id);
    setFotosMantidas(restantes);
    if (capaSelecionada === `mantida:${id}`) {
      setCapaSelecionada(restantes.length ? `mantida:${restantes[0].id}` : '');
    }
  }

  function removerFotoNova(index: number) {
    const removida = fotosNovas[index];
    if (removida) {
      URL.revokeObjectURL(removida.previewUrl);
      urlsFotosRef.current.delete(removida.previewUrl);
    }
    setFotosNovas((atuais) => atuais.filter((_, indice) => indice !== index));
    if (capaSelecionada === `nova:${index}`) setCapaSelecionada('');
    else if (capaSelecionada.startsWith('nova:')) {
      const capaAtual = Number(capaSelecionada.slice('nova:'.length));
      if (capaAtual > index) setCapaSelecionada(`nova:${capaAtual - 1}`);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErroLocal('');

    const totalFotos = fotosMantidas.length + fotosNovas.length;
    if (totalFotos < 1 || totalFotos > quantidadeMaximaFotos) {
      setErroLocal('Adicione entre 1 e 10 fotos ao anúncio.');
      return;
    }
    if (!capaSelecionada) {
      setErroLocal('Escolha uma foto de capa.');
      return;
    }

    const capaExistente = capaSelecionada.startsWith('mantida:')
      ? Number(capaSelecionada.slice('mantida:'.length))
      : undefined;
    const indiceCapaNova = capaSelecionada.startsWith('nova:')
      ? Number(capaSelecionada.slice('nova:'.length))
      : undefined;

    onSubmit({
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      modalidade,
      preco: modalidade === 'venda' ? Number(preco) : undefined,
      estadoConservacao,
      categoriaId,
      localEntrega: localEntrega.trim(),
      fotos: fotosNovas.map(({ arquivo }) => arquivo),
      fotosMantidas,
      capaId: capaExistente,
      capaIndice: indiceCapaNova,
    });
  }

  const totalFotos = fotosMantidas.length + fotosNovas.length;
  const exibirPreco = modalidade === 'venda';

  return (
    <form className="anuncio-form" onSubmit={handleSubmit}>
      {(erro || erroLocal) && (
        <div className="anuncio-alert-error" role="alert">{erroLocal || erro}</div>
      )}

      <Input
        label="Título"
        value={titulo}
        onChange={(event) => setTitulo(event.target.value)}
        maxLength={100}
        required
        error={errosCampos.titulo}
      />

      <div className="anuncio-field">
        <label htmlFor="anuncio-descricao">Descrição <span aria-hidden="true">*</span></label>
        <textarea
          id="anuncio-descricao"
          value={descricao}
          onChange={(event) => setDescricao(event.target.value)}
          maxLength={2000}
          rows={5}
          required
          aria-invalid={Boolean(errosCampos.descricao)}
          aria-describedby={errosCampos.descricao ? 'anuncio-descricao-erro' : undefined}
        />
        {errosCampos.descricao && <span id="anuncio-descricao-erro" className="anuncio-field-error">{errosCampos.descricao}</span>}
      </div>

      <div className="anuncio-form-grid">
        <div className="anuncio-field">
          <label htmlFor="anuncio-modalidade">Modalidade <span aria-hidden="true">*</span></label>
          <select
            id="anuncio-modalidade"
            value={modalidade}
            onChange={(event) => setModalidade(event.target.value as ModalidadeAnuncio)}
            required
          >
            <option value="venda">Venda</option>
            <option value="doacao">Doação</option>
          </select>
        </div>

        {exibirPreco && (
          <Input
            label="Preço (R$)"
            type="number"
            min="0.01"
            max="9999999.99"
            step="0.01"
            value={preco}
            onChange={(event) => setPreco(event.target.value)}
            required
            error={errosCampos.preco}
          />
        )}

        <div className="anuncio-field">
          <label htmlFor="anuncio-conservacao">Estado de conservação <span aria-hidden="true">*</span></label>
          <select
            id="anuncio-conservacao"
            value={estadoConservacao}
            onChange={(event) => setEstadoConservacao(event.target.value as EstadoConservacaoValor)}
            required
          >
            {estadosConservacao.map((estado) => (
              <option key={estado.valor} value={estado.valor}>{estado.rotulo}</option>
            ))}
          </select>
        </div>

        <div className="anuncio-field">
          <label htmlFor="anuncio-categoria">Categoria <span aria-hidden="true">*</span></label>
          <select
            id="anuncio-categoria"
            value={categoriaId}
            onChange={(event) => setCategoriaId(Number(event.target.value))}
            required
            disabled={!categorias.length}
          >
            {!categorias.length && <option value={0}>Nenhuma categoria disponível</option>}
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>{categoria.nome}</option>
            ))}
          </select>
          {errosCampos.categoriaId && <span className="anuncio-field-error">{errosCampos.categoriaId}</span>}
        </div>
      </div>

      <Input
        label="Local de entrega"
        value={localEntrega}
        onChange={(event) => setLocalEntrega(event.target.value)}
        maxLength={200}
        required
        error={errosCampos.localEntrega}
      />

      <section className="anuncio-photo-section" aria-labelledby="anuncio-fotos-heading">
        <div className="anuncio-photo-heading">
          <div>
            <h2 id="anuncio-fotos-heading">Fotos</h2>
            <p>Adicione de 1 a 10 imagens. A primeira imagem selecionada será a capa inicialmente.</p>
          </div>
          <span>{totalFotos}/{quantidadeMaximaFotos}</span>
        </div>
        <label className="anuncio-file-picker">
          <span>Adicionar fotos</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) => {
              adicionarFotos(event.target.files);
              event.target.value = '';
            }}
            disabled={totalFotos >= quantidadeMaximaFotos}
          />
        </label>

        <div className="anuncio-photo-grid">
          {fotosMantidas.map((foto) => (
            <div className="anuncio-photo-item" key={`mantida-${foto.id}`}>
              <img src={foto.url} alt="Foto existente do anúncio" />
              <label>
                <input
                  type="radio"
                  name="anuncio-capa"
                  checked={capaSelecionada === `mantida:${foto.id}`}
                  onChange={() => setCapaSelecionada(`mantida:${foto.id}`)}
                />
                Foto de capa
              </label>
              <button type="button" onClick={() => removerFotoMantida(foto.id)} aria-label="Remover foto">
                Remover
              </button>
            </div>
          ))}
          {fotosNovas.map(({ arquivo, previewUrl }, index) => (
            <div className="anuncio-photo-item" key={`${arquivo.name}-${arquivo.lastModified}-${index}`}>
              <img src={previewUrl} alt={`Prévia de ${arquivo.name}`} />
              <label>
                <input
                  type="radio"
                  name="anuncio-capa"
                  checked={capaSelecionada === `nova:${index}`}
                  onChange={() => setCapaSelecionada(`nova:${index}`)}
                />
                Foto de capa
              </label>
              <button type="button" onClick={() => removerFotoNova(index)} aria-label={`Remover ${arquivo.name}`}>
                Remover
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="anuncio-form-actions">
        <Button type="submit" loading={carregando} disabled={!categorias.length}>
          {initialAnuncio ? 'Salvar alterações' : 'Publicar anúncio'}
        </Button>
      </div>
    </form>
  );
}
