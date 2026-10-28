import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, ShieldAlert } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import { api } from '../services/api';

const dateText = (value) => value ? new Date(value).toLocaleString() : '—';
const severityColor = (severity) => ({ low: 'var(--success)', medium: 'var(--warning)', high: 'var(--danger)' }[String(severity).toLowerCase()] || 'var(--text-muted)');
const humanize = (value) => String(value || 'alert').replaceAll('_', ' ');

const SecurityAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const response = await api.get('/alerts');
      setAlerts(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load security alerts.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); const timer = window.setInterval(load, 10000); return () => window.clearInterval(timer); }, [load]);
  const openCount = alerts.filter((alert) => alert.status === 'open').length;

  return (
    <div>
      <div className="page-heading"><div><p className="eyebrow">THREAT AND POLICY EVENTS</p><h1 style={{ marginTop: 9 }}>Security alerts</h1><p>Alerts recorded by the backend for this account.</p></div><button className="action-button" type="button" onClick={load}><RefreshCw size={15} /> Refresh</button></div>
      <div className="stat-grid" style={{ marginBottom: 20 }}><div className="stat-card"><div className="stat-label"><ShieldAlert size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />Total alerts</div><div className="stat-value">{alerts.length}</div><div className="stat-detail">Alert records returned by the API</div></div><div className="stat-card"><div className="stat-label"><AlertTriangle size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />Open alerts</div><div className="stat-value">{openCount}</div><div className="stat-detail">Alerts with status open</div></div></div>
      {error && <div className="inline-message error" style={{ marginBottom: 18 }}>{error}</div>}
      {loading && alerts.length === 0 ? <div className="empty-state">Loading alerts…</div> : alerts.length === 0 ? <div className="empty-state">No security alerts have been recorded for this account.</div> : <div style={{ display: 'grid', gap: 12 }}>{alerts.map((alert) => {
        const color = severityColor(alert.severity);
        return <article className="panel" key={alert._id} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', gap: 14, borderLeft: `3px solid ${color}` }}>
          <div style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, flex: '0 0 42px', borderRadius: 13, color, background: `${color}16` }}><ShieldAlert size={20} /></div>
          <div style={{ flex: '1 1 280px', minWidth: 0 }}><div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 9, marginBottom: 7 }}><strong style={{ fontSize: 14, textTransform: 'capitalize' }}>{humanize(alert.type)}</strong><span className="status-pill" style={{ padding: '4px 8px', color, borderColor: `${color}45` }}>{humanize(alert.severity)}</span><span className="status-pill" style={{ padding: '4px 8px' }}>{humanize(alert.status)}</span></div><p className="muted" style={{ margin: 0, fontSize: 12, lineHeight: 1.7 }}>{alert.reason || 'No additional reason was recorded.'}</p>{alert.sessionId && <Link className="primary-link" style={{ display: 'inline-block', marginTop: 10, fontSize: 11 }} to={`/logs/${alert.sessionId}`}>View related session →</Link>}</div>
          <time className="muted" style={{ fontSize: 10 }}>{dateText(alert.createdAt)}</time>
        </article>;
      })}</div>}
    </div>
  );
};

export default SecurityAlerts;
