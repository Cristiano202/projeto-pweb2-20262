import { api } from './api';
import type {
  AtualizarUsuarioRequest,
  PaginaAnuncioResumo,
  Perfil,
  UsuarioLogado,
} from '../types';

export const usuarioService = {
  async obterUsuarioLogado(): Promise<UsuarioLogado> {
    const { data } = await api.get<UsuarioLogado>('/usuarios/eu');
    return data;
  },

  async atualizarDados(dados: AtualizarUsuarioRequest): Promise<UsuarioLogado> {
    const { data } = await api.put<UsuarioLogado>('/usuarios/eu', dados);
    return data;
  },

  async atualizarFoto(foto: File): Promise<UsuarioLogado> {
    const formData = new FormData();
    formData.append('foto', foto);

    const { data } = await api.put<UsuarioLogado>('/usuarios/eu/foto', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async obterPerfil(id: number): Promise<Perfil> {
    const { data } = await api.get<Perfil>(`/usuarios/${id}`);
    return data;
  },

  async listarAnunciosDoUsuario(
    id: number,
    params?: { pagina?: number; tamanho?: number }
  ): Promise<PaginaAnuncioResumo> {
    const { data } = await api.get<PaginaAnuncioResumo>(`/usuarios/${id}/anuncios`, {
      params,
    });
    return data;
  },
};