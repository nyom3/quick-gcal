# Vercel へのデプロイ手順

本プロジェクト（Next.js, App Router）は Vercel によって自動検出・ビルドされます。以下の手順で公開できます。

## 事前準備

- GitHub にリポジトリを用意し、最新の変更を push 済みにする
- Make（旧 Integromat）で Webhook URL を発行済みであること

## 手順

1. Vercel ダッシュボードで「New Project」→ GitHub の対象リポジトリを選択
2. Framework は Next.js が自動選択されます（変更不要）
3. Environment Variables を設定
   - `NEXT_PUBLIC_MAKE_CREATE_WEBHOOK_URL`（必須）
4. Deploy を実行

## 補足（PWA）

- サービスワーカー: `public/sw.js` がドメインルートで配信されます
- オフラインページ: `public/offline.html`（ナビゲーション時のフォールバック）
- アイコン生成: App Router で `/icons/*` と `/apple-icon.png` を動的生成
- メタデータ: `src/app/layout.tsx` の `metadata` と `PWARegister`/`InstallPrompt` により、インストール可能な PWA を構成

## トラブルシュート

- 404（アイコンが見つからない）
  - デプロイ直後のキャッシュが影響する場合があります。ハードリロード、もしくは再アクセスをお試しください。
  - ルートのパスが `/icons/icon-192.png` / `/icons/icon-512.png` / `/apple-icon.png` であることを確認してください。

- PWA として「インストール」表示が出ない
  - Chrome DevTools の Application タブ → Manifest で要件を満たしているか確認してください。
  - `http(s)` 配信、アイコンの最小サイズ、`display: standalone` 等が満たされている必要があります。

