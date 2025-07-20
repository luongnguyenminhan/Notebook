/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { login as apiLogin, getMe, setAccessToken as persistAccessToken, removeAccessToken, getAccessToken } from '@/api/authApi';

interface UserProfile {
  id: number;
  username: string;
  email: string;
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
}

interface AuthState {
  accessToken: string | null;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: getAccessToken(),
  user: null,
  loading: false,
  error: null,
};


export const loginThunk = createAsyncThunk<
  string,
  { username: string; password: string },
  { rejectValue: string }
>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await apiLogin(payload);
      persistAccessToken(data.access_token);
      return data.access_token;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.detail || err?.message || 'Login failed'
      );
    }
  }
);


export const fetchUserThunk = createAsyncThunk<
  UserProfile,
  void,
  { rejectValue: string }
>(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getMe();
      return user;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.detail || err?.message || 'Failed to fetch user'
      );
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  removeAccessToken();
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
      setAccessToken(action.payload);
    },
    setUser(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload;
    },
    logout(state) {
      state.accessToken = null;
      state.user = null;
      removeAccessToken();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed';
      })
      .addCase(fetchUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch user';
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.accessToken = null;
        state.user = null;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { setAccessToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
export type { UserProfile, AuthState }; 