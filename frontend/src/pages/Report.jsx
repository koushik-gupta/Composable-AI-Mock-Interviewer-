import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { downloadReportPdf } from "../services/api";

function extractScore(report) {
  const match = report.match(/Estimated competence:\s*(\d+)/i);
  return match ? Number(match[1]) : null;
}

function getVerdict(score) {
  if (score >= 8) return { label: "Strong Hire", color: "bg-green-600" };
  if (score >= 6) return { label: "Hire with Confidence", color: "bg-emerald-500" };
  if (score >= 4) return { label: "Needs Improvement", color: "bg-yellow-500" };
  return { label: "Not Interview Ready", color: "bg-red-500" };
}

export default function Report() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const report = sessionStorage.getItem("final_report");

  if (!report) {
    return <p className="text-center text-red-500">No report found</p>;
  }

  const score = extractScore(report);
  const verdict = score !== null ? getVerdict(score) : null;

  const handleDownload = async () => {
    const res = await downloadReportPdf(report);
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Interview_Report.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

      {/* HEADER SCORE CARD */}
      {score !== null && (
        <div className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-slate-500 uppercase tracking-wide">
              Final Interview Score
            </p>
            <h1 className="text-5xl font-bold mt-2">
              {score} / 10
            </h1>
          </div>

          {verdict && (
            <div
              className={`px-6 py-3 rounded-full text-white text-lg font-semibold ${verdict.color}`}
            >
              {verdict.label}
            </div>
          )}
        </div>
      )}

      {/* FULL REPORT */}
      <div className="bg-white p-8 rounded-xl shadow prose max-w-none">
        <ReactMarkdown>{report}</ReactMarkdown>
      </div>

      {/* ACTIONS */}
      <div className="flex justify-center gap-4">
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-black text-white rounded-md"
        >
          📄 Download PDF
        </button>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 border rounded-md"
        >
          Start New Interview
        </button>
      </div>
    </div>
  );
}
