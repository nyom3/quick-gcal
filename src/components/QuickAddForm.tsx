'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuickAddForm, Template } from "@/hooks/useQuickAddForm.tsx";
import { CalendarPlus } from "lucide-react";
import { TemplateButtons } from "./TemplateButtons";
import { ClipboardPasteButton } from "./ClipboardPasteButton";

const templates: Template[] = [
  { name: "歯医者", title: "歯医者", duration: 30, description: "定期検診" },
  { name: "飲み会", title: "飲み会", duration: 120, description: "〇〇と居酒屋" },
  { name: "デート", title: "デート", duration: 60, description: "ｘｘさんとディナー" },
  { name: "会議", title: "会議", duration: 30, description: "プロジェクトの進捗確認" }
];

export default function QuickAddForm() {
  const {
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
  } = useQuickAddForm();

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto">
      <TemplateButtons templates={templates} applyTemplate={applyTemplate} />
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="sm:col-span-2 grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input id="startTime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">Location (optional)</Label>
        <Input id="location" type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Input id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        <ClipboardPasteButton handlePaste={handlePasteFromClipboard} />
      </div>
      <Button type="submit" className="w-full" variant="default">
        <CalendarPlus className="mr-2 h-4 w-4" />
        Add Event
      </Button>
    </form>
  );
}