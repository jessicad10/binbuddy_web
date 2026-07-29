"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";

export default function ExamplePage() {
  const routes = [
    { path: "/example/ai/gemini", label: "Gemini Chatbot" },
    { path: "/example/contexts", label: "Contexts & States" },
    { path: "/example/image", label: "Image component usage" },
    { path: "/example/input", label: "Inputs & Forms" },
    { path: "/example/link", label: "Link navigation patterns" },
    { path: "/example/props", label: "Props & Type passings" },
    { path: "/example/react-hookfrom", label: "React Hook Form basic" },
    { path: "/example/react-hookfrom-zod", label: "React Hook Form with Zod schemas" },
    { path: "/example/server-boundary", label: "Server boundaries & boundaries layouts" },
  ];

  return (
    <main className="min-h-screen bg-[#F3F0DE] p-8 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-green-900 font-semibold hover:text-green-700 transition">
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl p-8 border border-gray-150 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <BookOpen className="text-green-800" size={24} />
            <h1 className="text-xl font-bold text-green-950">Next.js Learning Examples</h1>
          </div>
          
          <nav className="divide-y divide-gray-100">
            {routes.map((r) => (
              <Link key={r.path} href={r.path} className="block py-3 text-xs font-semibold text-gray-700 hover:text-green-900 hover:underline">
                {r.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </main>
  );
}
