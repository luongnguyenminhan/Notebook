import axiosInstance from '@/lib/utils/axiosInstance';

function getToken() {
  if (typeof document === 'undefined') return '';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; token=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || '';
  return '';
}

export interface RecordingResponse {
  id: number;
  user_id: number;
  filename: string;
  original_filename?: string | null;
  audio_path?: string | null;
  transcription?: string | null;
  summary?: string | null;
  status: string;
  file_size?: number | null;
  duration?: number | null;
  processing_started_at?: string | null;
  processing_completed_at?: string | null;
  error_message?: string | null;
  created_at: string;
  updated_at: string;
}

export interface RecordingCreate {
  filename: string;
  original_filename?: string | null;
}

export interface RecordingUpdate {
  filename?: string;
  original_filename?: string;
  transcription?: string;
  summary?: string;
  status?: string;
  file_size?: number;
  duration?: number;
  error_message?: string;
}

export const getAllRecordings = async (
  skip = 0,
  limit = 100,
): Promise<RecordingResponse[]> => {
  const token = getToken();
  const res = await axiosInstance.get<RecordingResponse[]>(
    `/recordings?skip=${skip}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

export const getRecordingById = async (
  id: number,
): Promise<RecordingResponse> => {
  const token = getToken();
  const res = await axiosInstance.get<RecordingResponse>(`/recordings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
export const uploadRecordingFile = async (
  formData: FormData,
): Promise<RecordingResponse> => {
  const token = getToken();
  const res = await axiosInstance.post<RecordingResponse>(
    '/recordings/',
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return res.data;
};

export const updateRecording = async (
  id: number,
  data: RecordingUpdate,
): Promise<RecordingResponse> => {
  const token = getToken();
  const res = await axiosInstance.put<RecordingResponse>(
    `/recordings/${id}`,
    data,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  return res.data;
};

export const deleteRecording = async (id: number): Promise<void> => {
  const token = getToken();
  await axiosInstance.delete(`/recordings/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Chat with recording
export interface RecordingChatRequest {
  message: string;
  history: Array<{ role: string; content: string }>;
}

export interface RecordingChatResponse {
  reply: string;
  history: Array<{ role: string; content: string }>;
}

export const chatWithRecording = async (
  id: number,
  data: RecordingChatRequest,
): Promise<RecordingChatResponse> => {
  const token = getToken();
  const res = await axiosInstance.post<RecordingChatResponse>(
    `/recordings/${id}/chat`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    },
  );
  return res.data;
};
