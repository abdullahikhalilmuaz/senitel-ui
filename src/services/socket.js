import { io } from "socket.io-client";

const socketUrl = import.meta.env.DEV
  ? window.location.origin
  : (
      import.meta.env.VITE_SOCKET_URL || "https://caus-backend.onrender.com"
    ).replace(/\/+$/, "");

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
