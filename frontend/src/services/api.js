import axios from "axios";

const API = "http://127.0.0.1:5000/api";

export const fetchTopics = () =>
  axios.get(`${API}/topics`);

export const startInterview = (formData) =>
  axios.post(`${API}/interview/start`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const submitAnswer = (payload) =>
  axios.post(`${API}/interview/answer`, payload);

export const downloadReportPdf = (sessionId) =>
  axios.get(`${API}/interview/report/pdf/${sessionId}`, {
    responseType: "blob",
  });
