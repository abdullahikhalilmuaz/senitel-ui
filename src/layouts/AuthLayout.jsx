import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}>
      <div style={{ display: 'none', '@media (min-width: 900px)': { display: 'block' } }}></div>
      
      {/* Mobile view / Login form container */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px', zIndex: 1 }}>
        
        <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
              <div className="liquid-glass" style={{ width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '20px', borderRadius: '16px' }}>S</div>
              <div>
                <h1 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '-0.5px' }}>Sentinel</h1>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Continuous Authentication</p>
              </div>
            </div>
            <Outlet />
        </div>
      </div>

      {/* Desktop Right Side Graphic (Hidden on mobile) */}
      <div style={{ display: 'none', flex: 1, position: 'relative', overflow: 'hidden', alignItems: 'center', justifyContent: 'center', '@media (min-width: 900px)': { display: 'flex' } }}>
          <motion.div 
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}
            style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '40px' }}
          >
            <h2 style={{ fontSize: '56px', fontWeight: '800', lineHeight: '1.1', marginBottom: '24px', letterSpacing: '-1.5px' }}>
              Your Behaviour <br/>
              <span style={{ background: 'linear-gradient(to right, #8b5cf6, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Is Your Identity.</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '18px', maxWidth: '420px', margin: '0 auto', lineHeight: '1.6' }}>
              Sentinel continuously verifies that it's really you — using your unique behavioural patterns.
            </p>
          </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout;
