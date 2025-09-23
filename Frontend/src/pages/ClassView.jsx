// src/pages/StudentDashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaFilePdf, FaFileWord, FaFilePowerpoint, FaFileAlt } from "react-icons/fa";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export default function StudentDashboard() {
  const [batch, setBatch] = useState("2025 A/L");
  const [videos, setVideos] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const studentId = "student123"; // replace with logged-in student id

  // Detect material type and return icon
  const getMaterialIcon = (filename) => {
    if (!filename) return <FaFileAlt className="text-blue-500 text-4xl" />;
    const ext = filename.split(".").pop().toLowerCase();
    if (ext === "pdf") return <FaFilePdf className="text-red-500 text-4xl" />;
    if (["doc", "docx"].includes(ext))
      return <FaFileWord className="text-blue-600 text-4xl" />;
    if (["ppt", "pptx"].includes(ext))
      return <FaFilePowerpoint className="text-orange-500 text-4xl" />;
    return <FaFileAlt className="text-blue-500 text-4xl" />;
  };

  // Fetch Videos
  useEffect(() => {
    axios
      .get(`${API}/api/videos`, { params: { batch, published: "true" } })
      .then((res) => setVideos(res.data.data))
      .catch(() => toast.error("Failed to load videos"));
  }, [batch]);

  // Fetch Materials
  useEffect(() => {
    axios
      .get(`${API}/api/materials`)
      .then((res) => {
        const items = (res.data.data || []).filter((m) => m.batch === batch);
        setMaterials(items);
      })
      .catch(() => toast.error("Failed to load materials"));
  }, [batch]);

  // Fetch Quizzes
  useEffect(() => {
    axios
      .get(`${API}/api/quizzes`)
      .then((res) => {
        const items = (res.data.data || []).filter(
          (q) => q.batch === batch && q.published
        );
        setQuizzes(items);
      })
      .catch(() => toast.error("Failed to load quizzes"));
  }, [batch]);

  // Load Quiz
  const startQuiz = async (quizId) => {
    try {
      const res = await axios.get(`${API}/api/quizzes/${quizId}/take`, {
        params: { studentId },
      });
      setSelectedQuiz(res.data.data);
      setAnswers({});
      setScore(null);
    } catch {
      toast.error("Cannot start quiz");
    }
  };

  const handleAnswer = (qIdx, optIdx) => {
    setAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const submitQuiz = async () => {
    try {
      const res = await axios.post(
        `${API}/api/quizzes/${selectedQuiz._id}/submit`,
        {
          studentId,
          answers: Object.entries(answers).map(([idx, chosenIndex]) => ({
            idx: Number(idx),
            chosenIndex,
          })),
        }
      );
      const { score, maxScore } = res.data.data;
      setScore({ score, maxScore });
      toast.success(`Score: ${score}/${maxScore}`);
      setSelectedQuiz(null);
    } catch {
      toast.error("Failed to submit quiz");
    }
  };

  // Extract YouTube video ID for preview (if YouTube URL)
  const getYouTubeId = (url) => {
    try {
      const match = url.match(
        /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
      );
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Batch Selector */}
      <div className="mb-6">
        <label className="font-semibold mr-2 text-gray-700">Select Batch:</label>
        <select
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          className="border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
        >
          <option>2025 A/L</option>
          <option>2026 A/L</option>
          <option>2027 A/L</option>
        </select>
      </div>

      {/* Videos */}
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Videos</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {videos.map((v) => {
          const videoId = getYouTubeId(v.url);
          return (
            <div
              key={v._id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
            >
              {/* Preview */}
              {videoId ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={v.title}
                  className="w-full h-48"
                  allowFullScreen
                />
              ) : (
                <div className="bg-gray-200 h-48 flex items-center justify-center text-gray-500">
                  No Preview
                </div>
              )}
              <div className="p-4">
                <p className="font-semibold text-lg text-gray-800">{v.title}</p>
                <a
                  href={v.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block mt-3 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
                >
                  Watch Video
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Materials */}
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Materials</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {materials.map((m) => (
          <div
            key={m._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex items-center gap-4"
          >
            {getMaterialIcon(m.link)}
            <div>
              <p className="font-semibold text-lg text-gray-800">{m.title}</p>
              <a
                href={m.link}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline text-sm"
              >
                Open Material
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Quizzes */}
      <h2 className="text-2xl font-bold mb-4 text-blue-700">Quizzes</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizzes.map((q) => (
          <div
            key={q._id}
            className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
          >
            <p className="font-semibold text-lg text-gray-800">{q.title}</p>
            <button
              onClick={() => startQuiz(q._id)}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full"
            >
              Attempt Quiz
            </button>
          </div>
        ))}
      </div>

      {/* Quiz Attempt */}
      {selectedQuiz && (
        <div className="mt-8 p-6 bg-white rounded-xl shadow-lg">
          <h3 className="font-bold text-xl text-blue-700 mb-4">
            {selectedQuiz.title}
          </h3>
          {selectedQuiz.questions.map((q, idx) => (
            <div key={idx} className="mb-6">
              <p className="font-medium text-gray-800 mb-2">{q.text}</p>
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => (
                  <label
                    key={optIdx}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name={`q${idx}`}
                      onChange={() => handleAnswer(q.idx, optIdx)}
                      checked={answers[q.idx] === optIdx}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{opt.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <button
            onClick={submitQuiz}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Submit Quiz
          </button>
        </div>
      )}

      {/* Score Display */}
      {score && (
        <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-xl text-center">
          <h3 className="text-xl font-bold text-blue-700">
            🎉 Your Score: {score.score}/{score.maxScore}
          </h3>
        </div>
      )}
    </div>
  );
}
