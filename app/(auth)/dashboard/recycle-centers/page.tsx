"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { createPickupRequest } from "@/lib/api/pickup";
import { getRecycleCenters } from "@/lib/api/recycle-center";
import Header from "@/app/(auth)/_components/Header";
import Footer from "@/app/(auth)/_components/Footer";
import { ArrowLeft, MapPin, Clock, Phone, Send, RefreshCw, CheckCircle, AlertTriangle, Sparkles, Building } from "lucide-react";

interface RecycleCenter {
  _id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  acceptedWaste: string[];
  description: string;
  status: "active" | "inactive";
}

export default function RecycleCentersPage() {
  const { user, token, loading: authLoading } = useAuth();
  
  // Data state
  const [centers, setCenters] = useState<RecycleCenter[]>([]);
  const [loadingCenters, setLoadingCenters] = useState(true);
  const [centersError, setCentersError] = useState("");

  // Filter states
  const [selectedCity, setSelectedCity] = useState<string>("All");

  // Modal states
  const [activeCenter, setActiveCenter] = useState<RecycleCenter | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [wasteType, setWasteType] = useState("Plastic");
  const [quantity, setQuantity] = useState("5 kg");
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const loadCenters = async () => {
    if (!token) return;
    setLoadingCenters(true);
    setCentersError("");
    try {
      const response = await getRecycleCenters(token, { status: "active" });
      if (response.success && response.data) {
        setCenters(response.data);
      } else {
        setCentersError(response.message || "Failed to load recycling centers");
      }
    } catch (err: any) {
      setCentersError(err.message || "An error occurred while loading recycling centers");
    } finally {
      setLoadingCenters(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadCenters();
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      if (user.contactNumber) {
        setPhone(user.contactNumber);
      }
    }
  }, [user]);

  // Set default preferred date to tomorrow
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const yyyy = tomorrow.getFullYear();
    const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const dd = String(tomorrow.getDate()).padStart(2, '0');
    setPreferredDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  const handleOpenPickupModal = (center: RecycleCenter) => {
    setActiveCenter(center);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleCloseModal = () => {
    setActiveCenter(null);
    setNotes("");
  };

  const handleSubmitPickup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!token) {
      setErrorMsg("Session expired. Please log in again.");
      return;
    }
    if (!phone.trim()) {
      setErrorMsg("Phone number is required");
      return;
    }
    if (!pickupAddress.trim()) {
      setErrorMsg("Pickup address is required");
      return;
    }
    if (!quantity.trim()) {
      setErrorMsg("Estimated quantity is required");
      return;
    }
    if (!preferredDate) {
      setErrorMsg("Preferred pickup date is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        fullName,
        email,
        phone,
        pickupAddress,
        centerName: activeCenter?.name || "General Recycle Center",
        wasteType,
        quantity,
        preferredDate,
        notes
      };

      const result = await createPickupRequest(token, payload);
      if (result.success) {
        setSuccessMsg("Your pickup request has been submitted successfully. The recycling center will contact you soon.");
      } else {
        setErrorMsg(result.message || "Failed to submit request");
      }
    } catch (e: any) {
      setErrorMsg(e.message || "An error occurred while submitting request");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCenters = centers.filter((c) => {
    return selectedCity === "All" || c.city === selectedCity;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F3F0DE] flex flex-col items-center justify-center">
        <RefreshCw className="animate-spin text-green-900 w-12 h-12" />
        <p className="mt-4 text-green-900 font-semibold">Loading Recycle Centers...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F0DE] flex flex-col font-sans">
      <Header />

      <div className="flex-grow max-w-7xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-green-900 hover:text-green-700 font-semibold transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>

        {/* Hero Section */}
        <header className="bg-[#124B34] text-white rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-15 bg-[url('https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=1200')] bg-cover bg-center" />
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1 bg-white/10 text-green-300 text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold mb-4 border border-white/15">
              <Sparkles size={14} className="text-yellow-400" />
              Recycling Networks
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Recycling Centers & Pickups
            </h1>
            <p className="mt-4 text-green-100 text-sm md:text-base max-w-xl">
              Locate authorized recycling collection plants inside Kathmandu Valley. Click "Request Pickup" to schedule doorstep waste reclamation.
            </p>
          </div>
        </header>

        {/* Filters */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-150 mb-12 flex flex-col md:flex-row gap-6 justify-between items-center">
          <div className="flex flex-wrap gap-2 justify-center md:justify-start w-full md:w-auto">
            {["All", "Kathmandu", "Lalitpur", "Bhaktapur"].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer ${
                  selectedCity === city
                    ? "bg-[#124B34] text-white shadow-sm"
                    : "bg-[#F3F0DE] text-green-900 hover:bg-green-100"
                }`}
              >
                {city === "All" ? "All Locations" : city}
              </button>
            ))}
          </div>
          <div className="text-xs text-gray-500 font-semibold">
            Showing {filteredCenters.length} centers in the valley
          </div>
        </section>

        {/* Centers Grid */}
        {loadingCenters ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-gray-100">
            <RefreshCw className="animate-spin text-green-900 w-12 h-12" />
            <p className="mt-4 text-green-900 font-semibold text-sm">Querying database...</p>
          </div>
        ) : centersError ? (
          <div className="bg-red-50 border border-red-200 text-red-800 rounded-3xl p-8 text-center flex flex-col items-center justify-center max-w-xl mx-auto shadow-sm">
            <AlertTriangle className="text-red-650 w-12 h-12 mb-4" />
            <h3 className="font-bold text-lg">Failed to load recycling centers</h3>
            <p className="text-sm mt-1 mb-4">{centersError}</p>
            <button
              onClick={loadCenters}
              className="bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : filteredCenters.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-150 shadow-sm max-w-md mx-auto">
            <Building size={48} className="text-green-800 mx-auto opacity-40 mb-4" />
            <h3 className="text-lg font-bold text-green-900">No centers found</h3>
            <p className="text-gray-500 text-sm mt-2 px-6">
              We couldn't find any active recycling centers listed in {selectedCity === "All" ? "Kathmandu Valley" : selectedCity} right now.
            </p>
          </div>
        ) : (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredCenters.map((center) => (
              <article
                key={center._id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 p-8 flex flex-col justify-between hover:shadow-md transition duration-300 group"
              >
                <div>
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <h3 className="font-extrabold text-xl text-green-950 group-hover:text-green-800 transition">
                      {center.name}
                    </h3>
                    <span className="bg-green-50 text-[#124B34] text-[10px] font-bold px-3 py-1 rounded-full border border-green-200 uppercase tracking-wider shrink-0">
                      {center.city}
                    </span>
                  </div>

                  <p className="text-gray-700 text-xs leading-relaxed mb-6">
                    {center.description}
                  </p>

                  {/* Waste Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {center.acceptedWaste.map((item) => (
                      <span
                        key={item}
                        className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2.5 py-1 rounded-lg"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Details list */}
                  <div className="space-y-2 border-t border-gray-100 pt-4 mb-6 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-green-800 shrink-0" />
                      <span>{center.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-green-800 shrink-0" />
                      <span>{center.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-green-800 shrink-0" />
                      <span>{center.phone}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleOpenPickupModal(center)}
                  className="w-full bg-[#0B2717] hover:bg-green-950 text-white font-bold py-3 rounded-xl text-sm transition cursor-pointer shadow-sm hover:shadow"
                >
                  Request Pickup
                </button>
              </article>
            ))}
          </section>
        )}
      </div>

      {/* REQUEST PICKUP MODAL */}
      {activeCenter && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scaleIn flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-150 flex justify-between items-center bg-[#0B2717] text-white">
              <div className="flex items-center gap-2">
                <Building size={20} className="text-green-300" />
                <div>
                  <h3 className="font-extrabold text-base">Schedule Trash Pickup</h3>
                  <p className="text-[10px] text-green-200 mt-0.5">Facility: {activeCenter.name}</p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-green-200 text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>

            {successMsg ? (
              /* Success Panel */
              <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
                <CheckCircle className="text-green-600 w-16 h-16 animate-pulse" />
                <h4 className="font-bold text-lg text-green-950">Request Submitted!</h4>
                <p className="text-xs text-gray-700 max-w-sm leading-relaxed">
                  {successMsg}
                </p>
                <button
                  onClick={handleCloseModal}
                  className="w-full bg-[#0B2717] hover:bg-green-950 text-white font-bold py-3 rounded-xl text-sm transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Form Panel */
              <form onSubmit={handleSubmitPickup} className="flex-1 overflow-y-auto max-h-[70vh]">
                <div className="p-6 space-y-4">
                  {errorMsg && (
                    <div className="bg-red-50 text-red-855 p-4 rounded-xl border border-red-150 text-xs font-semibold flex items-center gap-2">
                      <AlertTriangle size={14} className="shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                    />
                  </div>

                  {/* Phone & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 98XXXXXXXX"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Preferred Pickup Date
                      </label>
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Pickup Address
                    </label>
                    <input
                      type="text"
                      required
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="Street name, house number, area description"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                    />
                  </div>

                  {/* Waste Type & Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Waste Type
                      </label>
                      <select
                        value={wasteType}
                        onChange={(e) => setWasteType(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                      >
                        <option value="Plastic">Plastic</option>
                        <option value="Paper">Paper</option>
                        <option value="Cardboard">Cardboard</option>
                        <option value="Glass">Glass</option>
                        <option value="Metal">Metal</option>
                        <option value="E-Waste">E-Waste</option>
                        <option value="Batteries">Batteries</option>
                        <option value="Mixed">Mixed Waste</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Estimated Quantity
                      </label>
                      <input
                        type="text"
                        required
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="e.g. 10 kg, 3 bags, etc."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Provide directions or specify details..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm resize-none"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="p-6 border-t border-gray-150 bg-gray-50 flex gap-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3.5 rounded-xl text-sm transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-1/2 flex items-center justify-center gap-2 bg-[#0B2717] hover:bg-green-950 text-white font-bold py-3.5 rounded-xl text-sm transition disabled:opacity-50 cursor-pointer shadow"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="animate-spin" size={16} />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={14} />
                        Send Request
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
