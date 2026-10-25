import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Typing Speed', current: 80, baseline: 90 },
  { name: 'Mouse Move', current: 70, baseline: 85 },
  { name: 'Click Timing', current: 90, baseline: 90 },
  { name: 'Pause Duration', current: 60, baseline: 75 },
];

const BehaviourAnalytics = () => (
  <div>
    <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>Behaviour Analytics</h1>
    <div className="grid-responsive">
      <div className="liquid-glass" style={{ padding: '24px', gridColumn: 'span 2' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Behaviour Match Comparison</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={8}>
              <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
              <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Bar dataKey="current" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="baseline" fill="rgba(255,255,255,0.1)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="liquid-glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
         <div style={{ width: '160px', height: '160px', borderRadius: '50%', background: 'conic-gradient(var(--success) 87%, transparent 0)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
            <div style={{ width: '130px', height: '130px', borderRadius: '50%', background: '#0f0f1a', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span style={{ fontSize: '36px', fontWeight: 'bold' }}>87%</span>
              <span style={{ fontSize: '12px', color: 'var(--success)' }}>Match Score</span>
            </div>
         </div>
         <p style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-muted)' }}>Your current activity is consistent with your usual pattern.</p>
      </div>
    </div>
  </div>
);

export default BehaviourAnalytics;
