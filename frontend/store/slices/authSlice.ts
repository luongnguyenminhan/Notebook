import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getMe, login } from '@/services/api/auth';
export const getMeAsync = createAsyncThunk(
  'auth/getMe',
  async (token: string, { rejectWithValue }) => {
    try {
      const user = await getMe(token);
      return user;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.detail || 'Failed to fetch user info',
      );
    }
  },
);
interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
  user?: {
    username: string;
    email: string;
    id: number;
    is_admin: boolean;
    name?: string | null;
    job_title?: string | null;
    company?: string | null;
    transcription_language?: string | null;
    output_language?: string | null;
    summary_prompt?: string | null;
    diarize: boolean;
    created_at: string;
    updated_at: string;
  };
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
  user: undefined,
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await login(email, password);
      // Save token to localStorage or cookies if needed
      return res.access_token;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.detail || 'Login failed');
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.token = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload;
        state.error = null;
      })
      .addCase(getMeAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMeAsync.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getMeAsync.rejected, (state, action) => {
        state.loading = false;
        state.user = undefined;
        state.error = action.payload as string;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
