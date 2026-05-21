"use client";

import AnalyzeConfirm from "@/components/custom-ui/analyze-confirm";
import AnalyzeLoading from "@/components/custom-ui/analyze-loading";
import AnalyzeResult from "@/components/custom-ui/analyze-result";
import Dropzone from "@/components/custom-ui/dropzone";
import PromptBox from "@/components/custom-ui/promptbox";
import { extractFileContent, type FileContent } from "@/lib/extractFileContent";
import type { ChatMessage, GeminiContractResult, GeminiLetterResult } from "@/lib/types";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

type AppState = "idle" | "ready" | "analyzing" | "done";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [isDragging, setIsDragging] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const [fileContents, setFileContents] = useState<FileContent[]>([]);

  const [analysisResult, setAnalysisResult] = useState<GeminiContractResult | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setChatLoading] = useState(false);

  const apiPromiseRef = useRef<Promise<GeminiContractResult> | null>(null);

  const callAnalyzeAPI = (contents: FileContent[]): Promise<GeminiContractResult> =>
    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "contract", fileContent: contents }),
    }).then((r) => {
      if (!r.ok) throw new Error("API error");
      return r.json();
    });

  const handleFilesAdded = async (newFiles: File[]) => {
    const extracted = await Promise.all(
      newFiles.map(async (f) => {
        try {
          return await extractFileContent(f);
        } catch {
          toast.error(`Gagal membaca ${f.name}`);
          return null;
        }
      })
    );

    const validPairs = newFiles
      .map((f, i) => ({ file: f, content: extracted[i] }))
      .filter((p): p is { file: File; content: FileContent } => p.content !== null);

    if (validPairs.length === 0) return;

    setFiles((prev) => [...prev, ...validPairs.map((p) => p.file)]);
    setFileContents((prev) => {
      const next = [...prev, ...validPairs.map((p) => p.content)];
      if (next.length > 0) setAppState("ready");
      return next;
    });
  };

  const handleFileRemoved = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileContents((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (next.length === 0) setAppState("idle");
      return next;
    });
  };

  const handleConfirm = () => {
    setAppState("analyzing");
    apiPromiseRef.current = callAnalyzeAPI(fileContents);
  };

  const handleAnalyzeDone = useCallback(async () => {
    try {
      const result = await apiPromiseRef.current;
      if (!result) throw new Error("No result");
      setAnalysisResult(result);
      setAppState("done");
    } catch {
      toast.error("Gagal menganalisis. Coba lagi.");
      setAppState("ready");
    }
  }, []);

  const handlePromptSubmit = async (text: string) => {
    const userMsg: ChatMessage = { role: "user", content: text };
    setChatHistory((prev) => [...prev, userMsg]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "chat", message: text, history: chatHistory }),
      });
      if (!res.ok) throw new Error("API error");
      const data: { reply: string } = await res.json();
      setChatHistory((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      toast.error("Gagal mengirim pesan. Coba lagi.");
    } finally {
      setChatLoading(false);
    }
  };

  const handleGenerateLetter = async (): Promise<GeminiLetterResult> => {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "letter", analysisResult }),
    });
    if (!res.ok) throw new Error("API error");
    return res.json();
  };

  const handleReset = () => {
    setFiles([]);
    setFileContents([]);
    setAnalysisResult(null);
    setChatHistory([]);
    apiPromiseRef.current = null;
    setAppState("idle");
  };

  return (
    <main className="relative">
      <Dropzone
        files={files}
        onFilesAdded={handleFilesAdded}
        onFileRemoved={handleFileRemoved}
        onDraggingChange={setIsDragging}
        compact={appState !== "idle"}
      >
        {appState === "ready" && <AnalyzeConfirm onConfirm={handleConfirm} />}
        {appState === "analyzing" && (
          <AnalyzeLoading onComplete={handleAnalyzeDone} />
        )}
        {appState === "done" && analysisResult && (
          <AnalyzeResult
            data={analysisResult}
            chatHistory={chatHistory}
            isChatLoading={isChatLoading}
            fileName={files[0]?.name ?? "dokumen"}
            onGenerateLetter={handleGenerateLetter}
          />
        )}
      </Dropzone>

      {appState === "done" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <PromptBox isDragging={isDragging} onSubmit={handlePromptSubmit} />
        </div>
      )}

      {(appState === "ready" || appState === "done") && (
        <button
          onClick={handleReset}
          className="fixed top-4 right-4 text-xs text-slate-400 hover:text-slate-600 transition-colors z-50"
        >
          Mulai Ulang
        </button>
      )}
    </main>
  );
}
