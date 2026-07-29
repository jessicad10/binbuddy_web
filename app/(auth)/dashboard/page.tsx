"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  BookOpen,
  Lightbulb,
  MessageCircle,
  Leaf,
  Recycle,
  ArrowDown,
  LogOut,
  Users,
  Database,
  Activity,
  Settings,
  ShieldCheck,
  MapPin,
  Truck,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { getAdminUsers } from "@/lib/api/admin-users";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/app/(auth)/_components/Header";
import Footer from "@/app/(auth)/_components/Footer";

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  // Admin specific stats
  const [totalUsers, setTotalUsers] = useState<number | null>(null);
  const [adminCount, setAdminCount] = useState<number>(0);
  const [userCount, setUserCount] = useState<number>(0);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    const fetchAdminStats = async () => {
      if (user?.role === "admin" && token) {
        setLoadingStats(true);
        try {
          const response = await getAdminUsers(token, 1, 100);
          if (response.success) {
            const count = response.meta?.total || response.data.length;
            setTotalUsers(count);
            const admins = response.data.filter((u: any) => u.role === "admin").length;
            setAdminCount(admins);
            setUserCount(count - admins);
          }
        } catch (e) {
          console.error("Failed to load admin stats", e);
        } finally {
          setLoadingStats(false);
        }
      }
    };
    fetchAdminStats();
  }, [user, token]);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const isAdmin = user?.role === "admin";

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#F5F2DF] via-[#FAF8F0] to-[#E9E5CE] font-sans flex flex-col">
      <Header />

      <div className="flex-grow max-w-7xl w-full mx-auto px-6 sm:px-8 py-10">
        {isAdmin ? (
          /* ==============================================
             ADMIN DASHBOARD CONTENT (ELEVATED)
             ============================================== */
          <div className="space-y-10">
            
            {/* Hero Section */}
            <section className="grid grid-cols-12 gap-6">
              
              {/* Welcome Card with Gradient Glow */}
              <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-[#0B2717] via-[#124B34] to-[#041a0d] rounded-3xl overflow-hidden relative shadow-lg">
                <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200')] bg-cover bg-center mix-blend-overlay" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />

                <div className="relative p-8 md:p-10 z-10 flex flex-col justify-between h-full min-h-[250px]">
                  <div>
                    <span className="bg-white/10 text-green-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                      System Control Center
                    </span>
                    <h2 className="text-white text-3xl md:text-4xl font-extrabold mt-4 mb-3 tracking-tight">
                      Welcome back, {user?.fullName?.split(" ")[0] || "Admin"}!
                    </h2>
                    <p className="text-green-100/80 max-w-lg text-xs md:text-sm leading-relaxed">
                      Coordinate Kathmandu Valley waste sorting metrics, publish campaign events, update citizen pickup requests, and audit system users.
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10 max-w-xs shadow-sm">
                    <ShieldCheck size={20} className="text-green-400" />
                    <div>
                      <p className="text-[9px] text-green-300/80 font-bold uppercase tracking-wider">Privilege Level</p>
                      <p className="text-white font-extrabold text-xs">System Administrator</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Database and System Status */}
              <div className="col-span-12 lg:col-span-4 bg-[#EBE2C4] rounded-3xl p-6.5 flex flex-col justify-between shadow-md border border-black/5 relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#d8ceac] rounded-full blur-2xl transition-all duration-300 group-hover:scale-110" />
                
                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center text-lg shadow-sm border border-white/40">
                    ⚙️
                  </div>

                  <h3 className="font-extrabold text-xl mt-4 text-green-950 tracking-tight">
                    System Health
                  </h3>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between text-xs border-b border-green-900/10 pb-2.5">
                      <span className="text-gray-700 font-semibold flex items-center gap-2">
                        <Database size={14} className="text-green-800" /> Database Connection
                      </span>
                      <span className="font-bold text-green-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-700 animate-pulse"></span>
                        Active
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs border-b border-green-900/10 pb-2.5">
                      <span className="text-gray-700 font-semibold flex items-center gap-2">
                        <Activity size={14} className="text-green-800" /> API Services
                      </span>
                      <span className="font-bold text-green-900 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-700 animate-pulse"></span>
                        Online
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-700 font-semibold flex items-center gap-2">
                        <Settings size={14} className="text-green-800" /> Node Env Mode
                      </span>
                      <span className="font-extrabold text-green-900 bg-white/30 border border-white/20 px-2 py-0.5 rounded-lg">Development</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/admin"
                  className="mt-6 bg-[#124B34] hover:bg-[#0B2717] text-white rounded-xl py-3 font-bold text-xs text-center transition-all duration-200 shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Manage System <ArrowRight size={13} />
                </Link>
              </div>
            </section>

            {/* Quick Metrics */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6.5 shadow-sm border border-gray-150/70 flex items-center gap-5 hover:shadow-md transition duration-200">
                <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-[#124B34] shadow-inner">
                  <Users size={22} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Total Users Registered</p>
                  <h4 className="text-3xl font-black text-gray-900 mt-1 tracking-tight">
                    {loadingStats ? "..." : totalUsers !== null ? totalUsers : "—"}
                  </h4>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6.5 shadow-sm border border-gray-150/70 flex items-center gap-5 hover:shadow-md transition duration-200">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-800 shadow-inner">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Administrators</p>
                  <h4 className="text-3xl font-black text-gray-900 mt-1 tracking-tight">
                    {loadingStats ? "..." : totalUsers !== null ? adminCount : "—"}
                  </h4>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6.5 shadow-sm border border-gray-150/70 flex items-center gap-5 hover:shadow-md transition duration-200">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-700 shadow-inner">
                  <Users size={22} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Standard Citizen Accounts</p>
                  <h4 className="text-3xl font-black text-gray-900 mt-1 tracking-tight">
                    {loadingStats ? "..." : totalUsers !== null ? userCount : "—"}
                  </h4>
                </div>
              </div>
            </section>

            {/* Services (Admin Actions) */}
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-green-950 tracking-tight">
                Administrative Utilities
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                <div className="bg-white rounded-3xl p-6.5 hover:shadow-md transition-all duration-300 border border-gray-150/70 flex flex-col justify-between min-h-[200px] hover:-translate-y-1 group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-150 flex items-center justify-center text-[#124B34] transition-all duration-300 group-hover:scale-110">
                      <Users size={20} />
                    </div>
                    <h3 className="font-extrabold text-lg mt-4 text-green-950 tracking-tight">User Registry</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed font-medium">
                      Configure user credentials, manage role status permissions, and view metadata records.
                    </p>
                  </div>
                  <Link href="/admin" className="text-xs font-bold text-[#124B34] mt-4 flex items-center gap-1 group-hover:underline">
                    Access Registry <ArrowRight size={12} />
                  </Link>
                </div>

                <div className="bg-white rounded-3xl p-6.5 hover:shadow-md transition-all duration-300 border border-gray-150/70 flex flex-col justify-between min-h-[200px] hover:-translate-y-1 group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-150 flex items-center justify-center text-[#124B34] transition-all duration-300 group-hover:scale-110">
                      <BookOpen size={20} />
                    </div>
                    <h3 className="font-extrabold text-lg mt-4 text-green-950 tracking-tight">Add Blog</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed font-medium">
                      Publish announcements, sustainability articles, and educational materials to the feed.
                    </p>
                  </div>
                  <Link href="/dashboard/blog/create" className="text-xs font-bold text-[#124B34] mt-4 flex items-center gap-1 group-hover:underline">
                    Publish Blog <ArrowRight size={12} />
                  </Link>
                </div>

                <div className="bg-white rounded-3xl p-6.5 hover:shadow-md transition-all duration-300 border border-gray-150/70 flex flex-col justify-between min-h-[200px] hover:-translate-y-1 group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-150 flex items-center justify-center text-[#124B34] transition-all duration-300 group-hover:scale-110">
                      <Lightbulb size={20} />
                    </div>
                    <h3 className="font-extrabold text-lg mt-4 text-green-950 tracking-tight">Add Tips</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed font-medium">
                      Write daily tips on sorting categories, organic composting, and reducing household waste.
                    </p>
                  </div>
                  <Link href="/dashboard/tips/create" className="text-xs font-bold text-[#124B34] mt-4 flex items-center gap-1 group-hover:underline">
                    Create Guide <ArrowRight size={12} />
                  </Link>
                </div>

                <div className="bg-white rounded-3xl p-6.5 hover:shadow-md transition-all duration-300 border border-gray-150/70 flex flex-col justify-between min-h-[200px] hover:-translate-y-1 group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-150 flex items-center justify-center text-[#124B34] transition-all duration-300 group-hover:scale-110">
                      <Recycle size={20} />
                    </div>
                    <h3 className="font-extrabold text-lg mt-4 text-green-950 tracking-tight">Campaign Manager</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed font-medium">
                      Coordinate localized cleaning tasks, set dates, locations, and trace volunteers lists.
                    </p>
                  </div>
                  <Link href="/dashboard/campaigns" className="text-xs font-bold text-[#124B34] mt-4 flex items-center gap-1 group-hover:underline">
                    Manage Campaigns <ArrowRight size={12} />
                  </Link>
                </div>

                <div className="bg-white rounded-3xl p-6.5 hover:shadow-md transition-all duration-300 border border-gray-150/70 flex flex-col justify-between min-h-[200px] hover:-translate-y-1 group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-150 flex items-center justify-center text-[#124B34] transition-all duration-300 group-hover:scale-110">
                      <Truck size={20} />
                    </div>
                    <h3 className="font-extrabold text-lg mt-4 text-green-950 tracking-tight">Pickup Requests</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed font-medium">
                      Approve pending request notifications, log updates, and trace locations coordinates.
                    </p>
                  </div>
                  <Link href="/admin?tab=pickups" className="text-xs font-bold text-[#124B34] mt-4 flex items-center gap-1 group-hover:underline">
                    View Pickups <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* ==============================================
             USER DASHBOARD CONTENT (ELEVATED)
             ============================================== */
          <div className="space-y-10">
            
            {/* Hero Section */}
            <section className="grid grid-cols-12 gap-6">
              
              {/* Welcome Card with Gradient Glow */}
              <div className="col-span-12 lg:col-span-8 bg-gradient-to-br from-[#0B2717] via-[#124B34] to-[#041a0d] rounded-3xl overflow-hidden relative shadow-lg">
                <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1511497584788-876760111969?w=1200')] bg-cover bg-center mix-blend-overlay" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-green-500/10 rounded-full blur-3xl" />

                <div className="relative p-8 md:p-10 z-10 flex flex-col justify-between h-full min-h-[250px]">
                  <div>
                    <span className="bg-white/10 text-green-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-white/10">
                      Citizen Hub
                    </span>
                    <h2 className="text-white text-3xl md:text-4xl font-extrabold mt-4 mb-3 tracking-tight">
                      Welcome back, {user?.fullName?.split(" ")[0] || "Jessica"}!
                    </h2>
                    <p className="text-green-100/90 max-w-md text-xs md:text-sm font-semibold italic mt-4 mb-1">
                      "The greatest threat to our planet is the belief that someone else will save it."
                    </p>
                    <p className="text-green-300 text-xs font-bold">
                      — Robert Swan
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-3 bg-white/5 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10 max-w-xs shadow-sm">
                    <TrendingUp size={20} className="text-green-400" />
                    <div>
                      <p className="text-[9px] text-green-300/80 font-bold uppercase tracking-wider">Your Impact</p>
                      <p className="text-white font-extrabold text-xs">Active Eco-Citizen</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Waste Management Info Card */}
              <div className="col-span-12 lg:col-span-4 bg-[#EBE2C4] rounded-3xl p-6.5 flex flex-col justify-between shadow-md border border-black/5 relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#d8ceac] rounded-full blur-2xl transition-all duration-300 group-hover:scale-110" />

                <div className="relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-white/40 flex items-center justify-center text-lg shadow-sm border border-white/40">
                    ♻️
                  </div>

                  <h3 className="font-extrabold text-xl mt-4 text-green-950 tracking-tight">
                    Smart Waste Action
                  </h3>

                  <p className="text-xs text-gray-700 mt-3.5 leading-relaxed font-medium">
                    Proper waste management reduces pollution, conserves natural resources, and protects biodiversity. Every item sorted correctly is a step toward a circular economy.
                  </p>
                </div>

                <Link
                  href="/dashboard/tips"
                  className="mt-6 bg-[#124B34] hover:bg-[#0B2717] text-white rounded-xl py-3 font-bold text-xs text-center transition-all duration-200 shadow-md inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Learn Sorting Tips <ArrowRight size={13} />
                </Link>
              </div>
            </section>

            {/* Service Grid - Uplifted with Premium Card effects */}
            <section className="space-y-6">
              <h2 className="text-2xl font-black text-green-950 tracking-tight">
                My Services
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                
                <Link href="/dashboard/smart-sort" className="block cursor-pointer group">
                  <ServiceCard
                    icon={<Search size={20} />}
                    title="Smart Sort"
                    description="Identify waste types instantly using our AI models."
                  />
                </Link>

                <Link href="/dashboard/blog" className="block cursor-pointer group">
                  <ServiceCard
                    icon={<BookOpen size={20} />}
                    title="Blogs Feed"
                    description="Read announcements & sustainability stories."
                  />
                </Link>

                <Link href="/dashboard/tips" className="block cursor-pointer group">
                  <ServiceCard
                    icon={<Lightbulb size={20} />}
                    title="Daily Tips"
                    description="Bite-sized guidelines for clean, green living."
                  />
                </Link>

                <Link href="/dashboard/feedback" className="block cursor-pointer group">
                  <ServiceCard
                    icon={<MessageCircle size={20} />}
                    title="Feedback"
                    description="Help us optimize localized municipal services."
                  />
                </Link>

                <Link href="/dashboard/recycle-centers" className="block cursor-pointer group">
                  <ServiceCard
                    icon={<Recycle size={20} />}
                    title="Recycle Hubs"
                    description="Locate local plants and place pickup tickets."
                  />
                </Link>
              </div>
            </section>

            {/* Bottom Content Grid */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Recent Stories Card */}
              <div className="col-span-12 lg:col-span-4">
                <h2 className="font-black text-2xl text-green-950 tracking-tight mb-5">
                  Recent Stories
                </h2>

                <Link href="/dashboard/blog" className="block cursor-pointer group">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-gray-150/70 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col justify-between">
                    <div>
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=800"
                          alt="Composting 101"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#124B34] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                            Composting
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="font-extrabold text-xl text-green-950 leading-snug group-hover:text-green-800 transition">
                          Composting 101: Turn Kitchen Scraps Into Gold
                        </h3>

                        <p className="text-gray-500 text-xs mt-2.5 leading-relaxed font-medium">
                          Learn the science of composting at home, what goes in, what stays out, and how to use it.
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-[10px] font-bold text-gray-400">
                        <span>BY DR. CLARA GREENFIELD</span>
                        <span>5 MIN READ</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Recycle Hubs Card */}
              <div className="col-span-12 lg:col-span-4">
                <h2 className="font-black text-2xl text-green-950 tracking-tight mb-5">
                  Recycle Hubs
                </h2>

                <Link href="/dashboard/recycle-centers" className="block cursor-pointer group">
                  <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-gray-150/70 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col justify-between">
                    <div>
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=800"
                          alt="Recycle Centers"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#124B34] text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                            Recycling Hubs
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <h3 className="font-extrabold text-xl text-green-950 leading-snug group-hover:text-green-800 transition">
                          Doorstep Pickups: Local Valley Centers Active
                        </h3>

                        <p className="text-gray-500 text-xs mt-2.5 leading-relaxed font-medium">
                          Find certified hubs accepting plastic, e-waste, glass, and metal near you, and schedule door-to-door pickups.
                        </p>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-[10px] font-bold text-gray-400">
                        <span>BY BINBUDDY REGISTRY</span>
                        <span>DAILY PICKUPS</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Featured Campaign Banner */}
              <div className="col-span-12 lg:col-span-4 flex flex-col">
                <h2 className="font-black text-2xl text-green-950 tracking-tight mb-5">
                  Featured Campaign
                </h2>

                <div className="bg-gradient-to-br from-[#0B2717] via-[#124B34] to-[#041a0d] text-white rounded-3xl p-8 flex-grow flex flex-col justify-between relative overflow-hidden shadow-md group min-h-[320px]">
                  <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=850')] bg-cover bg-center transition-transform duration-500 group-hover:scale-105 mix-blend-overlay" />
                  
                  <div className="relative z-10">
                    <span className="bg-yellow-500/20 text-yellow-300 text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-yellow-500/20">
                      ⚡ UPCOMING DRIVE
                    </span>

                    <h3 className="text-2xl font-black text-white mt-4 leading-snug tracking-tight">
                      "Help the environment get better by cleaning Bagmati."
                    </h3>

                    <p className="text-green-100/85 text-xs mt-3.5 max-w-sm leading-relaxed font-medium">
                      Join hundreds of volunteers this Saturday at the Thapathali River Bank. Clean up, sort plastics, and protect Kathmandu's lifeline.
                    </p>
                  </div>

                  <div className="relative z-10 flex justify-between items-center mt-8 pt-4 border-t border-white/10">
                    <span className="text-[9px] text-green-200 font-bold uppercase tracking-wider flex items-center gap-1">
                      <MapPin size={12} className="text-yellow-400" />
                      Thapathali Bank, Ktm
                    </span>

                    <Link
                      href="/dashboard/campaigns"
                      className="bg-yellow-400 hover:bg-yellow-500 text-green-950 font-bold py-2.5 px-5 rounded-xl text-xs transition-all duration-200 shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      Join Campaign <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}

function ServiceCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-3xl p-6.5 border border-gray-150/70 hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[175px] hover:-translate-y-1 relative group overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-300" />
      
      <div className="relative z-10">
        <div className="w-11 h-11 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center text-[#124B34] shadow-inner transition-transform duration-300 group-hover:scale-105">
          {icon}
        </div>
        <h3 className="font-extrabold text-sm mt-4 text-green-950 tracking-tight">
          {title}
        </h3>
        <p className="text-[11px] text-gray-500 mt-1.5 leading-relaxed font-semibold">
          {description}
        </p>
      </div>
    </div>
  );
}