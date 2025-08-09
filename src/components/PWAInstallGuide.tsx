'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';

function isInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  const mql = window.matchMedia && window.matchMedia('(display-mode: standalone)');
  // iOS Safari uses navigator.standalone
  const iosStandalone = (navigator as any).standalone === true;
  return !!(mql && mql.matches) || iosStandalone;
}

export function PWAInstallGuide() {
  const [visible, setVisible] = useState(false);
  const isAndroid = useMemo(() => {
    if (typeof navigator === 'undefined') return false;
    return /Android/i.test(navigator.userAgent);
  }, []);

  useEffect(() => {
    if (!isAndroid) return;
    if (isInstalled()) return;
    let timer: number | undefined;
    // しきい値後も BIP が来ていなければ案内を表示
    timer = window.setTimeout(() => {
      const bipFired = typeof window !== 'undefined' && (window as any).__bip_fired === true;
      if (!bipFired) setVisible(true);
    }, 6000);
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [isAndroid]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 flex justify-center px-4 z-50">
      <div className="rounded-xl border bg-background shadow-sm p-3 md:p-3.5 flex items-start gap-3 max-w-[640px] w-full">
        <div className="text-sm leading-6">
          <p className="font-medium mb-1">アプリをホーム画面に追加</p>
          <p className="text-muted-foreground">
            Chrome のメニュー（右上の ⋮）から「アプリをインストール」または「ホーム画面に追加」を選択してください。
          </p>
        </div>
        <div className="ml-auto">
          <Button size="sm" variant="ghost" onClick={() => setVisible(false)}>閉じる</Button>
        </div>
      </div>
    </div>
  );
}

export default PWAInstallGuide;

