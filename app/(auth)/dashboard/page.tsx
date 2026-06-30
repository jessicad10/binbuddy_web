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
} from "lucide-react";
import { useAuth } from "@/app/context/AuthContext";
import { getAdminUsers } from "@/lib/api/admin-users";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
    <main className="min-h-screen bg-[#F3F0DE] font-sans">
      {/* Navbar */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <h1 className="font-bold text-xl text-green-900">
              BinBuddy
            </h1>

            <nav className="flex gap-8 text-sm text-gray-600">
              <span className="text-green-900 font-medium cursor-pointer">
                Dashboard
              </span>
              <Link href="/profile" className="cursor-pointer hover:text-green-900 transition">
                Profile
              </Link>
              {isAdmin && (
                <Link href="/admin" className="cursor-pointer hover:text-green-900 transition">
                  Admin Panel
                </Link>
              )}
              {!isAdmin && (
                <>
                  <span className="cursor-pointer">Notifications</span>
                  <span className="cursor-pointer">Campaign</span>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-sm">{user?.fullName || "Jessica"}</p>
              <p className="text-xs text-gray-500 uppercase font-semibold">
                {user?.role || "user"}
              </p>
            </div>

            <Link
              href="/profile"
              className="w-10 h-10 rounded-full bg-green-200 border-2 border-green-800 overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-85 transition"
            >
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-green-850 font-bold text-sm">
                  {(user?.fullName || "Jessica").charAt(0).toUpperCase()}
                </span>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-700 p-1.5 hover:bg-gray-50 rounded-xl transition"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-8">
        {isAdmin ? (
          /* ==============================================
             ADMIN DASHBOARD CONTENT
             ============================================== */
          <div className="space-y-12">
            {/* Hero Section */}
            <section className="grid grid-cols-12 gap-6">
              {/* Welcome Card */}
              <div className="col-span-8 bg-[#124B34] rounded-3xl overflow-hidden relative">
                <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200')] bg-cover bg-center" />

                <div className="relative p-8 z-10">
                  <span className="bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                    System Control Center
                  </span>
                  <h2 className="text-white text-4xl font-bold mt-4 mb-4">
                    Welcome back, {user?.fullName?.split(" ")[0] || "Admin"}!
                  </h2>

                  <p className="text-green-100 max-w-md text-sm leading-relaxed">
                    Manage registered users, configure settings, monitor system metrics, and coordinate waste sorting campaigns.
                  </p>

                  <div className="mt-8 flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-3.5 max-w-xs">
                    <ShieldCheck size={22} className="text-green-300" />
                    <div>
                      <p className="text-xs text-green-200">PRIVILEGE LEVEL</p>
                      <p className="text-white font-bold text-sm">System Administrator</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Database and System Status */}
              <div className="col-span-4 bg-[#E9D9A7] rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-yellow-200/50 flex items-center justify-center text-lg">
                    ⚙️
                  </div>

                  <h3 className="font-bold text-2xl mt-4 text-green-950">
                    System Status
                  </h3>

                  <div className="mt-4 space-y-3.5">
                    <div className="flex items-center justify-between text-sm border-b border-green-900/10 pb-2">
                      <span className="text-gray-700 flex items-center gap-2">
                        <Database size={15} /> Database
                      </span>
                      <span className="font-bold text-green-800">Connected</span>
                    </div>
                    <div className="flex items-center justify-between text-sm border-b border-green-900/10 pb-2">
                      <span className="text-gray-700 flex items-center gap-2">
                        <Activity size={15} /> Services
                      </span>
                      <span className="font-bold text-green-800">Operational</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 flex items-center gap-2">
                        <Settings size={15} /> Config Mode
                      </span>
                      <span className="font-bold text-green-800">Local (Dev)</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/admin"
                  className="mt-6 bg-[#124B34] hover:bg-[#0c3323] text-white rounded-xl py-3 font-semibold text-center transition shadow"
                >
                  Manage System
                </Link>
              </div>
            </section>

            {/* Quick Metrics */}
            <section className="grid grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-[#124B34]">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Users</p>
                  <h4 className="text-2xl font-bold text-gray-900 mt-1">
                    {loadingStats ? "..." : totalUsers !== null ? totalUsers : "—"}
                  </h4>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-800">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Administrators</p>
                  <h4 className="text-2xl font-bold text-gray-900 mt-1">
                    {loadingStats ? "..." : totalUsers !== null ? adminCount : "—"}
                  </h4>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-700">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Standard Accounts</p>
                  <h4 className="text-2xl font-bold text-gray-900 mt-1">
                    {loadingStats ? "..." : totalUsers !== null ? userCount : "—"}
                  </h4>
                </div>
              </div>
            </section>

            {/* Services (Admin Actions) */}
            <section>
              <h2 className="text-2xl font-bold text-green-900 mb-6">
                Administrative Utilities
              </h2>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-3xl p-6 hover:shadow-md transition border border-gray-100 flex flex-col justify-between min-h-[180px]">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-[#124B34]">
                      <Users size={22} />
                    </div>
                    <h3 className="font-bold text-lg mt-4 text-green-950">User Registry</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      Add new accounts, edit role permissions, search user profiles, and delete inactive entries.
                    </p>
                  </div>
                  <Link href="/admin" className="text-sm font-semibold text-green-900 mt-4 hover:underline">
                    Access Registry →
                  </Link>
                </div>

                <div className="bg-white rounded-3xl p-6 hover:shadow-md transition border border-gray-100 flex flex-col justify-between min-h-[180px]">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-[#124B34]">
                      <Database size={22} />
                    </div>
                    <h3 className="font-bold text-lg mt-4 text-green-950">System Logs</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      Monitor server response latency, database queries, image upload histories, and API requests.
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-400 mt-4 cursor-not-allowed">
                    View Logs (Unavailable)
                  </span>
                </div>

                <div className="bg-white rounded-3xl p-6 hover:shadow-md transition border border-gray-100 flex flex-col justify-between min-h-[180px]">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-[#124B34]">
                      <Settings size={22} />
                    </div>
                    <h3 className="font-bold text-lg mt-4 text-green-950">System Configurations</h3>
                    <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
                      Modify global environment constants, JWT expiration ranges, database fallback properties, and limits.
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-gray-400 mt-4 cursor-not-allowed">
                    Settings Panel (Unavailable)
                  </span>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* ==============================================
             USER DASHBOARD CONTENT
             ============================================== */
          <div>
            {/* Hero Section */}
            <section className="grid grid-cols-12 gap-6">
              {/* Welcome Card */}
              <div className="col-span-8 bg-[#124B34] rounded-3xl overflow-hidden relative">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1511497584788-876760111969?w=1200')] bg-cover bg-center" />

                <div className="relative p-8">
                  <h2 className="text-white text-4xl font-bold mb-4">
                    Welcome back, {user?.fullName?.split(" ")[0] || "Jessica"}!
                  </h2>

                  <p className="text-green-100 max-w-md text-sm">
                    "The greatest threat to our planet is the belief
                    that someone else will save it."
                  </p>

                  <p className="text-green-300 mt-2 text-sm">
                    — Robert Swan
                  </p>

                  <div className="mt-10 inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
                    <Leaf size={22} className="text-green-300" />

                    <div>
                      <p className="text-xs text-green-100">
                        PERSONAL IMPACT
                      </p>

                      <p className="text-white font-bold text-lg">
                        42.5 kg CO₂ saved
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Waste Management Card */}
              <div className="col-span-4 bg-[#E9D9A7] rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-yellow-200 flex items-center justify-center">
                    ♻️
                  </div>

                  <h3 className="font-bold text-2xl mt-4 text-green-900">
                    Why Waste Management Matters?
                  </h3>

                  <p className="text-sm text-gray-700 mt-4 leading-relaxed">
                    Proper waste management reduces pollution,
                    conserves natural resources, and protects
                    biodiversity. Every item sorted correctly is a
                    step toward a circular economy.
                  </p>
                </div>

                <button className="mt-6 bg-green-900 text-white rounded-xl py-3 font-medium">
                  Learn More
                </button>
              </div>
            </section>

            {/* Services */}
            <section className="mt-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-green-900">
                  My Services
                </h2>

                <button className="text-sm text-green-900 font-medium">
                  Manage Apps →
                </button>
              </div>

              <div className="grid grid-cols-4 gap-6">
                <ServiceCard
                  icon={<Search size={22} />}
                  title="Smart Sort"
                  description="AI-powered recognition to help you sort waste instantly."
                />

                <ServiceCard
                  icon={<BookOpen size={22} />}
                  title="Blog"
                  description="Stories from the field and local sustainability news."
                />

                <ServiceCard
                  icon={<Lightbulb size={22} />}
                  title="Tips"
                  description="Daily bite-sized advice for a zero-waste lifestyle."
                />

                <ServiceCard
                  icon={<MessageCircle size={22} />}
                  title="Feedback"
                  description="Tell us how we can improve the neighborhood service."
                />
              </div>
            </section>

            {/* Bottom Section */}
            <section className="grid grid-cols-12 gap-6 mt-12">
              {/* Stories */}
              <div className="col-span-6">
                <h2 className="font-bold text-2xl text-green-900 mb-4">
                  Recent Stories
                </h2>

                <div className="bg-white rounded-3xl overflow-hidden shadow-sm">
                  <img
                    src="https://images.unsplash.com/photo-1618477462146-050d2767eac4?w=1200"
                    alt="story"
                    className="w-full h-52 object-cover"
                  />

                  <div className="p-5">
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                      COMMUNITY SPOTLIGHT
                    </span>

                    <h3 className="font-bold text-xl mt-3">
                      The Green Street Project Success
                    </h3>

                    <p className="text-black-600 text-sm mt-2">
                      See how 50 households in Green Street
                      achieved a 90% recycling rate in just three
                      months using BinBuddy.
                    </p>

                    <div className="flex justify-between mt-4 text-sm">
                      <span>By Amanda Root</span>
                      <span>5 min read</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Optimization Hub */}
              <div className="col-span-6">
                <h2 className="font-bold text-2xl text-green-900 mb-4">
                  Optimization Hub
                </h2>

                <div className="bg-[#124B34] text-white rounded-3xl p-8 h-[350px] flex flex-col justify-between">
                  <div>
                    <h3 className="text-5xl font-bold">
                      14.2 Tons
                    </h3>

                    <p className="text-green-200 mt-2">
                      Estimated Annual Carbon Savings in your
                      area.
                    </p>

                    <div className="mt-10 space-y-5">
                      <div className="flex items-center gap-3">
                        <Recycle size={18} />
                        <span>
                          Recycling volume increased by 20%
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Leaf size={18} />
                        <span>
                          Fuel efficiency improved by 15%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <div className="bg-white/10 rounded-full p-5">
                      <ArrowDown size={40} />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
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
    <div className="bg-white rounded-2xl p-6 hover:shadow-md transition">
      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-900">
        {icon}
      </div>

      <h3 className="font-bold text-lg mt-4 text-green-900">
        {title}
      </h3>

      <p className="text-sm text-gray-700 mt-2">
        {description}
      </p>
    </div>
  );
}