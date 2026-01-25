import React, { useEffect, useState } from "react";
import { startInterview, fetchTopics } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CandidateForm() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [mode, setMode] = useState("normal"); // normal | project
  const [role, setRole] = useState("Technical");
  const [topic, setTopic] = useState("");
  const [topics, setTopics] = useState({});
  const [confidence, setConfidence] = useState(5);

  const [githubUrl, setGithubUrl] = useState("");
  const [resume, setResume] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTopics().then(res => setTopics(res.data));
  }, []);

  const handleStart = async () => {
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (mode === "normal" && !topic) {
      setError("Please select a topic");
      return;
    }

    if (mode === "project" && !githubUrl.trim()) {
      setError("GitHub repository link is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("mode", mode);
    formData.append("confidence", confidence);

    if (mode === "normal") {
      formData.append("role", role);
      formData.append("topic", topic);
      if (resume) formData.append("resume", resume);
    }

    if (mode === "project") {
      formData.append("github_url", githubUrl);
    }

    setLoading(true);
    try {
      const res = await startInterview(formData);
      sessionStorage.setItem("current_question", res.data.question);
      navigate(`/interview/${res.data.session_id}`);
    } catch {
      setError("Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl h-[92vh] bg-white rounded-3xl shadow-xl px-10 py-8 flex flex-col justify-between">

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Start Interview</h2>

        {error && <p className="text-red-500">{error}</p>}

        {/* NAME */}
        <div>
          <label className="block text-sm font-medium">Name *</label>
          <input
            className="w-full mt-1 border rounded-lg px-4 py-2"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>

        {/* MODE */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setMode("normal")}
            className={`py-3 rounded-lg ${
              mode === "normal" ? "bg-black text-white" : "border"
            }`}
          >
            Normal Interview
          </button>

          <button
            onClick={() => setMode("project")}
            className={`py-3 rounded-lg ${
              mode === "project" ? "bg-black text-white" : "border"
            }`}
          >
            Project (GitHub) Interview
          </button>
        </div>

        {/* ================= NORMAL INTERVIEW ================= */}
        {mode === "normal" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-sm font-medium">Interview Type</label>
              <select
                className="w-full mt-1 border rounded-lg px-4 py-2"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option>Technical</option>
                <option>HR</option>
                <option>Behavioral</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Topic</label>
              <select
                className="w-full mt-1 border rounded-lg px-4 py-2"
                value={topic}
                onChange={e => setTopic(e.target.value)}
              >
                <option value="">Select topic</option>
                {Object.entries(topics).map(([group, items]) => (
                  <optgroup key={group} label={group}>
                    {items.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium">
                Confidence: {confidence}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={confidence}
                onChange={e => setConfidence(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium">
                Resume (PDF, optional)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={e => setResume(e.target.files[0])}
              />
            </div>
          </div>
        )}

        {/* ================= PROJECT INTERVIEW ================= */}
        {mode === "project" && (
          <div>
            <label className="block text-sm font-medium">
              GitHub Repository URL *
            </label>
            <input
              className="w-full mt-1 border rounded-lg px-4 py-2"
              placeholder="https://github.com/username/repo"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* START BUTTON */}
      <button
        onClick={handleStart}
        disabled={loading}
        className="w-full py-4 bg-black text-white rounded-xl text-lg disabled:opacity-60"
      >
        {loading ? "Starting..." : "Start Interview"}
      </button>
    </div>
  );
}
