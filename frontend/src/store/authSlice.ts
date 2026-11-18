import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { api } from '../services/api';

export type PerfilUsuario = 'ESTUDANTE' | 'ADMIN';

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  curso?: string;
  telefone?: string;
  fotoUrl?: string;
  perfil: PerfilUsuario;
}

interface AuthState {
  usuario: UsuarioLogado | null;
  token: string | null;
  perfil: PerfilUsuario | null;
  carregando: boolean;
  erro: string | null;
  errosCampos: Record<string, string>;
}

const initialState: AuthState = {
  usuario: JSON.parse(localStorage.getItem('usuario') || 'null'),
  token: localStorage.getItem('token'),
  perfil: (localStorage.getItem('perfil') as PerfilUsuario | null) || null,
  carregando: false,
  erro: null,
  errosCampos: {},
};

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credenciais: { email: string; senha: string }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credenciais);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || { mensagem: 'Erro ao realizar login', campos: {} }
      );
    }
  }
);

export const cadastroThunk = createAsyncThunk(
  'auth/cadastro',
  async (
    dados: { nome: string; email: string; senha: string; cursoId: number; telefone?: string },
    { rejectWithValue }
  ) => {
    try {
      const { data } = await api.post('/auth/cadastro', dados);
      return data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data || { mensagem: 'Erro ao realizar cadastro', campos: {} }
      );
    }
  }
);

export const restaurarSessaoThunk = createAsyncThunk(
  'auth/restaurarSessao',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token');
    if (!token) return rejectWithValue(null);

    try {
      const { data } = await api.get('/usuarios/me');
      return { token, usuario: data };
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('perfil');
      localStorage.removeItem('usuario');
      return rejectWithValue(null);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.usuario = null;
      state.token = null;
      state.perfil = null;
      state.erro = null;
      state.errosCampos = {};
      localStorage.removeItem('token');
      localStorage.removeItem('perfil');
      localStorage.removeItem('usuario');
    },
    atualizarUsuarioLogado(state, action: PayloadAction<Partial<UsuarioLogado>>) {
      if (state.usuario) {
        state.usuario = { ...state.usuario, ...action.payload };
        localStorage.setItem('usuario', JSON.stringify(state.usuario));
      }
    },
    limparErrosAuth(state) {
      state.erro = null;
      state.errosCampos = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.carregando = true;
        state.erro = null;
        state.errosCampos = {};
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.carregando = false;
        state.token = action.payload.token;
        state.usuario = action.payload.usuario || null;
        state.perfil = action.payload.usuario?.perfil || 'ESTUDANTE';
        localStorage.setItem('token', state.token!);
        localStorage.setItem('perfil', state.perfil!);
        if (state.usuario) localStorage.setItem('usuario', JSON.stringify(state.usuario));
      })
      .addCase(loginThunk.rejected, (state, action: any) => {
        state.carregando = false;
        state.erro = action.payload?.mensagem || 'Falha na autenticação';
        state.errosCampos = action.payload?.campos || {};
      })
      .addCase(cadastroThunk.pending, (state) => {
        state.carregando = true;
        state.erro = null;
        state.errosCampos = {};
      })
      .addCase(cadastroThunk.fulfilled, (state, action) => {
        state.carregando = false;
        if (action.payload.token) {
          state.token = action.payload.token;
          state.usuario = action.payload.usuario || null;
          state.perfil = action.payload.usuario?.perfil || 'ESTUDANTE';
          localStorage.setItem('token', state.token!);
          localStorage.setItem('perfil', state.perfil!);
          if (state.usuario) localStorage.setItem('usuario', JSON.stringify(state.usuario));
        }
      })
      .addCase(cadastroThunk.rejected, (state, action: any) => {
        state.carregando = false;
        state.erro = action.payload?.mensagem || 'Falha ao cadastrar';
        state.errosCampos = action.payload?.campos || {};
      })
      .addCase(restaurarSessaoThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.usuario = action.payload.usuario;
        state.perfil = action.payload.usuario?.perfil || 'ESTUDANTE';
      })
      .addCase(restaurarSessaoThunk.rejected, (state) => {
        state.token = null;
        state.usuario = null;
        state.perfil = null;
      });
  },
});

export const { logout, atualizarUsuarioLogado, limparErrosAuth } = authSlice.actions;
export default authSlice.reducer;