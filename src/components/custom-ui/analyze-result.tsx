"use client";

import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

const dummyResult = {
  stats: {
    pages: 4,
    clauses: 12,
    wordCount: 2847,
    riskLevel: "Tinggi" as const,
  },
  verdict: {
    isLegit: true,
    isLegal: false,
    legitimacyNote:
      "Dokumen ditandatangani oleh kedua belah pihak dan bermaterai resmi Rp10.000.",
    legalityNote:
      "Terdapat klausul yang bertentangan dengan UU No. 8 Tahun 1999 tentang Perlindungan Konsumen.",
  },
  summary:
    "Perjanjian kerja sama bisnis antara CV Maju Bersama (pihak pertama) dan PT Sinar Abadi (pihak kedua). Dokumen ini mengatur pembagian keuntungan, hak dan kewajiban, serta mekanisme penyelesaian sengketa. Ditemukan beberapa klausul yang secara signifikan merugikan pihak pertama dan berpotensi melanggar hukum yang berlaku.",
  redFlags: [
    "Klausul 7.2 membebankan denda tidak proporsional hanya kepada pihak pertama",
    "Tidak ada klausul force majeure yang melindungi kedua pihak",
    "Hak terminasi kontrak sepihak hanya dimiliki oleh pihak kedua",
    'Batas waktu pembayaran tidak jelas — hanya tertulis "sesegera mungkin"',
  ],
  recommendations: [
    "Minta revisi klausul 7.2 agar denda bersifat proporsional dan berlaku dua arah",
    "Tambahkan klausul force majeure standar sebelum menandatangani",
    "Negosiasikan hak terminasi yang seimbang untuk kedua pihak",
    "Tetapkan batas waktu pembayaran yang jelas, misal 14 hari kerja",
  ],
};

const riskBadgeStyle = {
  Rendah: "text-emerald-700 bg-emerald-50 border-emerald-200",
  Sedang: "text-amber-700 bg-amber-50 border-amber-200",
  Tinggi: "text-red-700 bg-red-50 border-red-200",
};

export default function AnalyzeResult() {
  return (
    <div className="w-full max-w-lg space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Halaman", value: dummyResult.stats.pages },
          { label: "Klausul", value: dummyResult.stats.clauses },
          {
            label: "Kata",
            value: dummyResult.stats.wordCount.toLocaleString("id-ID"),
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-slate-200 rounded-xl p-3 text-center shadow-sm"
          >
            <p className="text-lg font-bold text-slate-800">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Risk level */}
      <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm">
        <p className="text-sm text-slate-600">Tingkat Risiko</p>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${riskBadgeStyle[dummyResult.stats.riskLevel]}`}
        >
          {dummyResult.stats.riskLevel}
        </span>
      </div>

      {/* Verdict */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
          Verdict
        </p>

        <div className="flex items-start gap-3">
          {dummyResult.verdict.isLegit ? (
            <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="text-sm font-medium text-slate-700">
              {dummyResult.verdict.isLegit ? "Dokumen Sah" : "Dokumen Tidak Sah"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {dummyResult.verdict.legitimacyNote}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          {dummyResult.verdict.isLegal ? (
            <CheckCircle2 className="size-5 text-emerald-500 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
          )}
          <div>
            <p className="text-sm font-medium text-slate-700">
              {dummyResult.verdict.isLegal
                ? "Sesuai Hukum"
                : "Bermasalah Secara Hukum"}
            </p>
            <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
              {dummyResult.verdict.legalityNote}
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <Info className="size-4 text-slate-400" />
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Ringkasan
          </p>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          {dummyResult.summary}
        </p>
      </div>

      {/* Red flags */}
      <div className="bg-white border border-red-100 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-red-400" />
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">
            Red Flags
          </p>
        </div>
        <ul className="space-y-2">
          {dummyResult.redFlags.map((flag, i) => (
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
          {dummyResult.recommendations.map((rec, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
              <span className="text-emerald-500 shrink-0 mt-0.5">•</span>
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* spacer so fixed promptbox doesn't overlap last card */}
      <div className="h-24" />
    </div>
  );
}
