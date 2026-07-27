import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import type { AuthUser } from "../types/user";
import {
    getUser,
    logout as clearAuth,
    isAuthenticated,
} from "../services/authService";

import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export function AuthProvider({ children }: Props) {

    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {

        if (isAuthenticated()) {
            setUser(getUser());
        }

    }, []);

    function login(user: AuthUser) {
        setUser(user);
    }

    function logout() {
        clearAuth();
        setUser(null);
    }

    return (

        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}