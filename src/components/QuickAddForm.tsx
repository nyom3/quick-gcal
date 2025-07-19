'use client'; // このディレクティブは、このコンポーネントがクライアントサイドでレンダリングされることを示します。
                  // Next.js 13以降のApp Routerでは、デフォルトでサーバーコンポーネントですが、
                  // useStateやuseEffectなどのクライアントサイドのフックを使用するために必要です。

import { Button } from "@/components/ui/button"; // shadcn/uiのボタンコンポーネントをインポート。
import { Input } from "@/components/ui/input";   // shadcn/uiの入力フィールドコンポーネントをインポート。
import { Label } from "@/components/ui/label";   // shadcn/uiのラベルコンポーネントをインポート。
import { useState, useCallback } from "react"; // Reactのstate管理とパフォーマンス最適化のためのフックをインポート。
import { createCalendarEvent } from "@/api/calendar"; // Googleカレンダーイベント作成APIを呼び出すためのラッパー関数をインポート。
import { toast } from "sonner"; // トースト通知を表示するためのライブラリをインポート。
import { formatDate, formatTime } from "@/lib/utils"; // 日付と時刻のフォーマットユーティリティ関数をインポート。
import {
  CalendarPlus,
  ClipboardList,
  ClipboardPaste,
} from "lucide-react"; // ボタン用アイコン

// 事前に用意されたイベントテンプレートの定義
const templates = [
  { name: "歯医者", title: "歯医者", duration: 30, description: "定期検診" },
  { name: "飲み会", title: "飲み会", duration: 120, description: "〇〇と居酒屋" },
  { name: "デート", title: "デート", duration: 60, description: "ｘｘさんとディナー" },
  { name: "会議", title: "会議", duration: 30, description: "プロジェクトの進捗確認" }
] as const;

// Make WebhookからのAPIレスポンスの型定義。
// これにより、レスポンスデータの構造が明確になり、型安全性が向上します。
interface ApiResponse {
  id: string;      // イベントの一意なID。
  htmlLink: string; // Googleカレンダーでイベントを表示するためのURL。
}

