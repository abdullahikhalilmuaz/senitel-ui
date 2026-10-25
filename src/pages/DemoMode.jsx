import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle, AlertTriangle, Shield } from 'lucide-react';
import Button from '../components/UI/Button';

const DemoMode = () => {
  const [step, setStep] = useState(2);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>Account Takeover Demonstration</h1>
          <p style={{ color: 'var(--text-muted)' }}>Simulate a different user accessing the same account.</p>
        </div>
        <Button variant="outline" style={{ width: 'auto' }} onClick={() => setStep(1)}>Reset Demo</Button>
      </div>

      <div className="liquid-glass" style={{ padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '20px', left: '10%', right: '10%', height: '2px', background: 'rgba(255,255,255,0.1)', zIndex: 0 }} />
          {[
            { id: 1, label: 'Legitimate User', icon: Shield },
            { id: 2, label: 'Behaviour Change', icon: ActivityIcon },
            { id: 3, label: 'Risk Assessment', icon: AlertTriangle },
            { id: 4, label: 'Access Decision', icon: CheckCircle }
          ].map((s) => (
            <div key={s.id} style={{ zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', width: '120px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: step >= s.id ? 'var(--primary)' : 'rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: step >= s.id ? '0 0 20px var(--primary-glow)' : 'none', transition: 'all 0.5s' }}>
                <s.icon size={20} color={step >= s.id ? 'white' : 'var(--text-muted)'} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '500', color: step >= s.id ? 'white' : 'var(--text-muted)', textAlign: 'center' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-responsive">
        <motion.div className="liquid-glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Live Comparison</h3>
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '12px', marginBottom: '16px', border: '1px solid rgba(16,185,129,0.3)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
               <span style={{ fontWeight: '600' }}>Original User (Baseline)</span>
               <span style={{ color: 'var(--success)', fontSize: '12px' }}>Trusted</span>
             </div>
             <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Typing: 68 WPM • Mouse: Normal</p>
          </div>
          <div style={{ background: 'rgba(239,68,68,0.1)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.3)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
               <span style={{ fontWeight: '600' }}>Current Session</span>
               <span style={{ color: 'var(--danger)', fontSize: '12px' }}>At Risk</span>
             </div>
             <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Typing: 42 WPM • Mouse: Erratic</p>
          </div>
        </motion.div>

        <motion.div className="liquid-glass" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Current Risk Score</h3>
          <div style={{ width: '140px', height: '140px', borderRadius: '50%', border: '10px solid rgba(239,68,68,0.2)', borderTopColor: 'var(--danger)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ fontSize: '32px', fontWeight: 'bold' }}>48%</span>
            <span style={{ fontSize: '12px', color: 'var(--danger)' }}>High Risk</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const ActivityIcon = ({ size, color }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;

export default DemoMode;
