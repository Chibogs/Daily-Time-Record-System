import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    if (!isAuthenticated()) {
        // Redirect to login page if not authenticated
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
}