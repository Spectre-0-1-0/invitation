'use client';

import { trackDiscovery } from '@/lib/analytics';
import { useEffect } from 'react';

export default function MediaClient() {
  useEffect(() => {
     // Admin usage is also tracked for internal auditing
     trackDiscovery('profile_view', { role: 'admin', section: 'media' });
  }, []);

  return null;
}
