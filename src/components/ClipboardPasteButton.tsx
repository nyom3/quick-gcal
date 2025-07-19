
'use client';

import { Button } from "@/components/ui/button";
import { ClipboardPaste } from "lucide-react";

interface ClipboardPasteButtonProps {
  handlePaste: () => void;
}

export const ClipboardPasteButton: React.FC<ClipboardPasteButtonProps> = ({ handlePaste }) => (
  <Button
    type="button"
    variant="ghost"
    size="sm"
    className="mt-2"
    onClick={handlePaste}
  >
    <ClipboardPaste className="mr-2 h-4 w-4" />
    リンクを貼り付け
  </Button>
);
