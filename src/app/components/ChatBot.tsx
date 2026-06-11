/*
 * CONNECTIONS NEEDED:
 * - AI Chatbot: import { askEcoBot } from '../lib/gemini'
 * - Connect to OpenRouter API - model: google/gemini-flash-1.5
 */
import { useState } from "react";
import { X, Send } from "lucide-react";

interface Message {
  id: number;
  from: "user" | "bot";
  text: string;
}

const initialMessages: Message[] = [
  { id: 1, from: "user", text: "How does the fungus eat plastic?" },
  {
    id: 2,
    from: "bot",
    text: "Great question! Oyster mushrooms produce special enzymes called laccases that break down plastic polymers into smaller molecules the fungus can absorb. 🌿 Register to get your full personalized guide!",
  },
];

const suggestions = ["Tell me more", "Which plastics?", "Is it safe?"];

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now(), from: "user", text };
    // TODO: connect askEcoBot(text) from ../lib/gemini
    const botMsg: Message = {
      id: Date.now() + 1,
      from: "bot",
      text: "Thanks for your question! Our EcoBot is learning more every day. 🌿 Connect to the Gemini API to get live answers.",
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        style={{ backgroundColor: "#2D6A4F" }}
        aria-label="Open GreenBot"
      >
        <span className="text-xl">🌿</span>
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ height: "400px", backgroundColor: "white", border: "1px solid #E5E7EB" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: "#2D6A4F" }}>
            <span style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, color: "white" }}>GreenBot 🌿</span>
            <button onClick={() => setOpen(false)} className="text-white opacity-80 hover:opacity-100">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className="px-3 py-2 rounded-2xl text-sm max-w-[80%]"
                  style={{
                    fontFamily: "Nunito, sans-serif",
                    backgroundColor: msg.from === "user" ? "#52B788" : "#F3F4F6",
                    color: msg.from === "user" ? "white" : "#374151",
                    borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Suggestion chips */}
          <div className="px-3 pb-2 flex gap-1 flex-wrap">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="px-2 py-1 rounded-full text-xs transition-opacity hover:opacity-70"
                style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div
            className="flex items-center gap-2 px-3 py-2"
            style={{ borderTop: "1px solid #E5E7EB" }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Ask EcoBot..."
              className="flex-1 text-sm px-3 py-2 rounded-xl outline-none"
              style={{ backgroundColor: "#F3F4F6", fontFamily: "Nunito, sans-serif" }}
            />
            <button
              onClick={() => sendMessage(input)}
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "#2D6A4F" }}
            >
              <Send size={14} color="white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
