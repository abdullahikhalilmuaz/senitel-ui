import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Cpu, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const matrixData = [
  { name: 'True Positive', value: 468, color: 'var(--success)' },
  { name: 'False Positive', value: 12, color: 'var(--warning)' },
  { name: 'False Negative', value: 18, color: 'var(--danger)' },
  { name: 'True Negative', value: 372, color: 'var(--success)' },
];

const AIModel = () => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>AI Model Evaluation</h1>
        <p style={{ color: 'var(--text-muted)' }}>Performance metrics and results of the behavioural analysis model.</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(139,92,246,0.1)', color: 'var(--primary)', padding: '8px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
         <Cpu size={16} /> Isolation Forest • v1.0
      </div>
    </div>

    <div className="grid-responsive">
      {[
        { label: 'Detection Rate', val: '94.2%', sub: '+2.3%', color: 'var(--success)' },
        { label: 'False Acceptance', val: '2.1%', sub: '-1.2%', color: 'var(--success)' },
        { label: 'False Rejection', val: '3.7%', sub: '-0.8%', color: 'var(--success)' },
        { label: 'Detection Latency', val: '1.8s', sub: '-0.6s', color: 'var(--success)' }
      ].map((m, i) => (
        <div key={i} className="liquid-glass" style={{ padding: '24px' }}>
           <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '8px' }}>{m.label}</div>
           <div style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>{m.val}</div>
           <div style={{ fontSize: '13px', color: m.color }}>{m.sub} from last version</div>
        </div>
      ))}

      <div className="liquid-glass" style={{ padding: '24px', gridColumn: '1 / -1' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Confusion Matrix (Last 30 Days)</h3>
        <div style={{ height: '250px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={matrixData} layout="vertical" margin={{ left: 50 }}>
              <XAxis type="number" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)' }} />
              <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ background: '#0a0a0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
              <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={30}>
                {matrixData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

export default AIModel;
