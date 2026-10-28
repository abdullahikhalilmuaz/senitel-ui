import { useCallback, useEffect, useState } from 'react';
import { Activity, Clock3, Radio, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const humanize = (value) => String(value || 'unknown').replaceAll('_', ' ');
const dateText = (value) => value ? new Date(value).toLocaleString() : 'No assessment recorded';

const LiveMonitoring = () => {
  const { monitoringEnabled } = useAuth();
  const [summary, setSummary] = useState(null);
  const [profile, setProfile] = useState(null);
  const [latestBatch, setLatestBatch] = useState(null);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      const [dashboardResponse, profileResponse] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/profiles'),
      ]);
      setSummary(dashboardResponse.data);
      setProfile(profileResponse.data);
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Live session information is currently unavailable.');
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 5000);
    const handleBatch = (event) => setLatestBatch({ ...event.detail, receivedAt: new Date().toISOString() });
    window.addEventListener('sentinel:behaviour-batch', handleBatch);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('sentinel:behaviour-batch', handleBatch);
    };
  }, [refresh]);

  const session = summary?.session || {};
  const monitoring = summary?.monitoring || {};
  const status = session.status || 'unknown';
  const risk = session.riskLevel || 'unknown';
  const trustValid = risk !== 'unknown' && Number.isFinite(session.trustScore) && profile?.status === 'ready';

  return (
    <div>
      <div className="page-heading"><div><p className="eyebrow">LIVE TELEMETRY</p><h1 style={{ marginTop: 9 }}>Live behaviour monitoring</h1><p>Current session state and actual feature-batch responses from this browser.</p></div><span className="status-pill" style={{ color: monitoringEnabled ? 'var(--success)' : 'var(--text-muted)' }}><span className="status-dot" style={{ background: monitoringEnabled ? 'var(--success)' : '#737386', marginTop: 0 }} />{monitoringEnabled ? 'Consent enabled' : 'Monitoring paused'}</span></div>
      {error && <div className="inline-message warning" style={{ marginBottom: 18 }}>{error}</div>}
      <div className="stat-grid" style={{ marginBottom: 20 }}>
        <div className="stat-card"><div className="stat-label"><Radio size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />Collection state</div><div className="stat-value" style={{ fontSize: 21, textTransform: 'capitalize' }}>{monitoringEnabled ? 'Enabled' : 'Paused'}</div><div className="stat-detail">{monitoringEnabled ? 'Feature summaries are collected only after sufficient interaction.' : 'Enable monitoring from Behavioural profile.'}</div></div>
        <div className="stat-card"><div className="stat-label"><ShieldAlert size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />Session risk</div><div className="stat-value" style={{ fontSize: 21, textTransform: 'capitalize' }}>{risk === 'unknown' ? 'Not evaluated' : humanize(risk)}</div><div className="stat-detail">{trustValid ? `Trust score ${Math.round(session.trustScore)}%` : 'Personalized risk decisions need a ready baseline.'}</div></div>
        <div className="stat-card"><div className="stat-label"><Activity size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />Enrollment samples</div><div className="stat-value">{profile?.sampleCount || 0} / {monitoring.requiredSamples || 20}</div><div className="stat-detail">Profile status: {humanize(profile?.status || 'not_started')}</div></div>
        <div className="stat-card"><div className="stat-label"><Clock3 size={14} style={{ verticalAlign: 'middle', marginRight: 7 }} />Last assessment</div><div className="stat-value" style={{ fontSize: 15 }}>{session.lastAssessmentAt ? new Date(session.lastAssessmentAt).toLocaleTimeString() : '—'}</div><div className="stat-detail">{dateText(session.lastAssessmentAt)}</div></div>
      </div>

      <div className="grid-responsive" style={{ alignItems: 'start' }}>
        <section className="panel" style={{ gridColumn: 'span 2' }}>
          <h2 className="panel-title">Latest feature batch</h2>
          {!latestBatch ? <div className="empty-state">No feature batch has been submitted since this page opened. Enable monitoring, then interact with the app long enough to produce a 30-second sample window.</div> : (
            <>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginBottom: 16 }}>
                <span className="status-pill">{latestBatch.processingStatus || 'received'}</span>
                <span className="status-pill">{latestBatch.model?.scoreMode || 'score mode unknown'}</span>
                <span className="status-pill">{latestBatch.model?.baselineUsed ? 'Personalized baseline used' : 'No personal baseline used'}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 16 }}>
                <div><div className="muted" style={{ fontSize: 11, marginBottom: 5 }}>Enrollment status</div><strong style={{ fontSize: 13 }}>{humanize(latestBatch.enrollment?.status)}</strong></div>
                <div><div className="muted" style={{ fontSize: 11, marginBottom: 5 }}>Samples enrolled</div><strong style={{ fontSize: 13 }}>{latestBatch.enrollment?.sampleCount ?? 0}</strong></div>
                <div><div className="muted" style={{ fontSize: 11, marginBottom: 5 }}>Decision policy</div><strong style={{ fontSize: 13, color: latestBatch.decision?.policyApplied ? 'var(--success)' : 'var(--warning)' }}>{latestBatch.decision?.policyApplied ? 'Applied' : 'Monitoring only'}</strong></div>
                <div><div className="muted" style={{ fontSize: 11, marginBottom: 5 }}>Received in UI</div><strong style={{ fontSize: 12 }}>{dateText(latestBatch.receivedAt)}</strong></div>
              </div>
              {latestBatch.decision?.warning && <div className="inline-message warning" style={{ marginTop: 17 }}>{latestBatch.decision.warning}</div>}
            </>
          )}
        </section>
        <section className="panel">
          <h2 className="panel-title">Session state</h2>
          <div style={{ display: 'grid', gap: 16 }}>
            <div><div className="muted" style={{ fontSize: 11, marginBottom: 5 }}>Status</div><strong style={{ fontSize: 13, textTransform: 'capitalize' }}>{humanize(status)}</strong></div>
            <div><div className="muted" style={{ fontSize: 11, marginBottom: 5 }}>Model version</div><strong style={{ fontSize: 13 }}>{monitoring.modelVersion || 'Unknown'}</strong></div>
            <div><div className="muted" style={{ fontSize: 11, marginBottom: 5 }}>Model service</div><strong style={{ fontSize: 13, textTransform: 'capitalize' }}>{humanize(monitoring.modelStatus)}</strong></div>
            <div><div className="muted" style={{ fontSize: 11, marginBottom: 5 }}>Policy eligibility</div><strong style={{ fontSize: 13 }}>{profile?.status === 'ready' ? 'Eligible when live baseline score is returned' : 'Waiting for enrollment'}</strong></div>
          </div>
          <p className="muted" style={{ fontSize: 11, lineHeight: 1.7, marginTop: 17 }}>This page does not invent a trust-score history. The backend currently exposes the latest session status, not a time-series endpoint for past assessments.</p>
        </section>
      </div>
    </div>
  );
};

export default LiveMonitoring;
