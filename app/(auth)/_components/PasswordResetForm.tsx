"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/api/auth";
import { RefreshCw, CheckCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function PasswordResetForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid reset password link. Please request a new one.");
      return;
    }
    if (!password.trim()) {
      setError("Password cannot be blank");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const res = await resetPassword({ token, password });
      if (res.success) {
        setSuccess(true);
      } else {
        setError(res.message || "Failed to reset password");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
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
            <h2 className="text-2xl font-bold text-gray-800">Password Reset Successful!</h2>
            <p className="text-gray-500 text-xs mt-2.5 leading-relaxed">
              Your password has been successfully updated. You can now log in using your new credentials.
            </p>
          </div>
          <div className="pt-4 border-t border-gray-100">
            <Link
              href="/login"
              className="w-full bg-[#0f3d2e] hover:bg-[#14513e] transition text-white font-semibold py-3.5 rounded-xl text-xs flex items-center justify-center cursor-pointer shadow-md"
            >
              Sign In Now
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-3xl font-bold text-[#0f3d2e]">Reset Password</h2>
          <p className="text-gray-500 mt-2 mb-8 text-xs leading-relaxed">
            Enter your new secure account password below.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-750 border border-red-150 p-3.5 rounded-xl text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-black mb-1.5 uppercase">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 pl-4 pr-10 py-3 outline-none text-black focus:ring-2 focus:ring-green-500 text-xs"
                  placeholder="Minimum 6 characters"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-black mb-1.5 uppercase">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 pl-4 pr-10 py-3 outline-none text-black focus:ring-2 focus:ring-green-500 text-xs"
                  placeholder="Re-enter password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-700 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
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
                  Resetting...
                </>
              ) : (
                "Reset Password"
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
