import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Toggle = ({ active, onClick }) => (
  <div onClick={onClick} style={{ width: '44px', height: '24px', borderRadius: '12px', background: active ? 'var(--primary)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', padding: '2px', cursor: 'pointer', transition: 'background 0.3s' }}>
    <motion.div animate={{ x: active ? 20 : 0 }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'white' }} />
  </div>
);

const Settings = () => {
  const [settings, setSettings] = useState({ twoFactor: true, requireVerify: true, alerts: false });

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '32px' }}>Settings</h1>
      <div className="liquid-glass" style={{ padding: '32px', maxWidth: '600px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '24px' }}>Security Settings</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>Two-Factor Authentication</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Add an extra layer of security to your account.</div>
            </div>
            <Toggle active={settings.twoFactor} onClick={() => toggle('twoFactor')} />
          </div>
          
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>Require Verification for Sensitive Actions</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Enable step-up verification for critical operations.</div>
            </div>
            <Toggle active={settings.requireVerify} onClick={() => toggle('requireVerify')} />
          </div>

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.05)' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>Login Alerts</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Get notified of new device logins and suspicious activity.</div>
            </div>
            <Toggle active={settings.alerts} onClick={() => toggle('alerts')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
