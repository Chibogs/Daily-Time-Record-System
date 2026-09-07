import { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import type { AdminUser } from "../types/admin";

export default function AdminUserManagementPage() {
    const [users, setUsers] = useState<AdminUser[]>([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [actionLoading, setActionLoading] =
        useState<number | null>(null);

    const [showCreateForm, setShowCreateForm] =
        useState(false);

    const [creating, setCreating] = useState(false);

    const [createError, setCreateError] =
        useState<string | null>(null);

    const [form, setForm] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        role: "Student",
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const result = await adminService.getAllUsers();

            setUsers(result);
        } catch (err) {
            console.error(err);
            setError("Failed to load users.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (userId: number) => {
        try {
            setActionLoading(userId);
            setError(null);

            await adminService.deactivateUser(userId);

            await loadUsers();
        } catch (err) {
            console.error(err);
            setError("Failed to deactivate user.");
        } finally {
            setActionLoading(null);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setCreating(true);
            setError(null);

            await adminService.createUser({
                username: form.username,
                password: form.password,
                fullName: form.fullName,
                role: form.role,
            });

            setForm({
                username: "",
                password: "",
                confirmPassword: "",
                fullName: "",
                role: "Student",
            });

            setShowCreateForm(false);

            await loadUsers();
        } catch (err) {
            console.error(err);
            setError("Failed to create user.");
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold">
                    User Management
                </h1>

                <p>Loading users...</p>
            </div>
        );
    }

    return (
        <div className="p-6">

            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    User Management
                </h1>

                <button
                    onClick={() => {
                        setShowCreateForm(!showCreateForm);
                        setCreateError(null);
                    }}
                    className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    {showCreateForm
                        ? "Cancel"
                        : "Create User"}
                </button>
            </div>

            {/* Create User Form */}
            {showCreateForm && (
                <div className="mb-6 rounded border p-6">

                    <h2 className="mb-4 text-xl font-bold">
                        Create User
                    </h2>

                    {createError && (
                        <p className="mb-4 text-red-600">
                            {createError}
                        </p>
                    )}

                    <form
                        onSubmit={handleCreateUser}
                        className="space-y-4"
                    >

                        {/* Username */}
                        <div>
                            <label
                                htmlFor="username"
                                className="mb-1 block font-medium"
                            >
                                Username
                            </label>

                            <input
                                id="username"
                                type="text"
                                value={form.username}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        username:
                                            e.target.value,
                                    })
                                }
                                required
                                className="w-full max-w-md rounded border p-2"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1 block font-medium"
                            >
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password:
                                            e.target.value,
                                    })
                                }
                                required
                                className="w-full max-w-md rounded border p-2"
                            />
                        </div>

                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="fullName"
                                className="mb-1 block font-medium"
                            >
                                Full Name
                            </label>

                            <input
                                id="fullName"
                                type="text"
                                value={form.fullName}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        fullName:
                                            e.target.value,
                                    })
                                }
                                required
                                className="w-full max-w-md rounded border p-2"
                            />
                        </div>

                        {/* Role */}
                        <div>
                            <label
                                htmlFor="role"
                                className="mb-1 block font-medium"
                            >
                                Role
                            </label>

                            <select
                                id="role"
                                value={form.role}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        role:
                                            e.target.value,
                                    })
                                }
                                className="w-full max-w-md rounded border p-2"
                            >
                                <option value="Student">
                                    Student
                                </option>

                                <option value="Admin">
                                    Admin
                                </option>
                            </select>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={creating}
                            className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
                        >
                            {creating
                                ? "Creating..."
                                : "Create User"}
                        </button>

                    </form>
                </div>
            )}

            {/* General Error */}
            {error && (
                <p className="mb-4 text-red-600">
                    {error}
                </p>
            )}

            {/* Users Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border">

                    <thead>
                        <tr className="bg-slate-100">

                            <th className="border p-3 text-left">
                                ID
                            </th>

                            <th className="border p-3 text-left">
                                Username
                            </th>

                            <th className="border p-3 text-left">
                                Full Name
                            </th>

                            <th className="border p-3 text-left">
                                Role
                            </th>

                            <th className="border p-3 text-left">
                                Status
                            </th>

                            <th className="border p-3 text-left">
                                Action
                            </th>

                        </tr>
                    </thead>

                    <tbody>

                        {users.map((user) => (
                            <tr key={user.id}>

                                <td className="border p-3">
                                    {user.id}
                                </td>

                                <td className="border p-3">
                                    {user.username}
                                </td>

                                <td className="border p-3">
                                    {user.fullName}
                                </td>

                                <td className="border p-3">
                                    {user.role}
                                </td>

                                <td className="border p-3">
                                    {user.isActive
                                        ? "Active"
                                        : "Inactive"}
                                </td>

                                <td className="border p-3">

                                    {user.isActive && (
                                        <button
                                            onClick={() =>
                                                handleDeactivate(
                                                    user.id
                                                )
                                            }
                                            disabled={
                                                actionLoading ===
                                                user.id
                                            }
                                            className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
                                        >
                                            {actionLoading ===
                                                user.id
                                                ? "Processing..."
                                                : "Deactivate"}
                                        </button>
                                    )}

                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>
            </div>

        </div>
    );
}