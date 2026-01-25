import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { submitAnswer } from "../services/api";
import Editor from "@monaco-editor/react";

/* -------------------------------
   Language mapping
-------------------------------- */
const languageFromTopic = (topic = "") => {
  const t = topic.toLowerCase();
  if (t.includes("python")) return "python";
  if (t.includes("java") && !t.includes("javascript")) return "java";
  if (t.includes("c++")) return "cpp";
  if (t.includes("javascript")) return "javascript";
  if (t.includes("sql")) return "sql";
  if (t.includes("node")) return "javascript";
  if (t.includes("flask") || t.includes("django")) return "python";
  if (t.includes("api")) return "javascript";
  return "plaintext";
};

const TOTAL_QUESTIONS = 5;
const ANSWER_BOX_HEIGHT = 260;

export default function Interview() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [textAnswer, setTextAnswer] = useState("");
  const [codeAnswer, setCodeAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [questionIndex, setQuestionIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("answer");

  /* 🔊 Voice */
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef(null);

  const topic = sessionStorage.getItem("topic") || "";
  const language = useMemo(() => languageFromTopic(topic), [topic]);

  /* -------------------------------
     Voice helpers
-------------------------------- */
  const speakQuestion = (text) => {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  /* -------------------------------
     Load first question
-------------------------------- */
  useEffect(() => {
    const q = sessionStorage.getItem("current_question");

    if (!q) {
      setError("Interview session expired. Please restart.");
      return;
    }

    if (q.trim().startsWith("{")) {
      setError("Invalid question received. Please restart interview.");
      return;
    }

    setQuestion(q);
    setQuestionIndex(0);
    speakQuestion(q);

    return () => window.speechSynthesis.cancel();
  }, []);

  /* -------------------------------
     Submit answer
-------------------------------- */
  const handleSubmit = async () => {
    if (!textAnswer.trim() && !codeAnswer.trim()) {
      setError("Please provide an explanation or code before submitting.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const combinedAnswer =
        textAnswer +
        (codeAnswer ? "\n\n--- CODE ---\n" + codeAnswer : "");

      const res = await submitAnswer({
        session_id: sessionId,
        answer: combinedAnswer,
      });

      if (res.data.done) {
        sessionStorage.removeItem("current_question");
        sessionStorage.setItem("final_report", res.data.report);
        navigate(`/report/${sessionId}`);
        return;
      }

      sessionStorage.setItem(
        "current_question",
        res.data.next_question
      );

      setQuestion(res.data.next_question);
      setTextAnswer("");
      setCodeAnswer("");
      setActiveTab("answer");
      setQuestionIndex((q) => q + 1);

      speakQuestion(res.data.next_question);
    } catch (err) {
      if (err?.response?.status === 400) {
        setError(err.response.data?.error || "Session expired.");
      } else {
        setError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const progressPercent = Math.min(
    ((questionIndex + 1) / TOTAL_QUESTIONS) * 100,
    100
  );

  /* -------------------------------
     UI
-------------------------------- */
  return (
    <div className="w-full min-h-screen px-8 py-6 space-y-6 bg-slate-50">

      {/* PROGRESS */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Interview Progress</span>
          <span>{questionIndex + 1} / {TOTAL_QUESTIONS}</span>
        </div>
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* QUESTION */}
      <div className="max-w-7xl mx-auto bg-white rounded-2xl p-6 shadow">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          Interview Question
        </p>

        <div className="flex items-start justify-between gap-4 mt-2">
          <h1 className="text-2xl font-semibold leading-relaxed flex-1">
            {question}
          </h1>

          <button
            onClick={() =>
              isSpeaking ? stopSpeaking() : speakQuestion(question)
            }
            className="px-4 py-2 text-sm border rounded-lg hover:bg-slate-100"
          >
            {isSpeaking ? "⏹ Stop" : "🔊 Listen"}
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto text-red-500 text-sm">
          {error}
        </div>
      )}

      {/* ANSWER + TIPS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* ANSWER */}
        <div className="bg-white rounded-2xl p-6 shadow flex flex-col">

          {/* Tabs + Submit */}
          <div className="flex items-center justify-between border-b pb-2 mb-3">
            <div className="flex gap-6">
              <button
                onClick={() => setActiveTab("answer")}
                className={`text-sm font-medium ${
                  activeTab === "answer"
                    ? "border-b-2 border-black"
                    : "text-slate-400"
                }`}
              >
                📝 Explanation
              </button>
              <button
                onClick={() => setActiveTab("code")}
                className={`text-sm font-medium ${
                  activeTab === "code"
                    ? "border-b-2 border-black"
                    : "text-slate-400"
                }`}
              >
                💻 Code
              </button>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 bg-black text-white rounded-lg text-sm"
            >
              {loading ? "Evaluating…" : "Submit"}
            </button>
          </div>

          {/* CONTENT (NO JUMP) */}
          <div
            className="border rounded-xl overflow-hidden"
            style={{ height: ANSWER_BOX_HEIGHT }}
          >
            {activeTab === "answer" ? (
              <textarea
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                className="w-full h-full resize-none p-4 text-sm focus:outline-none"
                placeholder="Explain your approach clearly…"
              />
            ) : (
              <Editor
                height={ANSWER_BOX_HEIGHT}
                language={language}
                theme="vs-dark"
                value={codeAnswer}
                onChange={(v) => setCodeAnswer(v || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                }}
              />
            )}
          </div>
        </div>

        {/* TIPS */}
        <div className="bg-white rounded-2xl p-6 shadow text-sm text-slate-600">
          <h3 className="font-semibold mb-3">Interview Tips</h3>
          <ul className="list-disc ml-5 space-y-2">
            <li>Explain your thinking clearly.</li>
            <li>Use code only when it adds value.</li>
            <li>Edge cases matter.</li>
            <li>It’s okay to state assumptions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
