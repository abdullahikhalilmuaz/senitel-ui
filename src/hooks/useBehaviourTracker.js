import { useEffect, useRef } from 'react';
import { api } from '../services/api';

export const useBehaviourTracker = (isAuthenticated) => {
  const keyTimings = useRef([]);
  const lastKeyTime = useRef(null);
  const mouseMovements = useRef([]);
  const lastMouseTime = useRef(null);
  const clickTimings = useRef([]);
  const lastClickTime = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    // --- Typing Tracker ---
    const handleKeyDown = (e) => {
      // Ignore password fields for privacy!
      if (e.target.type === 'password') return;

      const now = performance.now();
      if (lastKeyTime.current) {
        keyTimings.current.push(now - lastKeyTime.current);
      }
      lastKeyTime.current = now;
    };

    // --- Mouse Tracker ---
    const handleMouseMove = (e) => {
      const now = performance.now();
      if (lastMouseTime.current) {
        const timeDiff = now - lastMouseTime.current;
        if (timeDiff > 50) { // Sample every 50ms to avoid overload
          mouseMovements.current.push({ x: e.movementX, y: e.movementY, t: timeDiff });
          lastMouseTime.current = now;
        }
      } else {
        lastMouseTime.current = now;
      }
    };

    // --- Click Tracker ---
    const handleClick = () => {
      const now = performance.now();
      if (lastClickTime.current) {
        clickTimings.current.push(now - lastClickTime.current);
      }
      lastClickTime.current = now;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // Send data to backend every 30 seconds
    const interval = setInterval(async () => {
      const calcMean = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      const calcStd = (arr) => {
        if (arr.length < 2) return 0;
        const mean = calcMean(arr);
        return Math.sqrt(arr.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / arr.length);
      };

      const features = {
        typingIntervalMean: calcMean(keyTimings.current) || 150,
        typingIntervalStd: calcStd(keyTimings.current) || 30,
        typingIntervalMedian: calcMean(keyTimings.current) || 150, // Simplified for now
        pointerSpeedMean: calcMean(mouseMovements.current.map(m => Math.sqrt(m.x**2 + m.y**2))) || 1.5,
        pointerSpeedStd: calcStd(mouseMovements.current.map(m => Math.sqrt(m.x**2 + m.y**2))) || 0.5,
        clickIntervalMean: calcMean(clickTimings.current) || 800,
        clickIntervalStd: calcStd(clickTimings.current) || 200,
        idleRatio: 0.1, // Simplified for now
        navigationCount: 1,
        interactionCount: keyTimings.current.length + mouseMovements.current.length
      };

      // Only send if we have some data
      if (features.interactionCount > 10) {
        try {
          await api.post('/behaviour/batches', {
            schemaVersion: 1,
            observedAt: new Date().toISOString(),
            windowDurationMs: 30000,
            features
          });
          // Clear the arrays after sending
          keyTimings.current = [];
          mouseMovements.current = [];
          clickTimings.current = [];
        } catch (err) {
          console.error('Failed to send behaviour batch', err);
        }
      }
    }, 30000);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      clearInterval(interval);
    };
  }, [isAuthenticated]);
};