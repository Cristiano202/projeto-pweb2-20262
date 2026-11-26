import type { PaginaResposta } from './api';
import type { Categoria, EstadoConservacaoValor } from './listas';
import type { Perfil } from './usuario';

export type ModalidadeAnuncio = 'venda' | 'doacao';

export type EstadoAnuncio =
  | 'ativo'
  | 'pausado'
  | 'reservado'
  | 'vendido'
  | 'concluido';

export interface AnuncianteResumo {
  id: number;
  nome: string;
}

export interface FotoAnuncio {
  id: number;
  url: string;
  capa: boolean;
}

export interface AnuncioResumo {
  id: number;
  titulo: string;
  modalidade: ModalidadeAnuncio;
  preco: number | null;
  estado: EstadoAnuncio;
  estadoConservacao: EstadoConservacaoValor;
  categoria: Categoria;
  capaUrl: string;
  anunciante: AnuncianteResumo;
  publicadoEm: string;
  motivoRemocao?: string | null;
}

export type PaginaAnuncioResumo = PaginaResposta<AnuncioResumo>;

export interface AnuncioDetalhe {
  id: number;
  titulo: string;
  descricao: string;
  modalidade: ModalidadeAnuncio;
  preco: number | null;
  estado: EstadoAnuncio;
  estadoConservacao: EstadoConservacaoValor;
  categoria: Categoria;
  localEntrega: string;
  capaUrl: string;
  fotos: FotoAnuncio[];
  anunciante: Perfil;
  publicadoEm: string;
  atualizadoEm: string;
}

export interface BuscarAnunciosParams {
  modalidade: ModalidadeAnuncio;
  categoria?: string;
  precoMin?: number;
  precoMax?: number;
  ordem?: 'data' | 'preco';
  direcao?: 'asc' | 'desc';
  pagina?: number;
  tamanho?: number;
}

export interface NovoAnuncioForm {
  titulo: string;
  descricao: string;
  modalidade: ModalidadeAnuncio;
  preco?: number;
  estadoConservacao: EstadoConservacaoValor;
  categoriaId: number;
  localEntrega: string;
  fotos: File[];
  capaIndice?: number;
}

export interface EdicaoAnuncioForm {
  titulo: string;
  descricao: string;
  modalidade: ModalidadeAnuncio;
  preco?: number;
  estadoConservacao: EstadoConservacaoValor;
  categoriaId: number;
  localEntrega: string;
  fotosMantidas?: number[];
  fotos?: File[];
  capaId?: number;
  capaIndice?: number;
}

export interface AlterarEstadoRequest {
  estado: EstadoAnuncio;
}