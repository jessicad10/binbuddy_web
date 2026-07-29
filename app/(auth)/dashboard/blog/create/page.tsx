"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import Header from "@/app/(auth)/_components/Header";
import Footer from "@/app/(auth)/_components/Footer";
import { ArrowLeft, BookOpen, PenTool, Image as ImageIcon, Clock, User, Award, Send, RefreshCw, ShieldAlert } from "lucide-react";

export default function CreateBlogPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Composting");
  const [summary, setSummary] = useState("");
  const [contentParagraphs, setContentParagraphs] = useState([""]);
  const [imageUrl, setImageUrl] = useState("");
  const [readTime, setReadTime] = useState("5 min read");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("Sustainability Advocate");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      setAuthorName(user.fullName || "Jessica");
    }
  }, [user]);

  // Predefined beautiful unsplash image suggestions
  const imagePresets = [
    { label: "🌿 Green Leaves", url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800" },
    { label: "🍎 Compost / Soil", url: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800" },
    { label: "♻️ Waste Sorting", url: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800" },
    { label: "💡 Eco Energy", url: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800" },
    { label: "🌍 Earth Protection", url: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=800" }
  ];

  const handleAddParagraph = () => {
    setContentParagraphs([...contentParagraphs, ""]);
  };

  const handleParagraphChange = (index: number, val: string) => {
    const updated = [...contentParagraphs];
    updated[index] = val;
    setContentParagraphs(updated);
  };

  const handleRemoveParagraph = (index: number) => {
    if (contentParagraphs.length === 1) return;
    const updated = contentParagraphs.filter((_, i) => i !== index);
    setContentParagraphs(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("Title is required");
      return;
    }
    if (!summary.trim()) {
      setErrorMsg("Summary is required");
      return;
    }
    const cleanParagraphs = contentParagraphs.filter(p => p.trim() !== "");
    if (cleanParagraphs.length === 0) {
      setErrorMsg("Please write at least one paragraph of content");
      return;
    }

    setIsSubmitting(true);

    try {
      const selectedImg = imageUrl || imagePresets[0].url;

      const newPost = {
        id: `blog-local-${Date.now()}`,
        title,
        category,
        summary,
        content: cleanParagraphs,
        imageUrl: selectedImg,
        readTime,
        date: new Date().toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        author: authorName || "Jessica",
        authorRole,
        likes: 0
      };

      // Fetch existing local blogs
      const stored = localStorage.getItem("binbuddy_blogs");
      const currentBlogs = stored ? JSON.parse(stored) : [];
      
      // Save new blog at the beginning
      localStorage.setItem("binbuddy_blogs", JSON.stringify([newPost, ...currentBlogs]));
      
      // Redirect
      router.push("/dashboard/blog");
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to publish blog");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F0DE] flex flex-col items-center justify-center">
        <RefreshCw className="animate-spin text-green-900 w-12 h-12" />
        <p className="mt-4 text-green-900 font-semibold">Verifying credentials...</p>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-[#F3F0DE] flex flex-col">
        <Header />
        <div className="flex-grow max-w-xl mx-auto flex flex-col items-center justify-center p-8 text-center">
          <ShieldAlert size={48} className="text-red-700 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-red-950">Unauthorized Access</h2>
          <p className="text-sm text-gray-600 mt-2">
            Only administrators are authorized to publish new blogs on the BinBuddy platform.
          </p>
          <Link href="/dashboard" className="mt-6 bg-[#124B34] text-white font-bold py-2.5 px-6 rounded-xl text-sm hover:opacity-90">
            Back to Dashboard
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F0DE] flex flex-col font-sans">
      <Header />
      
      <div className="flex-grow max-w-3xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-green-900 hover:text-green-700 font-semibold transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>

        {/* Title */}
        <header className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold mb-4 border border-green-200">
            <PenTool size={14} />
            Authoring Tool
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-950 tracking-tight">
            Publish New Blog Post
          </h1>
          <p className="text-sm text-gray-700 mt-2">
            Share environmental insights, composting guides, or sustainability updates with the BinBuddy community.
          </p>
        </header>

        {/* Error Callout */}
        {errorMsg && (
          <div className="bg-red-50 text-red-850 p-4 rounded-2xl text-xs mb-8 border border-red-100 font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 border border-gray-150 shadow-sm space-y-6">
          {/* Title input */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Blog Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 5 Habits to Drastically Reduce Food Waste at Home"
              className="w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition bg-white"
            />
          </div>

          {/* Category & Read Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition bg-white"
              >
                <option value="Composting">Composting</option>
                <option value="Waste Sorting">Waste Sorting</option>
                <option value="Eco Living">Eco Living</option>
                <option value="Earth Conservation">Earth Conservation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Estimated Read Time
              </label>
              <input
                type="text"
                required
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 4 min read"
                className="w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition bg-white"
              />
            </div>
          </div>

          {/* Summary Input */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Brief Summary
            </label>
            <textarea
              required
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Write a catchy 1-2 sentence hook explaining what readers will learn..."
              className="w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition resize-none bg-white"
            />
          </div>

          {/* Preset Images Selector */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Featured Image
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-3">
              {imagePresets.map((preset) => (
                <button
                  type="button"
                  key={preset.url}
                  onClick={() => setImageUrl(preset.url)}
                  className={`border-2 rounded-xl p-1.5 transition text-left cursor-pointer overflow-hidden ${
                    imageUrl === preset.url ? "border-green-800 bg-green-50/40" : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="h-14 w-full object-cover rounded-lg mb-1" />
                  <span className="text-[9px] font-bold text-gray-600 block text-center truncate">{preset.label}</span>
                </button>
              ))}
            </div>

            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste custom image URL..."
              className="w-full rounded-xl border border-gray-300 py-3 px-4 text-xs text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition bg-white"
            />
          </div>

          {/* Author Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-150">
            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Author Name
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Author name"
                className="w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Author Role / Title
              </label>
              <input
                type="text"
                required
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="e.g. Lead Environmental Planner"
                className="w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition bg-white"
              />
            </div>
          </div>

          {/* Content Paragraphs */}
          <div className="pt-4 border-t border-gray-150 space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-black">
                Article Body Content
              </label>
              <button
                type="button"
                onClick={handleAddParagraph}
                className="text-xs bg-green-50 hover:bg-green-100 text-green-900 border border-green-200 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                + Add Paragraph
              </button>
            </div>

            {contentParagraphs.map((para, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute top-3 left-4 text-xs font-bold text-gray-400 bg-gray-50 border px-2 py-0.5 rounded-md">
                  P{idx + 1}
                </span>
                
                <textarea
                  required
                  rows={4}
                  value={para}
                  onChange={(e) => handleParagraphChange(idx, e.target.value)}
                  placeholder={`Write paragraph ${idx + 1}...`}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-14 pr-12 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition bg-white"
                />

                {contentParagraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveParagraph(idx)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-650 transition cursor-pointer"
                    title="Remove Paragraph"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Submit Action */}
          <div className="pt-6 border-t border-gray-150 flex gap-4">
            <Link
              href="/dashboard/blog"
              className="w-1/2 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl text-sm transition cursor-pointer"
            >
              Discard Draft
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-1/2 flex items-center justify-center gap-2 bg-[#124B34] hover:bg-green-950 text-white font-bold py-3.5 rounded-xl text-sm transition disabled:opacity-50 cursor-pointer shadow-md"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  Publishing...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Publish Blog
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </main>
  );
}
