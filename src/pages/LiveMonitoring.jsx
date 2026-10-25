import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, ShieldCheck } from 'lucide-react';

const data = [
  { time: '10:00', score: 92 }, { time: '10:05', score: 95 },
  { time: '10:10', score: 88 }, { time: '10:15', score: 91 },
  { time: '10:20', score: 93 }, { time: '10:25', score: 94 },
];

const LiveMonitoring = () => {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', letterSpacing: '-0.5px' }}>Live Behaviour Monitoring</h1>
          <p style={{ color: 'var(--text-muted)' }}>Real-time analysis of your behavioural patterns.</p>
        </div>
        <div className="liquid-glass" style={{ padding: '8px 16px', borderRadius: '20px', color: 'var(--success)', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)', animation: 'pulse 1.5s infinite' }} />
          Monitoring Active
        </div>
      </div>

      <div className="grid-responsive">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="liquid-glass" style={{ padding: '24px', gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Real-time Trust Score</h3>
          <div style={{ height: '250px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} />
                <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: 'rgba(10,10,15,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="score" stroke="#8b5cf6" strokeWidth={3} dot={{ fill: '#8b5cf6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="liquid-glass" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Key Metrics</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { label: 'Typing Speed', value: '72 WPM', diff: '+12%' },
              { label: 'Mouse Movement', value: 'Smooth', diff: '+8%' },
              { label: 'Click Rate', value: 'Normal', diff: '+5%' },
              { label: 'Idle Time', value: 'Low', diff: '-10%' }
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: '600' }}>{item.value}</div>
                  <div style={{ fontSize: '12px', color: item.diff.startsWith('+') ? 'var(--success)' : 'var(--danger)' }}>{item.diff}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="liquid-glass" style={{ padding: '24px', gridColumn: '1 / -1' }}>
           <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>Live Activity Feed</h3>
           <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
             {[
               { time: '10:24:12', event: 'Mouse movement detected', type: 'normal' },
               { time: '10:24:05', event: 'Key press recorded (Typing speed within range)', type: 'normal' },
               { time: '10:23:55', event: 'Page navigation - Dashboard', type: 'normal' }
             ].map((ev, i) => (
               <div key={i} style={{ display: 'flex', gap: '16px', fontSize: '14px' }}>
                 <span style={{ color: 'var(--text-muted)', width: '80px' }}>{ev.time}</span>
                 <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <ShieldCheck size={16} color="var(--success)" /> {ev.event}
                 </span>
               </div>
             ))}
           </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LiveMonitoring;
