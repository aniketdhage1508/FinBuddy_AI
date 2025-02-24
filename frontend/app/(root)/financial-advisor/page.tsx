"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Send, Loader2 } from "lucide-react";
import remarkGfm from "remark-gfm";

type Message = {
  role: "user" | "bot";
  text: string;
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput("");

    try {
      const response = await axios.post("http://localhost:8000/chat", { question: input });
      const botMessage: Message = { role: "bot", text: response.data.response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "bot", text: "⚠ Error: Unable to get a response" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 shadow-md text-black">
      {/* Header */}
      <header className="p-4 bg-gray-100 text-center text-xl font-bold shadow-md text-black">💬 FinBot - AI Financial Assistant</header>

      {/* Chat Container */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`w-auto max-w-[45%] p-3 rounded-lg ${
                msg.role === "user" ? "bg-blue-500 text-white self-end" : "bg-blue-500 text-gray-200 self-start"
              }`}
            >
              {/* Renders Markdown for bot responses */}
              {msg.role === "bot" ? (
                <div className="prose prose-invert">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                </div>
                ) : (
                msg.text
                )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-blue-400 text-black-1000 p-3 rounded-xl animate-pulse">Typing...</div>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-gray-100 flex items-center">
        <input
          type="text"
          className="flex-1 p-3 rounded-lg text-black border-2 focus:ring-2 focus:ring-blue-500 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask a financial question..."
        />
        <button onClick={sendMessage} className="ml-3 p-3 bg-blue-500 rounded-lg text-white">
          {loading ? <Loader2 className="animate-spin" /> : <Send />}
        </button>
      </div>
    </div>
  );
};

export default Chatbot;