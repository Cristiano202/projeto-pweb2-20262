export interface ApiErro {
  mensagem: string;
  campos?: Record<string, string>;
}

export interface PaginaResposta<T> {
  itens: T[];
  pagina: number;
  tamanho: number;
  total: number;
  totalPaginas: number;
}