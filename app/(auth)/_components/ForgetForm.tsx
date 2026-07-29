"use client";

import React, { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/api/auth";
import { RefreshCw, CheckCircle, ArrowLeft, Mail } from "lucide-react";

export default function ForgetForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await forgotPassword(email.trim());
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || "Failed to request password reset link");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-md mx-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-[#0f3d2e] flex items-center justify-center text-white font-bold">
          ♻
        </div>
        <span className="font-bold text-[#0f3d2e] text-lg">BinBuddy</span>
      </div>

      {success ? (
        <div className="text-center py-4 space-y-5 animate-in fade-in zoom-in duration-200">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-700 border border-green-100">
            <CheckCircle size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Check Your Email</h2>
            <p className="text-gray-500 text-xs mt-2.5 leading-relaxed">
              We've sent a secure password reset link to <strong className="text-gray-700">{email}</strong>.
              Please check your inbox (and spam folder) and click the link to reset your password.
            </p>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:underline"
            >
              <ArrowLeft size={16} />
              Return to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-bold text-[#0f3d2e]">Forgot Password?</h2>
          <p className="text-gray-500 mt-2 mb-8 text-xs leading-relaxed">
            Enter your email address below. We will send you a secure link to reset your account password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-700 border border-red-150 p-3.5 rounded-xl text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-black mb-1.5 uppercase">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 outline-none text-black focus:ring-2 focus:ring-green-500 text-xs"
                  placeholder="e.g. xyz@gmail.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#0f3d2e] hover:bg-[#14513e] transition text-white font-semibold py-3.5 rounded-xl text-xs disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} />
                  Sending Link...
                </>
              ) : (
                "Send Password Reset Link"
              )}
            </button>

            <div className="text-center pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:underline"
              >
                <ArrowLeft size={14} />
                Back to login page
              </Link>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
