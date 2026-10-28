import { useState } from 'react';
import { AlertTriangle, CheckCircle2, FlaskConical, Send } from 'lucide-react';
import { api } from '../services/api';

const sampleFeatures = {
  typical: {
    typingIntervalMean: 165, typingIntervalStd: 42, typingIntervalMedian: 158,
    pointerSpeedMean: 240, pointerSpeedStd: 85,
    clickIntervalMean: 510, clickIntervalStd: 145,
    idleRatio: 0.18, navigationCount: 2, interactionCount: 28,
  },
  changed: {
    typingIntervalMean: 890, typingIntervalStd: 420, typingIntervalMedian: 760,
    pointerSpeedMean: 1600, pointerSpeedStd: 970,
    clickIntervalMean: 155, clickIntervalStd: 75,
    idleRatio: 0.03, navigationCount: 10, interactionCount: 65,
  },
};

const DemoMode = () => {
  const [pattern, setPattern] = useState('typical');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const runSimulation = async () => {
    setBusy(true);
    setError('');
    try {
      const response = await api.post('/behaviour/batches', {
        schemaVersion: 1,
        observedAt: new Date().toISOString(),
        source: 'simulated',
        features: sampleFeatures[pattern],
      });
      setResult(response.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not submit this simulation.');
    } finally {
      setBusy(false);
    }
  };

  const decision = result?.decision;

  return (
    <div>
      <div className="page-heading"><div><p className="eyebrow">SAFE INTEGRATION TEST</p><h1 style={{ marginTop: 9 }}>Behaviour scoring demo</h1><p>Send a clearly labelled simulated batch to exercise the backend and ML service without enrolling samples.</p></div><span className="status-pill"><FlaskConical size={14} /> Simulation only</span></div>
      <div className="inline-message warning" style={{ marginBottom: 20 }}>Simulated samples never enter the personal baseline and must not cause authentication policy changes. The synthetic population model is not validated for identity recognition.</div>
      <div className="grid-responsive" style={{ alignItems: 'start' }}>
        <section className="panel" style={{ gridColumn: 'span 2' }}>
          <h2 className="panel-title">Choose a test pattern</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(190px,1fr))', gap: 12 }}>
            <button type="button" onClick={() => setPattern('typical')} className="panel" style={{ textAlign: 'left', cursor: 'pointer', borderColor: pattern === 'typical' ? 'rgba(167,139,250,.6)' : 'rgba(255,255,255,.08)', background: pattern === 'typical' ? 'rgba(139,92,246,.1)' : 'rgba(255,255,255,.02)' }}><strong style={{ display: 'block', fontSize: 13 }}>Typical interaction pattern</strong><span className="muted" style={{ display: 'block', marginTop: 8, fontSize: 11, lineHeight: 1.6 }}>Moderate typing intervals, pointer motion and click timing.</span></button>
            <button type="button" onClick={() => setPattern('changed')} className="panel" style={{ textAlign: 'left', cursor: 'pointer', borderColor: pattern === 'changed' ? 'rgba(245,158,11,.6)' : 'rgba(255,255,255,.08)', background: pattern === 'changed' ? 'rgba(245,158,11,.07)' : 'rgba(255,255,255,.02)' }}><strong style={{ display: 'block', fontSize: 13 }}>Changed interaction pattern</strong><span className="muted" style={{ display: 'block', marginTop: 8, fontSize: 11, lineHeight: 1.6 }}>Intentionally different values to test request and response handling.</span></button>
          </div>
          <button className="action-button primary" type="button" onClick={runSimulation} disabled={busy} style={{ marginTop: 18 }}><Send size={15} />{busy ? 'Submitting sample…' : 'Submit simulated batch'}</button>
          {error && <div className="inline-message error" style={{ marginTop: 16 }}>{error}</div>}
        </section>
        <section className="panel">
          <h2 className="panel-title">Response summary</h2>
          {!result ? <div className="empty-state">Run a simulation to view the backend's actual response here.</div> : (
            <div style={{ display: 'grid', gap: 15 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: 'var(--success)', fontSize: 13 }}><CheckCircle2 size={17} />{result.processingStatus || 'Request processed'}</div>
              <div><div className="muted" style={{ fontSize: 11, marginBottom: 5 }}>Score mode</div><strong style={{ fontSize: 13 }}>{result.model?.scoreMode || 'unknown'}</strong></div>
              <div><div className="muted" style={{ fontSize: 11, marginBottom: 5 }}>Baseline used</div><strong style={{ fontSize: 13 }}>{result.model?.baselineUsed ? 'Yes' : 'No'}</strong></div>
              <div><div className="muted" style={{ fontSize: 11, marginBottom: 5 }}>Policy applied</div><strong style={{ color: result.decision?.policyApplied ? 'var(--danger)' : 'var(--success)', fontSize: 13 }}>{result.decision?.policyApplied ? 'Yes' : 'No — expected for simulation'}</strong></div>
              <div><div className="muted" style={{ fontSize: 11, marginBottom: 5 }}>Assessment ID</div><code style={{ fontSize: 10, overflowWrap: 'anywhere' }}>{decision?.assessmentId || 'Not returned'}</code></div>
            </div>
          )}
          {decision?.warning && <div className="inline-message warning" style={{ marginTop: 17 }}><AlertTriangle size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />{decision.warning}</div>}
        </section>
      </div>
    </div>
  );
};

export default DemoMode;
