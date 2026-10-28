import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Ban, Clock3, Shield, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

const dateText = (value) => value ? new Date(value).toLocaleString() : 'Not recorded';
const humanize = (value) => String(value || 'unknown').replaceAll('_', ' ');
const colorFor = (value) => ({ active: 'var(--success)', low: 'var(--success)', medium: 'var(--warning)', step_up_required: 'var(--warning)', high: 'var(--danger)', restricted: 'var(--danger)', revoked: 'var(--text-muted)', expired: 'var(--text-muted)', unknown: 'var(--text-muted)' }[value] || 'var(--text-muted)');

const SessionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session: currentSession, logout } = useAuth();
  const { addToast } = useToast();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isCurrentSession = Boolean(currentSession?._id && String(currentSession._id) === String(id));

  const load = useCallback(async () => {
    try {
      const response = await api.get(`/sessions/${id}`);
      setSession(response.data);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load this session.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  const handleRevoke = async () => {
    const message = isCurrentSession
      ? 'Revoking the current session will sign you out. Continue?'
      : 'Revoke this session? The associated token will no longer be valid.';
    if (!window.confirm(message)) return;
    setBusy(true);
    try {
      await api.post(`/sessions/${id}/revoke`);
      addToast('Session revoked.', 'success');
      if (isCurrentSession) {
        await logout();
        navigate('/login', { replace: true });
      } else {
        await load();
      }
    } catch (requestError) {
      addToast(requestError.response?.data?.message || 'Could not revoke this session.', 'error');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="empty-state">Loading session details…</div>;
  if (error || !session) return <div><Link className="primary-link" to="/logs">← Back to session logs</Link><div className="inline-message error" style={{ marginTop: 18 }}>{error || 'Session not found.'}</div></div>;

  const canRevoke = !['revoked', 'expired'].includes(session.status);

  return (
    <div>
      <div className="page-heading"><div><Link className="primary-link" to="/logs" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14 }}><ArrowLeft size={15} /> Back to logs</Link><p className="eyebrow">SESSION RECORD</p><h1 style={{ marginTop: 9 }}>Session details</h1><p className="muted" style={{ overflowWrap: 'anywhere' }}>{session._id}</p></div><span className="status-pill" style={{ color: colorFor(session.status) }}>{humanize(session.status)}</span></div>
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-label"><Shield size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />Risk level</div><div className="stat-value" style={{ fontSize: 21, textTransform: 'capitalize', color: colorFor(session.riskLevel) }}>{humanize(session.riskLevel)}</div><div className="stat-detail">{session.riskLevel === 'unknown' ? 'No personalized policy assessment recorded' : 'Risk state from backend session data'}</div></div>
        <div className="stat-card"><div className="stat-label"><ShieldAlert size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />Trust score</div><div className="stat-value" style={{ fontSize: 21 }}>{session.riskLevel !== 'unknown' && Number.isFinite(session.trustScore) ? `${Math.round(session.trustScore)}%` : '—'}</div><div className="stat-detail">Not displayed until a risk level has been assessed</div></div>
        <div className="stat-card"><div className="stat-label"><Clock3 size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />Last activity</div><div className="stat-value" style={{ fontSize: 14 }}>{session.lastActivityAt ? new Date(session.lastActivityAt).toLocaleTimeString() : '—'}</div><div className="stat-detail">{dateText(session.lastActivityAt)}</div></div>
      </div>
      <section className="panel">
        <h2 className="panel-title">Recorded session metadata</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 20 }}>
          <div><div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>Created</div><strong style={{ fontSize: 12 }}>{dateText(session.createdAt)}</strong></div>
          <div><div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>Expires</div><strong style={{ fontSize: 12 }}>{dateText(session.expiresAt)}</strong></div>
          <div><div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>Last risk assessment</div><strong style={{ fontSize: 12 }}>{dateText(session.lastAssessmentAt)}</strong></div>
          <div><div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>Origin IP</div><strong style={{ fontSize: 12 }}>{session.deviceMetadata?.ip || 'Not recorded'}</strong></div>
          <div><div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>Verification state</div><strong style={{ fontSize: 12, textTransform: 'capitalize' }}>{humanize(session.verificationStatus)}</strong></div>
          <div><div className="muted" style={{ fontSize: 11, marginBottom: 6 }}>Current browser session</div><strong style={{ fontSize: 12 }}>{isCurrentSession ? 'Yes' : 'No'}</strong></div>
        </div>
        <div className="inline-message" style={{ marginTop: 20 }}>The backend currently exposes session state and timestamps, not a per-session behavioural timeline. No timeline or activity statistics are fabricated on this page.</div>
        {canRevoke && <button className="action-button danger" type="button" onClick={handleRevoke} disabled={busy} style={{ marginTop: 20 }}><Ban size={15} />{busy ? 'Revoking…' : isCurrentSession ? 'Revoke current session and sign out' : 'Revoke session'}</button>}
      </section>
    </div>
  );
};

export default SessionDetails;
