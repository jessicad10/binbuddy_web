"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Bot, RefreshCw, Sparkles, X, MessageSquare } from "lucide-react";
import { askGeminiChatbot } from "@/lib/actions/ai/gemini/gemini-action";

interface Message {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export default function GeminiChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      text: "Hello! I am BinBuddy's AI Assistant. Ask me any waste sorting, recycling center, pickup request, or environmental question!",
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    
    // Add user message to state
    const newUserMsg: Message = {
      role: "user",
      text: userMessage,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setLoading(true);

    try {
      // Map message history to Gemini API structure (role: user/model)
      const apiHistory = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      // Trigger the Next.js Server Action
      const result = await askGeminiChatbot(userMessage, apiHistory);
      
      const botMsg: Message = {
        role: "model",
        text: result.response || "I didn't quite catch that. Could you try rephrasing?",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        role: "model",
        text: "Sorry, I am having trouble connecting right now. Please try again.",
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F0DE] py-12 px-4 sm:px-6 lg:px-8 font-sans flex flex-col justify-between">
      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col">
        {/* Breadcrumb */}
        <div className="mb-6 shrink-0">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-green-900 hover:text-green-700 font-semibold transition text-sm"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
        </div>

        {/* Hero Banner */}
        <header className="bg-[#124B34] text-white rounded-t-3xl p-6 md:p-8 shrink-0 relative overflow-hidden shadow-md">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1 bg-white/10 text-green-300 text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider font-semibold mb-3 border border-white/15">
              <Sparkles size={11} className="text-yellow-450 fill-yellow-450 animate-pulse" />
              Teacher Demo AI Chatbot
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight">BinBuddy AI Waste Assistant</h1>
            <p className="mt-1.5 text-green-100 text-xs max-w-xl">
              Ask me about waste sorting codes, recycling locations in Kathmandu Valley, composting tips, or how to schedule doorstep trash pickups!
            </p>
          </div>
        </header>

        {/* Chat Interface Card */}
        <div className="bg-white rounded-b-3xl border border-gray-150 shadow-sm flex-grow flex flex-col h-[500px] overflow-hidden">
          {/* Messages Feed */}
          <div className="flex-grow overflow-y-auto p-6 bg-[#F3F0DE]/10 space-y-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3.5 max-w-[80%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {msg.role === "model" && (
                  <div className="w-8 h-8 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center shrink-0 text-green-800 shadow-sm">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-[#124B34] text-white rounded-tr-none shadow-sm"
                      : "bg-white text-gray-800 border border-gray-150 rounded-tl-none shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[8px] mt-1.5 text-right ${
                      msg.role === "user" ? "text-green-200" : "text-gray-400"
                    }`}
                  >
                    {msg.timestamp.toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3.5 max-w-[80%] mr-auto">
                <div className="w-8 h-8 rounded-xl bg-green-50 border border-green-200 flex items-center justify-center shrink-0 text-green-800 shadow-sm">
                  <Bot size={16} />
                </div>
                <div className="bg-white border border-gray-150 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <RefreshCw className="animate-spin text-green-950 w-4.5 h-4.5" />
                  <span className="text-[10px] text-gray-500 font-semibold">AI is searching database...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-150 bg-gray-50 flex gap-3 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask me: how do I compost? Or: is cardboard recyclable?"
              className="flex-grow px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-800 text-xs text-gray-900 shadow-inner placeholder:text-gray-400 font-medium"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="w-12 h-12 bg-[#124B34] hover:bg-[#0c3323] text-white rounded-xl flex items-center justify-center transition disabled:opacity-40 cursor-pointer shadow-md shrink-0"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>

      <footer className="text-center text-xs text-gray-500 mt-12 shrink-0">
        © 2026 BinBuddy. A college project.
      </footer>
    </main>
  );
}
