"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminBlogDetailsPage({ params }: PageProps) {
  const { id } = use(params);

  return (
    <main className="min-h-screen bg-[#F3F0DE] p-8 font-sans">
      <div className="max-w-xl mx-auto space-y-6">
        <Link href="/admin/blogs" className="inline-flex items-center gap-2 text-green-900 font-semibold hover:text-green-700 transition">
          <ArrowLeft size={16} />
          Back to Blogs list
        </Link>

        <article className="bg-white rounded-3xl p-6 shadow-sm border border-gray-150 text-xs">
          <h2 className="font-bold text-sm text-green-950 mb-2">Dynamic Blog Item details</h2>
          <p className="text-gray-500 font-mono">Blog Entity ID: {id}</p>
        </article>
      </div>
    </main>
  );
}
