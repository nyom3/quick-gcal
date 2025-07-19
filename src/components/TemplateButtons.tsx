
'use client';

import { Button } from "@/components/ui/button";
import { ClipboardList } from "lucide-react";
import { Template } from "@/hooks/useQuickAddForm";

interface TemplateButtonsProps {
  templates: Template[];
  applyTemplate: (template: Template) => void;
}

export const TemplateButtons: React.FC<TemplateButtonsProps> = ({ templates, applyTemplate }) => (
  <div className="flex flex-wrap gap-x-2 gap-y-2">
    {templates.map((t) => (
      <Button
        key={t.name}
        type="button"
        variant="outline"
        size="sm"
        onClick={() => applyTemplate(t)}
      >
        <ClipboardList className="mr-2 h-4 w-4" />
        {t.name}
      </Button>
    ))}
  </div>
);
