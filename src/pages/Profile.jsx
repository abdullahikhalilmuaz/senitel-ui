import { useCallback, useEffect, useState } from 'react';
import { Activity, CheckCircle2, CirclePause, Fingerprint, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../context/ToastContext';

const REQUIRED_SAMPLES = 20;
const FEATURE_LABELS = {
  typingIntervalMean: 'Typing interval mean',
  typingIntervalStd: 'Typing interval deviation',
  typingIntervalMedian: 'Typing interval median',
  pointerSpeedMean: 'Pointer speed mean',
  pointerSpeedStd: 'Pointer speed deviation',
  clickIntervalMean: 'Click interval mean',
  clickIntervalStd: 'Click interval deviation',
  idleRatio: 'Idle ratio',
  navigationCount: 'Navigation count',
  interactionCount: 'Interaction count',
};
const numberFormat = (value) => Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : '—';
const humanize = (value) => String(value || 'not_started').replaceAll('_', ' ');

const Profile = () => {
  const { monitoringEnabled, setMonitoringEnabled } = useAuth();
  const { addToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const loadProfile = useCallback(async () => {
    try {
      const response = await api.get('/profiles');
      setProfile(response.data || { status: 'not_started', sampleCount: 0, featureStats: {} });
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load your behavioural profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
    const timer = window.setInterval(loadProfile, 5000);
    return () => window.clearInterval(timer);
  }, [loadProfile]);

  const handleMonitoringAction = async () => {
    if (monitoringEnabled && profile?.status !== 'not_started') {
      setMonitoringEnabled(false);
      addToast('Behaviour monitoring paused on this browser.', 'success');
      return;
    }

    setBusy(true);
    try {
      if (!profile || profile.status === 'not_started' || profile.status === 'suspended') {
        const response = await api.post('/profiles/enrolment/start');
        setProfile(response.data?.profile || profile);
        addToast('Baseline enrollment started. Keep using the app to collect live samples.', 'success');
      }
      setMonitoringEnabled(true);
    } catch (requestError) {
      addToast(requestError.response?.data?.message || 'Could not start enrollment.', 'error');
    } finally {
      setBusy(false);
      await loadProfile();
    }
  };

  const status = profile?.status || 'not_started';
  const sampleCount = Number(profile?.sampleCount) || 0;
  const requiredSamples = Number(profile?.requiredSamples) || REQUIRED_SAMPLES;
  const progress = Math.max(0, Math.min(100, Math.round(sampleCount / requiredSamples * 100)));
  const means = profile?.featureStats?.mean || {};
  const deviations = profile?.featureStats?.std || {};
  const canPause = monitoringEnabled && status !== 'not_started' && status !== 'suspended';

  return (
    <div>
      <div className="page-heading"><div><p className="eyebrow">IDENTITY BASELINE</p><h1 style={{ marginTop: 9 }}>Behavioural profile</h1><p>Enroll a baseline using live activity from this browser.</p></div><span className="status-pill" style={{ color: status === 'ready' ? 'var(--success)' : status === 'collecting' ? '#c4b5fd' : 'var(--text-muted)' }}><span className="status-dot" style={{ background: status === 'ready' ? 'var(--success)' : status === 'collecting' ? '#a78bfa' : '#737386', marginTop: 0 }} />{humanize(status)}</span></div>

      {error && <div className="inline-message error" style={{ marginBottom: 18 }}>{error}</div>}

      <section className="panel" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ display: 'grid', placeItems: 'center', flex: '0 0 46px', height: 46, borderRadius: 14, color: '#ddd6fe', background: 'rgba(139,92,246,.16)' }}><Fingerprint size={23} /></div>
          <div style={{ flex: 1 }}>
            <h2 className="panel-title" style={{ marginBottom: 8 }}>Consent and privacy</h2>
            <p className="muted" style={{ fontSize: 12, lineHeight: 1.8, margin: 0 }}>When enabled, Sentinel samples key-press timing (not typed characters), pointer movement speed, click intervals, idle ratio, and simple navigation/interaction counts. Password fields are excluded. Feature summaries are sent to the local backend every 30 seconds when there has been enough activity.</p>
          </div>
        </div>
        <div className="inline-message warning" style={{ marginTop: 18 }}>The current ML model was trained on synthetic demo data. A personalized baseline is collected from your live samples; it is not a guarantee of identity and should be treated as a prototype evaluation.</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginTop: 20 }}>
          <div><strong style={{ display: 'block', fontSize: 13 }}>{monitoringEnabled ? 'Monitoring is enabled on this browser' : 'Monitoring is paused'}</strong><span className="muted" style={{ display: 'block', marginTop: 5, fontSize: 11 }}>{monitoringEnabled ? 'Live feature batches can be submitted while this app is open.' : 'No behavioural samples will be collected until you enable it.'}</span></div>
          <button className="action-button primary" type="button" disabled={busy || loading} onClick={handleMonitoringAction}>{busy ? 'Updating…' : canPause ? <><CirclePause size={16} /> Pause monitoring</> : status === 'ready' ? <><ShieldCheck size={16} /> Enable monitoring</> : status === 'collecting' ? <><Activity size={16} /> Resume enrollment</> : <><Activity size={16} /> Start enrollment</>}</button>
        </div>
      </section>

      <div className="grid-responsive" style={{ alignItems: 'start' }}>
        <section className="panel" style={{ gridColumn: 'span 2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 13 }}><h2 className="panel-title" style={{ margin: 0 }}>Enrollment progress</h2><strong style={{ fontSize: 13 }}>{sampleCount} / {requiredSamples}</strong></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 9, color: 'var(--text-muted)', fontSize: 10 }}><span>{progress}% complete</span><span>{Math.max(0, requiredSamples - sampleCount)} samples remaining</span></div>
          {status === 'ready' ? <div className="inline-message" style={{ marginTop: 18 }}><CheckCircle2 size={16} style={{ verticalAlign: 'middle', marginRight: 7 }} />Your profile has enough live samples for personalized scoring. Risk policy is applied only to live batches scored against this baseline.</div> : <div className="empty-state" style={{ marginTop: 18 }}>{monitoringEnabled ? 'Keep interacting with the app. A batch is submitted every 30 seconds after enough activity is observed.' : 'Enable monitoring to start or resume collection. Enrollment requires at least 20 valid live feature batches.'}</div>}
        </section>
        <section className="panel">
          <h2 className="panel-title">Profile status</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            <div><div className="muted" style={{ fontSize: 11, marginBottom: 5 }}>Feature schema</div><strong style={{ fontSize: 13 }}>v{profile?.featureSchemaVersion || 1}</strong></div>
            <div><div className="muted" style={{ fontSize: 11, marginBottom: 5 }}>Model version</div><strong style={{ fontSize: 13 }}>{profile?.modelVersion || 'iforest-v1'}</strong></div>
            <div><div className="muted" style={{ fontSize: 11, marginBottom: 5 }}>Last updated</div><strong style={{ fontSize: 12 }}>{profile?.updatedAt ? new Date(profile.updatedAt).toLocaleString() : 'Not recorded'}</strong></div>
          </div>
        </section>
      </div>

      <section className="panel" style={{ marginTop: 20 }}>
        <h2 className="panel-title">Baseline feature summary</h2>
        {!Object.keys(means).length ? <div className="empty-state">No baseline statistics are available yet. Start enrollment and collect live samples to populate this table.</div> : (
          <div className="data-table-wrap"><table className="data-table"><thead><tr><th>Feature</th><th>Mean</th><th>Standard deviation</th></tr></thead><tbody>{Object.entries(FEATURE_LABELS).map(([key, label]) => <tr key={key}><td>{label}</td><td>{numberFormat(means[key])}</td><td>{numberFormat(deviations[key])}</td></tr>)}</tbody></table></div>
        )}
      </section>
    </div>
  );
};

export default Profile;
