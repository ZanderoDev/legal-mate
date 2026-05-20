"use client";

import { ShieldCheck } from "lucide-react";

interface analyzeConfirmProps {
  onConfirm: () => void;
}

export default function AnalyzeConfirm({ onConfirm }: analyzeConfirmProps) {
  return (
    <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
          <ShieldCheck className="size-6" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-800">
            Siap untuk dianalisis?
          </p>
          <p className="text-xs text-slate-500 leading-relaxed">
            Kami akan memeriksa dokumen kamu untuk mendeteksi risiko hukum,
            klausul tidak adil, dan celah yang perlu kamu waspadai sebelum
            menandatangani.
          </p>
        </div>
      </div>

      <button
        onClick={onConfirm}
        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors"
      >
        Mulai Analisis
      </button>
    </div>
  );
}
