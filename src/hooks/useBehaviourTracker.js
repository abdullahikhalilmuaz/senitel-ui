import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';

const WINDOW_INTERVAL_MS = 30_000;
const MIN_INTERACTIONS_PER_BATCH = 5;
const MAX_FEATURE_VALUE = 1_000_000;

function mean(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}
function standardDeviation(values) {
  if (values.length < 2) return 0;
  const average = mean(values);
  return Math.sqrt(values.reduce((sum, value) => sum + ((value - average) ** 2), 0) / values.length);
}
function median(values) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
}
function resetWindow(state, now, pathname) {
  state.keyIntervals = [];
  state.pointerSpeeds = [];
  state.clickIntervals = [];
  state.keyEvents = 0;
  state.clickEvents = 0;
  state.pointerSamples = 0;
  state.navigationCount = 0;
  state.idleMilliseconds = 0;
  state.windowStart = now;
  state.lastActivity = now;
  state.lastKeyAt = null;
  state.lastPointerAt = null;
  state.lastPointerX = null;
  state.lastPointerY = null;
  state.pendingPointerDistance = 0;
  state.lastClickAt = null;
  state.pathname = pathname;
}

export const useBehaviourTracker = (isAuthenticated, monitoringEnabled) => {
  const location = useLocation();
  const stateRef = useRef({});
  const sendingRef = useRef(false);
  const pathnameRef = useRef(location.pathname);

  useEffect(() => {
    const state = stateRef.current;
    if (state.windowStart != null && pathnameRef.current !== location.pathname) {
      state.navigationCount = (state.navigationCount || 0) + 1;
      state.pathname = location.pathname;
    }
    pathnameRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    if (!isAuthenticated || !monitoringEnabled) return undefined;
    const state = stateRef.current;
    resetWindow(state, performance.now(), pathnameRef.current);
    sendingRef.current = false;

    const markActivity = (now = performance.now()) => {
      if (state.lastActivity != null) {
        const gap = now - state.lastActivity;
        if (gap > 1000) state.idleMilliseconds += gap - 1000;
      }
      state.lastActivity = now;
    };

    const handleKeyDown = (event) => {
      const target = event.target;
      const inputType = target?.type?.toLowerCase();
      // Timing only: never read event.key, input values, or typed text.
      if (inputType === 'password' || event.repeat || target?.isContentEditable) return;
      const now = performance.now();
      markActivity(now);
      state.keyEvents += 1;
      if (state.lastKeyAt != null) {
        const interval = now - state.lastKeyAt;
        if (interval >= 0 && interval <= 60_000) state.keyIntervals.push(interval);
      }
      state.lastKeyAt = now;
    };

    const handlePointerMove = (event) => {
      const now = performance.now();
      const x = Number(event.clientX);
      const y = Number(event.clientY);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      if (state.lastPointerAt == null || state.lastPointerX == null || state.lastPointerY == null) {
        state.lastPointerAt = now;
        state.lastPointerX = x;
        state.lastPointerY = y;
        markActivity(now);
        return;
      }
      state.pendingPointerDistance = (state.pendingPointerDistance || 0) + Math.hypot(x - state.lastPointerX, y - state.lastPointerY);
      state.lastPointerX = x;
      state.lastPointerY = y;
      const elapsed = now - state.lastPointerAt;
      markActivity(now);
      if (elapsed < 50) return;
      const speed = Math.min(MAX_FEATURE_VALUE, state.pendingPointerDistance / Math.max(elapsed / 1000, 0.001));
      state.pointerSpeeds.push(speed);
      state.pointerSamples += 1;
      state.pendingPointerDistance = 0;
      state.lastPointerAt = now;
    };

    const handleClick = () => {
      const now = performance.now();
      markActivity(now);
      state.clickEvents += 1;
      if (state.lastClickAt != null) {
        const interval = now - state.lastClickAt;
        if (interval >= 0 && interval <= 60_000) state.clickIntervals.push(interval);
      }
      state.lastClickAt = now;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });

    const sendBatch = async () => {
      if (sendingRef.current || document.visibilityState === 'prerender') return;
      const now = performance.now();
      const interactions = state.keyEvents + state.pointerSamples + state.clickEvents;
      if (interactions < MIN_INTERACTIONS_PER_BATCH) return;
      sendingRef.current = true;
      const elapsed = Math.max(1, now - state.windowStart);
      const idleTail = state.lastActivity == null ? elapsed : Math.max(0, now - state.lastActivity - 1000);
      const idleRatio = Math.max(0, Math.min(1, (state.idleMilliseconds + idleTail) / elapsed));
      const features = {
        typingIntervalMean: mean(state.keyIntervals),
        typingIntervalStd: standardDeviation(state.keyIntervals),
        typingIntervalMedian: median(state.keyIntervals),
        pointerSpeedMean: mean(state.pointerSpeeds),
        pointerSpeedStd: standardDeviation(state.pointerSpeeds),
        clickIntervalMean: mean(state.clickIntervals),
        clickIntervalStd: standardDeviation(state.clickIntervals),
        idleRatio,
        navigationCount: Math.max(0, Math.floor(state.navigationCount)),
        interactionCount: Math.max(0, Math.floor(interactions)),
      };

      try {
        const response = await api.post('/behaviour/batches', {
          schemaVersion: 1,
          observedAt: new Date().toISOString(),
          source: 'live',
          features,
        });
        const result = response.data;
        window.dispatchEvent(new CustomEvent('sentinel:behaviour-batch', { detail: result }));
        if (result?.decision?.policyApplied) {
          window.dispatchEvent(new CustomEvent('sentinel:risk-decision', { detail: result }));
        }
        resetWindow(state, performance.now(), pathnameRef.current);
      } catch (error) {
        const status = error.response?.status;
        if (status === 401) {
          window.dispatchEvent(new CustomEvent('sentinel:auth-expired'));
        } else if (status === 403) {
          window.dispatchEvent(new CustomEvent('sentinel:behaviour-blocked', {
            detail: {
              code: error.response?.data?.code,
              message: error.response?.data?.message || 'Behaviour batch was blocked by session policy.',
            },
          }));
        } else {
          console.warn('Behaviour batch was not submitted:', error.response?.data?.message || error.message);
        }
      } finally {
        sendingRef.current = false;
      }
    };

    const intervalId = window.setInterval(sendBatch, WINDOW_INTERVAL_MS);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('click', handleClick);
    };
  }, [isAuthenticated, monitoringEnabled]);
};
