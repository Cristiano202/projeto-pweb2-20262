import { api } from './api';
import type {
  AlterarEstadoRequest,
  AnuncioDetalhe,
  BuscarAnunciosParams,
  EdicaoAnuncioForm,
  NovoAnuncioForm,
  PaginaAnuncioResumo,
} from '../types';

export const anuncioService = {
  async buscar(params: BuscarAnunciosParams): Promise<PaginaAnuncioResumo> {
    const { data } = await api.get<PaginaAnuncioResumo>('/anuncios', { params });
    return data;
  },

  async obterDetalhe(id: number): Promise<AnuncioDetalhe> {
    const { data } = await api.get<AnuncioDetalhe>(`/anuncios/${id}`);
    return data;
  },

  async criar(dados: NovoAnuncioForm): Promise<AnuncioDetalhe> {
    const formData = new FormData();
    formData.append('titulo', dados.titulo);
    formData.append('descricao', dados.descricao);
    formData.append('modalidade', dados.modalidade);
    if (dados.preco !== undefined) {
      formData.append('preco', String(dados.preco));
    }
    formData.append('estadoConservacao', dados.estadoConservacao);
    formData.append('categoriaId', String(dados.categoriaId));
    formData.append('localEntrega', dados.localEntrega);
    if (dados.capaIndice !== undefined) {
      formData.append('capaIndice', String(dados.capaIndice));
    }
    dados.fotos.forEach((foto) => {
      formData.append('fotos', foto);
    });

    const { data } = await api.post<AnuncioDetalhe>('/anuncios', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async editar(id: number, dados: EdicaoAnuncioForm): Promise<AnuncioDetalhe> {
    const formData = new FormData();
    formData.append('titulo', dados.titulo);
    formData.append('descricao', dados.descricao);
    formData.append('modalidade', dados.modalidade);
    if (dados.preco !== undefined) {
      formData.append('preco', String(dados.preco));
    }
    formData.append('estadoConservacao', dados.estadoConservacao);
    formData.append('categoriaId', String(dados.categoriaId));
    formData.append('localEntrega', dados.localEntrega);

    dados.fotosMantidas?.forEach((fotoId) => {
      formData.append('fotosMantidas', String(fotoId));
    });

    dados.fotos?.forEach((foto) => {
      formData.append('fotos', foto);
    });

    if (dados.capaId !== undefined) {
      formData.append('capaId', String(dados.capaId));
    }
    if (dados.capaIndice !== undefined) {
      formData.append('capaIndice', String(dados.capaIndice));
    }

    const { data } = await api.put<AnuncioDetalhe>(`/anuncios/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async alterarEstado(id: number, dados: AlterarEstadoRequest): Promise<AnuncioDetalhe> {
    const { data } = await api.patch<AnuncioDetalhe>(`/anuncios/${id}/estado`, dados);
    return data;
  },
};