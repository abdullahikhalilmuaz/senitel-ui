import { motion } from 'framer-motion';

const BreathingLoader = () => {
  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#050508' }}>
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.6, 1, 0.6],
          boxShadow: [
            "0px 0px 0px 0px rgba(139, 92, 246, 0)",
            "0px 0px 80px 30px rgba(139, 92, 246, 0.4)",
            "0px 0px 0px 0px rgba(139, 92, 246, 0)"
          ]
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '30%',
          background: 'linear-gradient(135deg, rgba(139,92,246,1), rgba(76,29,149,1))',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '32px',
          fontWeight: 'bold',
          color: 'white',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        S
      </motion.div>
    </div>
  );
};

export default BreathingLoader;
