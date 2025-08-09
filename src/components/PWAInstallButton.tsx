'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

export function PWAInstallButton() {
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    const check = () => {
      setAvailable(typeof window !== 'undefined' && !!(window as any).__bip_event);
    };
    check();
    const id = window.setInterval(check, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!available) return null;

  return (
    <div
      className="fixed right-4 z-50"
      style={{ top: `calc(env(safe-area-inset-top, 0px) + 12px)` }}
    >
      <Button size="sm" onClick={async () => {
        try {
          const e = (window as any).__bip_event;
          if (!e) return;
          console.info('[PWA] Prompt via header button');
          await (e as any).prompt();
          const choice = await (e as any).userChoice;
          console.info('[PWA] userChoice', choice);
        } finally {
          (window as any).__bip_event = undefined;
          setAvailable(false);
        }
      }}>
        インストール
      </Button>
    </div>
  );
}

export default PWAInstallButton;

