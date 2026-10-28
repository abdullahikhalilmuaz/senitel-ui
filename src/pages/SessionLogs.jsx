import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileClock, RefreshCw, Search } from 'lucide-react';
import { api } from '../services/api';

const dateText = (value) => value ? new Date(value).toLocaleString() : '—';
const humanize = (value) => String(value || 'unknown').replaceAll('_', ' ');
const colorFor = (value) => ({ active: 'var(--success)', low: 'var(--success)', medium: 'var(--warning)', step_up_required: 'var(--warning)', high: 'var(--danger)', restricted: 'var(--danger)', revoked: 'var(--text-muted)', expired: 'var(--text-muted)', unknown: 'var(--text-muted)' }[value] || 'var(--text-muted)');

const SessionLogs = () => {
  const [sessions, setSessions] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const response = await api.get('/sessions');
      setSessions(Array.isArray(response.data) ? response.data : []);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load your session history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); const timer = window.setInterval(load, 10000); return () => window.clearInterval(timer); }, [load]);

  const filtered = useMemo(() => sessions.filter((session) => {
    const text = [session._id, session.status, session.riskLevel, session.deviceMetadata?.ip, session.verificationStatus].join(' ').toLowerCase();
    return text.includes(query.toLowerCase());
  }), [sessions, query]);

  return (
    <div>
      <div className="page-heading"><div><p className="eyebrow">ACCOUNT ACTIVITY</p><h1 style={{ marginTop: 9 }}>Session logs</h1><p>Sessions returned by the backend for your account.</p></div><button className="action-button" type="button" onClick={load}><RefreshCw size={15} /> Refresh</button></div>
      <section className="panel">
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 14, alignItems: 'center', marginBottom: 15 }}>
          <h2 className="panel-title" style={{ margin: 0 }}><FileClock size={16} style={{ verticalAlign: 'middle', marginRight: 7 }} />{sessions.length} session record{sessions.length === 1 ? '' : 's'}</h2>
          <label style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, width: 'min(100%,320px)' }}><Search size={16} style={{ position: 'absolute', left: 12, color: 'var(--text-muted)' }} /><input aria-label="Search sessions" placeholder="Search status, ID, IP…" value={query} onChange={(event) => setQuery(event.target.value)} style={{ paddingLeft: 36 }} /></label>
        </div>
        {error && <div className="inline-message error" style={{ marginBottom: 14 }}>{error}</div>}
        {loading && sessions.length === 0 ? <div className="empty-state">Loading sessions…</div> : filtered.length === 0 ? <div className="empty-state">No session records matched this search.</div> : (
          <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Created</th><th>Session / origin IP</th><th>Status</th><th>Risk</th><th>Last activity</th><th /></tr></thead><tbody>{filtered.map((session) => <tr key={session._id}>
            <td>{dateText(session.createdAt)}</td>
            <td><strong style={{ display: 'block', fontWeight: 600 }}>{String(session._id || '').slice(-10) || '—'}</strong><span className="muted" style={{ display: 'block', marginTop: 4 }}>{session.deviceMetadata?.ip || 'IP not recorded'}</span></td>
            <td><span style={{ color: colorFor(session.status), textTransform: 'capitalize' }}>{humanize(session.status)}</span></td>
            <td><span style={{ color: colorFor(session.riskLevel), textTransform: 'capitalize' }}>{humanize(session.riskLevel)}</span>{Number.isFinite(session.trustScore) && session.riskLevel !== 'unknown' ? <small className="muted" style={{ display: 'block', marginTop: 4 }}>{Math.round(session.trustScore)}% trust</small> : null}</td>
            <td>{dateText(session.lastActivityAt)}</td>
            <td><Link className="primary-link" to={`/logs/${session._id}`}>Details →</Link></td>
          </tr>)}</tbody></table></div>
        )}
      </section>
    </div>
  );
};

export default SessionLogs;
