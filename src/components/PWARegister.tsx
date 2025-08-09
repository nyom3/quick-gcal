'use client';

import { useEffect } from 'react';

export function PWARegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('serviceWorker' in navigator) {
      const register = async () => {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js');
          // Debug: registration and scope
          console.info('[PWA] SW registered', { scope: reg.scope });
          if (navigator.serviceWorker.controller) {
            console.info('[PWA] This page is controlled by SW');
          } else {
            console.info('[PWA] This page is NOT yet controlled (reload may be required)');
          }
        } catch (err) {
          console.error('SW registration failed', err);
        }
      };
      // Register after page load to avoid blocking TTI
      if (document.readyState === 'complete') register();
      else window.addEventListener('load', register, { once: true });
    }
  }, []);
  return null;
}
