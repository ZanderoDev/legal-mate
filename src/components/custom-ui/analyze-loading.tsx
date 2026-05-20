"use client";

import { useEffect, useRef, useState } from "react";

const steps = [
  "Membaca dan mengekstrak teks dokumen...",
  "Mengidentifikasi klausul dan pasal...",
  "Mengevaluasi risiko hukum...",
  "Menyusun laporan analisis...",
];

interface analyzeLoadingProps {
  onComplete: () => void;
}

export default function AnalyzeLoading({ onComplete }: analyzeLoadingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (currentStep >= steps.length) {
      onCompleteRef.current();
      return;
    }
    const timer = setTimeout(() => setCurrentStep((p) => p + 1), 700);
    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 animate-in fade-in zoom-in-95 duration-200">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
        Sedang Menganalisis
      </p>

      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-3">
            <div
              className={`size-2 rounded-full shrink-0 transition-all duration-300 ${
                i < currentStep
                  ? "bg-emerald-500"
                  : i === currentStep
                    ? "bg-emerald-400 animate-pulse"
                    : "bg-slate-200"
              }`}
            />
            <p
              className={`text-sm transition-colors duration-300 ${
                i < currentStep
                  ? "text-slate-300 line-through"
                  : i === currentStep
                    ? "text-slate-700 font-medium"
                    : "text-slate-300"
              }`}
            >
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
