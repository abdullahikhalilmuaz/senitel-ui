import React, { useState } from 'react';
import Button from '../components/UI/Button';
import { ShieldCheck, Key, Mail } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Verification = () => {
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      addToast('Verification successful!', 'success');
    }, 1500);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="liquid-glass" style={{ padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 24px', boxShadow: '0 0 40px rgba(139, 92, 246, 0.4)' }}>
           <ShieldCheck size={40} color="white" />
        </div>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>Step-Up Verification</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', marginBottom: '32px' }}>We've detected unusual activity in your session. Please complete the verification to continue.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
           <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left' }}>
              <Key size={20} color="var(--text-muted)" />
              <div>
                 <div style={{ fontSize: '15px', fontWeight: '600' }}>Enter Password</div>
                 <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Re-enter your account password</div>
              </div>
           </div>
           <div style={{ padding: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'left' }}>
              <Mail size={20} color="var(--text-muted)" />
              <div>
                 <div style={{ fontSize: '15px', fontWeight: '600' }}>Email Verification</div>
                 <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>We'll send a code to your email</div>
              </div>
           </div>
        </div>

        <Button onClick={handleVerify} isLoading={loading}>Continue</Button>
      </div>
    </div>
  );
};

export default Verification;
