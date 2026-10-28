import { io } from 'socket.io-client';

const fallbackApiUrl = import.meta.env.DEV
  ? 'http://127.0.0.1:5000/api'
  : 'https://caus-backend.onrender.com/api';

const apiUrl = import.meta.env.VITE_API_BASE_URL || fallbackApiUrl;
const inferredSocketUrl = apiUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');
const socketUrl = (import.meta.env.VITE_SOCKET_URL || inferredSocketUrl).replace(/\/+$/, '');

let socketInstance;

export function getSocket() {
  if (!socketInstance) {
    socketInstance = io(socketUrl, {
      autoConnect: false,
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      timeout: 8000,
    });
  }
  return socketInstance;
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.removeAllListeners();
    socketInstance.disconnect();
    socketInstance = undefined;
  }
}
