import { api } from './api';
import type { Categoria, Curso, OpcaoEstadoConservacao } from '../types';

export const listasService = {
  async listarCursos(): Promise<Curso[]> {
    const { data } = await api.get<Curso[]>('/cursos');
    return data;
  },

  async listarCategorias(): Promise<Categoria[]> {
    const { data } = await api.get<Categoria[]>('/categorias');
    return data;
  },

  async listarEstadosConservacao(): Promise<OpcaoEstadoConservacao[]> {
    const { data } = await api.get<OpcaoEstadoConservacao[]>('/estados-conservacao');
    return data;
  },
};