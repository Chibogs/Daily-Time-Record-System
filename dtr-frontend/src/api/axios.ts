import axios from "axios";
import { getToken, logout } from "../services/authService";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:5240/api",
});

// Add a request interceptor to include the token in the Authorization header
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    }
);

// Handle 401 Unauthorized responses globally
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (
            error.response?.status === 401 &&
            // Handle 401 globally except for the login endpoint.
            !error.config?.url?.includes("/auth/login")
        ) {
            logout();
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default apiClient;