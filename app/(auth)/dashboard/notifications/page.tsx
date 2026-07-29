"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { getNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from "@/lib/api/notification";
import { ArrowLeft, Bell, BookOpen, Lightbulb, Recycle, Lock, Eye, Trash2, CheckSquare, RefreshCw, Info } from "lucide-react";
import Header from "@/app/(auth)/_components/Header";
import Footer from "@/app/(auth)/_components/Footer";

interface NotificationItem {
  _id: string;
  id?: string;
  title: string;
  message: string;
  category: "blog" | "tip" | "milestone" | "password" | "campaign";
  createdAt: string;
  read: boolean;
}

export default function NotificationsPage() {
  const { token, loading: authLoading } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const categories = ["All", "System Updates", "Milestones", "Security", "Campaigns"];

  const loadNotifications = async () => {
    if (!token) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await getNotifications(token);
      if (response.success && response.data) {
        setNotifications(response.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadNotifications();
    }
  }, [token]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      if (activeFilter === "All") return true;
      if (activeFilter === "System Updates") return notif.category === "blog" || notif.category === "tip";
      if (activeFilter === "Milestones") return notif.category === "milestone";
      if (activeFilter === "Security") return notif.category === "password";
      if (activeFilter === "Campaigns") return notif.category === "campaign";
      return true;
    });
  }, [notifications, activeFilter]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  const handleMarkAsRead = async (id: string) => {
    if (!token) return;
    try {
      await markNotificationRead(id, token);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err: any) {
      alert(err.message || "Failed to mark notification as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!token) return;
    try {
      await markAllNotificationsRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err: any) {
      alert(err.message || "Failed to mark all notifications as read");
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await deleteNotification(id, token);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err: any) {
      alert(err.message || "Failed to delete notification");
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "blog":
        return <BookOpen size={18} className="text-blue-600" />;
      case "tip":
        return <Lightbulb size={18} className="text-yellow-600" />;
      case "milestone":
        return <Recycle size={18} className="text-green-600" />;
      case "password":
        return <Lock size={18} className="text-purple-600" />;
      case "campaign":
        return <Info size={18} className="text-emerald-600" />;
      default:
        return <Bell size={18} className="text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "blog":
        return "bg-blue-50 border-blue-200";
      case "tip":
        return "bg-yellow-50 border-yellow-200";
      case "milestone":
        return "bg-green-50 border-green-200";
      case "password":
        return "bg-purple-50 border-purple-200";
      case "campaign":
        return "bg-emerald-50 border-emerald-200";
      default:
        return "bg-gray-50 border-gray-250";
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F3F0DE] flex flex-col items-center justify-center">
        <RefreshCw className="animate-spin text-green-900 w-12 h-12" />
        <p className="mt-4 text-green-900 font-semibold">Loading session details...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F0DE] font-sans flex flex-col">
      <Header />
      <div className="flex-grow max-w-4xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-green-900 hover:text-green-700 font-semibold transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>

        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-green-950 flex items-center gap-3">
              <Bell className="text-green-900" />
              Notifications
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-bounce">
                  {unreadCount} New
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-700 mt-2">
              Stay updated with waste collection alerts, system announcements, and personal green achievements.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm cursor-pointer"
            >
              <CheckSquare size={14} />
              Mark all as read
            </button>
          )}
        </header>

        {/* Filter Controls */}
        <section className="bg-white rounded-3xl p-5 shadow-sm border border-gray-150 mb-8 flex flex-wrap gap-2 justify-center sm:justify-start">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeFilter === category
                  ? "bg-[#124B34] text-white shadow-sm"
                  : "bg-[#F3F0DE] text-green-900 hover:bg-green-100"
              }`}
            >
              {category}
            </button>
          ))}
        </section>

        {/* Notification List */}
        {isLoading ? (
          <div className="text-center py-20">
            <RefreshCw className="animate-spin text-green-900 w-12 h-12 mx-auto mb-4" />
            <p className="text-green-900 font-semibold">Loading Notifications...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-3xl text-center shadow-sm">
            <h3 className="font-bold text-lg">Failed to load notifications</h3>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <section className="space-y-4">
            {filteredNotifications.map((item) => (
              <div
                key={item._id}
                className={`border rounded-3xl p-5 shadow-sm transition duration-300 flex items-start gap-4 ${
                  item.read
                    ? "bg-white border-gray-150"
                    : "bg-green-50/40 border-green-200 ring-1 ring-green-100"
                }`}
              >
                {/* Visual Icon */}
                <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center shrink-0 ${getCategoryIcon(item.category) && getCategoryColor(item.category)}`}>
                  {getCategoryIcon(item.category)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className={`text-base font-bold leading-tight ${item.read ? "text-gray-800 font-semibold" : "text-green-950 font-bold"}`}>
                      {item.title}
                    </h3>
                    
                    <span className="text-[10px] text-gray-400 font-medium shrink-0">
                      {new Date(item.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <p className="text-xs text-gray-700 leading-relaxed mt-2.5">
                    {item.message}
                  </p>

                  {/* Actions Row */}
                  <div className="flex items-center gap-3 mt-4 border-t border-gray-100/60 pt-3">
                    {!item.read && (
                      <button
                        onClick={() => handleMarkAsRead(item._id)}
                        className="flex items-center gap-1 text-[10px] font-bold text-green-800 hover:text-green-950 transition cursor-pointer"
                      >
                        <Eye size={12} />
                        Mark as read
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-red-600 transition ml-auto cursor-pointer"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </section>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-150 shadow-sm max-w-lg mx-auto">
            <Bell size={48} className="text-green-800 mx-auto opacity-40 mb-4" />
            <h3 className="text-lg font-bold text-green-900">No Notifications</h3>
            <p className="text-gray-500 text-sm mt-2 px-6">
              You're all caught up! No notifications found matching the active filter tab "{activeFilter}".
            </p>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
