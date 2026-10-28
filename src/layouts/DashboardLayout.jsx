import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity, AlertTriangle, BarChart3, BrainCircuit, FileClock, LayoutDashboard,
  Keyboard, LogOut, Menu, PlayCircle, Settings, UserRound, X,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useBehaviourTracker } from '../hooks/useBehaviourTracker';
import { useToast } from '../context/ToastContext';
import { getSocket, disconnectSocket } from '../services/socket';
import './DashboardLayout.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/monitoring', label: 'Live monitoring', icon: Activity },
  { path: '/behaviour-lab', label: 'Behaviour measurement lab', icon: Keyboard },
  { path: '/profile', label: 'Behavioural profile', icon: UserRound },
  { path: '/analytics', label: 'Behaviour analytics', icon: BarChart3 },
  { path: '/logs', label: 'Session logs', icon: FileClock },
  { path: '/alerts', label: 'Security alerts', icon: AlertTriangle },
  { path: '/demo', label: 'Demo mode', icon: PlayCircle },
  { path: '/ai', label: 'AI model status', icon: BrainCircuit },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const initials = (name = '') => name.trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase() || '').join('') || 'S';

const DashboardLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [socketStatus, setSocketStatus] = useState('connecting');
  const { user, session, isAuthenticated, logout, monitoringEnabled, setMonitoringEnabled, refreshAuth } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  useBehaviourTracker(isAuthenticated, monitoringEnabled);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      setSocketStatus('disconnected');
      return undefined;
    }

    const socket = getSocket();
    const onConnect = () => setSocketStatus('connected');
    const onDisconnect = () => setSocketStatus('disconnected');
    const onConnectError = () => setSocketStatus('unavailable');
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onConnectError);
    socket.connect();

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onConnectError);
      disconnectSocket();
    };
  }, [isAuthenticated]);

  // Keep the browser on the recovery screen after a refresh/deep link too;
  // event-driven navigation alone would not cover a page reload.
  useEffect(() => {
    if (!['step_up_required', 'restricted'].includes(session?.status)) return;
    setMonitoringEnabled(false);
    if (location.pathname !== '/verify') navigate('/verify', { replace: true });
  }, [session?.status, location.pathname, navigate, setMonitoringEnabled]);

  useEffect(() => {
    const onRiskDecision = async (event) => {
      const decision = event.detail?.decision;
      if (!decision?.policyApplied) return;
      try { await refreshAuth(); } catch { /* retain the current view if refresh fails */ }
      if (decision.action === 'step-up') {
        setMonitoringEnabled(false);
        addToast('Your behavioural pattern changed. Verify your password to continue.', 'error');
        navigate('/verify');
      } else if (decision.action === 'restrict') {
        setMonitoringEnabled(false);
        addToast('High risk detected. Protected features are blocked until email verification succeeds.', 'error');
        navigate('/verify', { replace: true });
      }
    };
    const onBlocked = async (event) => {
      setMonitoringEnabled(false);
      const code = event.detail?.code;
      if (code === 'STEP_UP_REQUIRED' || code === 'SESSION_RESTRICTED') {
        try { await refreshAuth(); } catch { /* retain current session state if refresh fails */ }
        navigate('/verify', { replace: true });
        return;
      }
      if (code === 'SESSION_NOT_ACTIVE') {
        addToast(event.detail?.message || 'This session is no longer active. Please sign in again.', 'error');
        navigate('/login', { replace: true });
        return;
      }
      addToast(event.detail?.message || 'Behaviour monitoring was blocked by session policy.', 'error');
    };
    window.addEventListener('sentinel:risk-decision', onRiskDecision);
    window.addEventListener('sentinel:behaviour-blocked', onBlocked);
    return () => {
      window.removeEventListener('sentinel:risk-decision', onRiskDecision);
      window.removeEventListener('sentinel:behaviour-blocked', onBlocked);
    };
  }, [addToast, navigate, refreshAuth, setMonitoringEnabled]);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const sidebarLinks = (mobile = false) => navItems.map(({ path, label, icon: Icon }) => (
    <NavLink
      key={path}
      to={path}
      onClick={() => mobile && setMenuOpen(false)}
      className={({ isActive }) => `sentinel-nav-link${isActive ? ' active' : ''}`}
    >
      <Icon size={18} strokeWidth={1.8} />
      <span>{label}</span>
    </NavLink>
  ));

  const sidebarBody = (mobile = false) => (
    <>
      <div className="sidebar-brand">
        <div className="brand-mark">S</div>
        <div><strong>Sentinel</strong><small>Continuous authentication</small></div>
      </div>
      <nav className="sidebar-nav" aria-label="Main navigation">{sidebarLinks(mobile)}</nav>
      <div className="sidebar-bottom">
        <div className="monitoring-state">
          <span className={`status-dot ${monitoringEnabled ? 'online' : 'idle'}`} />
          <div><strong>{monitoringEnabled ? 'Monitoring enabled' : 'Monitoring paused'}</strong><small>{monitoringEnabled ? 'Consent enabled on this browser' : 'Enable it in your profile'}</small></div>
        </div>
        <button className="logout-button" type="button" onClick={handleLogout}><LogOut size={17} /> Sign out</button>
      </div>
    </>
  );

  return (
    <div className="sentinel-app-shell">
      <aside className="sentinel-sidebar">{sidebarBody()}</aside>
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button className="mobile-sidebar-backdrop" type="button" aria-label="Close navigation" onClick={() => setMenuOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
            <motion.aside className="sentinel-mobile-sidebar" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 26, stiffness: 250 }}>
              <button className="mobile-close-button" type="button" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={22} /></button>
              {sidebarBody(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="sentinel-main">
        <header className="sentinel-topbar">
          <button className="mobile-menu-button" type="button" aria-label="Open navigation" onClick={() => setMenuOpen(true)}><Menu size={22} /></button>
          <div className="topbar-context"><span className="topbar-eyebrow">SECURITY CONSOLE</span><strong>Session intelligence</strong></div>
          <div className="topbar-right">
            <div className="connection-label"><span className={`status-dot ${socketStatus === 'connected' ? 'online' : 'idle'}`} />{socketStatus === 'connected' ? 'Socket connected' : socketStatus === 'unavailable' ? 'Live channel unavailable' : socketStatus}</div>
            <div className="user-avatar" aria-hidden="true">{initials(user?.name)}</div>
            <div className="user-summary"><strong>{user?.name || 'Sentinel user'}</strong><small>{user?.role === 'admin' ? 'Administrator' : 'Account user'}</small></div>
          </div>
        </header>
        <motion.div key={window.location.pathname} className="page-container" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;
