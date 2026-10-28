import { Navigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Fingerprint } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AuthLayout = () => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <main className="auth-layout">
      <section className="auth-panel">
        <div className="brand-lockup">
          <div className="brand-mark">S</div>
          <div>
            <h1>Sentinel</h1>
            <p>Continuous Authentication</p>
          </div>
        </div>
        <Outlet />
        <p className="auth-footnote">Behavioural telemetry is collected only after you enable monitoring.</p>
      </section>
      <section className="auth-visual" aria-label="Sentinel system introduction">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="auth-visual-content">
          <div className="auth-orb"><Fingerprint size={54} strokeWidth={1.4} /></div>
          <p className="eyebrow">CONTINUOUS TRUST · SESSION PROTECTION</p>
          <h2>Your behaviour adds another layer of identity.</h2>
          <p className="auth-visual-copy">Sentinel observes timing patterns—not the text you type—and compares consented activity with your enrolled baseline.</p>
          <div className="auth-feature-row"><span><ShieldCheck size={18} /> Session-aware</span><span><Activity size={18} /> Behaviour-driven</span></div>
        </motion.div>
      </section>
    </main>
  );
};

export default AuthLayout;
