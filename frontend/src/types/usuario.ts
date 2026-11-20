import type { Curso } from './listas';

export type PapelUsuario = 'estudante' | 'administrador';

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  curso: Curso;
  telefone: string | null;
  fotoUrl: string | null;
  papel: PapelUsuario;
}

export interface Perfil {
  id: number;
  nome: string;
  curso: Curso;
  telefone: string | null;
  fotoUrl: string | null;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface CadastroRequest {
  nome: string;
  email: string;
  senha: string;
  cursoId: number;
  telefone?: string | null;
}

export interface SessaoResposta {
  token: string;
  expiraEm: string;
  usuario: UsuarioLogado;
}

export interface AtualizarUsuarioRequest {
  nome: string;
  cursoId: number;
  telefone?: string | null;
}