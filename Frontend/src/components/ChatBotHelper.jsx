// src/components/ChatBotHelper.jsx
import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

export default function ChatBotHelper() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! 👋 How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  function toggleChat() {
    setOpen((prev) => !prev);
  }

  function sendMessage(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");

    // Fake AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "I received your message ✅" },
      ]);
    }, 600);
  }

  return (
    <div>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 
                     text-white p-4 rounded-full shadow-lg transition"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 w-80 bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2">
            <h2 className="font-semibold">AI Assistant</h2>
            <button onClick={toggleChat}>
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.from === "user"
                    ? "bg-blue-100 self-end ml-auto"
                    : "bg-gray-200 self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="flex items-center border-t px-2 py-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
            <button
              type="submit"
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
