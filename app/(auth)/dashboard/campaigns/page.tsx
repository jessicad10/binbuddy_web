"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { getCampaigns, toggleInterest, getInterestedUsers, createCampaign, updateRespondentStatus } from "@/lib/api/campaign";
import { ArrowLeft, Calendar, MapPin, Clock, Users, Plus, X, Star, Sparkles, RefreshCw, Info, ShieldAlert } from "lucide-react";
import Header from "@/app/(auth)/_components/Header";
import Footer from "@/app/(auth)/_components/Footer";

export default function CampaignsPage() {
  const { user, token, loading: authLoading } = useAuth();

  // Campaigns list state
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Admin: View Interested Users Modal state
  const [selectedCampaignForUsers, setSelectedCampaignForUsers] = useState<any | null>(null);
  const [interestedUsersList, setInterestedUsersList] = useState<any[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState("");

  // Admin: Create Campaign Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newOrganizer, setNewOrganizer] = useState("");
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const isAdmin = user?.role === "admin";

  const fetchCampaignsList = async () => {
    if (!token) return;
    setIsLoading(true);
    setError("");
    try {
      const response = await getCampaigns(token);
      if (response.success && response.data) {
        setCampaigns(response.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load campaigns");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCampaignsList();
    }
  }, [token]);

  const handleToggleInterest = async (campaignId: string) => {
    if (!token) return;
    try {
      const response = await toggleInterest(campaignId, token);
      if (response.success) {
        // Update local campaigns state immediately
        setCampaigns((prev) =>
          prev.map((c) => (c._id === campaignId ? response.data : c))
        );

        // If the admin is currently viewing this campaign's respondents, reload them
        if (selectedCampaignForUsers && selectedCampaignForUsers._id === campaignId) {
          handleViewRespondents(response.data);
        }
      }
    } catch (err: any) {
      alert(err.message || "Failed to update interest status");
    }
  };

  const handleViewRespondents = async (campaign: any) => {
    if (!token) return;
    setSelectedCampaignForUsers(campaign);
    setIsLoadingUsers(true);
    setUsersError("");
    setInterestedUsersList([]);
    try {
      const response = await getInterestedUsers(campaign._id, token);
      if (response.success && response.data) {
        setInterestedUsersList(response.data);
      }
    } catch (err: any) {
      setUsersError(err.message || "Failed to load interested users list");
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleUpdateStatus = async (userId: string, status: "approved" | "denied") => {
    if (!token || !selectedCampaignForUsers) return;
    try {
      const response = await updateRespondentStatus(
        selectedCampaignForUsers._id,
        userId,
        status,
        token
      );
      if (response.success) {
        // Update main list status count
        setCampaigns((prev) =>
          prev.map((c) => (c._id === selectedCampaignForUsers._id ? response.data : c))
        );
        // Refresh modal list details
        await handleViewRespondents(response.data);
      }
    } catch (err: any) {
      alert(err.message || "Failed to update respondent status");
    }
  };

  const handleCreateCampaignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");

    if (!newTitle.trim() || !newDescription.trim() || !newLocation.trim() || !newDate.trim() || !newTime.trim()) {
      setCreateError("All fields except organizer are required");
      return;
    }

    setIsCreating(true);
    try {
      if (!token) throw new Error("No session token found");
      const response = await createCampaign(
        {
          title: newTitle,
          description: newDescription,
          location: newLocation,
          date: newDate,
          time: newTime,
          organizer: newOrganizer || undefined,
        },
        token
      );

      if (response.success) {
        setShowCreateModal(false);
        // Clear fields
        setNewTitle("");
        setNewDescription("");
        setNewLocation("");
        setNewDate("");
        setNewTime("");
        setNewOrganizer("");
        // Reload campaigns list
        await fetchCampaignsList();
      }
    } catch (err: any) {
      setCreateError(err.message || "Failed to create campaign");
    } finally {
      setIsCreating(false);
    }
  };

  const isUserInterested = (campaign: any) => {
    if (!user || !campaign.interestedUsers) return false;
    return campaign.interestedUsers.some((item: any) => 
      (typeof item.user === "object" && item.user ? item.user._id === user.id : item.user === user.id)
    );
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
      <div className="flex-grow max-w-7xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-green-950 hover:text-green-700 font-semibold transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>

        {/* Hero Section */}
        <header className="bg-[#124B34] text-white rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200')] bg-cover bg-center" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-1 bg-white/10 text-green-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold mb-4 border border-white/15">
                <Sparkles size={14} className="text-yellow-400" />
                Community Eco Campaigns
              </span>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Kathmandu Valley Green Drives
              </h1>
              <p className="mt-4 text-green-100 text-sm md:text-base max-w-xl">
                Explore local environmental campaigns, plantation drives, and cleanliness programs taking place inside Kathmandu Valley. Click "Interested" to register your support!
              </p>
            </div>

            {isAdmin && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-yellow-500 hover:bg-yellow-600 text-green-950 font-bold px-6 py-3 rounded-xl shadow transition duration-200 flex items-center gap-2 shrink-0 cursor-pointer text-sm"
              >
                <Plus size={18} />
                Create Campaign
              </button>
            )}
          </div>
        </header>

        {/* Main Grid content */}
        {isLoading ? (
          <div className="text-center py-20">
            <RefreshCw className="animate-spin text-green-900 w-12 h-12 mx-auto mb-4" />
            <p className="text-green-900 font-semibold">Loading Valley Campaigns...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-3xl max-w-lg mx-auto text-center shadow-sm">
            <Info size={36} className="mx-auto text-red-500 mb-3" />
            <h3 className="font-bold text-lg">Failed to load campaigns</h3>
            <p className="text-sm mt-1 mb-4">{error}</p>
            <button
              onClick={fetchCampaignsList}
              className="bg-red-650 hover:bg-red-750 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
            >
              Retry Connection
            </button>
          </div>
        ) : campaigns.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {campaigns.map((item) => {
              const isInterested = isUserInterested(item);
              const respondentCount = item.interestedUsers?.length || 0;
              return (
                <article
                  key={item._id}
                  className="bg-white rounded-3xl border border-gray-150 shadow-sm hover:shadow-md transition duration-300 overflow-hidden flex flex-col"
                >
                  {/* Campaign Header */}
                  <div className="bg-green-50 p-6 border-b border-gray-100 relative">
                    <div className="flex justify-between items-start gap-3">
                      <span className="bg-green-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-700 uppercase">
                        {item.organizer || "BinBuddy Event"}
                      </span>

                      {isAdmin && (
                        <span className="bg-[#124B34] text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-0.5">
                          <ShieldAlert size={8} />
                          Admin View
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-green-950 mt-4 leading-snug">
                      {item.title}
                    </h3>
                  </div>

                  {/* Body Info */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta Specs */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                          <MapPin size={14} className="text-green-800 shrink-0" />
                          <span className="font-medium truncate">{item.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                          <Calendar size={14} className="text-green-800 shrink-0" />
                          <span>{item.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-700">
                          <Clock size={14} className="text-green-800 shrink-0" />
                          <span>{item.time}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-gray-700 leading-relaxed line-clamp-4 mt-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-gray-100 pt-5 mt-6 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Users size={14} className="text-gray-400" />
                          <span className="font-bold text-gray-700">{respondentCount}</span>
                          <span>Interested</span>
                        </div>

                        <button
                          onClick={() => handleToggleInterest(item._id)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            isInterested
                              ? "bg-green-900 text-white border-green-900"
                              : "bg-white text-green-900 border-green-900 hover:bg-green-50"
                          }`}
                        >
                          <Star size={12} fill={isInterested ? "white" : "none"} />
                          {isInterested ? "Interested!" : "Mark Interested"}
                        </button>
                      </div>

                      {/* Admin view responses */}
                      {isAdmin && (
                        <button
                          onClick={() => handleViewRespondents(item)}
                          className="w-full mt-1 bg-yellow-50 hover:bg-yellow-100 text-green-950 font-bold border border-yellow-350 py-2 rounded-xl text-[11px] transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Users size={12} />
                          Manage Respondent List ({respondentCount})
                        </button>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-150 shadow-sm max-w-lg mx-auto">
            <Users size={48} className="text-green-800 mx-auto opacity-40 mb-4" />
            <h3 className="text-lg font-bold text-green-900">No Campaigns Found</h3>
            <p className="text-gray-500 text-sm mt-2 px-6">
              There are no current environmental campaigns scheduled inside Kathmandu Valley. Check back soon or click the add button if you're an admin!
            </p>
          </div>
        )}
      </div>

      {/* Admin: View Interested Users Modal */}
      {selectedCampaignForUsers && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-green-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[85vh] flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-[#124B34] text-white p-6 flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-green-300">Campaign Respondents</span>
                <h3 className="text-lg font-bold truncate max-w-md">{selectedCampaignForUsers.title}</h3>
              </div>
              <button
                onClick={() => setSelectedCampaignForUsers(null)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Respondent list */}
            <div className="overflow-y-auto p-6 flex-1">
              {isLoadingUsers ? (
                <div className="text-center py-10">
                  <RefreshCw className="animate-spin text-green-900 w-8 h-8 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Retrieving respondent database...</p>
                </div>
              ) : usersError ? (
                <div className="bg-red-50 text-red-800 p-4 rounded-xl text-xs border border-red-150">
                  {usersError}
                </div>
              ) : interestedUsersList.length > 0 ? (
                <div className="space-y-3.5">
                  {interestedUsersList.map((usr: any, index: number) => {
                    const status = usr.campaignStatus || "pending";
                    return (
                      <div
                        key={usr._id || index}
                        className="bg-[#F3F0DE]/40 border border-gray-200/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-green-150 flex items-center justify-center font-bold text-green-900 text-sm shrink-0">
                            {usr.fullName ? usr.fullName.charAt(0) : "U"}
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-gray-800">{usr.fullName}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">{usr.email}</p>
                            {/* Render Status Badge */}
                            <span
                              className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded mt-1.5 uppercase ${
                                status === "approved"
                                  ? "bg-green-100 text-green-800 border border-green-200"
                                  : status === "denied"
                                  ? "bg-red-100 text-red-850 border border-red-200"
                                  : "bg-yellow-100 text-yellow-800 border border-yellow-200"
                              }`}
                            >
                              {status}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-200/50">
                          {/* Info tags with placeholder defaults fully removed */}
                          <div className="text-left sm:text-right text-xs text-gray-600">
                            {usr.contactNumber && <p className="font-medium">{usr.contactNumber}</p>}
                            {usr.gender && <p className="text-[10px] text-gray-400 capitalize mt-0.5">{usr.gender}</p>}
                          </div>

                          {/* Approval / Denial buttons */}
                          {status === "pending" ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateStatus(usr._id, "approved")}
                                className="bg-green-700 hover:bg-green-800 text-white font-bold px-3 py-2 rounded-xl text-[10px] transition cursor-pointer shadow-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(usr._id, "denied")}
                                className="bg-red-600 hover:bg-red-700 text-white font-bold px-3 py-2 rounded-xl text-[10px] transition cursor-pointer shadow-sm"
                              >
                                Deny
                              </button>
                            </div>
                          ) : (
                            <div className="text-xs font-semibold text-gray-400 italic">
                              Decided
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <Star size={36} className="mx-auto mb-2 opacity-30" />
                  <h4 className="font-bold text-sm text-gray-600">No responses yet</h4>
                  <p className="text-xs text-gray-400 mt-0.5">No users have marked this Kathmandu Valley campaign as interested yet.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 border-t border-gray-150 p-4 flex justify-end">
              <button
                onClick={() => setSelectedCampaignForUsers(null)}
                className="bg-[#124B34] hover:bg-green-950 text-white font-bold py-2 px-6 rounded-xl text-xs transition cursor-pointer"
              >
                Close List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin: Create Campaign Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-green-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-[#124B34] text-white p-6 flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-green-300">System Administration</span>
                <h3 className="text-lg font-bold">Add Kathmandu Campaign</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form content */}
            <form onSubmit={handleCreateCampaignSubmit} className="overflow-y-auto p-6 flex-1 space-y-5">
              {createError && (
                <div className="bg-red-50 text-red-850 p-4 rounded-xl text-xs border border-red-150">
                  {createError}
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-black mb-1.5 uppercase">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-2.5 px-4 text-xs text-black caret-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition"
                  placeholder="e.g. Kathmandu Cleanliness Program 🗑️"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-bold text-black mb-1.5 uppercase">Valley Location / Area</label>
                <input
                  type="text"
                  required
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-2.5 px-4 text-xs text-black caret-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition"
                  placeholder="e.g. Bagmati River Bank, Kathmandu"
                />
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-black mb-1.5 uppercase">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-2.5 px-4 text-xs text-black caret-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-black mb-1.5 uppercase">Time / Duration</label>
                  <input
                    type="text"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 py-2.5 px-4 text-xs text-black caret-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition"
                    placeholder="e.g. 07:00 AM - 10:00 AM"
                  />
                </div>
              </div>

              {/* Organizer */}
              <div>
                <label className="block text-xs font-bold text-black mb-1.5 uppercase">Organizer Name (Optional)</label>
                <input
                  type="text"
                  value={newOrganizer}
                  onChange={(e) => setNewOrganizer(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-2.5 px-4 text-xs text-black caret-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition"
                  placeholder="Defaults to BinBuddy Team"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-black mb-1.5 uppercase">Detailed Description</label>
                <textarea
                  required
                  rows={4}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-2.5 px-4 text-xs text-black caret-green-900 focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition resize-none"
                  placeholder="Provide info on assembling point, items to bring, and expectations..."
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="w-1/2 bg-[#124B34] hover:bg-green-950 text-white font-bold py-2.5 rounded-xl text-xs transition disabled:opacity-50 cursor-pointer"
                >
                  {isCreating ? "Adding..." : "Add Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </main>
  );
}
