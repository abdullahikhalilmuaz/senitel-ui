import axios from 'axios';

const fallbackApiUrl = import.meta.env.DEV
  ? 'http://127.0.0.1:5000/api'
  : 'https://caus-backend.onrender.com/api';

const baseURL = (import.meta.env.VITE_API_BASE_URL || fallbackApiUrl).replace(/\/+$/, '');

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});
