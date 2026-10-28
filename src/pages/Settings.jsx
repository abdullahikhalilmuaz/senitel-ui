import { Link } from 'react-router-dom';
import { Bell, Fingerprint, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Settings = () => {
  const { monitoringEnabled, setMonitoringEnabled } = useAuth();

  return (
    <div>
      <div className="page-heading"><div><p className="eyebrow">PREFERENCES</p><h1 style={{ marginTop: 9 }}>Settings</h1><p>Manage the monitoring preference supported by this prototype.</p></div></div>
      <section className="panel" style={{ maxWidth: 820 }}>
        <h2 className="panel-title"><SlidersHorizontal size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />Behaviour monitoring</h2>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ display: 'grid', placeItems: 'center', width: 42, height: 42, flex: '0 0 42px', borderRadius: 13, background: 'rgba(139,92,246,.14)', color: '#c4b5fd' }}><Fingerprint size={20} /></div>
          <div style={{ flex: 1 }}><strong style={{ display: 'block', fontSize: 13 }}>Collect behavioural feature summaries</strong><p className="muted" style={{ fontSize: 12, lineHeight: 1.7, margin: '7px 0 0' }}>When on, the browser samples key timing, pointer speed, click intervals, idle ratio, and counts of interactions/navigation. It does not capture typed characters, and password fields are excluded.</p></div>
          <button className={`action-button ${monitoringEnabled ? 'primary' : ''}`} type="button" onClick={() => setMonitoringEnabled(!monitoringEnabled)}>{monitoringEnabled ? 'Pause' : 'Enable'}</button>
        </div>
        <div className="inline-message" style={{ marginTop: 18 }}>{monitoringEnabled ? 'Monitoring is enabled for this account on this browser. The consent preference is stored locally in this browser.' : 'Monitoring is paused. No new behavioural batches will be submitted until you enable it.'}</div>
        <Link className="primary-link" style={{ display: 'inline-block', marginTop: 18 }} to="/profile">Manage enrollment and baseline →</Link>
      </section>
      <section className="panel" style={{ maxWidth: 820, marginTop: 18 }}>
        <h2 className="panel-title"><ShieldCheck size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />Authentication controls</h2>
        <p className="muted" style={{ margin: 0, fontSize: 12, lineHeight: 1.8 }}>Password-based step-up verification is supported when the backend marks the current session as <code>step_up_required</code>. Two-factor authentication and alert-delivery preferences are not wired to backend settings yet, so this page does not display fake toggles for them.</p>
        <p style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 15, color: 'var(--text-muted)', fontSize: 12 }}><Bell size={15} />Security alerts are displayed from the backend on the <Link className="primary-link" to="/alerts">Security alerts</Link> page.</p>
      </section>
    </div>
  );
};

export default Settings;
