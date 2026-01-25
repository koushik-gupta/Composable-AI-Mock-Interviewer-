import React from "react";

export default function ChatBubble({ text }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="h-10 w-10 rounded-full bg-purple-600 text-white flex items-center justify-center text-lg">
        🤖
      </div>

      <div className="max-w-xl bg-white dark:bg-slate-900 rounded-2xl px-5 py-4 shadow-md">
        <p className="text-sm leading-relaxed">{text}</p>
        <div className="mt-2 text-xs text-slate-400">AI Interviewer</div>
      </div>
    </div>
  );
}
