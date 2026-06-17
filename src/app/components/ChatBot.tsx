import { useState, useRef, useEffect } from "react";
import { X, Send } from "lucide-react";
import { askGreenBot } from "../../lib/greenbot";

interface Message {
  id: number;
  from: "user" | "bot";
  text: string;
}

const initialMessages: Message[] = [
  { id: 1, from: "user", text: "¿Cómo el hongo come plástico?" },
  {
    id: 2,
    from: "bot",
    text: "¡Buena pregunta! Los hongos ostra producen enzimas llamadas lacasas que rompen los polímeros del plástico en moléculas más pequeñas que el micelio puede absorber. 🌿 ¡Regístrate para obtener tu guía personalizada completa!",
  },
];

const suggestions = ["¿Qué plásticos funcionan?", "¿Es seguro comer?", "¿Cómo empiezo?"];

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "instant" }), 50);
  }, [open]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now(), from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const reply = await askGreenBot(text);
      setMessages((prev) => [...prev, { id: Date.now(), from: "bot", text: reply }]);
    } catch {
      setMessages((prev) => [...prev, {
        id: Date.now(),
        from: "bot",
        text: "Lo siento, tuve un problema al responder. Intenta de nuevo. 🌿",
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105"
        style={{ backgroundColor: "#2D6A4F" }}
        aria-label="Abrir GreenBot"
      >
        <span className="text-xl">🌿</span>
      </button>

      {/* Chat window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ height: "420px", backgroundColor: "white", border: "1px solid #E5E7EB" }}
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
              <div
                key={msg.id}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                style={{ animation: "msgIn 0.18s ease-out both" }}
              >
                <div
                  className="px-3 py-2 rounded-2xl text-sm max-w-[80%]"
                  style={{
                    fontFamily: "Nunito, sans-serif",
                    backgroundColor: msg.from === "user" ? "#52B788" : "#F3F4F6",
                    color: msg.from === "user" ? "white" : "#374151",
                    borderRadius: msg.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    lineHeight: 1.5,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start" style={{ animation: "msgIn 0.18s ease-out both" }}>
                <div className="px-3 py-2.5" style={{ backgroundColor: "#F3F4F6", borderRadius: "16px 16px 16px 4px" }}>
                  <span className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "#52B788", animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "#52B788", animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "#52B788", animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Suggestion chips */}
          <div className="px-3 pb-2 flex gap-1 flex-wrap">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                disabled={loading}
                className="px-2 py-1 rounded-full text-xs transition-opacity hover:opacity-70"
                style={{ backgroundColor: "#D8F3DC", color: "#2D6A4F", fontFamily: "Nunito, sans-serif", fontWeight: 600, opacity: loading ? 0.5 : 1 }}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 px-3 py-2" style={{ borderTop: "1px solid #E5E7EB" }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
              placeholder="Pregunta a GreenBot..."
              disabled={loading}
              className="flex-1 text-sm px-3 py-2 rounded-xl outline-none"
              style={{ backgroundColor: "#F3F4F6", fontFamily: "Nunito, sans-serif" }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-opacity"
              style={{ backgroundColor: "#2D6A4F", opacity: loading ? 0.5 : 1 }}
            >
              <Send size={14} color="white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
