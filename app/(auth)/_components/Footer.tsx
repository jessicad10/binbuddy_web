"use client";

import React from "react";
import Link from "next/link";
import { Mail, GraduationCap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0B2717] text-white py-12 px-6 sm:px-8 lg:px-12 border-t border-green-950 font-sans mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        {/* Logo & Description Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#0B2717] font-bold text-base">
              ♻
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">
              BinBuddy
            </span>
          </div>
          
          <p className="text-green-100 text-xs font-semibold">
            "Smart waste sorting for a cleaner tomorrow."
          </p>
          
          <p className="text-green-200/80 text-xs leading-relaxed max-w-sm pt-2">
            BinBuddy is a smart waste management platform that helps users identify and sort waste responsibly.
          </p>
        </div>

        {/* Quick Links Column */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-green-300">
            Quick Links
          </h4>
          <ul className="space-y-2 text-xs text-green-100/90 font-medium">
            <li>
              <Link href="/dashboard" className="hover:text-white transition cursor-pointer">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/dashboard/smart-sort" className="hover:text-white transition cursor-pointer">
                Smart Sort
              </Link>
            </li>
            <li>
              <Link href="/dashboard/tips" className="hover:text-white transition cursor-pointer">
                Tips & Guides
              </Link>
            </li>
            <li>
              <Link href="/dashboard/blog" className="hover:text-white transition cursor-pointer">
                Blogs & Insights
              </Link>
            </li>
            <li>
              <Link href="/dashboard/campaigns" className="hover:text-white transition cursor-pointer">
                Campaigns
              </Link>
            </li>
            <li>
              <Link href="/dashboard/feedback" className="hover:text-white transition cursor-pointer">
                Feedback & Reports
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact & Meta Column */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-green-300">
            Contact Us
          </h4>
          
          <div className="flex items-center gap-2 text-xs text-green-100">
            <Mail size={14} className="text-green-350" />
            <a href="mailto:admin@binbuddy.com" className="hover:text-white transition cursor-pointer">
              admin@binbuddy.com
            </a>
          </div>
        </div>
      </div>

      {/* Copyright row */}
      <div className="max-w-7xl mx-auto border-t border-green-900/50 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-green-200/60">
        <p>&copy; 2026 BinBuddy. All rights reserved.</p>
        <p className="hover:text-white transition cursor-pointer">Privacy Policy & Terms</p>
      </div>
    </footer>
  );
}
