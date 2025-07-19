
'use client';

import { useState, useCallback } from "react";
import { createCalendarEvent } from "@/api/calendar";
import { toast } from "sonner";
import { formatDate, formatTime } from "@/lib/utils";

interface ApiResponse {
  id: string;
  htmlLink: string;
}

export interface Template {
  name: string;
  title: string;
  duration: number;
  description: string;
}

export const useQuickAddForm = () => {
  const now = new Date();
  const defaultStartTime = new Date(now.getTime() + 30 * 60 * 1000);
  const defaultEndTime = new Date(now.getTime() + 60 * 60 * 1000);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(formatDate(now));
  const [startTime, setStartTime] = useState(formatTime(defaultStartTime));
  const [endTime, setEndTime] = useState(formatTime(defaultEndTime));
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const applyTemplate = (template: Template) => {
    const start = new Date();
    const end = new Date(start.getTime() + template.duration * 60000);
    setTitle(template.title);
    setDate(formatDate(start));
    setStartTime(formatTime(start));
    setEndTime(formatTime(end));
    setDescription(template.description ?? "");
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.startsWith("https://") || text.startsWith("http://")) {
        const linkText = "リンク";
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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    const startDateTimeObj = new Date(`${date}T${startTime}:00`);
    const timezoneOffsetMinutes = startDateTimeObj.getTimezoneOffset();
    const offsetHours = Math.floor(Math.abs(timezoneOffsetMinutes) / 60);
    const offsetMinutes = Math.abs(timezoneOffsetMinutes) % 60;
    const offsetSign = timezoneOffsetMinutes > 0 ? '-' : '+';
    const formattedOffset = `${offsetSign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinutes).padStart(2, '0')}`;

    const startDateTimeWithOffset = `${date}T${startTime}:00${formattedOffset}`;
    const endDateTimeWithOffset = `${date}T${endTime}:00${formattedOffset}`;

    try {
      const apiResponse: ApiResponse[] = await createCalendarEvent({
        title,
        start: startDateTimeWithOffset,
        end: endDateTimeWithOffset,
        location,
        description,
      });

      let htmlLink: string | null = null;

      if (Array.isArray(apiResponse) && apiResponse.length > 0 && apiResponse[0]?.htmlLink) {
        htmlLink = apiResponse[0].htmlLink;
      }

      const newNow = new Date();
      setTitle("");
      setDate(formatDate(newNow));
      setStartTime(formatTime(new Date(newNow.getTime() + 30 * 60 * 1000)));
      setEndTime(formatTime(new Date(newNow.getTime() + 60 * 60 * 1000)));
      setLocation("");
      setDescription("");

      if (htmlLink) {
        setTimeout(() => {
          toast.success(
            <a href={htmlLink} target="_blank" rel="noopener noreferrer" className="underline">
              ✅ 予定を登録しました (カレンダーで表示)
            </a>
          );
        }, 2000);
      } else {
        toast.success("✅ 予定を登録しました");
      }

    } catch (error) {
      console.error("Failed to create event:", error);
      toast.error("❌ 予定の登録に失敗しました");
    }
  }, [title, date, startTime, endTime, location, description]);

  return {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    location,
    setLocation,
    description,
    setDescription,
    handlePasteFromClipboard,
    handleSubmit,
    applyTemplate,
  };
};
