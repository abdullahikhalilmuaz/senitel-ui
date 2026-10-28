import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ShieldAlert, ShieldCheck, Mail, RefreshCw, LogOut } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

const Verification = () => {
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [delivery, setDelivery] = useState(null);
  const [busy, setBusy] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [error, setError] = useState('');
  const { session, refreshAuth, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const restricted = session?.status === 'restricted';
  const stepUpRequired = session?.status === 'step_up_required';
  const verificationRequired = restricted || stepUpRequired;

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/auth/verify-step-up', { password });
      await refreshAuth();
      setPassword('');
      addToast('Additional verification successful. Your session is active again.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Verification failed. Check your password and session state.');
    } finally {
      setBusy(false);
    }
  };

  const requestCode = async () => {
    setSendingCode(true);
    setError('');
    try {
      const response = await api.post('/auth/request-verification-code');
      setDelivery(response.data || null);
      setCode('');
      if (response.data?.deliveryMode === 'development-demo') {
        addToast('Development-only demo verification code created. Do not use this mode in production.', 'success');
      } else {
        addToast('A verification code was sent to your account email.', 'success');
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not send a verification code. Check the email configuration.');
    } finally {
      setSendingCode(false);
    }
  };

  const handleCodeSubmit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.post('/auth/verify-otp', { code });
      await refreshAuth();
      setCode('');
      addToast('High-risk verification successful. Your session has been restored.', 'success');
      navigate('/dashboard', { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'The code could not be verified. Request a new code if it has expired.');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 650, margin: '5vh auto' }}>
      <section className="panel" style={{ padding: 'clamp(22px,4vw,36px)' }}>
        <div style={{ display: 'grid', placeItems: 'center', width: 58, height: 58, borderRadius: 18, background: restricted ? 'rgba(239,68,68,.13)' : 'rgba(139,92,246,.16)', color: restricted ? '#fecaca' : '#ddd6fe', marginBottom: 21 }}>
          {restricted ? <ShieldAlert size={28} /> : <ShieldCheck size={28} />}
        </div>
        <p className="eyebrow">{restricted ? 'HIGH-RISK SESSION RECOVERY' : 'STEP-UP AUTHENTICATION'}</p>
        <h1 style={{ margin: '9px 0 10px', fontSize: 26 }}>{restricted ? 'Verify your account to restore access' : 'Verify it’s you'}</h1>

        {!verificationRequired && (
          <>
            <p className="muted" style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 22 }}>This session is not currently marked as requiring additional verification.</p>
            <button className="action-button primary" type="button" onClick={() => navigate('/dashboard')}>Return to dashboard</button>
          </>
        )}

        {stepUpRequired && (
          <>
            <p className="muted" style={{ fontSize: 13, lineHeight: 1.7, marginBottom: 22 }}>Sentinel observed behaviour that crossed the configured medium-risk threshold. The session is waiting for a password check before protected features can resume.</p>
            <form onSubmit={handlePasswordSubmit} style={{ display: 'grid', gap: 14 }}>
              <label style={{ display: 'grid', gap: 8, fontSize: 12, fontWeight: 600 }}>Account password
                <div style={{ position: 'relative' }}><KeyRound size={17} style={{ position: 'absolute', left: 13, top: 14, color: 'var(--text-muted)' }} /><input style={{ paddingLeft: 40 }} type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} maxLength={128} required /></div>
              </label>
              {error && <div className="inline-message error" role="alert">{error}</div>}
              <button className="action-button primary" type="submit" disabled={busy}>{busy ? 'Verifying…' : 'Verify password and continue'}</button>
              <p className="muted" style={{ fontSize: 11, lineHeight: 1.6 }}>The password is verified by the backend. It is not stored by this page.</p>
            </form>
          </>
        )}

        {restricted && (
          <>
            <div className="inline-message error" style={{ marginBottom: 18 }}>A high-risk assessment has restricted protected features for this session. To recover, Sentinel requires a one-time code delivered to the account email. The current session remains restricted until the code is verified.</div>
            <div style={{ display: 'grid', gap: 13 }}>
              <button className="action-button primary" type="button" onClick={requestCode} disabled={sendingCode || busy}><Mail size={16} />{sendingCode ? 'Requesting code…' : delivery ? 'Request a new code' : 'Send verification code'}</button>
              {delivery && (
                <div className="inline-message" role="status">
                  {delivery.deliveryMode === 'email' ? `A code was sent to ${delivery.emailHint || 'your account email'}. It expires in 10 minutes.` : `Development demo mode only: no email was sent. Demo code: ${delivery.demoCode}. Disable DEMO_OTP_ENABLED and configure SMTP before production.`}
                </div>
              )}
              {delivery && (
                <form onSubmit={handleCodeSubmit} style={{ display: 'grid', gap: 12 }}>
                  <label style={{ display: 'grid', gap: 8, fontSize: 12, fontWeight: 600 }}>Six-digit verification code
                    <input inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="000000" required />
                  </label>
                  {error && <div className="inline-message error" role="alert">{error}</div>}
                  <button className="action-button primary" type="submit" disabled={busy || code.length !== 6}>{busy ? 'Checking code…' : 'Verify code and restore session'}</button>
                </form>
              )}
              {!delivery && error && <div className="inline-message error" role="alert">{error}</div>}
              <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: 14, marginTop: 3 }}>
                <p className="muted" style={{ fontSize: 11, lineHeight: 1.7 }}>Codes expire after 10 minutes and are limited to five attempts. In local defence mode, the code may be displayed in this page only when <code>DEMO_OTP_ENABLED=true</code> and <code>NODE_ENV=development</code>. That development-only mode is not suitable for production.</p>
                <button className="action-button" type="button" onClick={signOut} disabled={busy}><LogOut size={15} />Sign out instead</button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Verification;
