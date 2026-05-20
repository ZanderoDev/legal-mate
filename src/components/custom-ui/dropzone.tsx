"use client";

import { ValidFileType } from "@/lib/validTypeFiles";
import { FileText, UploadCloud, X } from "lucide-react";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

interface dropzoneProps {
  onFileSelected: (file: File) => void;
  onFileRemoved?: () => void;
  onDraggingChange?: (isDragging: boolean) => void;
  compact?: boolean;
  children?: React.ReactNode;
}

export default function Dropzone({
  onFileSelected,
  onFileRemoved,
  onDraggingChange,
  compact,
  children,
}: dropzoneProps) {
  const [isDragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const setDraggingState = (val: boolean) => {
    setDragging(val);
    onDraggingChange?.(val);
  };

  // Handling if the user do drag the file into the page
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingState(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    // only reset if leaving the root container entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDraggingState(false);
    }
  };

  // if the user drop a file into this we'll gonna catch it
  const handleDragDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggingState(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validatendSetFile(file);
    }
  };

  // if this user decide to upload it using button
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validatendSetFile(file);
    }
  };

  // validate the file format, also set the file here
  const validatendSetFile = (file: File) => {
    if (ValidFileType.includes(file.type)) {
      setSelectedFile(file);
      onFileSelected(file);
    } else {
      toast.error("Format file tidak didukung", {
        description: "Coba dengan format PDF, JPG, JPEG, DOC, atau DOCX.",
      });
    }
  };

  // if the user remove the file cause why not
  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onFileRemoved?.();
  };

  return (
    <div
      className={`relative w-full min-h-screen flex flex-col items-center gap-4 p-6 transition-colors duration-200 ${
        compact ? "justify-start pt-16" : "justify-center pb-32"
      } ${isDragging ? "bg-emerald-50/50" : "bg-slate-50"}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDragDrop}
    >
      {/* full-screen drag border overlay */}
      <div
        className={`fixed inset-0 border-4 border-dashed pointer-events-none transition-all duration-200 ${
          isDragging ? "border-emerald-400 opacity-100" : "border-transparent opacity-0"
        }`}
      />

      {!selectedFile ? (
        <div
          className={`relative border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all duration-200 w-full max-w-lg ${
            isDragging
              ? "border-emerald-400 bg-emerald-50 scale-[1.01] shadow-inner"
              : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*, .pdf"
            className="hidden"
            onChange={handleFileInput}
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div
              className={`p-4 rounded-full transition-colors ${
                isDragging
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-slate-50 text-slate-400"
              }`}
            >
              <UploadCloud className="size-8 animate-pulse" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-slate-700">
                <span className="text-emerald-600 font-semibold">
                  Silahkan klik disini untuk mengunggah file anda
                </span>{" "}
                atau seret saja kesini filenya
              </p>
              <p className="text-xs text-slate-400">
                PDF, JPG, JPEG, atau PNG (max. 10MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm animate-in fade-in zoom-in-95 duration-150 w-full max-w-lg">
          <div className="flex items-center space-x-3 truncate">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <FileText className="size-5" />
            </div>

            <div className="truncate text-left">
              <p className="text-sm font-medium text-slate-700 truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-slate-400">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)}MB
              </p>
            </div>
          </div>

          <button
            onClick={removeFile}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      {children}
    </div>
  );
}
