import { io } from 'socket.io-client';
export const socket = io('https://caus-backend.onrender.com', {
  withCredentials: true
});