// API Base URL from environment variables
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export type Department =
    | 'investment'
    | 'franchise'
    | 'it'
    | 'project'
    | 'finance'
    | 'operation'
    | 'maintanance'
    | 'hr'
    | 'realestate'
    | 'procurement'
    | 'quality'
    | 'marketing'
    | 'property_management'
    | 'legal'
    | 'government_relations'
    | 'safety';

export const departmentOptions: Array<{ value: Department; label: string }> = [
    { value: 'investment', label: 'Investment' },
    { value: 'franchise', label: 'Franchise' },
    { value: 'it', label: 'IT' },
    { value: 'project', label: 'Project' },
    { value: 'finance', label: 'Finance' },
    { value: 'operation', label: 'Operation' },
    { value: 'maintanance', label: 'Maintanance' },
    { value: 'hr', label: 'HR' },
    { value: 'realestate', label: 'Realestate' },
    { value: 'procurement', label: 'Procurement' },
    { value: 'quality', label: 'Quality' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'property_management', label: 'Property Management' },
    { value: 'legal', label: 'Legal' },
    { value: 'government_relations', label: 'Government Relations' },
    { value: 'safety', label: 'Safety' },
];

const departmentLabelMap: Record<Department, string> = departmentOptions.reduce((labels, option) => {
    labels[option.value] = option.label;
    return labels;
}, {} as Record<Department, string>);
export type UserType = 'internal' | 'external';
export type UserStatus = 'active' | 'inactive';

// User roles
export type UserRole = 'super_admin' | 'ceo' | 'department_manager' | 'supervisor' | 'employee';

export function normalizeUserRole(role: unknown): UserRole {
    const normalized = String(role ?? '').trim().toLowerCase();

    if (normalized === 'admin') {
        return 'super_admin';
    }

    if (normalized === 'ceo') {
        return 'ceo';
    }

    if (normalized === 'super_admin' || normalized === 'ceo' || normalized === 'department_manager' || normalized === 'supervisor' || normalized === 'employee') {
        return normalized;
    }

    return 'employee';
}

// Helper: human-readable label for each role
export function getRoleLabel(role: UserRole | 'admin' | string): string {
    switch (normalizeUserRole(role)) {
        case 'super_admin': return 'Super Admin';
        case 'ceo': return 'CEO';
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

    return departmentLabelMap[department] || department;
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
        full_name: string | null;
        email: string | null;
        phone: string | null;
        user_type: UserType;
        status: UserStatus;
        station_codes?: string[];
        last_login_at?: string | null;
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
    full_name: string | null;
    email: string | null;
    phone: string | null;
    user_type: UserType;
    status: UserStatus;
    station_codes?: string[];
    created_at: string;
    updated_at: string;
}

export interface StationOption {
    station_code: string;
    station_name: string;
}

export interface AdminUserPayload {
    username: string;
    password: string;
    role?: UserRole;
    department?: Department | null;
    full_name?: string;
    email?: string;
    phone?: string;
    user_type: UserType;
    status?: UserStatus;
    station_codes?: string[];
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

    async create(payload: AdminUserPayload): Promise<void> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/auth/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create user');
        }
    },

    async update(id: string, payload: AdminUserPayload): Promise<void> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/auth/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update user');
        }
    },

    async updateStatus(id: string, status: UserStatus): Promise<void> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/auth/users/${id}/status`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update user status');
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

    async getStations(): Promise<StationOption[]> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/stations`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || error.message || 'Failed to fetch stations');
        }

        const result = await response.json();
        const data = Array.isArray(result?.data) ? result.data : [];

        return data
            .map((station: any) => ({
                station_code: String(station.station_code || ''),
                station_name: String(station.station_name || station.station_code || ''),
            }))
            .filter((station: StationOption) => station.station_code.length > 0);
    },

    async getDepartmentManagers(department: Department): Promise<Array<{ id: string; username: string; department: Department | null }>> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/users/department-managers?department=${encodeURIComponent(department)}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error?.error || error?.message || 'Failed to fetch department managers');
        }
        const result = await response.json();
        return Array.isArray(result?.data) ? result.data : [];
    },
};

export const feasibilityAPI = {
    async submitFeasibility(payload: any): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/feasibility/submit`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to submit feasibility study');
        }
        return result?.data;
    },

    async submitManagerReview(taskId: string, payload: {
        suggestions: string;
        budget: string;
        timeDuration: string;
        percentage: string;
        requirements: string;
    }): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/tasks/${encodeURIComponent(taskId)}/feasibility-submit`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to submit feasibility review');
        }
        return result?.data;
    },

    async setDepartmentUnlock(taskId: string, payload: { department: string; unlock: boolean }): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/tasks/${encodeURIComponent(taskId)}/feasibility-unlock`, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to update feasibility unlock');
        }
        return result?.data;
    },

    async getDetails(taskId: string): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/feasibility/${encodeURIComponent(taskId)}/details`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to fetch feasibility details');
        }
        return result?.data;
    },
};
