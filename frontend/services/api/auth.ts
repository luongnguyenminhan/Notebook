import axiosInstance from '@/lib/utils/axiosInstance';

// --- Types ---
export interface UserRegister {
  username: string;
  email: string;
  password: string;
}

export interface UserResponse {
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

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface AccountResponse {
  user: UserResponse;
  stats: {
    recordings_count: number;
    storage_used: number;
  };
  use_asr_endpoint: boolean;
  asr_diarize_locked: boolean;
  asr_diarize_env_value: string | null;
}

export interface IsFirstUserResponse {
  is_first_user: boolean;
}

// --- API Functions ---

export async function register(data: UserRegister): Promise<UserResponse> {
  const res = await axiosInstance.post<UserResponse>('/auth/register', data);
  return res.data;
}

export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', email);
  params.append('password', password);
  params.append('scope', '');
  params.append('client_id', 'string');
  params.append('client_secret', 'string');
  const res = await axiosInstance.post<LoginResponse>('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return res.data;
}

export async function getMe(token: string): Promise<UserResponse> {
  const res = await axiosInstance.get<UserResponse>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function getAccount(token: string): Promise<AccountResponse> {
  const res = await axiosInstance.get<AccountResponse>('/auth/account', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

export async function checkIsFirstUser(): Promise<IsFirstUserResponse> {
  const res = await axiosInstance.get<IsFirstUserResponse>(
    '/auth/is-first-user',
  );
  return res.data;
}

export async function initSuperUser(data: UserRegister): Promise<UserResponse> {
  const res = await axiosInstance.post<UserResponse>(
    '/auth/init-superuser',
    data,
  );
  return res.data;
}
