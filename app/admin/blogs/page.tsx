"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BlogTable from "./_components/BlogTable";
import DeleteModal from "./_components/DeleteModal";

export default function AdminBlogsPage() {
  return (
    <main className="min-h-screen bg-[#F3F0DE] p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/admin" className="inline-flex items-center gap-2 text-green-900 font-semibold hover:text-green-700 transition">
          <ArrowLeft size={16} />
          Back to Admin Dashboard
        </Link>

        <header className="bg-[#124B34] text-white p-8 rounded-3xl">
          <h1 className="text-2xl font-bold">Admin Blogs Management</h1>
          <p className="text-xs text-green-200 mt-1">Reference route mapping matching the teacher folder structure.</p>
        </header>

        <BlogTable />
        <DeleteModal />
      </div>
    </main>
  );
}
