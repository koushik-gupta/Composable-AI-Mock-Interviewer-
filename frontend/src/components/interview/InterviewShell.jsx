import React from "react";

export default function InterviewShell({ children }) {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200 dark:from-[#0b0f19] dark:via-[#0e1324] dark:to-[#0b0f19]">
      <div
        className="
          w-full max-w-6xl
          rounded-3xl
          bg-white/70 dark:bg-[#0f172a]/80
          backdrop-blur-2xl
          shadow-[0_30px_80px_rgba(0,0,0,0.45)]
          border border-white/20
          p-10
        "
      >
        {children}
      </div>
    </div>
  );
}
