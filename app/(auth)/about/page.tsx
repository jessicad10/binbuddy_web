"use client";

import React from "react";
import Header from "@/app/(auth)/_components/Header";
import Footer from "@/app/(auth)/_components/Footer";
import { Leaf, Recycle, ShieldCheck, Sparkles, Target, Users } from "lucide-react";

export default function AboutUsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F2DF] via-[#FAF8F0] to-[#E9E5CE] font-sans flex flex-col justify-between">
      <Header />

      <div className="flex-grow max-w-5xl w-full mx-auto px-6 py-12 md:py-16 space-y-12">
        {/* Banner Section */}
        <section className="bg-gradient-to-br from-[#0B2717] via-[#124B34] to-[#041a0d] text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-lg text-center">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200')] bg-cover bg-center mix-blend-overlay" />
          <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 bg-white/10 text-green-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
              <Sparkles size={11} className="text-yellow-400 fill-yellow-400" />
              Our Mission
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              Smart Waste Sorting for a Cleaner Tomorrow
            </h1>
            <p className="text-green-150 text-sm leading-relaxed max-w-lg mx-auto font-medium">
              BinBuddy is an interactive waste management platform designed to help local citizens responsibly identify, separate, and recycle waste.
            </p>
          </div>
        </section>

        {/* Pillars / Values Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6.5 border border-gray-150/70 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-[#124B34] mb-4">
              <Target size={22} />
            </div>
            <h3 className="font-extrabold text-base text-gray-900 tracking-tight">Promoting Composting</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed font-semibold">
              Assisting households in separating biodegradable food scraps to reduce municipal landfills and build organic fertilizer.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6.5 border border-gray-150/70 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 mb-4">
              <Recycle size={22} />
            </div>
            <h3 className="font-extrabold text-base text-gray-900 tracking-tight">Doorstep Recycling</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed font-semibold">
              Connecting local citizens directly with Kathmandu recycling centers to schedule door-to-door trash collection pickups.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6.5 border border-gray-150/70 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 mb-4">
              <Users size={22} />
            </div>
            <h3 className="font-extrabold text-base text-gray-900 tracking-tight">Active Communities</h3>
            <p className="text-xs text-gray-500 mt-2 leading-relaxed font-semibold">
              Organizing localized cleanliness campaigns and plantation drives to restore Bagmati river banks and public spaces.
            </p>
          </div>
        </section>

        {/* Detailed Core Description Card */}
        <section className="bg-white rounded-3xl p-8 border border-gray-150/70 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <Leaf className="text-green-800" size={24} />
            <h2 className="text-xl font-extrabold text-green-950 tracking-tight">What is BinBuddy?</h2>
          </div>
          
          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            BinBuddy is a waste management framework developed to bridge the gap between municipal recycling guidelines and public civic participation. In modern cities like Kathmandu, waste segregation at source remains a major challenge. Clean, recyclable products are often mixed with wet kitchen trash, making post-collection sorting impossible.
          </p>

          <p className="text-xs text-gray-600 leading-relaxed font-medium">
            Our platform features **Smart Sort**, which helps users immediately identify waste categories. Additionally, the **Recycle Centers Directory** allows users to discover active local drop-off centers and request pickups for cardboard, plastics, batteries, or metal waste directly from their doorsteps.
          </p>

        </section>
      </div>

      <Footer />
    </main>
  );
}
