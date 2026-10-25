import React from 'react';
import { AlertCircle, ShieldAlert, CheckCircle } from 'lucide-react';

const alerts = [
  { id: 1, date: 'Today, 10:24', event: 'Behavioural deviation detected', desc: 'Unusual typing rhythm and mouse movement', risk: 'High', color: 'var(--danger)' },
  { id: 2, date: 'Yesterday, 15:40', event: 'New device detected', desc: 'Login from unknown device', risk: 'Medium', color: 'var(--warning)' },
  { id: 3, date: 'Oct 26, 09:12', event: 'Multiple failed verifications', desc: 'Step-up authentication failed 3 times', risk: 'High', color: 'var(--danger)' },
];

const SecurityAlerts = () => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
       <div>
         <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>Security Alerts</h1>
         <p style={{ color: 'var(--text-muted)' }}>View and manage suspicious activities and risk events.</p>
       </div>
       <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '8px 16px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '20px', fontSize: '13px', cursor: 'pointer' }}>All</button>
          <button style={{ padding: '8px 16px', background: 'transparent', color: 'var(--text-muted)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '13px', cursor: 'pointer' }}>High Risk</button>
       </div>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {alerts.map((alert) => (
        <div key={alert.id} className="liquid-glass" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
           <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `rgba(255,255,255,0.05)`, display: 'flex', justifyContent: 'center', alignItems: 'center', color: alert.color }}>
              <ShieldAlert size={24} />
           </div>
           <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600' }}>{alert.event}</h3>
                <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', background: `${alert.color}20`, color: alert.color, fontWeight: '600' }}>{alert.risk} Risk</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{alert.desc}</p>
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
              <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{alert.date}</span>
              <button style={{ background: 'transparent', border: 'none', color: 'var(--primary)', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>View Details</button>
           </div>
        </div>
      ))}
    </div>
  </div>
);

export default SecurityAlerts;
