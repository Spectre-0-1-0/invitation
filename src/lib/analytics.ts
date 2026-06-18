'use client';

/**
 * LIGHTWEIGHT NON-INVASIVE ANALYTICS
 * No cookies, no personal data, no third-party tracking.
 * This logs internal events to the browser console in development
 * and can be connected to a secure internal logging endpoint in production.
 */

type DiscoveryAction = 'search' | 'filter' | 'random_memory' | 'profile_view' | 'memory_view' | 'tribute_play';

export const trackDiscovery = (action: DiscoveryAction, metadata?: Record<string, any>) => {
  if (typeof window === 'undefined') return;

  const eventData = {
    action,
    path: window.location.pathname,
    timestamp: new Date().toISOString(),
    ...metadata,
  };

  // In production, we would fetch('/api/analytics', { method: 'POST', body: JSON.stringify(eventData) })
  // For now, we log to console for auditing purposes as per "Internal Discovery Log" requirements.
  if (process.env.NODE_ENV === 'development') {
    console.log('[Internal Discovery Log]:', eventData);
  }
};

export const trackPageView = (path: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[Page View]:', path);
  }
};
