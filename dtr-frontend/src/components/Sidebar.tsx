import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {
    const { user, logout } = useAuth();

    return (
        <aside className="flex w-64 flex-col bg-slate-900 text-white">

            {/* Logo / User Information */}
            <div className="border-b border-slate-700 p-6">
                <h2 className="text-xl font-bold">
                    DTR System
                </h2>

                {user && (
                    <div className="mt-3">
                        <p className="text-sm">
                            {user.fullName}
                        </p>

                        <p className="text-xs text-slate-400">
                            {user.role}
                        </p>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 p-4">

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `block rounded px-3 py-2 ${isActive
                            ? "bg-slate-700"
                            : "hover:bg-slate-800"
                        }`
                    }
                >
                    Dashboard
                </NavLink>

                {/* Attendance Dashboard: role = Student */}
                {user?.role === "Student" && (
                    <NavLink
                        to="/attendance"
                        className={({ isActive }) =>
                            `block rounded px-3 py-2 ${isActive
                                ? "bg-slate-700"
                                : "hover:bg-slate-800"
                            }`
                        }
                    >
                        Attendance
                    </NavLink>
                )}

                {/* History */}
                <NavLink
                    to="/history"
                    className={({ isActive }) =>
                        `block rounded px-3 py-2 ${isActive
                            ? "bg-slate-700"
                            : "hover:bg-slate-800"
                        }`
                    }
                >
                    History
                </NavLink>

                {/* Admin Dashboard: role = Admin */}
                {user?.role === "Admin" && (
                    <NavLink
                        to="/admin/attendance"
                        className={({ isActive }) =>
                            `block rounded px-3 py-2 ${isActive
                                ? "bg-slate-700"
                                : "hover:bg-slate-800"
                            }`
                        }
                    >
                        Admin Attendance
                    </NavLink>
                )}

            </nav>

            {/* Logout */}
            <div className="border-t border-slate-700 p-4">
                <button
                    onClick={logout}
                    className="w-full rounded bg-red-500 py-2 hover:bg-red-600"
                >
                    Logout
                </button>
            </div>

        </aside>
    );
}