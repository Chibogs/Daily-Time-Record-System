import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="app-shell">
            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            {isSidebarOpen && (
                <button
                    type="button"
                    className="sidebar-backdrop"
                    aria-label="Close navigation"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div className="app-main">
                <Header onMenuClick={() => setIsSidebarOpen(true)} />

                <div className="app-content">
                    <main className="content-container">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}