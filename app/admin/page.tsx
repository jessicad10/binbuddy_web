"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from "@/lib/api/admin-users";
import {
  getRecycleCenters,
  createRecycleCenter,
  updateRecycleCenter,
  deleteRecycleCenter,
} from "@/lib/api/recycle-center";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  LogOut,
  Truck,
  Calendar,
  MapPin,
  Building,
  User,
  Inbox,
  Eye,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/app/(auth)/_components/Header";
import Footer from "@/app/(auth)/_components/Footer";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { getAllPickupRequests, updatePickupRequestStatus } from "@/lib/api/pickup";

// Zod schemas for validation
const createUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["admin", "user"]),
  contactNumber: z.string().optional().or(z.literal("")),
  gender: z.enum(["Male", "Female", "Other", ""]).optional(),
});

const updateUserSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .optional()
    .or(z.literal("")),
  role: z.enum(["admin", "user"]),
  contactNumber: z.string().optional().or(z.literal("")),
  gender: z.enum(["Male", "Female", "Other", ""]).optional(),
});

type CreateUserInput = z.infer<typeof createUserSchema>;
type UpdateUserInput = z.infer<typeof updateUserSchema>;

interface UserType {
  _id: string;
  fullName: string;
  email: string;
  role: "admin" | "user";
  contactNumber?: string;
  gender?: "Male" | "Female" | "Other" | "";
  profileImage?: string;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const { user: currentUser, token, logout } = useAuth();
  const router = useRouter();

  // State Management
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination and Search State
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  // Tab Management
  const [activeTab, setActiveTab] = useState<"users" | "pickups" | "recycle-centers">("users");

  // Pickups State
  const [pickups, setPickups] = useState<any[]>([]);
  const [pickupsLoading, setPickupsLoading] = useState(false);
  const [pickupsError, setPickupsError] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  // Recycling Centers State
  const [centers, setCenters] = useState<any[]>([]);
  const [centersLoading, setCentersLoading] = useState(false);
  const [centersError, setCentersError] = useState<string | null>(null);
  const [centersSearch, setCentersSearch] = useState("");

  // Recycle Center form states
  const [rcName, setRcName] = useState("");
  const [rcCity, setRcCity] = useState("Kathmandu");
  const [rcAddress, setRcAddress] = useState("");
  const [rcPhone, setRcPhone] = useState("");
  const [rcEmail, setRcEmail] = useState("");
  const [rcHours, setRcHours] = useState("");
  const [rcWaste, setRcWaste] = useState<string[]>([]);
  const [rcDesc, setRcDesc] = useState("");
  const [rcStatus, setRcStatus] = useState<"active" | "inactive">("active");
  const [selectedCenter, setSelectedCenter] = useState<any | null>(null);

  // Fetch all pickup requests
  const fetchPickups = async () => {
    if (!token) return;
    setPickupsLoading(true);
    setPickupsError(null);
    try {
      const response = await getAllPickupRequests(token);
      if (response.success) {
        setPickups(response.data);
      } else {
        setPickupsError(response.message || "Failed to fetch pickup requests");
      }
    } catch (err: any) {
      setPickupsError(err.message || "An error occurred while loading pickups");
    } finally {
      setPickupsLoading(false);
    }
  };

  // Fetch all recycling centers
  const fetchCenters = async () => {
    if (!token) return;
    setCentersLoading(true);
    setCentersError(null);
    try {
      const response = await getRecycleCenters(token);
      if (response.success) {
        setCenters(response.data);
      } else {
        setCentersError(response.message || "Failed to load recycling centers");
      }
    } catch (err: any) {
      setCentersError(err.message || "An error occurred while loading recycling centers");
    } finally {
      setCentersLoading(false);
    }
  };

