"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { updateProfile } from "@/lib/api/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Camera, Save, Lock, User, Mail, Phone, RefreshCw } from "lucide-react";

export default function ProfilePage() {
  const { user, token, refreshUser, loading } = useAuth();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Details State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">("");
  
  // Image Upload State
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Password State
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Status State
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Prefill details once user data is loaded
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setContactNumber(user.contactNumber || "");
      setGender(user.gender || "");
      if (user.profileImage) {
        setImagePreview(user.profileImage);
      }
    }
  }, [user]);

  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setProfileError("Only image files are allowed");
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");
    setIsSavingProfile(true);

    try {
      if (!token) {
        throw new Error("No authorization token found. Please log in again.");
      }

      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);
      formData.append("contactNumber", contactNumber);
      if (gender) {
        formData.append("gender", gender);
      }
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      const response = await updateProfile(formData, token);
      
      if (response.success) {
        setProfileSuccess("Profile updated successfully!");
        await refreshUser();
      } else {
        setProfileError(response.message || "Failed to update profile");
      }
    } catch (err: any) {
      setProfileError(err.message || "An error occurred while updating profile");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (!password) {
      setPasswordError("Password cannot be empty");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setIsSavingPassword(true);

    try {
      if (!token) {
        throw new Error("No authorization token found. Please log in again.");
      }

      const formData = new FormData();
      formData.append("password", password);

      const response = await updateProfile(formData, token);
      
      if (response.success) {
        setPasswordSuccess("Password updated successfully!");
        setPassword("");
        setConfirmPassword("");
        await refreshUser();
      } else {
        setPasswordError(response.message || "Failed to change password");
      }
    } catch (err: any) {
      setPasswordError(err.message || "An error occurred while changing password");
    } finally {
      setIsSavingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F0DE] flex flex-col items-center justify-center">
        <RefreshCw className="animate-spin text-green-900 w-12 h-12" />
        <p className="mt-4 text-green-900 font-semibold">Loading profile...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F0DE] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-green-900 hover:text-green-700 font-medium transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-[#124B34] text-white rounded-3xl p-8 mb-8 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1511497584788-876760111969?w=1200')] bg-cover bg-center" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white bg-green-100 flex items-center justify-center relative shadow-md">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={48} className="text-green-800" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-green-900 hover:bg-green-800 text-white rounded-full p-2 border-2 border-white shadow transition-all scale-95 hover:scale-105"
              >
                <Camera size={16} />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-bold">{fullName || "User Profile"}</h2>
              <p className="text-green-200 text-sm mt-1">{email}</p>
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full mt-3 uppercase tracking-wider font-semibold">
                {user?.role || "User"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info Form */}
          <div className="md:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-green-900 mb-6 flex items-center gap-2">
              <User size={20} />
              Profile Details
            </h3>

            {profileError && (
              <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm mb-6 font-medium border border-red-100">
                {profileError}
              </div>
            )}
            {profileSuccess && (
              <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm mb-6 font-medium border border-green-100">
                {profileSuccess}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-black-400">
                      <User size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="pl-10 w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black caret-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Mail size={16} />
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black caret-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Contact Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                      <Phone size={16} />
                    </span>
                    <input
                      type="text"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="pl-10 w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black caret-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition"
                      placeholder="+977-9800000000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e: any) => setGender(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="flex items-center gap-2 bg-[#124B34] hover:bg-green-950 text-white rounded-xl py-3 px-6 font-semibold transition disabled:opacity-50"
                >
                  {isSavingProfile ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Details
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Password Form */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-green-900 mb-6 flex items-center gap-2">
              <Lock size={20} />
              Change Password
            </h3>

            {passwordError && (
              <div className="bg-red-50 text-red-800 p-4 rounded-xl text-sm mb-6 font-medium border border-red-100">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm mb-6 font-medium border border-green-100">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  New Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-black-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black caret-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-black mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-black-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 w-full rounded-xl border border-gray-300 py-3 px-4 text-sm text-black caret-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="w-full flex items-center justify-center gap-2 bg-green-900 hover:bg-green-950 text-white rounded-xl py-3 px-4 font-semibold transition disabled:opacity-50"
                >
                  {isSavingPassword ? (
                    <>
                      <RefreshCw className="animate-spin" size={18} />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock size={18} />
                      Update Password
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
