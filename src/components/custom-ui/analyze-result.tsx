"use client";

import type { GeminiContractResult, ChatMessage, GeminiLetterResult } from "@/lib/types";
import RiskTimeline from "@/components/custom-ui/risk-timeline";
import {
  AlertTriangle,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Info,
  Loader2,
  Mail,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface AnalyzeResultProps {
  data: GeminiContractResult;
  chatHistory: ChatMessage[];
  isChatLoading: boolean;
  fileName: string;
  onGenerateLetter: () => Promise<GeminiLetterResult>;
}

const riskBadgeStyle = {
  Rendah: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Sedang: "text-amber-700 bg-amber-50 border-amber-200",
  Tinggi: "text-red-700 bg-red-50 border-red-200",
};

export default function AnalyzeResult({
  data,
  chatHistory,
  isChatLoading,
  fileName,
  onGenerateLetter,
}: AnalyzeResultProps) {
  const [letter, setLetter] = useState<GeminiLetterResult | null>(null);
  const [letterLoading, setLetterLoading] = useState(false);
  const [showLetter, setShowLetter] = useState(false);

  const handleExportPDF = async () => {
    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const element = document.getElementById("analyze-report-content");
      if (!element) return;

      toast.info("Membuat PDF...");
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * pageWidth) / canvas.width;

      let yOffset = 0;
      while (yOffset < imgHeight) {
        if (yOffset > 0) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -yOffset, pageWidth, imgHeight);
        yOffset += pageHeight;
      }

      pdf.save(`laporan-legal-mate-${fileName.replace(/\.[^.]+$/, "")}.pdf`);
      toast.success("PDF berhasil diunduh!");
    } catch {
      toast.error("Gagal membuat PDF");
    }
  };

  const handleGenerateLetter = async () => {
    if (letter) {
      setShowLetter((v) => !v);
      return;
    }
    setLetterLoading(true);
    try {
      const result = await onGenerateLetter();
      setLetter(result);
      setShowLetter(true);
    } catch {
      toast.error("Gagal membuat surat balasan");
    } finally {
      setLetterLoading(false);
    }
  };

  const handleCopyLetter = () => {
    if (!letter) return;
    navigator.clipboard.writeText(`${letter.subject}\n\n${letter.letter}`);
    toast.success("Surat disalin ke clipboard!");
  };

  return (
    <div className="w-full max-w-lg space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all"
        >
          <Download className="size-3.5" />
          Unduh PDF
        </button>
        <button
          onClick={handleGenerateLetter}
          disabled={letterLoading}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 disabled:opacity-50 transition-all"
        >
          {letterLoading ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Mail className="size-3.5" />
          )}
          {letter ? (showLetter ? "Sembunyikan Surat" : "Tampilkan Surat") : "Buat Surat Balasan"}
        </button>
      </div>

      {/* Report content captured for PDF */}
      <div id="analyze-report-content" className="space-y-4 bg-slate-50 p-1 rounded-2xl">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold text-slate-800">{data.metrics.klausul}</p>
            <p className="text-xs text-slate-400 mt-0.5">Klausul</p>
          </div>
          <div
            className={`border rounded-xl p-3 text-center shadow-sm ${riskBadgeStyle[data.riskLevel]}`}
          >
            <p className="text-lg font-bold">{data.riskLevel}</p>
            <p className="text-xs mt-0.5 opacity-70">Tingkat Risiko</p>
          </div>
        </div>

        {/* Verdict */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Verdict</p>

          <div className="flex items-start gap-3">
            {data.verdict.sah ? (
              <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-medium text-slate-700">
                {data.verdict.sah ? "Dokumen Sah" : "Dokumen Tidak Sah"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{data.verdict.pesanSah}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            {!data.verdict.bermasalah ? (
              <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm font-medium text-slate-700">
                {data.verdict.bermasalah ? "Ada Klausul Bermasalah" : "Tidak Ada Masalah Hukum"}
              </p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                {data.verdict.pesanBermasalah}
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center gap-2">
            <Info className="size-4 text-slate-400" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Ringkasan</p>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{data.summary}</p>
        </div>

        {/* Risk timeline */}
        {data.timeline?.length > 0 && (
          <RiskTimeline timeline={data.timeline} />
        )}

        {/* Red flags */}
        <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-red-400" />
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">Red Flags</p>
          </div>
          <ul className="space-y-2">
            {data.redFlags.map((flag, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-red-400 shrink-0 mt-0.5">•</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-emerald-400" />
            <p className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">
              Rekomendasi
            </p>
          </div>
          <ul className="space-y-2">
            {data.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Generated letter */}
      {showLetter && letter && (
        <div className="bg-white border border-blue-100 rounded-2xl p-4 shadow-sm space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-blue-400" />
              <p className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                Surat Balasan
              </p>
            </div>
            <button
              onClick={handleCopyLetter}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              <Copy className="size-3" />
              Salin
            </button>
          </div>
          <p className="text-xs font-medium text-slate-500">Perihal: {letter.subject}</p>
          <pre className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-sans">
            {letter.letter}
          </pre>
        </div>
      )}

      {/* Chat history */}
      {chatHistory.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-1">
            Percakapan
          </p>
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-emerald-50 border border-emerald-100 text-emerald-800 ml-8"
                  : "bg-white border border-slate-200 text-slate-700 mr-8 shadow-sm"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {isChatLoading && (
            <div className="flex items-center gap-2 p-4 bg-white border border-slate-200 rounded-2xl shadow-sm mr-8">
              <Loader2 className="size-4 text-slate-400 animate-spin" />
              <p className="text-sm text-slate-400">Legal Mate sedang berpikir...</p>
            </div>
          )}
        </div>
      )}

      {/* spacer so fixed promptbox doesn't overlap */}
      <div className="h-24" />
    </div>
  );
}
