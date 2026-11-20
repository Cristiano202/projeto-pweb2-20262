import { api } from './api';
import type { CadastroRequest, LoginRequest, SessaoResposta } from '../types';

export const authService = {
  async login(dados: LoginRequest): Promise<SessaoResposta> {
    const { data } = await api.post<SessaoResposta>('/auth/login', dados);
    return data;
  },

  async cadastrar(dados: CadastroRequest): Promise<SessaoResposta> {
    const { data } = await api.post<SessaoResposta>('/auth/cadastro', dados);
    return data;
  },
};