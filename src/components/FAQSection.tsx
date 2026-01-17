"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

const defaultFAQs: FAQItem[] = [
  {
    question: "How do I book an activity?",
    answer:
      "Select an activity, choose your preferred date and number of guests, then follow the checkout flow to complete your booking.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Most activities allow free cancellation up to 24 hours before the start time. Specific policies are listed on each activity's page.",
  },
  {
    question: "Are activities suitable for children or seniors?",
    answer:
      "Activity suitability varies. Each listing includes an accessibility/suitability note — contact us if you need specific guidance.",
  },
  {
    question: "How do I request a custom itinerary or group booking?",
    answer:
      "For group bookings or custom itineraries, contact our support team with your dates and requirements and we'll assist with a tailored plan.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept major credit cards and popular digital wallets. Payment options appear during checkout and may vary by provider.",
  },
];

type Message = {
  id: string;
  role: "user" | "assistant";
  text?: string;
  kind?: "text" | "typing";
};

function uid() {
  // safe-ish unique id
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function FAQSection({ items }: { items?: FAQItem[] }) {
  const faqItems = items ?? defaultFAQs;

  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: uid(),
      role: "assistant",
      kind: "text",
      text: "Hey 👋 Ask me anything about bookings, cancellations, payments, or group trips.",
    },
    {
      id: uid(),
      role: "assistant",
      kind: "text",
      text: "Pick a question below and I’ll answer like a normal human (promise).",
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const askedQuestions = useMemo(() => {
    const asked = new Set<string>();
    for (const m of messages) {
      if (m.role === "user" && m.text) asked.add(m.text);
    }
    return asked;
  }, [messages]);

  useEffect(() => {
    if (containerRef.current) {
      try {
        containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
      } catch {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }
    } else {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [messages]);

  const clearChat = () => {
    setIsTyping(false);
    setMessages([
      {
        id: uid(),
        role: "assistant",
        kind: "text",
        text: "Reset ✅ Ask another one — I’m here.",
      },
    ]);
  };

  const ask = (item: FAQItem) => {
    if (isTyping) return;

    setIsTyping(true);

    const typingId = uid();

    setMessages((prev) => [
      ...prev,
      { id: uid(), role: "user", kind: "text", text: item.question },
      { id: typingId, role: "assistant", kind: "typing" },
    ]);

    // “typing…” delay (feels conversational)
    window.setTimeout(() => {
      setMessages((prev) => {
        // remove typing bubble, then append answer
        const withoutTyping = prev.filter((m) => m.id !== typingId);
        return [
          ...withoutTyping,
          { id: uid(), role: "assistant", kind: "text", text: item.answer },
        ];
      });
      setIsTyping(false);
    }, 650);
  };

  return (
    <section id="faq" className="bg-gradient-to-b from-[var(--surface-1)] to-[var(--bg)] py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-[var(--text-1)] mb-4 tracking-tight">
            FAQ, but like a conversation
          </h2>
          <p className="text-lg sm:text-xl text-[var(--text-2)] max-w-2xl mx-auto">
            Tap a question → it drops into chat → you get an instant answer.
          </p>
        </div>

        {/* Chat card */}
        <div className="rounded-[32px] bg-[var(--surface-1)] shadow-2xl ring-2 ring-[var(--border)] overflow-hidden animate-fade-in">
          {/* Top bar */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 px-4 sm:px-5 py-3 sm:py-4 border-b border-[var(--border)] bg-[var(--surface-1)]">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-600)] text-white flex items-center justify-center font-extrabold text-sm sm:text-base shadow-lg">
                ?
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-[var(--text-1)] leading-tight text-sm sm:text-base">Support</p>
                <p className="text-[10px] sm:text-xs text-[var(--text-3)] leading-tight">
                  Usually replies instantly
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={clearChat}
              className="rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text-1)] ring-1 ring-[var(--border)] smooth-hover">
              Clear
            </button>
          </div>

          {/* Messages */}
          <div ref={containerRef} className="px-3 sm:px-5 py-4 sm:py-5 max-h-[400px] sm:max-h-[480px] md:max-h-[520px] overflow-y-auto bg-gradient-to-b from-[var(--surface-1)] to-[var(--bg)]">
            <div className="space-y-3 sm:space-y-4">
              {messages.map((m) => {
                const isUser = m.role === "user";

                return (
                  <div
                    key={m.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                  >
                    <div
                      className={[
                        "max-w-[90%] sm:max-w-[85%] md:max-w-[72%] rounded-3xl px-3 sm:px-4 py-2 sm:py-3 shadow-sm ring-1",
                        isUser
                          ? "bg-[var(--primary)] text-white ring-[var(--border)] rounded-br-lg"
                          : "bg-[var(--surface-2)] text-[var(--text-1)] ring-[var(--border)] rounded-bl-lg",
                      ].join(" ")}
                    >
                      {m.kind === "typing" ? (
                        <div className="flex items-center gap-1 py-1">
                          <span className="h-2 w-2 rounded-full bg-[var(--text-3)] animate-pulse" />
                          <span className="h-2 w-2 rounded-full bg-[var(--text-3)] animate-pulse [animation-delay:120ms]" />
                          <span className="h-2 w-2 rounded-full bg-[var(--text-3)] animate-pulse [animation-delay:240ms]" />
                        </div>
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-line">
                          {m.text}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          </div>

          {/* Quick questions */}
          <div className="border-t border-[var(--border)] bg-[var(--surface-1)] px-3 sm:px-5 py-3 sm:py-4">
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <p className="text-xs sm:text-sm font-bold text-[var(--text-1)]">Quick questions</p>
              <p className="text-[10px] sm:text-xs text-[var(--text-3)]">
                {isTyping ? "Answering…" : "Tap to ask"}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {faqItems.map((item, idx) => {
                const disabled = isTyping; // keep it simple
                const alreadyAsked = askedQuestions.has(item.question);

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => ask(item)}
                    disabled={disabled}
                    className={[
                      "rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all smooth-hover",
                      "ring-1 ring-[var(--border)]",
                      disabled
                        ? "bg-[var(--surface-2)] text-[var(--text-3)] cursor-not-allowed"
                        : alreadyAsked
                        ? "bg-[var(--surface-2)] text-[var(--text-3)] hover:bg-[var(--border)]"
                        : "bg-[var(--surface-2)] text-[var(--text-1)] hover:bg-[var(--surface-1)] hover:-translate-y-[1px] hover:shadow-md hover:ring-[var(--primary)]",
                    ].join(" ")}
                    aria-label={`Ask: ${item.question}`}
                    title={item.question}
                  >
                    {item.question}
                  </button>
                );
              })}
            </div>

            <p className="mt-3 text-xs text-[var(--text-3)]">
              Tip: You can keep asking multiple questions — it remembers the thread.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
