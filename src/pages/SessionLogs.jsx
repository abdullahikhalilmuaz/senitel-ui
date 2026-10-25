import React from 'react';
import { Search } from 'lucide-react';

const sessions = [
  { id: 1, date: 'Today, 10:24', device: 'Windows • Chrome', location: 'Lagos, NG', status: 'Active', risk: 'Low', color: 'var(--success)' },
  { id: 2, date: 'Yesterday, 15:42', device: 'iPhone • Safari', location: 'Abuja, NG', status: 'Ended', risk: 'Medium', color: 'var(--warning)' },
  { id: 3, date: 'Oct 26, 09:12', device: 'MacBook • Firefox', location: 'Kano, NG', status: 'Suspicious', risk: 'High', color: 'var(--danger)' },
];

const SessionLogs = () => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
      <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Session Logs</h1>
      <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: '400px' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input placeholder="Search sessions..." style={{ paddingLeft: '44px' }} />
        </div>
      </div>
    </div>

    <div className="liquid-glass" style={{ padding: '24px', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-muted)', fontSize: '13px' }}>
            <th style={{ padding: '16px' }}>Date & Time</th>
            <th style={{ padding: '16px' }}>Device</th>
            <th style={{ padding: '16px' }}>Location</th>
            <th style={{ padding: '16px' }}>Status</th>
            <th style={{ padding: '16px' }}>Risk</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '14px' }}>
              <td style={{ padding: '16px', fontWeight: '500' }}>{s.date}</td>
              <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{s.device}</td>
              <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{s.location}</td>
              <td style={{ padding: '16px' }}>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', background: `rgba(255,255,255,0.05)`, color: s.status === 'Active' ? 'var(--success)' : s.status === 'Suspicious' ? 'var(--danger)' : 'var(--text-muted)' }}>{s.status}</span>
              </td>
              <td style={{ padding: '16px' }}>
                <span style={{ color: s.color, fontWeight: '600' }}>{s.risk}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default SessionLogs;