  // Check query parameter on load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "pickups") {
        setActiveTab("pickups");
      } else if (tabParam === "recycle-centers") {
        setActiveTab("recycle-centers");
      }
    }
  }, []);

  // Fetch pickups or users based on active tab
  useEffect(() => {
    if (activeTab === "pickups") {
      fetchPickups();
    } else if (activeTab === "recycle-centers") {
      fetchCenters();
    } else {
      fetchUsers();
    }
  }, [activeTab, currentPage, debouncedSearch, token]);

  // Status Change Handler
  const handleStatusChange = async (id: string, newStatus: string) => {
    if (!token) return;
    setStatusUpdatingId(id);
    try {
      const result = await updatePickupRequestStatus(token, id, newStatus);
      if (result.success) {
        // Update local state directly to feel instant
        setPickups((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p))
        );
      } else {
        alert(result.message || "Failed to update status");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred while updating status");
    } finally {
      setStatusUpdatingId(null);
    }
  };

  // Recycle Centers CRUD handlers
  const handleCreateCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setActionLoading(true);
    setActionError(null);

    if (!rcName || !rcCity || !rcAddress || !rcPhone || !rcEmail || !rcHours || rcWaste.length === 0 || !rcDesc) {
      setActionError("All fields are required");
      setActionLoading(false);
      return;
    }

    try {
      const result = await createRecycleCenter(token, {
        name: rcName,
        city: rcCity,
        address: rcAddress,
        phone: rcPhone,
        email: rcEmail,
        hours: rcHours,
        acceptedWaste: rcWaste,
        description: rcDesc,
        status: rcStatus
      });

      if (result.success) {
        closeModal();
        fetchCenters();
      } else {
        setActionError(result.message || "Failed to create center");
      }
    } catch (err: any) {
      setActionError(err.message || "An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCenter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedCenter) return;
    setActionLoading(true);
    setActionError(null);

    if (!rcName || !rcCity || !rcAddress || !rcPhone || !rcEmail || !rcHours || rcWaste.length === 0 || !rcDesc) {
      setActionError("All fields are required");
      setActionLoading(false);
      return;
    }

    try {
      const result = await updateRecycleCenter(token, selectedCenter._id, {
        name: rcName,
        city: rcCity,
        address: rcAddress,
        phone: rcPhone,
        email: rcEmail,
        hours: rcHours,
        acceptedWaste: rcWaste,
        description: rcDesc,
        status: rcStatus
      });

      if (result.success) {
        closeModal();
        fetchCenters();
      } else {
        setActionError(result.message || "Failed to update center");
      }
    } catch (err: any) {
      setActionError(err.message || "An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCenterConfirm = async () => {
    if (!token || !selectedCenter) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const result = await deleteRecycleCenter(token, selectedCenter._id);
      if (result.success) {
        closeModal();
        fetchCenters();
      } else {
        setActionError(result.message || "Failed to delete center");
      }
    } catch (err: any) {
      setActionError(err.message || "An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  const openCreateCenterModal = () => {
    setRcName("");
    setRcCity("Kathmandu");
    setRcAddress("");
    setRcPhone("");
    setRcEmail("");
    setRcHours("9:00 AM - 5:00 PM");
    setRcWaste([]);
    setRcDesc("");
    setRcStatus("active");
    setSelectedCenter(null);
    setActionError(null);
    setActiveModal("create_center" as any);
  };

  const openEditCenterModal = (center: any) => {
    setRcName(center.name);
    setRcCity(center.city);
    setRcAddress(center.address);
    setRcPhone(center.phone);
    setRcEmail(center.email);
    setRcHours(center.hours);
    setRcWaste(center.acceptedWaste);
    setRcDesc(center.description);
    setRcStatus(center.status);
    setSelectedCenter(center);
    setActionError(null);
    setActiveModal("edit_center" as any);
  };

  const openDeleteCenterModal = (center: any) => {
    setSelectedCenter(center);
    setActionError(null);
    setActiveModal("delete_center" as any);
  };

  const openViewCenterModal = (center: any) => {
    setSelectedCenter(center);
    setActiveModal("view_center" as any);
  };

  const toggleWasteSelection = (type: string) => {
    setRcWaste((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // Modal State
  const [activeModal, setActiveModal] = useState<"create" | "edit" | "delete" | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // React Hook Form setups
  const createForm = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "user",
      contactNumber: "",
      gender: "",
    },
  });

  const editForm = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      role: "user",
      contactNumber: "",
      gender: "",
    },
  });

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 450);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch users when token, page, or search query changes
  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await getAdminUsers(token, currentPage, limit, debouncedSearch);
      if (response.success) {
        setUsers(response.data);
        if (response.meta) {
          setMeta(response.meta);
        }
      } else {
        setError(response.message || "Failed to fetch users");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while loading users");
    } finally {
      setLoading(false);
    }
  };

  // Conditional activeTab effect handles all listings queries

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // Open creation modal
  const openCreateModal = () => {
    createForm.reset({
      fullName: "",
      email: "",
      password: "",
      role: "user",
      contactNumber: "",
      gender: "",
    });
    setActionError(null);
    setActiveModal("create");
  };

  // Open edit modal
  const openEditModal = (user: UserType) => {
    setSelectedUser(user);
    editForm.reset({
      fullName: user.fullName,
      email: user.email,
      password: "",
      role: user.role,
      contactNumber: user.contactNumber || "",
      gender: user.gender || "",
    });
    setActionError(null);
    setActiveModal("edit");
  };

  // Open delete confirmation modal
  const openDeleteModal = (user: UserType) => {
    setSelectedUser(user);
    setActionError(null);
    setActiveModal("delete");
  };

  // Close any open modal
  const closeModal = () => {
    setActiveModal(null);
    setSelectedUser(null);
    setActionError(null);
  };

  // Handle User Creation
  const onCreateSubmit = async (data: CreateUserInput) => {
    if (!token) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const payload = {
        ...data,
        gender: data.gender === "" ? undefined : data.gender,
        contactNumber: data.contactNumber === "" ? undefined : data.contactNumber,
      };

      const result = await createAdminUser(token, payload);
      if (result.success) {
        closeModal();
        fetchUsers();
      } else {
        setActionError(result.message || "Failed to create user");
      }
    } catch (err: any) {
      setActionError(err.message || "An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle User Update
  const onEditSubmit = async (data: UpdateUserInput) => {
    if (!token || !selectedUser) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const payload: any = {
        fullName: data.fullName,
        email: data.email,
        role: data.role,
        gender: data.gender === "" ? null : data.gender,
        contactNumber: data.contactNumber === "" ? null : data.contactNumber,
      };

      if (data.password && data.password.trim() !== "") {
        payload.password = data.password;
      }

      const result = await updateAdminUser(token, selectedUser._id, payload);
      if (result.success) {
        closeModal();
        fetchUsers();
      } else {
        setActionError(result.message || "Failed to update user");
      }
    } catch (err: any) {
      setActionError(err.message || "An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle User Deletion
  const handleDeleteConfirm = async () => {
    if (!token || !selectedUser) return;
    setActionLoading(true);
    setActionError(null);
    try {
      const result = await deleteAdminUser(token, selectedUser._id);
      if (result.success) {
        closeModal();
        if (users.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchUsers();
        }
      } else {
        setActionError(result.message || "Failed to delete user");
      }
    } catch (err: any) {
      setActionError(err.message || "An error occurred");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F3F0DE] flex flex-col font-sans">
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8 w-full flex-1 flex flex-col">
        <div className="grid grid-cols-12 gap-8 items-start">
          {/* Admin Sidebar */}
          <aside className="col-span-12 md:col-span-3 bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 px-3">
              Admin Controls
            </h3>
            
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition cursor-pointer text-left ${
                activeTab === "users"
                  ? "bg-[#124B34] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-green-950"
              }`}
            >
              <Users size={16} />
              Manage Users
            </button>

            <button
              onClick={() => setActiveTab("pickups")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition cursor-pointer text-left ${
                activeTab === "pickups"
                  ? "bg-[#124B34] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-green-950"
              }`}
            >
              <Truck size={16} />
              Manage Pickups
            </button>

            <button
              onClick={() => setActiveTab("recycle-centers")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition cursor-pointer text-left ${
                activeTab === "recycle-centers"
                  ? "bg-[#124B34] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50 hover:text-green-950"
              }`}
            >
              <Building size={16} />
              Manage Centers
            </button>
          </aside>

          {/* Admin Active Module Panel */}
          <main className="col-span-12 md:col-span-9 flex flex-col min-h-[500px]">
            {activeTab === "users" ? (
              <>
                {/* Title Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-green-900 tracking-tight">
                      Admin User Registry
                    </h2>
                    <p className="text-gray-600 mt-1 text-sm">
                      Perform administrative operations: create new accounts, modify permissions, search and delete users.
                    </p>
                  </div>

                  <button
                    onClick={openCreateModal}
                    className="flex items-center gap-2 bg-[#124B34] hover:bg-[#0c3323] text-white font-semibold px-5 py-3 rounded-2xl transition shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
                  >
                    <Plus size={18} />
                    Create User
                  </button>
                </div>

                {/* Search & Statistics Bar */}
                <div className="bg-white rounded-3xl p-6 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Search size={18} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-900 text-sm transition shadow-inner"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-6 text-sm text-gray-600 w-full md:w-auto justify-end">
                    <p>
                      Total Registered: <span className="font-bold text-green-900">{meta.total}</span>
                    </p>
                    <button
                      onClick={fetchUsers}
                      className="p-2 text-gray-500 hover:text-green-900 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                      title="Refresh list"
                    >
                      <RefreshCw size={16} className={`${loading ? "animate-spin" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 rounded-3xl p-6 flex items-start gap-4 mb-6 animate-fadeIn">
                    <AlertCircle size={22} className="text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">Failed to load user repository</h3>
                      <p className="text-xs text-red-700 mt-1">{error}</p>
                    </div>
                    <button
                      onClick={fetchUsers}
                      className="bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Users Table / Grid Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-[400px]">
                  {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12">
                      <RefreshCw className="animate-spin text-green-900 w-12 h-12" />
                      <p className="mt-4 text-green-900 font-semibold text-sm">Querying database...</p>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400 text-xl font-bold">
                        ?
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">No users found</h3>
                      <p className="text-gray-500 text-sm mt-1 max-w-sm">
                        We couldn't find any users matching your criteria. Try adjusting your search term or add a new user.
                      </p>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                              <th className="py-4 px-6">User ID</th>
                              <th className="py-4 px-6">Name / Identity</th>
                              <th className="py-4 px-6">Email Address</th>
                              <th className="py-4 px-6">Role</th>
                              <th className="py-4 px-6">Created Date</th>
                              <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                            {users.map((u) => (
                              <tr key={u._id} className="hover:bg-gray-50/50 transition">
                                <td className="py-4 px-6 font-mono text-xs text-gray-400">
                                  {u._id.substring(u._id.length - 8)}
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-full bg-green-150 border border-green-800/20 overflow-hidden flex items-center justify-center text-xs font-bold text-green-900 uppercase shrink-0">
                                      {u.profileImage ? (
                                        <img
                                          src={u.profileImage}
                                          alt="Profile"
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <span>{u.fullName.charAt(0)}</span>
                                      )}
                                    </div>
                                    <div className="font-semibold text-gray-900">{u.fullName}</div>
                                  </div>
                                </td>
                                <td className="py-4 px-6 text-gray-600">{u.email}</td>
                                <td className="py-4 px-6">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                      u.role === "admin"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {u.role}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-gray-500 text-xs">
                                  {new Date(u.createdAt).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex justify-end gap-2">
                                    <button
                                      onClick={() => openEditModal(u)}
                                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-green-800 transition cursor-pointer"
                                      title="Edit user"
                                    >
                                      <Edit size={16} />
                                    </button>
                                    <button
                                      onClick={() => openDeleteModal(u)}
                                      className="p-1.5 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-650 transition cursor-pointer"
                                      title="Delete user"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Pagination Controls */}
                      <div className="bg-gray-50/50 border-t border-gray-100 py-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <span className="text-xs text-gray-500">
                          Showing page <span className="font-bold text-gray-800">{meta.page}</span> of{" "}
                          <span className="font-bold text-gray-800">{meta.totalPages}</span> ({meta.total} users)
                        </span>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1 || loading}
                            className="flex items-center gap-1 text-xs font-semibold border rounded-xl px-3.5 py-2 hover:bg-white transition disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                          >
                            <ChevronLeft size={14} />
                            Previous
                          </button>
                          <button
                            onClick={() => setCurrentPage((p) => Math.min(meta.totalPages, p + 1))}
                            disabled={currentPage === meta.totalPages || loading}
                            className="flex items-center gap-1 text-xs font-semibold border rounded-xl px-3.5 py-2 hover:bg-white transition disabled:opacity-50 disabled:hover:bg-transparent cursor-pointer"
                          >
                            Next
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : activeTab === "pickups" ? (
              <>
                {/* Pickup Requests Title Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-green-900 tracking-tight">
                      Pickup Requests Management
                    </h2>
                    <p className="text-gray-600 mt-1 text-sm">
                      Track citizen waste collection tickets, review disposal parameters, and update statuses.
                    </p>
                  </div>
                  <button
                    onClick={fetchPickups}
                    className="p-2 text-gray-500 hover:text-green-900 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                    title="Refresh requests"
                  >
                    <RefreshCw size={16} className={`${pickupsLoading ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {/* Pickups Error Banner */}
                {pickupsError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 rounded-3xl p-6 flex items-start gap-4 mb-6 animate-fadeIn">
                    <AlertCircle size={22} className="text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">Failed to load pickup requests</h3>
                      <p className="text-xs text-red-700 mt-1">{pickupsError}</p>
                    </div>
                    <button
                      onClick={fetchPickups}
                      className="bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Pickups Table Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-[400px]">
                  {pickupsLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12">
                      <RefreshCw className="animate-spin text-green-900 w-12 h-12" />
                      <p className="mt-4 text-green-900 font-semibold text-sm">Querying database...</p>
                    </div>
                  ) : pickups.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400 flex justify-center items-center font-bold">
                        <Inbox size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">No pickup requests found</h3>
                      <p className="text-gray-500 text-sm mt-1 max-w-sm">
                        No citizens have requested trash collection pickups yet.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="py-4 px-6">ID</th>
                            <th className="py-4 px-6">Citizen</th>
                            <th className="py-4 px-6">Location</th>
                            <th className="py-4 px-6">Recycle Center</th>
                            <th className="py-4 px-6">Waste Type & Qty</th>
                            <th className="py-4 px-6">Pref Date</th>
                            <th className="py-4 px-6">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                          {pickups.map((pickup) => (
                            <tr key={pickup._id} className="hover:bg-gray-50/50 transition">
                              <td className="py-4 px-6 font-mono text-xs text-gray-400">
                                {pickup._id.substring(pickup._id.length - 8)}
                              </td>
                              <td className="py-4 px-6">
                                <div>
                                  <div className="font-semibold text-gray-900">{pickup.fullName}</div>
                                  <div className="text-xs text-gray-500">{pickup.email}</div>
                                  <div className="text-xs text-gray-500">{pickup.phone}</div>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-start gap-1 max-w-xs text-xs text-gray-700 leading-normal">
                                  <MapPin size={12} className="text-gray-400 mt-0.5 shrink-0" />
                                  <span>{pickup.pickupAddress}</span>
                                </div>
                                {pickup.notes && (
                                  <div className="text-[10px] text-gray-500 mt-1 italic max-w-xs overflow-hidden text-ellipsis whitespace-nowrap" title={pickup.notes}>
                                    Note: {pickup.notes}
                                  </div>
                                )}
                              </td>
                              <td className="py-4 px-6 text-xs text-gray-800 font-semibold">
                                <div className="flex items-center gap-1">
                                  <Building size={12} className="text-green-800" />
                                  <span>{pickup.centerName}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="font-semibold text-gray-900 text-xs">{pickup.wasteType}</div>
                                <div className="text-[11px] text-gray-500">{pickup.quantity}</div>
                              </td>
                              <td className="py-4 px-6 text-xs text-gray-600 font-medium">
                                <div className="flex items-center gap-1">
                                  <Calendar size={12} className="text-gray-400" />
                                  <span>{pickup.preferredDate}</span>
                                </div>
                              </td>
                              <td className="py-4 px-6">
                                <div className="flex items-center gap-2">
                                  <select
                                    value={pickup.status}
                                    disabled={statusUpdatingId === pickup._id}
                                    onChange={(e) => handleStatusChange(pickup._id, e.target.value)}
                                    className={`border rounded-xl text-xs font-bold px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-green-800 cursor-pointer disabled:opacity-50 ${
                                      pickup.status === "completed"
                                        ? "bg-green-50 text-green-800 border-green-200"
                                        : pickup.status === "cancelled"
                                        ? "bg-red-50 text-red-800 border-red-200"
                                        : pickup.status === "scheduled"
                                        ? "bg-purple-50 text-purple-800 border-purple-200"
                                        : pickup.status === "approved"
                                        ? "bg-blue-50 text-blue-800 border-blue-200"
                                        : "bg-amber-50 text-amber-800 border-amber-200"
                                    }`}
                                  >
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="scheduled">Scheduled</option>
                                    <option value="completed">Completed</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                  {statusUpdatingId === pickup._id && (
                                    <RefreshCw className="animate-spin text-green-950 w-3.5 h-3.5" />
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Recycling Centers Title Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h2 className="text-3xl font-extrabold text-green-900 tracking-tight">
                      Manage Recycling Centers
                    </h2>
                    <p className="text-gray-600 mt-1 text-sm">
                      Perform administrative operations on recycling hubs: add new plants, edit parameters, and deactivate centers.
                    </p>
                  </div>

                  <button
                    onClick={openCreateCenterModal}
                    className="flex items-center gap-2 bg-[#124B34] hover:bg-[#0c3323] text-white font-semibold px-5 py-3 rounded-2xl transition shadow-md hover:shadow-lg active:scale-[0.98] cursor-pointer"
                  >
                    <Plus size={18} />
                    Add New Center
                  </button>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-3xl p-6 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:max-w-md">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Search size={18} />
                    </span>
                    <input
                      type="text"
                      placeholder="Search centers by name or city..."
                      value={centersSearch}
                      onChange={(e) => setCentersSearch(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 text-gray-900 text-sm transition shadow-inner"
                    />
                    {centersSearch && (
                      <button
                        onClick={() => setCentersSearch("")}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={fetchCenters}
                    className="p-2 text-gray-500 hover:text-green-900 hover:bg-gray-100 rounded-xl transition cursor-pointer"
                    title="Refresh list"
                  >
                    <RefreshCw size={16} className={`${centersLoading ? "animate-spin" : ""}`} />
                  </button>
                </div>

                {/* Centers Error Banner */}
                {centersError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 rounded-3xl p-6 flex items-start gap-4 mb-6 animate-fadeIn">
                    <AlertCircle size={22} className="text-red-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">Failed to load recycling centers</h3>
                      <p className="text-xs text-red-700 mt-1">{centersError}</p>
                    </div>
                    <button
                      onClick={fetchCenters}
                      className="bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Centers Table Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col min-h-[400px]">
                  {centersLoading ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12">
                      <RefreshCw className="animate-spin text-green-900 w-12 h-12" />
                      <p className="mt-4 text-green-900 font-semibold text-sm">Querying database...</p>
                    </div>
                  ) : centers.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400 flex justify-center items-center font-bold">
                        <Building size={24} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">No centers listed</h3>
                      <p className="text-gray-500 text-sm mt-1 max-w-sm">
                        Create recycling center records to serve them dynamically to citizens.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="py-4 px-6">Name</th>
                            <th className="py-4 px-6">Address</th>
                            <th className="py-4 px-6">Contact details</th>
                            <th className="py-4 px-6">Waste accepted</th>
                            <th className="py-4 px-6">Status</th>
                            <th className="py-4 px-6 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                          {centers
                            .filter((c) => {
                              const matchStr = centersSearch.toLowerCase();
                              return (
                                c.name.toLowerCase().includes(matchStr) ||
                                c.city.toLowerCase().includes(matchStr) ||
                                c.address.toLowerCase().includes(matchStr)
                              );
                            })
                            .map((center) => (
                              <tr key={center._id} className="hover:bg-gray-50/50 transition">
                                <td className="py-4 px-6">
                                  <div className="font-semibold text-gray-900">{center.name}</div>
                                  <div className="text-[10px] text-gray-500 font-medium">Hours: {center.hours}</div>
                                </td>
                                <td className="py-4 px-6 text-xs text-gray-600">
                                  <div className="flex items-center gap-1 font-semibold text-green-950 mb-0.5">
                                    <MapPin size={11} />
                                    <span>{center.city}</span>
                                  </div>
                                  <div>{center.address}</div>
                                </td>
                                <td className="py-4 px-6 text-xs text-gray-600">
                                  <div>{center.phone}</div>
                                  <div className="text-[11px] text-gray-400 mt-0.5">{center.email}</div>
                                </td>
                                <td className="py-4 px-6">
                                  <div className="flex flex-wrap gap-1 max-w-xs">
                                    {center.acceptedWaste.map((w: string) => (
                                      <span
                                        key={w}
                                        className="bg-gray-100 text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded-lg shrink-0"
                                      >
                                        {w}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="py-4 px-6">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                      center.status === "active"
                                        ? "bg-green-50 text-green-800 border border-green-200"
                                        : "bg-gray-100 text-gray-600 border border-gray-300"
                                    }`}
                                  >
                                    {center.status}
                                  </span>
                                </td>
                                <td className="py-4 px-6 text-right">
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      onClick={() => openViewCenterModal(center)}
                                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-green-800 transition cursor-pointer"
                                      title="View center details"
                                    >
                                      <Eye size={15} />
                                    </button>
                                    <button
                                      onClick={() => openEditCenterModal(center)}
                                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-green-850 transition cursor-pointer"
                                      title="Edit center parameters"
                                    >
                                      <Edit size={15} />
                                    </button>
                                    <button
                                      onClick={() => openDeleteCenterModal(center)}
                                      className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-650 transition cursor-pointer"
                                      title="Delete recycling center"
                                    >
                                      <Trash2 size={15} />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {/* CREATE MODAL */}
      {activeModal === "create" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 border-b border-gray-150 flex justify-between items-center">
              <h3 className="font-bold text-lg text-green-950">Register New User</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={createForm.handleSubmit(onCreateSubmit)}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {actionError && (
                  <div className="bg-red-50 text-red-800 border border-red-150 text-xs p-3.5 rounded-xl flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-600 shrink-0" />
                    <span>{actionError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...createForm.register("fullName")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-450 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                    placeholder="e.g. Jessica Alba"
                  />
                  {createForm.formState.errors.fullName && (
                    <p className="text-red-600 text-xs mt-1">
                      {createForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...createForm.register("email")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-450 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                    placeholder="name@example.com"
                  />
                  {createForm.formState.errors.email && (
                    <p className="text-red-600 text-xs mt-1">
                      {createForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      System Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...createForm.register("role")}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm bg-white text-gray-900"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Gender
                    </label>
                    <select
                      {...createForm.register("gender")}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm bg-white text-gray-900"
                    >
                      <option value="">Unspecified</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    {...createForm.register("contactNumber")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-450 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                    placeholder="e.g. +1 555-0199"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Security Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    {...createForm.register("password")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-450 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                    placeholder="Minimum 6 characters"
                  />
                  {createForm.formState.errors.password && (
                    <p className="text-red-600 text-xs mt-1">
                      {createForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-150 bg-gray-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 border rounded-xl font-semibold text-sm hover:bg-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-[#124B34] hover:bg-[#0c3323] text-white font-semibold rounded-xl text-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? "Registering..." : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {activeModal === "edit" && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 border-b border-gray-150 flex justify-between items-center">
              <h3 className="font-bold text-lg text-green-950">Modify User Information</h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={editForm.handleSubmit(onEditSubmit)}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                {actionError && (
                  <div className="bg-red-50 text-red-800 border border-red-150 text-xs p-3.5 rounded-xl flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-600 shrink-0" />
                    <span>{actionError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...editForm.register("fullName")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                  />
                  {editForm.formState.errors.fullName && (
                    <p className="text-red-600 text-xs mt-1">
                      {editForm.formState.errors.fullName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...editForm.register("email")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                  />
                  {editForm.formState.errors.email && (
                    <p className="text-red-600 text-xs mt-1">
                      {editForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      System Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...editForm.register("role")}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm bg-white text-gray-900"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Gender
                    </label>
                    <select
                      {...editForm.register("gender")}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm bg-white text-gray-900"
                    >
                      <option value="">Unspecified</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    {...editForm.register("contactNumber")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Security Password <span className="text-gray-400 font-normal">(Leave blank to keep current)</span>
                  </label>
                  <input
                    type="password"
                    {...editForm.register("password")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                    placeholder="New password (min 6 characters)"
                  />
                  {editForm.formState.errors.password && (
                    <p className="text-red-650 text-xs mt-1">
                      {editForm.formState.errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-150 bg-gray-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 border rounded-xl font-semibold text-sm hover:bg-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 bg-[#124B34] hover:bg-[#0c3323] text-white font-semibold rounded-xl text-sm transition disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {activeModal === "delete" && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-600 mb-4 font-bold">
                🗑️
              </div>
              <h3 className="font-extrabold text-xl text-gray-900">Delete User Account</h3>
              <p className="text-gray-800 text-sm mt-2 font-medium">
                Are you sure you want to permanently delete the account for{" "}
                <span className="font-bold text-black">{selectedUser.fullName}</span> (
                <span className="text-xs font-bold font-mono text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">{selectedUser.email}</span>)?
              </p>
              <p className="text-red-700 font-bold text-xs mt-4 bg-red-50 border border-red-200 px-3.5 py-2.5 rounded-xl">
                Warning: This action cannot be undone.
              </p>

              {actionError && (
                <div className="mt-4 bg-red-50 text-red-800 text-xs p-3 rounded-xl border border-red-150 flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={actionLoading}
                className="px-4 py-2.5 border border-gray-300 rounded-xl font-semibold text-sm hover:bg-white text-gray-800 transition cursor-pointer flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={actionLoading}
                className="px-4 py-2.5 bg-red-650 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition disabled:opacity-50 cursor-pointer flex-1"
              >
                {actionLoading ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW RECYCLE CENTER DETAILS MODAL */}
      {(activeModal as any) === "view_center" && selectedCenter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scaleIn flex flex-col">
            <div className="p-6 border-b border-gray-150 flex justify-between items-center bg-[#0B2717] text-white">
              <div className="flex items-center gap-2">
                <Building size={20} className="text-green-300" />
                <h3 className="font-extrabold text-base">Recycling Center Details</h3>
              </div>
              <button onClick={closeModal} className="text-white hover:text-green-200 text-xl font-bold cursor-pointer">×</button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh] text-sm text-gray-700">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Center Name</h4>
                <p className="font-bold text-lg text-green-950 mt-0.5">{selectedCenter.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">City</h4>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedCenter.city}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Status</h4>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 uppercase ${
                    selectedCenter.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}>
                    {selectedCenter.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address</h4>
                <p className="font-semibold text-gray-900 mt-0.5">{selectedCenter.address}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contact Number</h4>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedCenter.phone}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</h4>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedCenter.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Opening Hours</h4>
                  <p className="font-semibold text-gray-900 mt-0.5">{selectedCenter.hours}</p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Waste Types Accepted</h4>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {selectedCenter.acceptedWaste.map((item: string) => (
                    <span key={item} className="bg-gray-100 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-lg">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Description</h4>
                <p className="text-xs leading-relaxed text-gray-700 mt-1">{selectedCenter.description}</p>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button onClick={closeModal} className="px-5 py-2.5 bg-[#0B2717] hover:bg-green-950 text-white font-bold rounded-xl text-sm transition cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE & EDIT RECYCLE CENTER MODAL */}
      {((activeModal as any) === "create_center" || (activeModal as any) === "edit_center") && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-scaleIn flex flex-col">
            <div className="p-6 border-b border-gray-150 flex justify-between items-center bg-[#0B2717] text-white">
              <div className="flex items-center gap-2">
                <Building size={20} className="text-green-300" />
                <h3 className="font-extrabold text-base">
                  {(activeModal as any) === "create_center" ? "Add New Recycling Center" : "Edit Recycling Center"}
                </h3>
              </div>
              <button onClick={closeModal} className="text-white hover:text-green-200 text-xl font-bold cursor-pointer">×</button>
            </div>

            <form onSubmit={(activeModal as any) === "create_center" ? handleCreateCenter : handleUpdateCenter} className="flex-1 overflow-y-auto max-h-[70vh]">
              <div className="p-6 space-y-4">
                {actionError && (
                  <div className="bg-red-50 text-red-800 p-4 rounded-xl border border-red-150 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{actionError}</span>
                  </div>
                )}

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Center Name</label>
                  <input
                    type="text"
                    required
                    value={rcName}
                    onChange={(e) => setRcName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                  />
                </div>

                {/* City & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
                    <select
                      value={rcCity}
                      onChange={(e) => setRcCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                    >
                      <option value="Kathmandu">Kathmandu</option>
                      <option value="Lalitpur">Lalitpur</option>
                      <option value="Bhaktapur">Bhaktapur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                    <select
                      value={rcStatus}
                      onChange={(e) => setRcStatus(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Address</label>
                  <input
                    type="text"
                    required
                    value={rcAddress}
                    onChange={(e) => setRcAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                  />
                </div>

                {/* Phone & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Contact Number</label>
                    <input
                      type="text"
                      required
                      value={rcPhone}
                      onChange={(e) => setRcPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={rcEmail}
                      onChange={(e) => setRcEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                    />
                  </div>
                </div>

                {/* Hours */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Opening Hours</label>
                  <input
                    type="text"
                    required
                    value={rcHours}
                    onChange={(e) => setRcHours(e.target.value)}
                    placeholder="e.g. 9:00 AM - 5:00 PM"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                  />
                </div>

                {/* Accepted Waste Checkboxes */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Types of Waste Accepted</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-gray-50 border border-gray-150 p-4 rounded-2xl">
                    {["Plastic", "Paper", "Cardboard", "Glass", "Metal", "Organic", "E-Waste", "Batteries", "Hazardous Waste", "Mixed"].map((type) => (
                      <label key={type} className="flex items-center gap-2 text-xs font-medium text-gray-750 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rcWaste.includes(type)}
                          onChange={() => toggleWasteSelection(type)}
                          className="w-4 h-4 text-green-900 border-gray-300 rounded focus:ring-green-800 bg-white"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Short Description</label>
                  <textarea
                    required
                    rows={3}
                    value={rcDesc}
                    onChange={(e) => setRcDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm resize-none"
                  />
                </div>
              </div>

              {/* Form Footer */}
              <div className="p-6 border-t border-gray-150 bg-gray-50 flex gap-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-xl text-sm transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-1/2 bg-[#0B2717] hover:bg-green-950 text-white font-bold py-3 rounded-xl text-sm transition disabled:opacity-50 cursor-pointer shadow"
                >
                  {actionLoading ? "Saving..." : "Save Center"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE RECYCLE CENTER MODAL */}
      {((activeModal as any) === "delete_center") && selectedCenter && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-scaleIn">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center text-red-650 mb-4 font-bold">
                🗑️
              </div>
              <h3 className="font-extrabold text-xl text-gray-900">Delete Recycling Center</h3>
              <p className="text-gray-800 text-sm mt-2 font-medium">
                Are you sure you want to delete the recycling center:{" "}
                <span className="font-bold text-black">{selectedCenter.name}</span> located at{" "}
                <span className="font-bold text-black">{selectedCenter.address}</span>?
              </p>
              <p className="text-red-700 font-bold text-xs mt-4 bg-red-50 border border-red-200 px-3.5 py-2.5 rounded-xl">
                Warning: Citizens will no longer be able to find this center or request pickups.
              </p>

              {actionError && (
                <div className="mt-4 bg-red-50 text-red-800 text-xs p-3 rounded-xl border border-red-150 flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{actionError}</span>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center gap-3">
              <button
                type="button"
                onClick={closeModal}
                disabled={actionLoading}
                className="px-4 py-2.5 border border-gray-300 rounded-xl font-semibold text-sm hover:bg-white text-gray-800 transition cursor-pointer flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteCenterConfirm}
                disabled={actionLoading}
                className="px-4 py-2.5 bg-red-650 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition disabled:opacity-50 cursor-pointer flex-1"
              >
                {actionLoading ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}
