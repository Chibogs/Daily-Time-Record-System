import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user, logout } = useAuth();

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        `sidebar-link ${isActive ? "sidebar-link-active" : ""}`;

    return (
        <aside className={`app-sidebar ${isOpen ? "app-sidebar-open" : ""}`}>
            <div className="sidebar-brand">
                <div className="brand-mark" aria-hidden="true">D</div>
                <div>
                    <p className="brand-name">DTR System</p>
                    <p className="brand-caption">Attendance workspace</p>
                </div>
                <button
                    type="button"
                    className="sidebar-close"
                    aria-label="Close navigation"
                    onClick={onClose}
                >
                    &times;
                </button>
            </div>

            {user && (
                <div className="sidebar-profile">
                    <div className="avatar" aria-hidden="true">
                        {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="profile-copy">
                        <p className="profile-name">{user.fullName}</p>
                        <p className="profile-role">{user.role} account</p>
                    </div>
                </div>
            )}

            <nav className="sidebar-nav" aria-label="Primary navigation">
                <p className="nav-label">Overview</p>
                <NavLink
                    to="/dashboard"
                    className={navLinkClass}
                    onClick={onClose}
                >
                    <span className="nav-icon" aria-hidden="true">01</span>
                    Dashboard
                </NavLink>

                {user?.role === "Student" && (
                    <>
                        <NavLink
                            to="/attendance"
                            className={navLinkClass}
                            onClick={onClose}
                        >
                            <span className="nav-icon" aria-hidden="true">02</span>
                            Attendance
                        </NavLink>

                        <NavLink
                            to="/history"
                            className={navLinkClass}
                            onClick={onClose}
                        >
                            <span className="nav-icon" aria-hidden="true">03</span>
                            History
                        </NavLink>
                    </>
                )}

                {user?.role === "Admin" && (
                    <>
                        <p className="nav-label nav-label-spaced">Administration</p>
                        <NavLink
                            to="/admin/attendance"
                            className={navLinkClass}
                            onClick={onClose}
                        >
                            <span className="nav-icon" aria-hidden="true">04</span>
                            Attendance Requests
                        </NavLink>

                        <NavLink
                            to="/admin/users"
                            className={navLinkClass}
                            onClick={onClose}
                        >
                            <span className="nav-icon" aria-hidden="true">05</span>
                            Users Management
                        </NavLink>
                    </>
                )}

            </nav>

            <div className="sidebar-footer">
                <button
                    onClick={logout}
                    className="logout-button"
                >
                    <span aria-hidden="true">&#8594;</span>
                    Sign out
                </button>
            </div>

        </aside>
    );
}