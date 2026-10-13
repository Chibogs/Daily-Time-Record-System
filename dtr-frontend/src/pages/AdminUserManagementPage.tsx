import { useEffect, useState } from "react";
import { adminService } from "../services/adminService";
import type { AdminUser } from "../types/admin";
import { getErrorMessage } from "../utils/getErrorMessage";

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
            setError(getErrorMessage(err, "Failed to load users."));
        } finally {
            setLoading(false);
        }
    };

    const handleDeactivate = async (userId: number) => {

        const confirmed = window.confirm(
            "Are you sure you want to deactivate this user?"
        );
        
        if (!confirmed) return;

        try {
            setActionLoading(userId);
            setError(null);

            await adminService.deactivateUser(userId);

            await loadUsers();
        } catch (err) {
            console.error(err);
            setError(getErrorMessage(err, "Failed to deactivate user."));
        } finally {
            setActionLoading(null);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            setCreateError("Passwords do not match.");
            return;
        }

        try {
            setCreating(true);
            setCreateError(null);

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
            setCreateError(getErrorMessage(err, "Failed to create user."));
        } finally {
            setCreating(false);
        }
    };

    if (loading) {
        return (
            <div className="users-page">
                <section className="page-heading">
                    <div>
                        <p className="page-eyebrow">Administration</p>
                        <h1>User management</h1>
                        <p className="page-description">
                            Manage accounts and workspace access.
                        </p>
                    </div>
                </section>
                <div className="loading-panel" role="status">
                    <span className="loading-indicator" aria-hidden="true" />
                    Loading users...
                </div>
            </div>
        );
    }

    return (
        <div className="users-page">
            <section className="page-heading">
                <div>
                    <p className="page-eyebrow">Administration</p>
                    <h1>User management</h1>
                    <p className="page-description">
                        Manage accounts and workspace access.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setShowCreateForm(!showCreateForm);
                        setCreateError(null);
                    }}
                    className="create-user-button"
                >
                    <span aria-hidden="true">{showCreateForm ? "-" : "+"}</span>
                    {showCreateForm ? "Close form" : "Create user"}
                </button>
            </section>

            {showCreateForm && (
                <section className="create-user-panel">
                    <div className="create-user-heading">
                        <div>
                            <p className="page-eyebrow">New account</p>
                            <h2>Create a user</h2>
                        </div>
                        <p>Set up login credentials and assign a workspace role.</p>
                    </div>

                    {createError && (
                        <p className="attendance-error" role="alert">
                            {createError}
                        </p>
                    )}

                    <form onSubmit={handleCreateUser} className="create-user-form">
                        <div className="user-form-field">
                            <label htmlFor="username">Username</label>

                            <input
                                id="username"
                                type="text"
                                value={form.username}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        username: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="user-form-field">
                            <label htmlFor="password">Password</label>

                            <input
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="user-form-field">
                            <label htmlFor="confirmPassword">Confirm password</label>

                            <input
                                id="confirmPassword"
                                type="password"
                                value={form.confirmPassword}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        confirmPassword: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="user-form-field">
                            <label htmlFor="fullName">Full name</label>

                            <input
                                id="fullName"
                                type="text"
                                value={form.fullName}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        fullName: e.target.value,
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="user-form-field">
                            <label htmlFor="role">Role</label>

                            <select
                                id="role"
                                value={form.role}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        role: e.target.value,
                                    })
                                }
                            >
                                <option value="Student">
                                    Student
                                </option>

                                <option value="Admin">
                                    Admin
                                </option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={creating}
                            className="create-submit-button"
                        >
                            {creating ? "Creating..." : "Create user"}
                        </button>
                    </form>
                </section>
            )}

            {error && (
                <p className="attendance-error" role="alert">
                    {error}
                </p>
            )}

            <section className="users-table-wrap">
                <div className="users-table-heading">
                    <div>
                        <p className="page-eyebrow">Directory</p>
                        <h2>Workspace users</h2>
                    </div>
                    <span className="user-count">
                        {users.length} {users.length === 1 ? "user" : "users"}
                    </span>
                </div>

                <div className="users-table-scroll">
                    <table className="users-table">
                        <thead>
                        <tr className="bg-slate-100">
                            <th>ID</th>
                            <th>Username</th>
                            <th>Full name</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="users-empty-cell">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td className="user-id-cell">{user.id}</td>
                                    <td className="user-username-cell">{user.username}</td>
                                    <td className="user-name-cell">{user.fullName}</td>
                                    <td>
                                        <span className={`user-role user-role-${user.role.toLowerCase()}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`user-status ${user.isActive ? "user-status-active" : "user-status-inactive"}`}>
                                            <span className="user-status-dot" aria-hidden="true" />
                                            {user.isActive ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td>
                                        {user.isActive && (
                                            <button
                                                type="button"
                                                onClick={() => handleDeactivate(user.id)}
                                                disabled={actionLoading === user.id}
                                                className="deactivate-button"
                                            >
                                                {actionLoading === user.id ? "Processing..." : "Deactivate"}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}