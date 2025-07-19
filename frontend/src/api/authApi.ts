import axiosInstance from './axiosInstance';

// Check if the current user is the first user (for superuser initialization)
export async function checkIsFirstUser(): Promise<{ is_first_user: boolean }> {
  const res = await axiosInstance.get('/auth/is-first-user');
  return res.data;
}

export interface InitSuperUserPayload {
  username: string;
  email: string;
  password: string;
}

// Initialize the first superuser (only allowed if no users exist)
export async function initSuperUser(payload: InitSuperUserPayload) {
  const res = await axiosInstance.post('/auth/init-superuser', payload);
  return res.data;
}

// Register a new user
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}
export async function register(payload: RegisterPayload) {
  const res = await axiosInstance.post('/auth/register', payload);
  return res.data;
}

// Login and get JWT token
export interface LoginPayload {
  username: string; // FastAPI OAuth2PasswordRequestForm expects username field (email in this app)
  password: string;
}
export async function login(payload: LoginPayload) {
  const params = new URLSearchParams();
  params.append('username', payload.username);
  params.append('password', payload.password);
  return axiosInstance.post('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  }).then(res => res.data);
}

// Get current user profile
export async function getMe() {
  const res = await axiosInstance.get('/auth/me');
  return res.data;
}

// Update current user profile
export interface UpdateUserPayload {
  username?: string;
  email?: string;
  password?: string;
  name?: string;
  job_title?: string;
  company?: string;
  transcription_language?: string;
  output_language?: string;
  summary_prompt?: string;
  diarize?: boolean;
}
export async function updateMe(payload: UpdateUserPayload) {
  const res = await axiosInstance.put('/auth/me', payload);
  return res.data;
}

// Change password
export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
}
export async function changePassword(payload: ChangePasswordPayload) {
  const res = await axiosInstance.post('/auth/change-password', payload);
  return res.data;
}

// Get account info (user + stats + settings)
export async function getAccountInfo() {
  const res = await axiosInstance.get('/auth/account');
  return res.data;
}