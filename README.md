# quick-gcal

Google Calendar と連携するカレンダーアプリのソースコードです。

## 開発サーバの起動方法
1. 依存パッケージをインストールします。
   ```bash
   npm install
   ```
2. 開発サーバを起動します。
   ```bash
   npm run dev
   ```
   上記コマンドで `http://localhost:3000` にアクセスできるようになります。

## ビルド方法
本番用の静的ファイルを生成するには次のコマンドを実行します。
```bash
npm run build
```
ビルド後、`npm start` で本番サーバを起動できます。

## 必要な環境変数
Google Calendar へイベントを登録するため、Make(旧 Integromat) の Webhook URL を環境変数として設定する必要があります。

- `NEXT_PUBLIC_MAKE_CREATE_WEBHOOK_URL` : Make で作成した Webhook の URL

`.env.local` などに以下のように記述してください。
```env
NEXT_PUBLIC_MAKE_CREATE_WEBHOOK_URL=https://hook.example.com/your-webhook-id
```
この値は `src/api/calendar.ts` で参照され、イベント作成時の HTTP リクエスト送信先として利用されます。