// QuickAddFormコンポーネントの定義。
// ユーザーがGoogleカレンダーに素早くイベントを追加するためのフォームを提供します。
export default function QuickAddForm() {
  // 現在時刻を取得し、デフォルトの日付と時刻の計算に使用します。
  // コンポーネントがマウントされた時点の時刻が基準となります。
  const now = new Date();
  // デフォルトの開始時刻を現在時刻の30分後に設定します。
  // ユーザーがすぐにイベントを作成できるように、一般的な会議時間などを考慮しています。
  const defaultStartTime = new Date(now.getTime() + 30 * 60 * 1000);
  // デフォルトの終了時刻を開始時刻の30分後（現在時刻の1時間後）に設定します。
  // これも一般的な会議の長さを考慮したものです。
  const defaultEndTime = new Date(now.getTime() + 60 * 60 * 1000);

  // フォームの各入力フィールドの状態を管理するためのuseStateフック。
  // ユーザーの入力に応じてこれらの状態が更新され、フォームの表示に反映されます。
  const [title, setTitle] = useState(""); // イベントのタイトル。
  // 日付の初期値は現在の日付に設定されます。
  const [date, setDate] = useState(formatDate(now));
  // 開始時刻の初期値はデフォルトの開始時刻に設定されます。
  const [startTime, setStartTime] = useState(formatTime(defaultStartTime));
  // 終了時刻の初期値はデフォルトの終了時刻に設定されます。
  const [endTime, setEndTime] = useState(formatTime(defaultEndTime));
  // イベントの場所（オプション）。
  const [location, setLocation] = useState("");
  // イベントの説明（オプション）。
  const [description, setDescription] = useState("");

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.startsWith("https://") || text.startsWith("http://")) {
        const linkText = "リンク"; // リンクの表示テキストを"リンク"とする
        const newLink = `<a href="${text}">${linkText}</a>`;
        setDescription((prevDesc) => (prevDesc ? `${prevDesc}\n${newLink}` : newLink));
        toast.success("✅ リンクを貼り付けました");
      } else {
        toast.error("❌ 有効なURLが検出されません");
      }
    } catch (error) {
      console.error("Failed to read clipboard contents:\n", error);
      toast.error("❌ クリップボードの読み取りに失敗しました");
    }
  };

  // フォーム送信時のハンドラー関数。
  // useCallbackを使用することで、コンポーネントが再レンダリングされてもこの関数が再作成されるのを防ぎ、
  // パフォーマンスを最適化します。依存配列に指定された値が変更された場合にのみ関数が再作成されます。
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault(); // フォームのデフォルトの送信動作（ページリロード）を防ぎます。

    // フォームの入力値からDateオブジェクトを構築し、ローカルタイムゾーンのオフセットを付加します。
    // GoogleカレンダーAPIが正確な日時を解釈できるように、タイムゾーン情報を含めることが重要です。
    const startDateTimeObj = new Date(`${date}T${startTime}:00`);
    const endDateTimeObj = new Date(`${date}T${endTime}:00`);

    // タイムゾーンオフセットを計算し、ISO 8601形式に変換します。
    // 例: +09:00 (日本標準時)
    const timezoneOffsetMinutes = startDateTimeObj.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(timezoneOffsetMinutes) / 60);
    const offsetMinutes = Math.abs(timezoneOffsetMinutes) % 60;
    const offsetSign = timezoneOffsetMinutes > 0 ? '-' : '+'; // getTimezoneOffsetは逆の符号を返すため反転
    const formattedOffset = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;

    // タイムゾーンオフセットを含む完全な日時文字列を作成します。
    // 例: "2025-07-12T09:30:00+09:00"
    const startDateTimeWithOffset = `${date}T${startTime}:00${formattedOffset}`;
    const endDateTimeWithOffset = `${date}T${endTime}:00${formattedOffset}`;

    try {
      // createCalendarEvent関数を呼び出して、Make Webhook経由でGoogleカレンダーにイベントを登録します。
      const apiResponse: ApiResponse[] = await createCalendarEvent({
        title,
        start: startDateTimeWithOffset, // タイムゾーン情報を含む開始日時
        end: endDateTimeWithOffset,     // タイムゾーン情報を含む終了日時
        location,
        description,
      });

      let htmlLink: string | null = null; // Googleカレンダーイベントへのリンクを格納する変数。

      // APIレスポンスが配列であり、最初の要素にhtmlLinkプロパティが存在するかを確認します。
      // Make Webhookのレスポンス形式に合わせてデータを安全に抽出するためです。
      if (Array.isArray(apiResponse) && apiResponse.length > 0 && apiResponse[0]?.htmlLink) {
        htmlLink = apiResponse[0].htmlLink;
      }

      // フォームをリセットする際に、現在時刻を再取得してデフォルト値を更新します。
      // これにより、連続してイベントを登録する際に、常に最新の日時がデフォルトとして表示されます。
      const newNow = new Date();
      setTitle(""); // タイトルをクリア。
      setDate(formatDate(newNow)); // 日付を現在の日付にリセット。
      setStartTime(formatTime(new Date(newNow.getTime() + 30 * 60 * 1000))); // 開始時刻を現在時刻の30分後にリセット。
      setEndTime(formatTime(new Date(newNow.getTime() + 60 * 60 * 1000)));   // 終了時刻を現在時刻の1時間後にリセット。
      setLocation(""); // 場所をクリア。
      setDescription(""); // 説明をクリア。

      // htmlLinkが存在する場合、リンク付きの成功トーストを表示します。
      // Googleカレンダーがイベントを認識するまでの時間差を考慮し、2秒の遅延を設けています。
      // これにより、「予定が見つかりません」というエラーを減らすことを目指します。
      if (htmlLink) {
        setTimeout(() => {
          toast.success(
            <a href={htmlLink} target="_blank" rel="noopener noreferrer" className="underline">
              ✅ 予定を登録しました (カレンダーで表示)
            </a>
          );
        }, 2000); // 2秒 (2000ミリ秒) 遅延。
      } else {
        // htmlLinkが取得できなかった場合でも、API呼び出し自体は成功しているので、通常の成功メッセージを表示します。
        toast.success("✅ 予定を登録しました");
      }

    } catch (error) {
      // イベント作成中にエラーが発生した場合の処理。
      // エラーをコンソールに出力し、ユーザーに失敗を通知するトーストを表示します。
      console.error("Failed to create event:", error);
      toast.error("❌ 予定の登録に失敗しました");
    }
  }, [title, date, startTime, endTime, location, description]); // useCallbackの依存配列。これらの値が変更された場合にのみhandleSubmitが再作成されます。

  // フォームのUI構造。
  // shadcn/uiのコンポーネントとTailwind CSSを使用して、モバイルフレンドリーなレイアウトを実現しています。
  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto"> {/* 各フォーム要素間にスペースを設けるためのTailwindクラス */}
      <div className="flex flex-wrap gap-x-2 gap-y-2">
        {templates.map((t) => (
          <Button
            key={t.name}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const start = new Date();
              const end = new Date(start.getTime() + t.duration * 60000);
              setTitle(t.title);
              setDate(formatDate(start));
              setStartTime(formatTime(start));
              setEndTime(formatTime(end));
              setDescription(t.description ?? "");
            }}
          >
            <ClipboardList className="mr-2 h-4 w-4" />
            {t.name}
          </Button>
        ))}
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label> {/* イベントタイトルのラベル */}
        <Input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required /> {/* タイトル入力フィールド */}
      </div>
      {/* 日付と時刻の入力フィールドのレイアウト。モバイルでは縦に、sm以上の画面ではグリッドレイアウトになります。 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label> {/* 日付のラベル */}
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required /> {/* 日付入力フィールド */}
        </div>
        {/* 開始時刻と終了時刻のフィールドをグループ化し、sm以上の画面で2カラム表示にします。 */}
        <div className="sm:col-span-2 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label> {/* 開始時刻のラベル */}
            <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required /> {/* 開始時刻入力フィールド */}
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label> {/* 終了時刻のラベル */}
            <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required /> {/* 終了時刻入力フィールド */}
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location (optional)</Label> {/* 場所のラベル（オプション） */}
        <Input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} /> {/* 場所入力フィールド */}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="mt-2"
          onClick={handlePasteFromClipboard}
        >
          <ClipboardPaste className="mr-2 h-4 w-4" />
          リンクを貼り付け
        </Button>
      </div>
      <Button type="submit" className="w-full" variant="default">
        <CalendarPlus className="mr-2 h-4 w-4" />
        Add Event
      </Button> {/* イベント追加ボタン。w-fullで幅いっぱいに表示 */}
    </form>
  );
}