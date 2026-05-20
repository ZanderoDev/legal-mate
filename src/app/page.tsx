"use client";

import AnalyzeConfirm from "@/components/custom-ui/analyze-confirm";
import AnalyzeLoading from "@/components/custom-ui/analyze-loading";
import AnalyzeResult from "@/components/custom-ui/analyze-result";
import Dropzone from "@/components/custom-ui/dropzone";
import PromptBox from "@/components/custom-ui/promptbox";
import { useCallback, useState } from "react";

type AppState = "idle" | "ready" | "analyzing" | "done";

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (_file: File) => setAppState("ready");

  const handleFileRemoved = () => setAppState("idle");

  const handleConfirm = () => setAppState("analyzing");

  const handleAnalyzeDone = useCallback(() => setAppState("done"), []);

  const handlePromptSubmit = (_text: string) => {};

  return (
    <main className="relative">
      <Dropzone
        onFileSelected={handleFileChange}
        onFileRemoved={handleFileRemoved}
        onDraggingChange={setIsDragging}
        compact={appState !== "idle"}
      >
        {appState === "ready" && (
          <AnalyzeConfirm onConfirm={handleConfirm} />
        )}
        {appState === "analyzing" && (
          <AnalyzeLoading onComplete={handleAnalyzeDone} />
        )}
        {appState === "done" && <AnalyzeResult />}
      </Dropzone>

      {appState === "done" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <PromptBox isDragging={isDragging} onSubmit={handlePromptSubmit} />
        </div>
      )}
    </main>
  );
}
