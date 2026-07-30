"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import {
  registerSchema,
  type RegisterFormData,
} from "./schema";

import { handleRegisterUser } from "@/lib/actions/auth-action";

export default function RegisterForm() {
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    setError("");

    startTransition(async () => {
      try {
        const result = await handleRegisterUser(data);

        if (result.success) {
          router.push("/login");
        } else {
          setError(result.message || "Registration failed");
        }
      } catch (err: any) {
        setError(err?.message || "Registration failed");
      }
    });
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

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>

              <input
                type="text"
                placeholder="Jessica"
                {...register("firstName")}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>

              <input
                type="text"
                placeholder="Dhamala"
                {...register("lastName")}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>

              <input
                type="text"
                placeholder="jessica123"
                {...register("username")}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="xyz@gmail.com"
                {...register("email")}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full px-4 pr-12 py-3 rounded-xl border border-gray-300 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-700 transition cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("confirmPassword")}
                  className="w-full px-4 pr-12 py-3 rounded-xl border border-gray-300 bg-white text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-700 transition cursor-pointer"
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isPending}
              className="w-full bg-[#0f3d2e] hover:bg-[#14523d] text-white font-semibold py-3 rounded-xl transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending
                ? "Creating Account..."
                : "Create BinBuddy Account"}
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
