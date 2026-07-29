"use client";

import React, { Suspense } from "react";
import { RefreshCw } from "lucide-react";
import PasswordResetForm from "../_components/PasswordResetForm";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f3d2e] relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1f5f46] via-[#0d3b2e] to-[#021b14]" />
      <div className="relative z-10 w-full max-w-md px-6">
        <Suspense fallback={
          <div className="bg-white rounded-3xl shadow-2xl p-10 text-center text-black">
            <RefreshCw className="animate-spin mx-auto text-green-900 w-8 h-8 mb-2" />
            Loading reset interface...
          </div>
        }>
          <PasswordResetForm />
        </Suspense>
      </div>
    </main>
  );
}
