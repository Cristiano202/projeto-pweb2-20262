import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { anuncioService } from '../services/anuncioService';
import type {
  AnuncioDetalhe,
  ApiErro,
  AlterarEstadoRequest,
  EdicaoAnuncioForm,
  NovoAnuncioForm,
} from '../types';

interface AnunciosState {
  anuncioDetalhe: AnuncioDetalhe | null;
  carregando: boolean;
  erro: string | null;
  errosCampos: Record<string, string>;
}

const initialState: AnunciosState = {
  anuncioDetalhe: null,
  carregando: false,
  erro: null,
  errosCampos: {},
};

function erroDaApi(error: unknown, mensagemPadrao: string): ApiErro {
  if (axios.isAxiosError<ApiErro>(error) && error.response?.data) {
    return error.response.data;
  }
  return { mensagem: mensagemPadrao };
}

export const buscarAnuncioPorIdThunk = createAsyncThunk<
  AnuncioDetalhe,
  string | number,
  { rejectValue: ApiErro }
>('anuncios/buscarPorId', async (id, { rejectWithValue }) => {
  try {
    return await anuncioService.obterDetalhe(Number(id));
  } catch (error) {
    return rejectWithValue(erroDaApi(error, 'Não foi possível carregar o anúncio.'));
  }
});

export const criarAnuncioThunk = createAsyncThunk<
  AnuncioDetalhe,
  NovoAnuncioForm,
  { rejectValue: ApiErro }
>('anuncios/criar', async (dados, { rejectWithValue }) => {
  try {
    return await anuncioService.criar(dados);
  } catch (error) {
    return rejectWithValue(erroDaApi(error, 'Não foi possível criar o anúncio.'));
  }
});

export const editarAnuncioThunk = createAsyncThunk<
  AnuncioDetalhe,
  { id: string | number; dados: EdicaoAnuncioForm },
  { rejectValue: ApiErro }
>('anuncios/editar', async ({ id, dados }, { rejectWithValue }) => {
  try {
    return await anuncioService.editar(Number(id), dados);
  } catch (error) {
    return rejectWithValue(erroDaApi(error, 'Não foi possível editar o anúncio.'));
  }
});

export const alterarEstadoAnuncioThunk = createAsyncThunk<
  AnuncioDetalhe,
  { id: string | number; dados: AlterarEstadoRequest },
  { rejectValue: ApiErro }
>('anuncios/alterarEstado', async ({ id, dados }, { rejectWithValue }) => {
  try {
    return await anuncioService.alterarEstado(Number(id), dados);
  } catch (error) {
    return rejectWithValue(erroDaApi(error, 'Não foi possível alterar o estado.'));
  }
});

const anunciosSlice = createSlice({
  name: 'anuncios',
  initialState,
  reducers: {
    limparAnuncioDetalhe(state) {
      state.anuncioDetalhe = null;
      state.carregando = false;
      state.erro = null;
      state.errosCampos = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(buscarAnuncioPorIdThunk.pending, (state) => {
        state.carregando = true;
        state.erro = null;
        state.errosCampos = {};
      })
      .addCase(buscarAnuncioPorIdThunk.fulfilled, (state, action) => {
        state.carregando = false;
        state.anuncioDetalhe = action.payload;
      })
      .addCase(buscarAnuncioPorIdThunk.rejected, (state, action) => {
        state.carregando = false;
        state.erro = action.payload?.mensagem || 'Não foi possível carregar o anúncio.';
        state.errosCampos = action.payload?.campos || {};
      })
      .addCase(criarAnuncioThunk.pending, (state) => {
        state.carregando = true;
        state.erro = null;
        state.errosCampos = {};
      })
      .addCase(criarAnuncioThunk.fulfilled, (state, action) => {
        state.carregando = false;
        state.anuncioDetalhe = action.payload;
      })
      .addCase(criarAnuncioThunk.rejected, (state, action) => {
        state.carregando = false;
        state.erro = action.payload?.mensagem || 'Não foi possível criar o anúncio.';
        state.errosCampos = action.payload?.campos || {};
      })
      .addCase(editarAnuncioThunk.pending, (state) => {
        state.carregando = true;
        state.erro = null;
        state.errosCampos = {};
      })
      .addCase(editarAnuncioThunk.fulfilled, (state, action) => {
        state.carregando = false;
        state.anuncioDetalhe = action.payload;
      })
      .addCase(editarAnuncioThunk.rejected, (state, action) => {
        state.carregando = false;
        state.erro = action.payload?.mensagem || 'Não foi possível editar o anúncio.';
        state.errosCampos = action.payload?.campos || {};
      })
      .addCase(alterarEstadoAnuncioThunk.pending, (state) => {
        state.carregando = true;
        state.erro = null;
        state.errosCampos = {};
      })
      .addCase(alterarEstadoAnuncioThunk.fulfilled, (state, action) => {
        state.carregando = false;
        state.anuncioDetalhe = action.payload;
      })
      .addCase(alterarEstadoAnuncioThunk.rejected, (state, action) => {
        state.carregando = false;
        state.erro = action.payload?.mensagem || 'Não foi possível alterar o estado.';
        state.errosCampos = action.payload?.campos || {};
      });
  },
});

export const { limparAnuncioDetalhe } = anunciosSlice.actions;
export default anunciosSlice.reducer;
