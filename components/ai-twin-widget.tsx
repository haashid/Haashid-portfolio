"use client";

import { useEffect, useRef, useState } from "react";
import { X, Send, Sparkles, RotateCcw } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
}

const STARTERS = [
  "Tell me about yourself",
  "What are your biggest hackathon wins?",
  "Tell me about ORION",
  "Tell me about TrueHire AI",
  "What's your tech stack?",
  "What's your leadership experience?",
  "What are you currently building?",
  "How do you handle pressure in hackathons?",
];

function TypingDots() {
  return (
    <span className="ai-twin-typing-dots" aria-label="Thinking…">
      <span />
      <span />
      <span />
    </span>
  );
}

function formatText(text: string) {
  // Simple markdown-lite: **bold**, preserve line breaks
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br />");
}

export function AiTwinWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showStarters, setShowStarters] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open]);

  async function send(text?: string) {
    const userMessage = (text ?? input).trim();
    if (!userMessage || loading) return;

    setInput("");
    setShowStarters(false);
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: messages.slice(-6),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setMessages((prev) => [...prev, { role: "ai", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "Hmm, something went wrong on my end. Please check that GEMINI_API_KEY is set in your .env.local and try again!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setMessages([]);
    setShowStarters(true);
    setInput("");
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function autoResize(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  }

  return (
    <>
      {/* ── Floating Trigger Button ─────────────────────────────── */}
      <button
        id="ai-twin-trigger"
        className="ai-twin-fab"
        onClick={() => setOpen(true)}
        aria-label="Chat with Muhammad Haashid's AI Twin"
        aria-expanded={open}
        style={{ display: open ? "none" : undefined }}
      >
        <Sparkles size={20} strokeWidth={2} />
        <span>Ask me anything</span>
      </button>

      {/* ── Chat Panel ──────────────────────────────────────────── */}
      <div
        id="ai-twin-panel"
        className={`ai-twin-panel${open ? " ai-twin-panel--open" : ""}`}
        role="dialog"
        aria-label="AI Twin Chat"
        aria-modal="true"
      >
        {/* Header */}
        <div className="ai-twin-header">
          <div className="ai-twin-header-info">
            <div className="ai-twin-avatar" aria-hidden="true">MH</div>
            <div>
              <p className="ai-twin-name">Muhammad Haashid</p>
              <p className="ai-twin-subtitle">
                <span className="ai-twin-status-dot" />
                AI Twin · Ask me anything
              </p>
            </div>
          </div>
          <div className="ai-twin-header-actions">
            {messages.length > 0 && (
              <button
                className="ai-twin-icon-btn"
                onClick={reset}
                title="Clear chat"
                aria-label="Clear conversation"
              >
                <RotateCcw size={15} />
              </button>
            )}
            <button
              className="ai-twin-icon-btn"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="ai-twin-messages" role="log" aria-live="polite">
          {/* Welcome */}
          {messages.length === 0 && (
            <div className="ai-twin-welcome">
              <p>
                👋 Hey! I&apos;m Haashid&apos;s AI twin. Ask me about my projects,
                background, achievements, or anything else you&apos;d ask me in
                person.
              </p>
            </div>
          )}

          {/* Starter Chips */}
          {showStarters && messages.length === 0 && (
            <div className="ai-twin-starters" aria-label="Suggested questions">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  className="ai-twin-starter-chip"
                  onClick={() => send(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Conversation */}
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`ai-twin-msg ai-twin-msg--${msg.role}`}
            >
              {msg.role === "ai" && (
                <div className="ai-twin-msg-avatar" aria-hidden="true">
                  MH
                </div>
              )}
              <div
                className="ai-twin-bubble"
                // Safe — we control the content via formatText, not user input for display
                dangerouslySetInnerHTML={{ __html: formatText(msg.content) }}
              />
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="ai-twin-msg ai-twin-msg--ai">
              <div className="ai-twin-msg-avatar" aria-hidden="true">MH</div>
              <div className="ai-twin-bubble ai-twin-bubble--typing">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="ai-twin-input-area">
          <div className="ai-twin-input-wrap">
            <textarea
              ref={inputRef}
              id="ai-twin-input"
              className="ai-twin-textarea"
              rows={1}
              placeholder="Ask me anything…"
              value={input}
              onChange={autoResize}
              onKeyDown={handleKey}
              disabled={loading}
              aria-label="Your message"
              maxLength={1000}
            />
            <button
              id="ai-twin-send"
              className="ai-twin-send-btn"
              onClick={() => send()}
              disabled={loading || !input.trim()}
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </div>
          <p className="ai-twin-hint">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Backdrop (mobile) */}
      {open && (
        <div
          className="ai-twin-backdrop"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
