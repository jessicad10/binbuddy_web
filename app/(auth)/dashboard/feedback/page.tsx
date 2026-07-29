"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { submitFeedback, getFeedbacks } from "@/lib/api/feedback";
import { ArrowLeft, MessageSquare, Send, CheckCircle, RefreshCw, AlertCircle, FileText, User, Mail, Calendar, Heart, ShieldAlert } from "lucide-react";
import Header from "@/app/(auth)/_components/Header";
import Footer from "@/app/(auth)/_components/Footer";

export default function FeedbackPage() {
  const { user, token, loading: authLoading } = useAuth();

  // Form State
  const [feedbackType, setFeedbackType] = useState<"website" | "waste-management" | "general" | "praise">("website");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // UI Status State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [recentSubmission, setRecentSubmission] = useState<any>(null);

  // Past Feedbacks State
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [isLoadingFeedbacks, setIsLoadingFeedbacks] = useState(true);
  const [feedbacksError, setFeedbacksError] = useState("");

  const loadFeedbacks = async () => {
    if (!token) return;
    setIsLoadingFeedbacks(true);
    setFeedbacksError("");
    try {
      const response = await getFeedbacks(token);
      if (response.success && response.data) {
        setFeedbacks(response.data);
      }
    } catch (err: any) {
      setFeedbacksError(err.message || "Failed to load past feedbacks");
    } finally {
      setIsLoadingFeedbacks(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadFeedbacks();
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess(false);

    if (subject.trim().length < 3) {
      setSubmitError("Subject must be at least 3 characters long");
      return;
    }
    if (message.trim().length < 10) {
      setSubmitError("Message must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);

    try {
      if (!token) {
        throw new Error("No authorization token found. Please log in again.");
      }

      const response = await submitFeedback(
        {
          type: feedbackType,
          subject,
          message,
        },
        token
      );

      if (response.success) {
        setSubmitSuccess(true);
        setRecentSubmission(response.data);
        setSubject("");
        setMessage("");
        // Reload list to show the new submission
        await loadFeedbacks();
      } else {
        setSubmitError(response.message || "Failed to submit feedback");
      }
    } catch (err: any) {
      setSubmitError(err.message || "An error occurred while submitting feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getCategoryLabel = (type: string) => {
    switch (type) {
      case "website":
        return "🌐 Website Improvement";
      case "waste-management":
        return "♻️ Waste/Service Feedback";
      case "praise":
        return "💖 Praise / Compliment";
      default:
        return "💬 General Inquiry";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F3F0DE] flex flex-col items-center justify-center">
        <RefreshCw className="animate-spin text-green-900 w-12 h-12" />
        <p className="mt-4 text-green-900 font-semibold">Loading account session...</p>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";

  return (
    <main className="min-h-screen bg-[#F3F0DE] font-sans flex flex-col">
      <Header />
      <div className="flex-grow max-w-6xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
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

        {/* Hero Section */}
        <header className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold mb-4 border border-green-200">
            <MessageSquare size={14} />
            User Voice
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-green-950 tracking-tight leading-tight">
            Feedback & Service Reports
          </h1>
          <p className="mt-3 text-gray-700 text-sm md:text-base">
            Tell us how we can improve the website UI, report local waste collection issues, request new bin locations, or share a sustainability praise!
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Form / Success Card */}
          <div className="lg:col-span-5">
            {submitSuccess ? (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-green-150 animate-in zoom-in duration-200">
                <div className="text-center mb-6">
                  <CheckCircle className="text-green-600 w-16 h-16 mx-auto mb-3" />
                  <h3 className="text-2xl font-bold text-green-900">Thank You, {user?.fullName?.split(" ")[0]}!</h3>
                  <p className="text-sm text-gray-500 mt-1">Your feedback helps us build a cleaner tomorrow.</p>
                </div>

                <div className="bg-green-50/50 rounded-2xl p-4 border border-green-100 mb-6 space-y-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-green-800 tracking-wider">Feedback Type</span>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5">{getCategoryLabel(recentSubmission?.type)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-green-800 tracking-wider">Subject</span>
                    <p className="text-xs font-semibold text-gray-800 mt-0.5">{recentSubmission?.subject}</p>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-green-800 tracking-wider">Message</span>
                    <p className="text-xs text-gray-700 leading-relaxed mt-0.5">{recentSubmission?.message}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="w-full bg-[#124B34] hover:bg-green-950 text-white font-bold py-3 rounded-xl text-sm transition cursor-pointer"
                >
                  Submit More Feedback
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-green-900 mb-6 flex items-center gap-2">
                  <MessageSquare size={20} />
                  Submit Feedback
                </h3>

                {submitError && (
                  <div className="bg-red-50 text-red-850 p-4 rounded-xl text-sm mb-6 border border-red-100 flex gap-2 items-start">
                    <AlertCircle size={18} className="mt-0.5 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Type Selector */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      What is your feedback about?
                    </label>
                    <select
                      value={feedbackType}
                      onChange={(e: any) => setFeedbackType(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition bg-white"
                    >
                      <option value="website">🌐 Website UI / Suggestion</option>
                      <option value="waste-management">♻️ Waste Sorting / Collection Issue</option>
                      <option value="general">💬 General Suggestion / Question</option>
                      <option value="praise">💖 Praise / Compliment</option>
                    </select>
                  </div>

                  {/* Subject Input */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black caret-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition"
                      placeholder="Summary of issue or suggestion"
                    />
                  </div>

                  {/* Message Input */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Detailed Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black caret-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition resize-none"
                      placeholder="Write your feedback here (minimum 10 characters)..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 bg-[#124B34] hover:bg-green-950 text-white rounded-xl py-3.5 px-4 font-semibold transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="animate-spin" size={18} />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Feedback
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>

          {/* Right Column: Listing Past Feedbacks / Admin Feed */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-green-900 flex items-center gap-2">
                  <FileText size={20} />
                  {isAdmin ? "Admin System Feedback Feed" : "My Past Feedbacks"}
                </h3>

                {isAdmin && (
                  <span className="bg-[#124B34] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldAlert size={10} />
                    System Admin Panel
                  </span>
                )}
              </div>

              {isLoadingFeedbacks ? (
                <div className="flex-1 flex flex-col items-center justify-center py-20">
                  <RefreshCw className="animate-spin text-green-900 w-8 h-8" />
                  <p className="mt-2 text-xs text-gray-500">Loading feed details...</p>
                </div>
              ) : feedbacksError ? (
                <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm border border-red-100">
                  {feedbacksError}
                </div>
              ) : feedbacks.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {feedbacks.map((item) => (
                    <div
                      key={item._id}
                      className="bg-[#F3F0DE]/40 border border-gray-200/60 rounded-2xl p-5 hover:border-gray-300 transition duration-200"
                    >
                      {/* Meta header row */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="bg-green-50 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                          {getCategoryLabel(item.type)}
                        </span>
                        
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(item.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>

                      {/* Subject */}
                      <h4 className="font-bold text-sm text-green-950">{item.subject}</h4>
                      
                      {/* Message body */}
                      <p className="text-xs text-gray-800 leading-relaxed mt-2 bg-white/70 p-3 rounded-xl border border-gray-150/40">
                        {item.message}
                      </p>

                      {/* Admin Info tag */}
                      {isAdmin && item.user && (
                        <div className="flex flex-wrap items-center gap-x-4 mt-3 pt-3 border-t border-gray-250/30 text-[10px] text-gray-500">
                          <span className="flex items-center gap-1">
                            <User size={10} />
                            {item.user.fullName || "Unknown User"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail size={10} />
                            {item.user.email || "No email"}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                  <MessageSquare size={40} className="text-gray-300 mb-3" />
                  <h4 className="font-bold text-gray-700 text-sm">No feedback logs found</h4>
                  <p className="text-xs text-gray-400 max-w-xs mt-1">
                    {isAdmin
                      ? "No user has submitted any feedback tickets yet."
                      : "You have not submitted any feedback tickets yet. Feel free to send us one!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
