import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';

export default function ProtectedRoute() {
    if (!isAuthenticated()) {
        // Redirect to login page if not authenticated
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
}