# quick-gcal

[![Lighthouse CI](https://github.com/nyom3/quick-gcal/actions/workflows/lhci.yml/badge.svg)](https://github.com/nyom3/quick-gcal/actions/workflows/lhci.yml)

このアプリケーションは Google Calendar と連携するための Next.js 製サンプルです。

## セットアップ

1. 依存パッケージのインストール

```bash
npm install
```

2. 環境変数の設定

`.env.example` を `.env.local` としてコピーし、`NEXT_PUBLIC_MAKE_CREATE_WEBHOOK_URL` に Make で発行した Webhook URL を設定します。

```bash
cp .env.example .env.local
# .env.local を開いて URL を入力
```

3. 開発サーバーの起動

```bash
npm run dev
```

上記コマンドで `http://localhost:3000` にアクセスできるようになります。

## ビルド方法

本番用の静的ファイルを生成するには次のコマンドを実行します。

```bash
npm run build
```

ビルド後、以下で本番サーバを起動できます。

```bash
npm start
```

## 必要な環境変数

Google Calendar へイベントを登録するため、Make（旧 Integromat）の Webhook URL を環境変数として設定する必要があります。

* `NEXT_PUBLIC_MAKE_CREATE_WEBHOOK_URL` : Make で作成した Webhook の URL

`.env.local` などに以下のように記述してください。

```env
NEXT_PUBLIC_MAKE_CREATE_WEBHOOK_URL=https://hook.example.com/your-webhook-id
```

この値は `src/api/calendar.ts` で参照され、イベント作成時の HTTP リクエスト送信先として利用されます。

## 補足

詳しい開発経緯や技術解説は `docs/` ディレクトリ内の Markdown を参照してください。

## PWA 対応

本アプリはインストール可能な PWA に対応しています。

- マニフェスト: `src/app/manifest.ts`
- サービスワーカー登録: `src/components/PWARegister.tsx`（`src/app/layout.tsx` で読み込み）
- インストール促進UI: `src/components/InstallPrompt.tsx`（`beforeinstallprompt` をハンドリング）
- サービスワーカー本体: `public/sw.js`
- オフラインページ: `public/offline.html`

アイコンはサーバーサイドで動的生成されます（追加作業不要）。

- 生成ルート:
  - `GET /icons/icon-192.png` → 192×192 PNG
  - `GET /icons/icon-512.png` → 512×512 PNG
  - `GET /apple-icon.png` → 180×180 PNG（iOSホーム画面）

開発時に確認するには、`npm run dev` で起動後、Chrome の Application タブで Manifest と Icons を確認してください。localhost でも Service Worker が動作します。

### Apple（iOS/iPadOS）
- `metadata.appleWebApp` を設定しており、ホーム画面追加後はスタンドアロンで起動します。
- タッチアイコンを `public/icons` に置くと、ホーム画面アイコンが反映されます（推奨: 180×180 PNG）。

## Vercel へのデプロイ

Next.js プロジェクトのため、Vercel へのデプロイは自動検出されます。以下の手順で公開できます。

1. GitHub へリポジトリをプッシュ（または更新）
2. Vercel ダッシュボードで「New Project」→ 対象リポジトリを選択
3. Framework は Next.js が自動選択されます（変更不要）
4. 環境変数を設定
   - `NEXT_PUBLIC_MAKE_CREATE_WEBHOOK_URL`（必須）
5. Deploy を実行

補足:
- `public/sw.js` と `public/offline.html` はそのまま配信され、PWA/オフライン対応が機能します。
- App Router 配下のアイコン生成ルート（`/icons/*`, `/apple-icon.png`）はサーバーレス関数として動作します。

## CI（Lighthouse）

GitHub Actions で本番URLに対して Lighthouse CI を実行します（PRごと）。

- ワークフロー: `.github/workflows/lhci.yml`
- 計測対象URL: 手動入力 > リポジトリ変数/シークレット `LHCI_PROD_URL` > 既定 `https://quick-gcal.vercel.app`
- 成果物: ワークフローページの「Step Summary」に平均スコア（Performance/Accessibility/Best Practices/SEO）を出力

手動実行方法（workflow_dispatch）
- リポジトリ → Actions → "Lighthouse CI" → "Run workflow"
- 入力欄 `prod_url` に任意のURL（例: `https://quick-gcal.vercel.app`）を指定可能（空なら既定/変数を使用）

## 変更点サマリー（今回）

- PWA 対応を追加（Service Worker, オフラインページ, インストール促進UI）
- 動的アイコン生成ルートを追加（`/icons/*`, `/apple-icon.png`）
- `layout.tsx` に PWA メタデータと登録コンポーネントを組み込み
- README に PWA, Vercel デプロイ, CI の説明を追記
