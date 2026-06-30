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
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

  useEffect(() => {
    fetchUsers();
  }, [token, currentPage, debouncedSearch]);

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
      {/* Header/Navbar */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <h1 className="font-bold text-xl text-green-900 tracking-tight">
              BinBuddy
            </h1>
            <nav className="flex gap-8 text-sm text-gray-600 font-medium">
              <Link href="/dashboard" className="cursor-pointer hover:text-green-900 transition">
                Dashboard
              </Link>
              <Link href="/profile" className="cursor-pointer hover:text-green-900 transition">
                Profile
              </Link>
              <span className="text-green-900 font-semibold cursor-pointer border-b-2 border-green-800 pb-4 -mb-4">
                Admin Panel
              </span>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-sm">{currentUser?.fullName || "Admin"}</p>
              <p className="text-xs text-green-800 font-bold uppercase tracking-wider">
                {currentUser?.role || "admin"}
              </p>
            </div>

            <Link
              href="/profile"
              className="w-10 h-10 rounded-full bg-green-200 border-2 border-green-800 overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-85 transition shadow-sm"
            >
              {currentUser?.profileImage ? (
                <img
                  src={currentUser.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-green-950 font-bold text-sm">
                  {(currentUser?.fullName || "Admin").charAt(0).toUpperCase()}
                </span>
              )}
            </Link>

            <button
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-700 p-1.5 hover:bg-gray-100 rounded-xl transition"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-8 w-full flex-1 flex flex-col">
        {/* Title Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-green-900 tracking-tight">
              Admin User Management
            </h2>
            <p className="text-gray-600 mt-1 text-sm">
              Perform administrative operations: create new accounts, modify permissions, search and delete users.
            </p>
          </div>

          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-[#124B34] hover:bg-[#0c3323] text-white font-semibold px-5 py-3 rounded-2xl transition shadow-md hover:shadow-lg active:scale-[0.98]"
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
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-800 focus:bg-white text-sm transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
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
              className="p-2 text-gray-500 hover:text-green-900 hover:bg-gray-100 rounded-xl transition"
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
              className="bg-red-100 hover:bg-red-200 text-red-800 text-xs font-semibold px-4 py-2 rounded-xl transition"
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
                          {u._id}
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
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-green-800 transition"
                              title="Edit user"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(u)}
                              className="p-1.5 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-650 transition"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm bg-white"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm bg-white"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm bg-white"
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm bg-white"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Security Password <span className="text-gray-400 font-normal">(Leave blank to keep current)</span>
                  </label>
                  <input
                    type="password"
                    {...editForm.register("password")}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-800 text-sm"
                    placeholder="New password (min 6 characters)"
                  />
                  {editForm.formState.errors.password && (
                    <p className="text-red-600 text-xs mt-1">
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
              <h3 className="font-bold text-lg text-gray-900">Delete User Account</h3>
              <p className="text-gray-500 text-sm mt-2">
                Are you sure you want to permanently delete the account for{" "}
                <span className="font-bold text-gray-800">{selectedUser.fullName}</span> (
                <span className="text-xs font-mono">{selectedUser.email}</span>)?
              </p>
              <p className="text-red-600 font-semibold text-xs mt-3 bg-red-50 px-3.5 py-2 rounded-xl">
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
                className="px-4 py-2.5 border rounded-xl font-semibold text-sm hover:bg-white transition cursor-pointer flex-1"
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
    </main>
  );
}
