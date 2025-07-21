import axios from 'axios';

// You can enhance this instance with interceptors, baseURL, etc.
// For environment-based baseURL, use process.env.NEXT_PUBLIC_API_URL or similar.
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000', // Adjust as needed, e.g. process.env.NEXT_PUBLIC_API_URL
  withCredentials: true, // If you need cookies for auth, else remove
});

export default axiosInstance;
