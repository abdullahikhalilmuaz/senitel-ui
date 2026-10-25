import { createContext, useContext, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const playSound = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.volume = 0.4;
    audio.play().catch(e => console.log('Audio play failed:', e));
  };

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    playSound();

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 50, scale: 0.8, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              className="liquid-glass"
              style={{
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'white',
                minWidth: '280px'
              }}
            >
              {toast.type === 'success' ? <CheckCircle color="var(--success)" size={24} /> : <AlertCircle color="var(--danger)" size={24} />}
              <span style={{ fontSize: '15px', fontWeight: '500' }}>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
