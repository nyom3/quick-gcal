# quick-gcal 開発サマリーと今後の実装方針

## 1. これまでの実装内容

`quick-gcal` プロジェクトは、Google Calendar と連携するシンプルなカレンダーアプリケーションを目指しています。これまでの開発で、以下の基盤が構築されました。

### プロジェクトの初期設定と環境構築
- Next.js をベースとしたプロジェクト構造が確立されています。
- 開発サーバーの起動 (`npm run dev`) が可能になりました。

### UI コンポーネントの整備
- `src/components/ui` ディレクトリが作成されました。
- 以下の基本的な UI コンポーネントが作成されました。
    - `button.tsx`: 再利用可能なボタンコンポーネント。
    - `input.tsx`: 再利用可能な入力フィールドコンポーネント。
    - `label.tsx`: 再利用可能なラベルコンポーネント。
- これらのコンポーネントは、`shadcn/ui` のようなモダンな UI ライブラリのパターンを参考に、Tailwind CSS を用いてスタイリングされています。

### 依存関係の解決とユーティリティの追加
- UI コンポーネントが依存する以下のライブラリがインストールされました。
    - `clsx`: 条件付きでクラス名を結合するためのユーティリティ。
    - `tailwind-merge`: Tailwind CSS のクラス名を効率的にマージするためのユーティリティ。
    - `@radix-ui/react-label`: Radix UI のラベルコンポーネント。
- `src/lib/utils.ts` ファイルが作成され、`clsx` と `tailwind-merge` を利用した `cn` (classnames) 関数が定義されました。これにより、Tailwind CSS のクラス名を動的に、かつ衝突なく適用できるようになりました。

### エラーの解決履歴
開発中に発生した主なエラーとその解決策は以下の通りです。
- **`@/lib/utils` モジュールが見つからないエラー**: `src/lib/utils.ts` ファイルの作成と、`clsx` および `tailwind-merge` のインストールにより解決。
- **`@radix-ui/react-label` モジュールが見つからないエラー**: `@radix-ui/react-label` のインストールにより解決。
- **`class-variance-authority` モジュールが見つからないエラー**: `class-variance-authority` のインストールにより解決。
- **`TypeError: Class extends value undefined is not a constructor or null` エラー**: `@fullcalendar/react` を使用している `src/components/CalendarView.tsx` が Server Component として扱われていたため、ファイルの先頭に `'use client';` を追加し、Client Component としてマークすることで解決。

### 現在のアプリケーションの状態
- `src/app/page.tsx` に `CalendarView` と `EventForm` が配置されています。
- テスト目的で、`page.tsx` に `Input` と `Button` コンポーネントが追加され、UI コンポーネントがブラウザに表示されることを確認済みです。

## 2. 今後の実装方針

今後は、Google Calendar との本格的な連携機能の実装に焦点を当てます。

### ステップ 1: Google API クレデンシャルの取得と設定
- Google Cloud Platform でプロジェクトを作成し、Google Calendar API を有効化します。
- OAuth 2.0 クライアント ID を取得し、`client ID` と `client secret` を安全に管理します（環境変数として設定）。
- 承認済みの JavaScript 生成元 (例: `http://localhost:3000`) とリダイレクト URI を設定します。

### ステップ 2: Google API クライアントライブラリのインストール
- Node.js 環境で Google API を操作するための公式クライアントライブラリ（例: `google-api-nodejs-client` または `googleapis`）をインストールします。

### ステップ 3: 認証フローの実装
- Next.js の API ルート (`/api/auth`) を利用して、OAuth 2.0 認証フローを実装します。
- ユーザーが Google アカウントでログインし、Google Calendar へのアクセスを許可するプロセスを構築します。
- 認証トークンを安全に保存し、再利用できるようにします。

### ステップ 4: Google Calendar イベントの取得と表示
- 認証トークンを使用して Google Calendar API を呼び出し、ユーザーのカレンダーイベントを取得します。
- 取得したイベントデータを `CalendarView` コンポーネントに渡し、カレンダー上に表示します。
- イベントの期間、タイトル、説明などの情報を適切にマッピングします。

### ステップ 5: イベントの作成・更新・削除機能の実装
- `EventForm` コンポーネントを拡張し、新しいイベントの作成、既存イベントの更新、削除ができるようにします。
- フォームの入力値に基づいて Google Calendar API を呼び出し、カレンダーデータを操作します。

### その他の検討事項
- **エラーハンドリングとユーザーフィードバック**: API 通信時のエラーや認証失敗時の適切なエラーハンドリングと、ユーザーへの分かりやすいフィードバックメカニズムを実装します。
- **UI/UX の改善**: カレンダーの表示オプション（週表示、日表示など）、イベントの詳細表示、検索・フィルタリング機能など、ユーザーエクスペリエンスを向上させるための機能を追加します。
- **テスト**: 各機能の実装後、単体テストや統合テストを記述し、アプリケーションの品質と安定性を確保します。

このロードマップに沿って、`quick-gcal` を実用的な Google Calendar クライアントとして完成させていきます。
