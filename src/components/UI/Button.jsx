import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Button = ({ children, isLoading, variant = 'primary', style, ...props }) => {
  const baseStyle = {
    width: '100%',
    padding: '16px 24px',
    borderRadius: '16px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    ...style
  };

  const variants = {
    primary: { 
      background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', 
      color: 'white',
      boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
    },
    outline: { 
      background: 'rgba(255,255,255,0.05)', 
      border: '1px solid rgba(255,255,255,0.1)', 
      color: 'white',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
    },
    danger: { 
      background: 'linear-gradient(135deg, #ef4444, #b91c1c)', 
      color: 'white',
      boxShadow: '0 4px 20px rgba(239, 68, 68, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      style={{ ...baseStyle, ...variants[variant] }}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? <Loader2 size={22} className="animate-spin" /> : children}
    </motion.button>
  );
};

export default Button;
