// store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login } from '@/services/api/auth';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
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
  }
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
