import { useEffect, useRef, useState } from 'react';
import { Activity, Gauge, Keyboard, MousePointer2, ShieldCheck, TimerReset } from 'lucide-react';

const mean = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const deviation = (values) => {
  if (values.length < 2) return 0;
  const average = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length);
};
const format = (value, digits = 1) => Number.isFinite(value) ? value.toLocaleString(undefined, { maximumFractionDigits: digits }) : '—';

const BehaviourLab = () => {
  const areaRef = useRef(null);
  const lastKeyAt = useRef(null);
  const lastPointerAt = useRef(null);
  const lastPointerPosition = useRef(null);
  const lastClickAt = useRef(null);
  const startAt = useRef(performance.now());
  const samples = useRef({ keyIntervals: [], pointerSpeeds: [], clickIntervals: [], keyEvents: 0, pointerEvents: 0, clicks: 0, interactionCount: 0 });
  const [stats, setStats] = useState({ keyIntervalMean: 0, keyIntervalStd: 0, keyEventsPerMinute: 0, pointerSpeedMean: 0, pointerSpeedStd: 0, clickIntervalMean: 0, clickEvents: 0, interactions: 0, elapsedSeconds: 0 });
  const [lastBatch, setLastBatch] = useState(null);

  useEffect(() => {
    const update = () => {
      const data = samples.current;
      const elapsedSeconds = Math.max((performance.now() - startAt.current) / 1000, 1);
      setStats({
        keyIntervalMean: mean(data.keyIntervals),
        keyIntervalStd: deviation(data.keyIntervals),
        keyEventsPerMinute: data.keyEvents / elapsedSeconds * 60,
        pointerSpeedMean: mean(data.pointerSpeeds),
        pointerSpeedStd: deviation(data.pointerSpeeds),
        clickIntervalMean: mean(data.clickIntervals),
        clickEvents: data.clicks,
        interactions: data.interactionCount,
        elapsedSeconds,
      });
    };
    const handleKeyDown = (event) => {
      if (event.target !== areaRef.current || event.repeat) return;
      const now = performance.now();
      const data = samples.current;
      data.keyEvents += 1;
      data.interactionCount += 1;
      if (lastKeyAt.current != null) {
        const gap = now - lastKeyAt.current;
        if (gap >= 0 && gap <= 60_000) data.keyIntervals.push(gap);
      }
      lastKeyAt.current = now;
      if (data.keyIntervals.length > 500) data.keyIntervals.shift();
      update();
    };
    const handleBatch = (event) => setLastBatch({ ...event.detail, receivedAt: new Date().toISOString() });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('sentinel:behaviour-batch', handleBatch);
    const timer = window.setInterval(update, 500);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('sentinel:behaviour-batch', handleBatch);
      window.clearInterval(timer);
    };
  }, []);

  const handlePointerMove = (event) => {
    const now = performance.now();
    const previous = lastPointerPosition.current;
    lastPointerPosition.current = { x: event.clientX, y: event.clientY };
    if (lastPointerAt.current == null || !previous) {
      lastPointerAt.current = now;
      return;
    }
    const elapsed = now - lastPointerAt.current;
    if (elapsed >= 50) {
      const distance = Math.hypot(event.clientX - previous.x, event.clientY - previous.y);
      const speed = Math.min(1_000_000, distance / Math.max(elapsed / 1000, 0.001));
      const data = samples.current;
      data.pointerSpeeds.push(speed);
      data.pointerEvents += 1;
      data.interactionCount += 1;
      if (data.pointerSpeeds.length > 500) data.pointerSpeeds.shift();
      lastPointerAt.current = now;
    }
  };

  const handleClick = () => {
    const now = performance.now();
    const data = samples.current;
    data.clicks += 1;
    data.interactionCount += 1;
    if (lastClickAt.current != null) {
      const gap = now - lastClickAt.current;
      if (gap >= 0 && gap <= 60_000) data.clickIntervals.push(gap);
    }
    lastClickAt.current = now;
  };

  const reset = () => {
    samples.current = { keyIntervals: [], pointerSpeeds: [], clickIntervals: [], keyEvents: 0, pointerEvents: 0, clicks: 0, interactionCount: 0 };
    lastKeyAt.current = null;
    lastPointerAt.current = null;
    lastPointerPosition.current = null;
    lastClickAt.current = null;
    startAt.current = performance.now();
    setStats({ keyIntervalMean: 0, keyIntervalStd: 0, keyEventsPerMinute: 0, pointerSpeedMean: 0, pointerSpeedStd: 0, clickIntervalMean: 0, clickEvents: 0, interactions: 0, elapsedSeconds: 0 });
    if (areaRef.current) areaRef.current.value = '';
  };

  const decision = lastBatch?.decision;
  const model = lastBatch?.model;

  return (
    <div>
      <div className="page-heading">
        <div><p className="eyebrow">INTERACTIVE DEMONSTRATION</p><h1 style={{ marginTop: 9 }}>Behaviour measurement lab</h1><p>Type, move the pointer, and click to see interaction timing update live.</p></div>
        <span className="status-pill"><Activity size={14} /> Live measurements</span>
      </div>

      <div className="inline-message warning" style={{ marginBottom: 20 }}>This page displays local timing measurements for demonstration. It does not read or transmit the words you type. If monitoring consent is enabled in your profile, Sentinel separately sends aggregate behavioural features to the backend collector.</div>

      <div className="grid-responsive" style={{ alignItems: 'start' }}>
        <section className="panel" style={{ gridColumn: 'span 2' }}>
          <h2 className="panel-title"><Keyboard size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />Try typing here</h2>
          <p className="muted" style={{ fontSize: 12, lineHeight: 1.7 }}>Type a sentence in the box. The page tracks the interval between key events—not the letters, words, or password content. Move your pointer around this area and click to create additional measurements.</p>
          <textarea
            ref={areaRef}
            rows={5}
            onPointerMove={handlePointerMove}
            onClick={handleClick}
            placeholder="Start typing a sentence to see your keyboard timing…"
            aria-label="Behaviour lab typing area"
            style={{ marginTop: 10, resize: 'vertical', lineHeight: 1.7 }}
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, marginTop: 13 }}>
            <span className="muted" style={{ fontSize: 11 }}>Elapsed test time: {format(stats.elapsedSeconds, 0)} seconds</span>
            <button className="action-button" type="button" onClick={reset}><TimerReset size={15} />Reset local measurements</button>
          </div>
        </section>
        <section className="panel">
          <h2 className="panel-title">What is measured</h2>
          <div style={{ display: 'grid', gap: 13, fontSize: 12, lineHeight: 1.7 }}>
            <div><strong><Keyboard size={15} style={{ verticalAlign: 'middle', marginRight: 7 }} />Typing interval</strong><p className="muted" style={{ margin: '5px 0 0' }}>Time between key events, in milliseconds.</p></div>
            <div><strong><MousePointer2 size={15} style={{ verticalAlign: 'middle', marginRight: 7 }} />Pointer speed</strong><p className="muted" style={{ margin: '5px 0 0' }}>Approximate pointer travel per second, in pixels.</p></div>
            <div><strong><Gauge size={15} style={{ verticalAlign: 'middle', marginRight: 7 }} />Interaction pattern</strong><p className="muted" style={{ margin: '5px 0 0' }}>Counts and variations help describe a session's interaction style.</p></div>
          </div>
        </section>
      </div>

      <div className="stat-grid" style={{ marginTop: 20 }}>
        <div className="stat-card"><div className="stat-label">Mean typing interval</div><div className="stat-value">{format(stats.keyIntervalMean)} <span style={{ fontSize: 12 }}>ms</span></div><div className="stat-detail">{samples.current.keyIntervals.length} intervals measured</div></div>
        <div className="stat-card"><div className="stat-label">Typing interval deviation</div><div className="stat-value">{format(stats.keyIntervalStd)} <span style={{ fontSize: 12 }}>ms</span></div><div className="stat-detail">Variation in your key timing</div></div>
        <div className="stat-card"><div className="stat-label">Approx. key events / minute</div><div className="stat-value">{format(stats.keyEventsPerMinute, 0)}</div><div className="stat-detail">Key event rate, not word-per-minute speed</div></div>
        <div className="stat-card"><div className="stat-label">Mean pointer speed</div><div className="stat-value">{format(stats.pointerSpeedMean)} <span style={{ fontSize: 12 }}>px/s</span></div><div className="stat-detail">Pointer movement observed in the test area</div></div>
        <div className="stat-card"><div className="stat-label">Mean click interval</div><div className="stat-value">{format(stats.clickIntervalMean)} <span style={{ fontSize: 12 }}>ms</span></div><div className="stat-detail">{stats.clickEvents} clicks observed</div></div>
        <div className="stat-card"><div className="stat-label">Total interactions</div><div className="stat-value">{stats.interactions}</div><div className="stat-detail">Keyboard, pointer and click events in this lab</div></div>
      </div>

      <section className="panel" style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}><ShieldCheck size={19} /><h2 className="panel-title" style={{ margin: 0 }}>Actual backend scoring response</h2></div>
        {!lastBatch ? <div className="empty-state">No backend batch has arrived on this page yet. Enable monitoring in Behavioural profile, then interact until the collector submits a batch.</div> : (
          <div className="grid-responsive" style={{ gap: 13 }}>
            <div className="stat-card"><div className="stat-label">Scoring mode</div><div className="stat-value" style={{ fontSize: 17 }}>{model?.scoreMode || 'unknown'}</div><div className="stat-detail">{model?.baselineUsed ? 'Personal baseline used' : 'Personal baseline not used'}</div></div>
            <div className="stat-card"><div className="stat-label">Risk level / action</div><div className="stat-value" style={{ fontSize: 17, textTransform: 'capitalize' }}>{decision?.riskLevel || 'unknown'} / {decision?.action || 'none'}</div><div className="stat-detail">Session: {decision?.sessionStatus || 'unknown'}</div></div>
            <div className="stat-card"><div className="stat-label">Policy enforcement</div><div className="stat-value" style={{ fontSize: 17, color: decision?.policyApplied ? 'var(--success)' : 'var(--warning)' }}>{decision?.policyApplied ? 'Applied' : 'Monitoring only'}</div><div className="stat-detail">{decision?.warning || 'The live personalized score was eligible for policy.'}</div></div>
          </div>
        )}
        {lastBatch?.decision?.warning && <div className="inline-message warning" style={{ marginTop: 14 }}>{lastBatch.decision.warning}</div>}
        <p className="muted" style={{ fontSize: 11, lineHeight: 1.7, marginTop: 16 }}>This display shows the API response received by the browser; it does not invent a score. The model is a prototype trained using synthetic population data, and its risk index is not a probability that the user is an impostor.</p>
      </section>
    </div>
  );
};

export default BehaviourLab;
