// API Base URL from environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export type Department = 'investment' | 'franchise';

// User roles
export type UserRole = 'super_admin' | 'department_manager' | 'supervisor' | 'employee';

export function normalizeUserRole(role: unknown): UserRole {
    const normalized = String(role ?? '').trim().toLowerCase();

    if (normalized === 'admin') {
        return 'super_admin';
    }

    if (normalized === 'super_admin' || normalized === 'department_manager' || normalized === 'supervisor' || normalized === 'employee') {
        return normalized;
    }

    return 'employee';
}

// Helper: human-readable label for each role
export function getRoleLabel(role: UserRole | 'admin' | string): string {
    switch (normalizeUserRole(role)) {
        case 'super_admin': return 'Super Admin';
        case 'department_manager': return 'Department Manager';
        case 'supervisor': return 'Supervisor';
        case 'employee': return 'Employee';
        default: return role;
    }
}

export function getDepartmentLabel(department: Department | null): string {
    if (!department) {
        return 'All Departments';
    }

    return department === 'investment' ? 'Investment' : 'Franchise';
}

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
        department: Department | null;
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

// User interface for admin management
export interface UserRecord {
    id: string;
    username: string;
    password: string;
    role: UserRole;
    department: Department | null;
    station_id: string | null;
    created_at: string;
    updated_at: string;
}

// Users API (admin only)
export const usersAPI = {
    async getAll(): Promise<UserRecord[]> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/auth/users`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch users');
        }
        const data = await response.json();
        return data.data;
    },

    async create(username: string, password: string, role: UserRole, department: Department | null): Promise<void> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/auth/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password, role, department }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create user');
        }
    },

    async delete(id: string): Promise<void> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/auth/users/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete user');
        }
    },
};
