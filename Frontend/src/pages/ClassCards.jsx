// src/pages/ClassCards.jsx
import { useNavigate } from "react-router-dom";

export default function ClassCards() {
  const navigate = useNavigate();

  const classes = [
    { id: 1, name: "2025 A/L", price: 5000 },
    { id: 2, name: "2026 A/L", price: 5000 },
    { id: 3, name: "2027 A/L", price: 5000 },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-100 to-blue-200">
      <h1 className="text-3xl font-bold text-blue-800 mb-10">ITGuru Classes</h1>
      <div className="flex gap-8">
        {classes.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl shadow-lg p-6 text-center w-60"
          >
            <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold">
              {c.name}
            </div>
            <p className="mt-4 text-xl text-blue-700 font-semibold">{c.price}</p>
            <p className="text-gray-500 mb-4">LKR.{c.price}</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg w-full mb-2">
              Pay Here
            </button>
            <button
              onClick={() => navigate(`/class/${c.name}`)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg w-full"
            >
              View Class
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
