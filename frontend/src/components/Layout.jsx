import React from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <h1 className="text-lg font-semibold tracking-tight">
              AI Mock Interviewer
            </h1>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>Hackathon Build</span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-6 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-500 dark:text-slate-400 pb-6">
        Researched and Developed by Koushik Gupta
      </footer>
    </div>
  );
}
