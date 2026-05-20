"use client";

import { SendHorizontal } from "lucide-react";
import React, { useRef, useState } from "react";

interface promptBoxProps {
  isDragging: boolean;
  onSubmit: (text: string) => void;
}

export default function PromptBox({ isDragging, onSubmit }: promptBoxProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSubmit(value.trim());
    setValue("");
  };

  // submit on Enter, new line on Shift+Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // auto-grow textarea height
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div
      className={`flex items-end gap-3 p-3 bg-white border rounded-2xl transition-all duration-300 ease-in-out ${
        isDragging
          ? "border-emerald-400 shadow-lg shadow-emerald-100 scale-[1.02] -translate-y-1"
          : "border-slate-200 shadow-sm"
      }`}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={
          isDragging
            ? "Lepaskan file di atas..."
            : "Tanyakan sesuatu tentang kontrak ini..."
        }
        rows={1}
        className="flex-1 resize-none text-sm text-slate-700 placeholder:text-slate-400 outline-none bg-transparent max-h-36 overflow-y-auto leading-relaxed"
      />

      <button
        onClick={handleSubmit}
        disabled={!value.trim()}
        className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
      >
        <SendHorizontal className="size-4" />
      </button>
    </div>
  );
}
