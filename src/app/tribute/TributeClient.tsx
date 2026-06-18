'use client';

import { useEffect } from 'react';
import { trackDiscovery } from '@/lib/analytics';

export default function TributeClient() {
  useEffect(() => {
    trackDiscovery('tribute_play');
  }, []);

  return null;
}
