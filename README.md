# quick-gcal

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

詳しい開発経緯や技術解説は `docs/` ディレクトリの Markdown を参照してください。
