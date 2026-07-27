import { createContext } from "react";
import type { AuthUser } from "../types/user";

export interface AuthContextType {
    user: AuthUser | null;

    isAuthenticated: boolean;

    login: (user: AuthUser) => void;

    logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);