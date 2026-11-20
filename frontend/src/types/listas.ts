export type EstadoConservacaoValor = 'novo' | 'seminovo' | 'usado';

export interface Curso {
  id: number;
  nome: string;
}

export interface Categoria {
  id: number;
  nome: string;
  slug: string;
}

export interface OpcaoEstadoConservacao {
  valor: EstadoConservacaoValor;
  rotulo: string;
}