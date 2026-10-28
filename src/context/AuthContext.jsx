import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { disconnectSocket } from '../services/socket';

export const AuthContext = createContext(null);

const consentKey = (userId) => `sentinel:behaviour-monitoring:${userId}`;

function readConsent(userId) {
  if (!userId || typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(consentKey(userId)) === 'true';
  } catch {
    return false;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [monitoringEnabled, setMonitoringEnabledState] = useState(false);

  const applyAuth = useCallback((nextUser, nextSession) => {
    setUser(nextUser || null);
    setSession(nextSession || null);
    setMonitoringEnabledState(readConsent(nextUser?._id));
  }, []);

  const clearAuth = useCallback(() => {
    disconnectSocket();
    setUser(null);
    setSession(null);
    setMonitoringEnabledState(false);
  }, []);

  const refreshAuth = useCallback(async () => {
    const response = await api.get('/auth/me');
    applyAuth(response.data?.user, response.data?.session);
    return response.data;
  }, [applyAuth]);

  useEffect(() => {
    let cancelled = false;

    const checkAuth = async () => {
      try {
        const response = await api.get('/auth/me');
        if (!cancelled) applyAuth(response.data?.user, response.data?.session);
      } catch {
        if (!cancelled) {
          setUser(null);
          setSession(null);
          setMonitoringEnabledState(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    checkAuth();
    const handleExpired = () => clearAuth();
    window.addEventListener('sentinel:auth-expired', handleExpired);

    return () => {
      cancelled = true;
      window.removeEventListener('sentinel:auth-expired', handleExpired);
    };
  }, [applyAuth, clearAuth]);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email: email.trim(), password });
      applyAuth(response.data?.user, response.data?.session);
      return { success: true, message: response.data?.message || 'Login successful' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not sign in. Check the backend connection and your credentials.',
      };
    }
  }, [applyAuth]);

  const register = useCallback(async ({ name, email, password }) => {
    try {
      await api.post('/auth/register', { name: name.trim(), email: email.trim(), password });
      // The registration endpoint creates an account but deliberately does not create a session.
      return await login(email, password);
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Could not create the account. Check the backend connection and form details.',
      };
    }
  }, [login]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Clear local app state even if the session has already expired or been revoked.
    } finally {
      clearAuth();
    }
  }, [clearAuth]);

  const setMonitoringEnabled = useCallback((enabled) => {
    const nextEnabled = Boolean(enabled);
    setMonitoringEnabledState(nextEnabled);
    if (!user?._id || typeof window === 'undefined') return;
    try {
      if (nextEnabled) window.localStorage.setItem(consentKey(user._id), 'true');
      else window.localStorage.removeItem(consentKey(user._id));
    } catch {
      // The toggle still works for this app session if storage is unavailable.
    }
  }, [user?._id]);

  const value = useMemo(() => ({
    user,
    session,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    refreshAuth,
    monitoringEnabled,
    setMonitoringEnabled,
  }), [user, session, loading, login, register, logout, refreshAuth, monitoringEnabled, setMonitoringEnabled]);

  if (loading) return null;

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
