export interface TimelinePoint {
  section: string;
  risk: "tinggi" | "sedang" | "aman";
  note: string;
}

export interface GeminiContractResult {
  metrics: { klausul: number };
  riskLevel: "Rendah" | "Sedang" | "Tinggi";
  verdict: {
    sah: boolean;
    pesanSah: string;
    bermasalah: boolean;
    pesanBermasalah: string;
  };
  summary: string;
  redFlags: string[];
  recommendations: string[];
  timeline: TimelinePoint[];
}

export interface GeminiChatResult {
  reply: string;
}

export interface GeminiLetterResult {
  subject: string;
  letter: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
