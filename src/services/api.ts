// API Base URL from environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// User roles
export type UserRole = 'admin' | 'user';

// API Response types
export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    token?: string;
    user?: {
        id: string;
        username: string;
        role: UserRole;
        station_id: string | null;
        created_at: string;
        updated_at: string;
    };
}

// Auth API
export const authAPI = {
    // Login user
    async login(username: string, password: string): Promise<ApiResponse> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }

        return response.json();
    },

    // Register user
    async register(username: string, password: string): Promise<ApiResponse> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }

        return response.json();
    },

    // Get user profile
    async getProfile(token: string): Promise<ApiResponse> {
        const response = await fetch(`${API_URL}/auth/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to get profile');
        }

        return response.json();
    },
};

// Health check
export const healthCheck = async (): Promise<any> => {
    const response = await fetch(`${API_URL}/health`);
    return response.json();
};
