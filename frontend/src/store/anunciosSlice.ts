import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../services/api';

interface AnunciosState {
  anuncioDetalhe: any | null;
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

export const buscarAnuncioPorIdThunk = createAsyncThunk(
  'anuncios/buscarPorId',
  async (id: string | number, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/anuncios/${id}`);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { mensagem: 'Anúncio não encontrado' });
    }
  }
);

export const criarAnuncioThunk = createAsyncThunk(
  'anuncios/criar',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/anuncios', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { mensagem: 'Erro ao criar anúncio' });
    }
  }
);

export const editarAnuncioThunk = createAsyncThunk(
  'anuncios/editar',
  async ({ id, dados }: { id: string | number; dados: any }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/anuncios/${id}`, dados);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { mensagem: 'Erro ao editar anúncio' });
    }
  }
);

export const alterarEstadoAnuncioThunk = createAsyncThunk(
  'anuncios/alterarEstado',
  async ({ id, estado }: { id: string | number; estado: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.patch(`/anuncios/${id}/estado`, { estado });
      return data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data || { mensagem: 'Erro ao alterar estado' });
    }
  }
);

const anunciosSlice = createSlice({
  name: 'anuncios',
  initialState,
  reducers: {
    limparAnuncioDetalhe(state) {
      state.anuncioDetalhe = null;
      state.erro = null;
      state.errosCampos = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(buscarAnuncioPorIdThunk.pending, (state) => {
        state.carregando = true;
        state.erro = null;
      })
      .addCase(buscarAnuncioPorIdThunk.fulfilled, (state, action) => {
        state.carregando = false;
        state.anuncioDetalhe = action.payload;
      })
      .addCase(buscarAnuncioPorIdThunk.rejected, (state, action: any) => {
        state.carregando = false;
        state.erro = action.payload?.mensagem || 'Erro ao carregar anúncio';
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
      .addCase(criarAnuncioThunk.rejected, (state, action: any) => {
        state.carregando = false;
        state.erro = action.payload?.mensagem || 'Erro ao criar anúncio';
        state.errosCampos = action.payload?.campos || {};
      })
      .addCase(editarAnuncioThunk.fulfilled, (state, action) => {
        state.carregando = false;
        state.anuncioDetalhe = action.payload;
      })
      .addCase(alterarEstadoAnuncioThunk.fulfilled, (state, action) => {
        state.carregando = false;
        state.anuncioDetalhe = action.payload;
      });
  },
});

export const { limparAnuncioDetalhe } = anunciosSlice.actions;
export default anunciosSlice.reducer;