import React from "react";

export default function AnswerBox({ value, onChange, onSubmit, loading }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-6">
      <h3 className="text-sm font-semibold mb-2">Your Answer</h3>

      <textarea
        className="w-full min-h-[160px] resize-none rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent p-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500"
        placeholder="Think out loud. You can include code."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-slate-400">
          Tip: Shift + Enter for new line
        </span>

        <button
          onClick={onSubmit}
          disabled={loading}
          className="rounded-xl bg-purple-600 px-6 py-2 text-sm text-white font-semibold hover:bg-purple-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting…" : "Submit"}
        </button>
      </div>
    </div>
  );
}
