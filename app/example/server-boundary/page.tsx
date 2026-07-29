"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ServerBoundaryPage() {
  return (
    <main className="min-h-screen bg-[#F3F0DE] p-8 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        <Link href="/example" className="inline-flex items-center gap-2 text-green-900 font-semibold hover:text-green-700 transition">
          <ArrowLeft size={16} />
          Back to Examples
        </Link>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-150 text-xs">
          <h2 className="font-bold text-sm text-green-950 mb-2">Server Boundaries</h2>
          <p className="text-gray-500">Demonstrates React server component boundaries and data loading lifecycle error handlers.</p>
        </div>
      </div>
    </main>
  );
}
