import { useCallback, useEffect, useState } from 'react';
import { Activity, Database, Fingerprint } from 'lucide-react';
import { api } from '../services/api';

const labels = {
  typingIntervalMean: 'Typing interval mean (ms)',
  typingIntervalStd: 'Typing interval standard deviation (ms)',
  typingIntervalMedian: 'Typing interval median (ms)',
  pointerSpeedMean: 'Pointer speed mean (px/s)',
  pointerSpeedStd: 'Pointer speed standard deviation (px/s)',
  clickIntervalMean: 'Click interval mean (ms)',
  clickIntervalStd: 'Click interval standard deviation (ms)',
  idleRatio: 'Idle ratio (0–1)',
  navigationCount: 'Navigation count',
  interactionCount: 'Interaction count',
};
const format = (value) => Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—';

const BehaviourAnalytics = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      const response = await api.get('/profiles');
      setProfile(response.data);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load baseline statistics.');
    }
  }, []);

  useEffect(() => { load(); const timer = window.setInterval(load, 5000); return () => window.clearInterval(timer); }, [load]);

  const means = profile?.featureStats?.mean || {};
  const deviations = profile?.featureStats?.std || {};
  const rows = Object.entries(labels).filter(([key]) => Object.hasOwn(means, key));

  return (
    <div>
      <div className="page-heading"><div><p className="eyebrow">BASELINE TELEMETRY</p><h1 style={{ marginTop: 9 }}>Behaviour analytics</h1><p>Feature statistics collected from this account's live enrollment batches.</p></div></div>
      {error && <div className="inline-message error" style={{ marginBottom: 18 }}>{error}</div>}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-label"><Database size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />Profile status</div><div className="stat-value" style={{ fontSize: 21, textTransform: 'capitalize' }}>{String(profile?.status || 'loading').replaceAll('_', ' ')}</div><div className="stat-detail">Profile schema v{profile?.featureSchemaVersion || 1}</div></div>
        <div className="stat-card"><div className="stat-label"><Activity size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />Samples collected</div><div className="stat-value">{profile?.sampleCount ?? '—'}</div><div className="stat-detail">20 valid live samples required for a ready baseline</div></div>
        <div className="stat-card"><div className="stat-label"><Fingerprint size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />Model version</div><div className="stat-value" style={{ fontSize: 20 }}>{profile?.modelVersion || 'Unknown'}</div><div className="stat-detail">Model output is not an impostor probability</div></div>
      </div>
      <section className="panel">
        <h2 className="panel-title">Enrolled feature statistics</h2>
        {rows.length === 0 ? <div className="empty-state">No feature statistics have been recorded yet. Enable monitoring in your Behavioural profile and interact with the app to collect live batches.</div> : (
          <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Feature</th><th>Mean</th><th>Standard deviation</th></tr></thead><tbody>{rows.map(([key, label]) => <tr key={key}><td>{label}</td><td>{format(means[key])}</td><td>{format(deviations[key])}</td></tr>)}</tbody></table></div>
        )}
        <p className="muted" style={{ marginTop: 15, fontSize: 11, lineHeight: 1.7 }}>These values describe the enrolled feature summaries. They are not validated identity evidence, and the current population model was trained using synthetic demo data.</p>
      </section>
    </div>
  );
};

export default BehaviourAnalytics;
