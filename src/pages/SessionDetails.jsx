import React from 'react';
import { ArrowLeft, Shield, AlertCircle } from 'lucide-react';

const SessionDetails = () => (
  <div>
    <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', cursor: 'pointer', fontSize: '14px' }}>
      <ArrowLeft size={16} /> Back to logs
    </button>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
       <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Session Details</h1>
       <span style={{ padding: '6px 16px', background: 'rgba(239,68,68,0.15)', color: 'var(--danger)', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>Suspicious</span>
    </div>

    <div className="grid-responsive">
      <div className="liquid-glass" style={{ padding: '32px', gridColumn: 'span 2' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Session Timeline</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '24px', marginLeft: '8px' }}>
           {[
             { time: '10:21', title: 'Session Started', desc: 'User logged in from Chrome on Windows', type: 'normal' },
             { time: '10:24', title: 'Behavioural Change Detected', desc: 'Typing pattern deviated from baseline', type: 'warning' },
             { time: '10:27', title: 'Risk Score Increased', desc: 'Current score: 64% (Medium risk)', type: 'danger' },
             { time: '10:28', title: 'Verification Required', desc: 'Step-up authentication requested', type: 'warning' }
           ].map((item, i) => (
             <div key={i} style={{ position: 'relative' }}>
               <div style={{ position: 'absolute', left: '-33px', top: '0', width: '16px', height: '16px', borderRadius: '50%', background: item.type === 'danger' ? 'var(--danger)' : item.type === 'warning' ? 'var(--warning)' : 'var(--primary)', border: '4px solid #0f0f1a' }} />
               <div style={{ display: 'flex', gap: '16px' }}>
                 <span style={{ fontSize: '13px', color: 'var(--text-muted)', width: '50px' }}>{item.time}</span>
                 <div>
                   <h4 style={{ fontSize: '15px', fontWeight: '600', color: item.type === 'danger' ? 'var(--danger)' : 'white' }}>{item.title}</h4>
                   <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>{item.desc}</p>
                 </div>
               </div>
             </div>
           ))}
        </div>
      </div>

      <div className="liquid-glass" style={{ padding: '32px' }}>
         <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Behaviour Summary</h3>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                 <span>Typing Speed</span>
                 <span style={{ color: 'var(--danger)' }}>-22% from baseline</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}><div style={{ width: '78%', height: '100%', background: 'var(--danger)', borderRadius: '3px' }} /></div>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                 <span>Mouse Movement</span>
                 <span style={{ color: 'var(--warning)' }}>+18% from baseline</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}><div style={{ width: '60%', height: '100%', background: 'var(--warning)', borderRadius: '3px' }} /></div>
            </div>
         </div>
      </div>
    </div>
  </div>
);

export default SessionDetails;
