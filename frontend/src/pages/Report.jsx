import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { downloadReportPdf } from "../services/api";

export default function Report() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const report = sessionStorage.getItem("final_report");

  const handleDownload = async () => {
    const res = await downloadReportPdf(sessionId);
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "Interview_Report.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (!report) {
    return <p>No report found</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-center">
        Interview Report
      </h1>

      <div className="bg-white p-8 rounded-xl shadow prose max-w-none">
        <ReactMarkdown>{report}</ReactMarkdown>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={handleDownload}
          className="px-6 py-3 bg-black text-white rounded"
        >
          📄 Download PDF
        </button>

        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 border rounded"
        >
          Start New Interview
        </button>
      </div>
    </div>
  );
}
