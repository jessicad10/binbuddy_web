"use client";

import React from "react";
import ForgetForm from "../_components/ForgetForm";

export default function ForgetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0f3d2e] relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-r from-[#1f5f46] via-[#0d3b2e] to-[#021b14]" />
      <div className="relative z-10 w-full max-w-md px-6">
        <ForgetForm />
      </div>
    </main>
  );
}
