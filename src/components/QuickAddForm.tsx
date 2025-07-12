'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createCalendarEvent } from "@/api/calendar";
import { toast } from "sonner";

export default function QuickAddForm() {
  const now = new Date();
  const defaultStartTime = new Date(now.getTime() + 30 * 60 * 1000);
  const defaultEndTime = new Date(now.getTime() + 60 * 60 * 1000);

  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  const formatTime = (date: Date) => date.toTimeString().split(' ')[0].substring(0, 5);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(formatDate(now));
  const [startTime, setStartTime] = useState(formatTime(defaultStartTime));
  const [endTime, setEndTime] = useState(formatTime(defaultEndTime));
  const [location, setLocation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const startDateTime = `${date}T${startTime}`;
    const endDateTime = `${date}T${endTime}`;

    try {
      const apiResponse = await createCalendarEvent({
        title,
        start: startDateTime,
        end: endDateTime,
        location,
      });

      let htmlLink = null;

      if (Array.isArray(apiResponse) && apiResponse.length > 0 && apiResponse[0]?.htmlLink) {
        htmlLink = apiResponse[0].htmlLink;
      }

      if (htmlLink) {
        toast.success(
          <a href={htmlLink} target="_blank" rel="noopener noreferrer" className="underline">
            ✅ 予定を登録しました (リンク)
          </a>
        );
      } else {
        toast.success("✅ 予定を登録しました");
      }

      setTitle("");
      setDate(formatDate(now));
      setStartTime(formatTime(defaultStartTime));
      setEndTime(formatTime(defaultEndTime));
      setLocation("");
    } catch (error) {
      console.error("Failed to create event:", error);
      toast.error("❌ 予定の登録に失敗しました");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="sm:col-span-2 grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startTime">Start Time</Label>
            <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="endTime">End Time</Label>
            <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
          </div>
        </div>
      </div>
      <div>
        <Label htmlFor="location">Location (optional)</Label>
        <Input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <Button type="submit" className="w-full">Add Event</Button>
    </form>
  );
}
