import { MessageSquare, Star } from "lucide-react";

export default function FloatingButtons({ onSupportClick, onFeedbackClick }) {
  return (
    <div className="fixed bottom-20 right-6 flex flex-col space-y-3">
      {/* Support Ticket Button */}
      <button
        onClick={onSupportClick}
        className="p-4 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition"
      >
        <MessageSquare size={24} />
      </button>

      {/* Feedback Button */}
      <button
        onClick={onFeedbackClick}
        className="p-4 rounded-full bg-green-600 text-white shadow-lg hover:bg-green-700 transition"
      >
        <Star size={24} />
      </button>
    </div>
  );
}