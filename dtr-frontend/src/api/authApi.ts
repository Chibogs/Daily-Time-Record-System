import apiClient from "./axios";
import type { LoginRequest, LoginResponse } from "../types/auth";

export async function login(request: LoginRequest): Promise<LoginResponse> {

    // Send a POST request to the login endpoint with the provided request data
    
    //<LoginResponse> is a TypeScript type assertion that specifies the expected response type from the API call. It tells TypeScript that the response data will conform to the LoginResponse interface, allowing for better type checking and autocompletion when working with the response data.
    const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    request
);
    return response.data;
}