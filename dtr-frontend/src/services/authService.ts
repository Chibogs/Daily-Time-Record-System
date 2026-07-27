import type {LoginResponse} from "../types/auth";
import type { AuthUser } from "../types/user";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export function saveAuthToken(data: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify({
        username: data.username,
        fullName: data.fullName,
        role: data.role,
        expiresAt: data.expiresAt
    }));
}

export function getToken(): string | null{
    return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): AuthUser | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
}

export function logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

export function isAuthenticated(): boolean {
    return !!getToken();
}