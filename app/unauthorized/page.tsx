"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-[#F3F0DE] flex items-center justify-center font-sans p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-lg border border-gray-150 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 border border-red-150 flex items-center justify-center mx-auto">
          <ShieldAlert size={32} />
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Access Unauthorized</h1>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">
            You do not have administrative permissions to view this resource. Please return to the standard user dashboard.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="w-full bg-[#124B34] hover:bg-[#0c3323] text-white font-bold py-3.5 rounded-xl text-xs transition cursor-pointer inline-block"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}
