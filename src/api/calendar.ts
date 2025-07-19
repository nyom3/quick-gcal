import axios from 'axios'; // HTTPリクエストを行うためのライブラリ。

// Googleカレンダーイベント作成APIに送信するパラメータの型定義。
// これにより、関数に渡されるデータの構造が明確になり、開発時のエラーを防ぎます。
interface CreateEventParams {
  title: string;   // イベントのタイトル。必須。
  start: string;   // イベントの開始日時。ISO 8601形式 (例: YYYY-MM-DDTHH:MM:SS+HH:MM)。タイムゾーン情報を含むことが重要です。
  end: string;     // イベントの終了日時。ISO 8601形式。
  location?: string; // イベントの場所。オプション。
  description?: string; // イベントの説明。オプション。
}

// Googleカレンダーにイベントを作成するための非同期関数。
// Make Webhookを介してGoogle Calendar APIと連携します。
export async function createCalendarEvent(params: CreateEventParams) {
  // 環境変数からMake WebhookのURLを取得します。
  // NEXT_PUBLIC_で始まる変数は、Next.jsのクライアントサイドでもアクセス可能です。
  const makeWebhookUrl = process.env.NEXT_PUBLIC_MAKE_CREATE_WEBHOOK_URL;

  // Webhook URLが設定されていない場合はエラーをスローします。
  // これは、API呼び出しが正しく行われるための重要な前提条件です。
  if (!makeWebhookUrl) {
    throw new Error("NEXT_PUBLIC_MAKE_CREATE_WEBHOOK_URL is not defined");
  }

  // axios.postを使用して、指定されたWebhook URLにイベントデータを送信します。
  // ここで送信されるデータは、MakeシナリオでGoogleカレンダーイベントを作成するために使用されます。
  const response = await axios.post(makeWebhookUrl, {
    title: params.title,
    start: params.start,
    end: params.end,
    location: params.location,
    description: params.description,
  });

  // Make Webhookからの生のレスポンスデータをコンソールに出力します。
  // これはデバッグ目的で追加されており、API連携の問題を診断するのに役立ちます。
  console.log("Full response from Make webhook:", response.data);

  // Make Webhookからのレスポンスデータを返します。
  // このデータには、作成されたイベントのIDやGoogleカレンダーでの表示リンクなどが含まれると期待されます。
  return response.data;
}
