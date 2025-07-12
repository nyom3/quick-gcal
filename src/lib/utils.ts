import { type ClassValue, clsx } from "clsx" // Tailwind CSSのクラス名を条件付きで結合するためのユーティリティ。
import { twMerge } from "tailwind-merge" // Tailwind CSSの競合するクラス名を解決するためのユーティリティ。

// Tailwind CSSのクラス名を結合するためのヘルパー関数。
// clsxとtailwind-mergeを組み合わせて使用することで、
// クラス名の重複や競合を効率的に解決し、最終的なクラス文字列を生成します。
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Dateオブジェクトを "YYYY-MM-DD" 形式の文字列にフォーマットする関数。
// toISOString()がUTCでフォーマットするのに対し、この関数はローカルタイムゾーンに基づいて日付を生成します。
// これにより、ユーザーの期待する日付が正確に表示されるようになります。
export const formatDate = (date: Date) => {
  const year = date.getFullYear(); // 年を取得。
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月を取得し、1を加えて2桁にパディング。
  const day = String(date.getDate()).padStart(2, '0');     // 日を取得し、2桁にパディング。
  return `${year}-${month}-${day}`;
};

// Dateオブジェクトを "HH:MM" 形式の文字列にフォーマットする関数。
// toTimeString()から時刻部分を抽出し、不要な秒やタイムゾーン情報を除外します。
export const formatTime = (date: Date) => date.toTimeString().split(' ')[0].substring(0, 5);