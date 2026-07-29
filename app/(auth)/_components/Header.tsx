"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { LogOut, MessageCircle, X, Send, Bot, Sparkles, RefreshCw } from "lucide-react";
import { askGeminiChatbot } from "@/lib/actions/ai/gemini/gemini-action";

interface Message {
  role: "user" | "model";
  text: string;
  timestamp: Date;
}

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Inline Chatbot states
  const [chatOpen, setChatOpen] = useState(false);
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
    if (chatOpen) {
      scrollToBottom();
    }
  }, [messages, chatOpen]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMessage = inputValue.trim();
    setInputValue("");

    const newUserMsg: Message = {
      role: "user",
      text: userMessage,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setLoading(true);

    try {
      const apiHistory = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

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

  const isAdmin = user?.role === "admin";

  const getLinkClass = (path: string) => {
    const isActive = pathname === path;
    return isActive
      ? "text-green-900 font-semibold cursor-pointer border-b-2 border-green-800 pb-1"
      : "cursor-pointer hover:text-green-900 pb-1 border-b-2 border-transparent hover:border-green-200 transition-all duration-200";
  };

  return (
    <>
      {/* Dynamic Slide-in Animations Styles */}
      <style jsx global>{`
        @keyframes chatSlideUp {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.96);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-chatSlideUp {
          animation: chatSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 99px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>

      <header className="bg-white/95 backdrop-blur-md border-b border-gray-150 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <Link href="/dashboard" className="font-extrabold text-2xl text-green-950 cursor-pointer tracking-tight hover:opacity-90 transition">
              Bin<span className="text-[#124B34]">Buddy</span>
            </Link>

            <nav className="flex gap-8 text-sm font-medium text-gray-500 items-center">
              <Link href="/dashboard" className={getLinkClass("/dashboard")}>
                Dashboard
              </Link>
              <Link href="/profile" className={getLinkClass("/profile")}>
                Profile
              </Link>
              {isAdmin && (
                <Link href="/admin" className={getLinkClass("/admin")}>
                  Admin Panel
                </Link>
              )}
              {!isAdmin && (
                <Link href="/dashboard/notifications" className={getLinkClass("/dashboard/notifications")}>
                  Notifications
                </Link>
              )}
              <Link href="/dashboard/campaigns" className={getLinkClass("/dashboard/campaigns")}>
                Campaigns
              </Link>
              <Link href="/about" className={getLinkClass("/about")}>
                About Us
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-sm text-gray-900">{user?.fullName || "Jessica"}</p>
              <p className="text-[10px] text-green-800 bg-green-50 border border-green-150 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider inline-block mt-0.5">
                {user?.role || "user"}
              </p>
            </div>

            <Link
              href="/profile"
              className="w-10 h-10 rounded-full bg-green-200 border-2 border-green-800 overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-85 shadow-sm transition"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-green-850 font-extrabold text-sm">
                  {(user?.fullName || "Jessica").charAt(0).toUpperCase()}
                </span>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-755 p-2 hover:bg-red-55/60 rounded-xl transition cursor-pointer"
              title="Logout"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Action Button with pulsing ring - Rendered outside sticky header */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-tr from-[#0B2717] to-[#124B34] hover:shadow-[0_8px_30px_rgb(18,75,52,0.4)] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
        title="Ask BinBuddy AI"
      >
        {chatOpen ? (
          <X size={22} className="transition-transform group-hover:rotate-90 duration-200" />
        ) : (
          <div className="relative">
            <MessageCircle size={22} />
            <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-yellow-500 rounded-full border-2 border-white animate-pulse"></span>
          </div>
        )}
      </button>

      {/* Chat Window Panel - Elevated UI with Glassmorphism - Rendered outside sticky header */}
      {chatOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] sm:w-[410px] h-[530px] bg-white/95 backdrop-blur-md rounded-3xl shadow-[0_20px_50px_rgba(11,39,23,0.22)] border border-gray-200 overflow-hidden flex flex-col animate-chatSlideUp">
          {/* Header */}
          <header className="bg-gradient-to-r from-[#0B2717] to-[#124B34] text-white px-5 py-4 flex justify-between items-center shrink-0 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20 shadow-inner">
                <Bot className="text-green-300" size={19} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm flex items-center gap-1.5">
                  BinBuddy AI Helper
                  <Sparkles size={12} className="text-yellow-400 fill-yellow-400 animate-bounce" />
                </h3>
                <p className="text-[10px] text-green-300/80 font-medium">Smart Sustainability Guide</p>
              </div>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white/70 hover:text-white p-1 hover:bg-white/10 rounded-lg transition cursor-pointer"
            >
              <X size={16} />
            </button>
          </header>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-5 bg-[#F3F0DE]/20 space-y-4 custom-scrollbar">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 max-w-[85%] ${
                  msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {msg.role === "model" && (
                  <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-150 flex items-center justify-center shrink-0 text-[#124B34] shadow-sm mt-0.5">
                    <Bot size={14} />
                  </div>
                )}
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.role === "user"
                      ? "bg-gradient-to-br from-[#124B34] to-[#0B2717] text-white rounded-tr-none"
                      : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line font-medium">{msg.text}</p>
                  <span
                    className={`block text-[8px] mt-1.5 text-right font-semibold ${
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
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-8 h-8 rounded-lg bg-green-50 border border-green-150 flex items-center justify-center shrink-0 text-[#124B34] shadow-sm mt-0.5">
                  <Bot size={14} />
                </div>
                <div className="bg-white border border-gray-200 p-3.5 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <div className="flex gap-1 items-center px-1.5 py-1">
                    <span className="w-1.5 h-1.5 bg-[#124B34] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#124B34] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-[#124B34] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input Footer */}
          <form onSubmit={handleSendChat} className="p-3.5 border-t border-gray-200 bg-gray-50/80 flex gap-2.5 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about sorting plastic, cardboard, e-waste..."
              className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-1.5 focus:ring-green-800/40 text-xs text-gray-900 shadow-inner placeholder:text-gray-400 font-medium"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="w-10 h-10 bg-gradient-to-tr from-[#0B2717] to-[#124B34] hover:opacity-95 text-white rounded-xl flex items-center justify-center transition disabled:opacity-40 cursor-pointer shadow-md shrink-0"
            >
              <Send size={13} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
