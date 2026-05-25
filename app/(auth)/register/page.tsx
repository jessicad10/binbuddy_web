"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    // Success Message
    setSuccess("Account created successfully!");
    setError("");

    console.log("Registered:", formData);

    // Clear fields after 2 seconds
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f3d2e] relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-green-500/20 blur-3xl rounded-full right-10 top-20"></div>

      <div className="relative z-10 w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 items-center px-6 md:px-16 gap-10">

        {/* Left Section */}
        <div className="text-white space-y-6">
          <p className="uppercase tracking-[4px] text-green-400 text-sm">
            Join The Movement
          </p>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Preserving our <br /> only home.
          </h1>

          <p className="text-gray-300 max-w-md text-lg leading-relaxed">
            The urgency of environmental action has never been greater.
            Join us in the mission to restore balance and protect the
            natural systems that sustain all life on Earth.
          </p>
        </div>

        {/* Register Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10 w-full max-w-md mx-auto">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-full bg-[#0f3d2e] flex items-center justify-center text-white font-bold">
              ♻
            </div>

            <h2 className="text-xl font-bold text-[#0f3d2e]">
              BinBuddy
            </h2>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Create account
            </h1>

            <p className="text-gray-500 mt-2">
              Start your journey towards a cleaner world.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-500 text-sm mb-4">
              {error}
            </p>
          )}

          {/* Success Message */}
          {success && (
            <p className="text-green-600 text-sm mb-4 font-medium">
              {success}
            </p>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Jessica Dhamala"
                value={formData.name}
                onChange={handleChange}
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-text"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>

              <input
                type="email"
                name="email"
                placeholder="xyz@gmail.com"
                value={formData.email}
                onChange={handleChange}
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-text"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-text"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="off"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600 cursor-text"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#0f3d2e] hover:bg-[#14523d] text-white font-semibold py-3 rounded-xl transition duration-300"
            >
              Create BinBuddy Account
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 mt-6 text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-[#0f3d2e] font-semibold hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}