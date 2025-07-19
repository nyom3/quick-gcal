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
