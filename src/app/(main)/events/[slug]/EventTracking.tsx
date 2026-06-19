'use client';

import { useEffect } from 'react';
import { trackDiscovery } from '@/lib/analytics';

export default function EventTracking({ slug, title }: { slug: string, title: string }) {
  useEffect(() => {
    trackDiscovery('profile_view', { eventSlug: slug, eventTitle: title, type: 'event' });
  }, [slug, title]);

  return null;
}
