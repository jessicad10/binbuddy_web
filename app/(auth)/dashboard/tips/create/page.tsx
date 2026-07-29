"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import Header from "@/app/(auth)/_components/Header";
import Footer from "@/app/(auth)/_components/Footer";
import { ArrowLeft, Lightbulb, CheckSquare, Sparkles, Send, RefreshCw, ShieldAlert } from "lucide-react";

export default function CreateTipPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Sort Smart");
  const [description, setDescription] = useState("");
  const [whyItMatters, setWhyItMatters] = useState("");
  const [steps, setSteps] = useState([""]);
  const [icon, setIcon] = useState("💡");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const presetIcons = ["💡", "♻️", "🍌", "🥤", "🔋", "🍎", "👕", "🔌", "🧴", "📦"];

  const handleAddStep = () => {
    setSteps([...steps, ""]);
  };

  const handleStepChange = (index: number, val: string) => {
    const updated = [...steps];
    updated[index] = val;
    setSteps(updated);
  };

  const handleRemoveStep = (index: number) => {
    if (steps.length === 1) return;
    const updated = steps.filter((_, i) => i !== index);
    setSteps(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!title.trim()) {
      setErrorMsg("Title is required");
      return;
    }
    if (!description.trim()) {
      setErrorMsg("Description is required");
      return;
    }
    if (!whyItMatters.trim()) {
      setErrorMsg("Explanation for 'Why it matters' is required");
      return;
    }
    const cleanSteps = steps.filter(s => s.trim() !== "");
    if (cleanSteps.length === 0) {
      setErrorMsg("Please add at least one actionable step");
      return;
    }

    setIsSubmitting(true);

    try {
      const newTip = {
        id: `tip-local-${Date.now()}`,
        title,
        category,
        description,
        whyItMatters,
        steps: cleanSteps,
        icon
      };

      // Fetch existing local tips
      const stored = localStorage.getItem("binbuddy_tips");
      const currentTips = stored ? JSON.parse(stored) : [];

      // Save new tip at the beginning
      localStorage.setItem("binbuddy_tips", JSON.stringify([newTip, ...currentTips]));

      // Redirect
      router.push("/dashboard/tips");
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to publish tip");
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
            Only administrators are authorized to publish new tips on the BinBuddy platform.
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
            <Lightbulb size={14} />
            Tip Creator
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-955 tracking-tight">
            Publish Sustainability Guide / Tip
          </h1>
          <p className="text-sm text-gray-700 mt-2">
            Write micro-actions or sorting guidelines that will help standard citizens sort waste correctly.
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
              Tip Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Decode the Plastic Numbers on Packaging"
              className="w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition bg-white"
            />
          </div>

          {/* Category & Icon */}
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
                <option value="Sort Smart">Sort Smart</option>
                <option value="Reduce Waste">Reduce Waste</option>
                <option value="Reuse & Recycle">Reuse & Recycle</option>
                <option value="Food & Organics">Food & Organics</option>
                <option value="E-Waste & Hazardous">E-Waste & Hazardous</option>
                <option value="Eco Habits">Eco Habits</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-black mb-2">
                Display Icon
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {presetIcons.map((i) => (
                  <button
                    type="button"
                    key={i}
                    onClick={() => setIcon(i)}
                    className={`w-9 h-9 border rounded-lg text-lg flex items-center justify-center transition cursor-pointer ${
                      icon === i ? "border-green-800 bg-green-50" : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    {i}
                  </button>
                ))}
              </div>
              <input
                type="text"
                maxLength={2}
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                placeholder="Or paste custom emoji..."
                className="w-full rounded-xl border border-gray-300 py-2 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition bg-white"
              />
            </div>
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Tip Description
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a clear, brief explanation of what this guide is about..."
              className="w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition resize-none bg-white"
            />
          </div>

          {/* Why it Matters Input */}
          <div>
            <label className="block text-sm font-semibold text-black mb-2">
              Why It Matters?
            </label>
            <textarea
              required
              rows={3}
              value={whyItMatters}
              onChange={(e) => setWhyItMatters(e.target.value)}
              placeholder="Why should users follow this? Explain the ecological impact (e.g. saves energy, reduces landfill toxic runoffs)..."
              className="w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition resize-none bg-white"
            />
          </div>

          {/* Steps list */}
          <div className="pt-4 border-t border-gray-150 space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-black">
                Action Steps / Guidelines
              </label>
              <button
                type="button"
                onClick={handleAddStep}
                className="text-xs bg-green-50 hover:bg-green-100 text-green-900 border border-green-200 font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
              >
                + Add Step
              </button>
            </div>

            {steps.map((step, idx) => (
              <div key={idx} className="relative group">
                <span className="absolute top-3 left-4 text-xs font-bold text-gray-400 bg-gray-50 border px-2 py-0.5 rounded-md">
                  Step {idx + 1}
                </span>

                <input
                  type="text"
                  required
                  value={step}
                  onChange={(e) => handleStepChange(idx, e.target.value)}
                  placeholder={`Write step ${idx + 1} detail...`}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-20 pr-12 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition bg-white"
                />

                {steps.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveStep(idx)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-650 transition cursor-pointer"
                    title="Remove Step"
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
              href="/dashboard/tips"
              className="w-1/2 text-center bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3.5 rounded-xl text-sm transition cursor-pointer"
            >
              Discard Tip
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
                  Publish Tip
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
