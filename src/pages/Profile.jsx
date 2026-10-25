import React from 'react';
import { User, Activity, Clock, Shield } from 'lucide-react';
import Button from '../components/UI/Button';

const Profile = () => (
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
      <div>
        <h1 style={{ fontSize: '28px', fontWeight: '700' }}>Behavioural Profile</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your enrolment and view your baseline.</p>
      </div>
      <span style={{ padding: '6px 16px', background: 'rgba(16,185,129,0.15)', color: 'var(--success)', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>Enrolled</span>
    </div>

    <div className="grid-responsive">
       <div className="liquid-glass" style={{ padding: '32px', gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Your Behavioural Baseline</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
             {[
               { label: 'Typing Speed', value: '165 ms', icon: Activity },
               { label: 'Mouse Movement', value: '278 px/s', icon: Activity },
               { label: 'Click Interval', value: '1.24 s', icon: Clock },
               { label: 'Idle Time', value: '2.8 s', icon: Shield }
             ].map((item, i) => (
               <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <item.icon size={20} color="var(--primary)" style={{ marginBottom: '12px' }} />
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px' }}>{item.label}</div>
                  <div style={{ fontSize: '20px', fontWeight: '700' }}>{item.value}</div>
               </div>
             ))}
          </div>
          <Button style={{ marginTop: '32px' }}>Update Profile Baseline</Button>
       </div>

       <div className="liquid-glass" style={{ padding: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Enrolment Progress</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
             <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                   <span>Typing Dynamics</span>
                   <span style={{ color: 'var(--success)' }}>100%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}><div style={{ width: '100%', height: '100%', background: 'var(--success)', borderRadius: '3px' }} /></div>
             </div>
             <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                   <span>Mouse Dynamics</span>
                   <span style={{ color: 'var(--success)' }}>100%</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}><div style={{ width: '100%', height: '100%', background: 'var(--success)', borderRadius: '3px' }} /></div>
             </div>
          </div>
       </div>
    </div>
  </div>
);

export default Profile;
