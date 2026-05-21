"use client";

import { ValidFileType } from "@/lib/validTypeFiles";
import { FileText, Plus, UploadCloud, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

interface DropzoneProps {
  files: File[];
  onFilesAdded: (newFiles: File[]) => void;
  onFileRemoved: (index: number) => void;
  onDraggingChange?: (isDragging: boolean) => void;
  compact?: boolean;
  children?: React.ReactNode;
}

export default function Dropzone({
  files,
  onFilesAdded,
  onFileRemoved,
  onDraggingChange,
  compact,
  children,
}: DropzoneProps) {
  const [isDragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setDraggingState = (val: boolean) => {
    setDragging(val);
    onDraggingChange?.(val);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingState(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDraggingState(false);
    }
  };

  const handleDragDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingState(false);
    if (e.dataTransfer.files?.length > 0) {
      validateAndAdd(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      validateAndAdd(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const validateAndAdd = (incoming: File[]) => {
    const valid: File[] = [];
    const existingNames = new Set(files.map((f) => f.name));

    for (const file of incoming) {
      if (!ValidFileType.includes(file.type)) {
        toast.error(`Format tidak didukung: ${file.name}`, {
          description: "Gunakan PDF, DOCX, JPG, atau PNG.",
        });
        continue;
      }
      if (existingNames.has(file.name)) {
        toast.info(`File sudah ada: ${file.name}`);
        continue;
      }
      valid.push(file);
    }

    if (valid.length > 0) onFilesAdded(valid);
  };

  const hasFiles = files.length > 0;

  return (
    <div
      className={`relative w-full min-h-screen flex flex-col items-center gap-4 p-6 transition-colors duration-200 ${
        compact ? "justify-start pt-16" : "justify-center pb-32"
      } ${isDragging ? "bg-emerald-50/50" : "bg-slate-50"}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragDrop}
    >
      {/* drag border overlay */}
      <div
        className={`fixed inset-0 border-4 border-dashed pointer-events-none transition-all duration-200 ${
          isDragging ? "border-emerald-400 opacity-100" : "border-transparent opacity-0"
        }`}
      />

      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/jpg,image/png,.pdf,.doc,.docx"
        multiple
        className="hidden"
        onChange={handleFileInput}
      />

      {!hasFiles ? (
        /* Empty state — big drop zone */
        <div
          className={`relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-200 w-full max-w-lg ${
            isDragging
              ? "border-emerald-400 bg-emerald-50 scale-[1.01] shadow-inner"
              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div
              className={`p-4 rounded-full transition-colors ${
                isDragging ? "bg-emerald-100 text-emerald-600" : "bg-slate-50 text-slate-400"
              }`}
            >
              <UploadCloud className="size-8 animate-pulse" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">
                <span className="text-emerald-600 font-semibold">Klik untuk mengunggah</span>{" "}
                atau seret file ke sini
              </p>
              <p className="text-xs text-slate-400">
                PDF, DOCX, JPG, PNG — bisa lebih dari 1 file (max. 10MB/file)
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* File list */
        <div className="w-full max-w-lg space-y-2 animate-in fade-in zoom-in-95 duration-150">
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-xl shadow-sm"
            >
              <div className="flex items-center gap-3 truncate">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
                  <FileText className="size-4" />
                </div>
                <div className="truncate text-left">
                  <p className="text-sm font-medium text-slate-700 truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </div>
              <button
                onClick={() => onFileRemoved(i)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors shrink-0 ml-2"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}

          {/* Add more button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 w-full p-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all text-sm"
          >
            <Plus className="size-4" />
            Tambah file lain (screenshot chat, lampiran, dll.)
          </button>
        </div>
      )}

      {children}
    </div>
  );
}
