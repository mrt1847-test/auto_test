import React from "react";
import { Textarea } from "@/components/ui/textarea";

interface MarkdownEditorProps {
  markdown: string;
  onMarkdownChange: (value: string) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ markdown, onMarkdownChange }) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      onMarkdownChange(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-2">
      <input type="file" accept=".md,.txt" onChange={handleFileUpload} className="mb-2" />
      <Textarea
        className="h-64 w-full font-mono"
        value={markdown}
        onChange={(e) => onMarkdownChange(e.target.value)}
      />
    </div>
  );
};