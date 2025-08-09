
'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

type BIPE = Event & { prompt: () => Promise<void>; userChoice?: Promise<{ outcome: 'accepted' | 'dismissed' }>; };

declare global {
  interface Window {
    __bip_fired?: boolean;
  }
}

export function InstallPrompt() {
  const [event, setEvent] = useState<BIPE | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      if (typeof window !== 'undefined') {
        window.__bip_fired = true;
      }
      console.info('[PWA] beforeinstallprompt fired');
      setEvent(e as BIPE);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', handler as EventListener);
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  if (!visible || !event) return null;

  const onInstall = async () => {
    try {
      console.info('[PWA] Prompting install UI');
      await event.prompt();
    } finally {
      setVisible(false);
      setEvent(null);
    }
  };

  return (
    <div className="fixed bottom-4 inset-x-0 flex justify-center px-4 z-50">
      <div className="rounded-xl border bg-background shadow-sm p-3 flex items-center gap-3">
        <span className="text-sm">アプリをインストールできます</span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="default"
            onClick={async () => {
              try {
                console.info('[PWA] Prompting install UI');
                await event.prompt();
                // userChoice は仕様で存在。型は必須ではないので optional に。
                const choice = await (event as any).userChoice;
                console.info('[PWA] userChoice', choice);
              } finally {
                setVisible(false);
                setEvent(null);
              }
            }}
          >
            インストール
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setVisible(false)}>閉じる</Button>
        </div>
      </div>
    </div>
  );
}
