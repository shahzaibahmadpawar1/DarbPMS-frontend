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

/** Sidebar / permissions: treat Legal department case-insensitively (API may vary). */
export function isLegalDepartment(department: unknown): boolean {
    return String(department ?? '').trim().toLowerCase() === 'legal';
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

    async search(query: string, limit = 50, department?: Department): Promise<Array<{ id: string; username: string; role: UserRole; department: Department | null; email?: string | null }>> {
        const token = localStorage.getItem('auth_token');
        const deptParam = department ? `&department=${encodeURIComponent(department)}` : '';
        const url = `${API_URL}/users/search?query=${encodeURIComponent(query || '')}&limit=${encodeURIComponent(String(limit))}${deptParam}`;
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to search users');
        }
        return Array.isArray(result?.data) ? result.data : [];
    },
};

export const investmentWorkflowAPI = {
    withDepartment(url: string, departmentType?: "investment" | "franchise"): string {
        if (!departmentType) return url;
        const sep = url.includes("?") ? "&" : "?";
        return `${url}${sep}departmentType=${encodeURIComponent(departmentType)}`;
    },
    async listRegions(): Promise<any[]> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/investment/locations/regions`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to fetch regions');
        }
        return Array.isArray(result?.data) ? result.data : [];
    },

    async createRegion(name: string): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/investment/locations/regions`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ name }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to create region');
        }
        return result?.data;
    },

    async deleteRegion(id: string): Promise<void> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/investment/locations/regions/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to delete region');
        }
    },

    async listCities(regionId: string): Promise<any[]> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/investment/locations/cities?regionId=${encodeURIComponent(regionId)}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to fetch cities');
        }
        return Array.isArray(result?.data) ? result.data : [];
    },

    async createCity(regionId: string, name: string): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/investment/locations/cities`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ regionId, name }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to create city');
        }
        return result?.data;
    },

    async deleteCity(id: string): Promise<void> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/investment/locations/cities/${encodeURIComponent(id)}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to delete city');
        }
    },

    async listClients(search = ''): Promise<any[]> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/investment/clients?search=${encodeURIComponent(search)}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to fetch clients');
        }
        return Array.isArray(result?.data) ? result.data : [];
    },

    async createClient(payload: any): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/investment/clients`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to create client');
        }
        return result?.data;
    },

    async listOpportunities(
        departmentType?: "investment" | "franchise",
        opts?: { pendingStationAssignment?: boolean },
    ): Promise<any[]> {
        const token = localStorage.getItem('auth_token');
        let url = this.withDepartment(`${API_URL}/investment/opportunities`, departmentType);
        if (opts?.pendingStationAssignment) {
            const sep = url.includes("?") ? "&" : "?";
            url = `${url}${sep}pendingStationAssignment=true`;
        }
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to fetch opportunities');
        }
        return Array.isArray(result?.data) ? result.data : [];
    },

    async getOpportunity(id: string): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/investment/opportunities/${encodeURIComponent(id)}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to fetch opportunity');
        }
        return result?.data;
    },

    async createOpportunity(payload: any, departmentType?: "investment" | "franchise"): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const bodyPayload = departmentType ? { ...payload, departmentType } : payload;
        const response = await fetch(`${API_URL}/investment/opportunities`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyPayload),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to create opportunity');
        }
        return result?.data;
    },

    async ceoSendOpportunityToContract(id: string, payload: { contractDepartment: string; contractManagerUserId: string }): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/investment/opportunities/${encodeURIComponent(id)}/ceo/send-contract`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to send opportunity for contract');
        }
        return result?.data;
    },

    async ceoApproveOpportunity(id: string): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/investment/opportunities/${encodeURIComponent(id)}/ceo/approve`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to approve opportunity');
        }
        return result?.data;
    },

    async publishOpportunityStation(id: string, payload: { stationCode: string; stationName: string }): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/investment/opportunities/${encodeURIComponent(id)}/publish-station`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to publish station');
        }
        return result?.data;
    },

    async ceoRejectOpportunity(id: string): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/investment/opportunities/${encodeURIComponent(id)}/ceo/reject`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to reject opportunity');
        }
        return result?.data;
    },

    async submitOpportunityContract(id: string, payload: { contractFormData: any }): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/investment/opportunities/${encodeURIComponent(id)}/contract/submit`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to submit contract form');
        }
        return result?.data;
    },

    async listStudies(departmentType?: "investment" | "franchise"): Promise<any[]> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(this.withDepartment(`${API_URL}/investment/studies`, departmentType), {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to fetch studies');
        }
        return Array.isArray(result?.data) ? result.data : [];
    },

    async saveStudy(payload: any, departmentType?: "investment" | "franchise"): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const bodyPayload = departmentType ? { ...payload, departmentType } : payload;
        const response = await fetch(`${API_URL}/investment/studies`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyPayload),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to save study');
        }
        return result?.data;
    },

    async submitStudy(id: string, departmentType?: "investment" | "franchise"): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(this.withDepartment(`${API_URL}/investment/studies/${encodeURIComponent(id)}/submit`, departmentType), {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to submit study');
        }
        return result?.data;
    },

    async getStudyDetails(id: string, departmentType?: "investment" | "franchise"): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(this.withDepartment(`${API_URL}/investment/studies/${encodeURIComponent(id)}/details`, departmentType), {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to fetch study details');
        }
        return result?.data;
    },

    async committeeInbox(departmentType?: "investment" | "franchise"): Promise<any[]> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(this.withDepartment(`${API_URL}/investment/committee/inbox`, departmentType), {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to fetch committee inbox');
        }
        return Array.isArray(result?.data) ? result.data : [];
    },

    async submitOpinion(
        studyId: string,
        department: string,
        opinionPayload: any,
        departmentType?: "investment" | "franchise",
    ): Promise<any> {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${API_URL}/investment/studies/${encodeURIComponent(studyId)}/opinions/${encodeURIComponent(department)}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(departmentType ? { opinionPayload, departmentType } : { opinionPayload }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || 'Failed to submit opinion');
        }
        return result?.data;
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

const SIDEBAR_NAV_CFG_CACHE_KEY = "darb_sidebar_nav_cfg_cache_v1";

function sidebarNavCacheStorageKey(): string {
    try {
        const userRaw = localStorage.getItem("auth_user");
        if (!userRaw) return SIDEBAR_NAV_CFG_CACHE_KEY;
        const user = JSON.parse(userRaw) as { id?: string };
        return user?.id ? `${SIDEBAR_NAV_CFG_CACHE_KEY}:${user.id}` : SIDEBAR_NAV_CFG_CACHE_KEY;
    } catch {
        return SIDEBAR_NAV_CFG_CACHE_KEY;
    }
}

function readSidebarNavCfgCache(): { order: string[] | null; nestedOrder: unknown | null } {
    try {
        const raw = localStorage.getItem(sidebarNavCacheStorageKey());
        if (!raw) return { order: null, nestedOrder: null };
        const parsed = JSON.parse(raw) as { order?: unknown; nestedOrder?: unknown };
        const order = Array.isArray(parsed?.order)
            ? parsed.order.filter((v): v is string => typeof v === "string")
            : null;
        return { order: order?.length ? order : null, nestedOrder: parsed?.nestedOrder ?? null };
    } catch {
        return { order: null, nestedOrder: null };
    }
}

function writeSidebarNavCfgCache(payload: { order: string[] | null; nestedOrder: unknown | null }) {
    try {
        localStorage.setItem(sidebarNavCacheStorageKey(), JSON.stringify(payload));
    } catch {
        // Best-effort cache only.
    }
}

function alignOrderToAllowed(order: string[], allowed: string[]): string[] {
    const allowedSet = new Set(allowed);
    const seen = new Set<string>();
    const out: string[] = [];
    for (const slot of order) {
        if (!allowedSet.has(slot) || seen.has(slot)) continue;
        out.push(slot);
        seen.add(slot);
    }
    for (const slot of allowed) {
        if (!seen.has(slot)) out.push(slot);
    }
    return out;
}

function alignNestedToServerShape(
    requestedNested: unknown | null,
    serverNested: unknown,
): Record<string, string[]> | null {
    if (!requestedNested || typeof requestedNested !== "object") return null;
    if (!serverNested || typeof serverNested !== "object") return null;
    const requested = requestedNested as Record<string, unknown>;
    const server = serverNested as Record<string, unknown>;
    const normalized: Record<string, string[]> = {};
    for (const key of Object.keys(server)) {
        const allowedRaw = server[key];
        if (!Array.isArray(allowedRaw)) continue;
        const allowed = allowedRaw.filter((v): v is string => typeof v === "string");
        if (allowed.length === 0) continue;
        const requestedRaw = requested[key];
        const requestedItems = Array.isArray(requestedRaw)
            ? requestedRaw.filter((v): v is string => typeof v === "string")
            : [];
        normalized[key] = alignOrderToAllowed(requestedItems, allowed);
    }
    return Object.keys(normalized).length > 0 ? normalized : null;
}

export const appSettingsAPI = {
    async getSidebarNavSlots(): Promise<string[] | null> {
        const cfg = await this.getSidebarNavConfig();
        return cfg.order;
    },

    async getSidebarNavConfig(): Promise<{ order: string[] | null; nestedOrder: unknown | null }> {
        const token = localStorage.getItem("auth_token");
        const cached = readSidebarNavCfgCache();
        const response = await fetch(`${API_URL}/app-settings/sidebar-nav-slots`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || "Failed to load sidebar order");
        }
        const order = result?.data?.order;
        const nestedOrder = result?.data?.nestedOrder ?? cached.nestedOrder ?? null;
        const resolvedOrder = Array.isArray(order) ? order : cached.order;
        writeSidebarNavCfgCache({
            order: Array.isArray(resolvedOrder) ? resolvedOrder : null,
            nestedOrder,
        });
        return { order: Array.isArray(resolvedOrder) ? resolvedOrder : null, nestedOrder };
    },

    async putSidebarNavSlots(order: string[]): Promise<void> {
        await this.putSidebarNavConfig(order, null);
    },

    async putSidebarNavConfig(order: string[], nestedOrder: unknown | null): Promise<void> {
        const token = localStorage.getItem("auth_token");
        const doPut = async (payloadOrder: string[], payloadNestedOrder: unknown | null) =>
            fetch(`${API_URL}/app-settings/sidebar-nav-slots`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ order: payloadOrder, nestedOrder: payloadNestedOrder }),
        });

        let response = await doPut(order, nestedOrder);
        let result = await response.json().catch(() => ({}));
        if (response.ok) {
            writeSidebarNavCfgCache({ order, nestedOrder });
            return;
        }

        const message = String(result?.error || result?.message || "");
        const maybeOldBackendInvalidOrder = response.status === 400 && /invalid\s+order/i.test(message);
        if (maybeOldBackendInvalidOrder) {
            // Fetch current server shape and align payload to what backend currently supports.
            const readResponse = await fetch(`${API_URL}/app-settings/sidebar-nav-slots`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const readResult = await readResponse.json().catch(() => ({}));
            const serverOrder = Array.isArray(readResult?.data?.order)
                ? readResult.data.order.filter((v: unknown): v is string => typeof v === "string")
                : [];
            const alignedOrder = serverOrder.length > 0 ? alignOrderToAllowed(order, serverOrder) : order;
            const alignedNested = alignNestedToServerShape(nestedOrder, readResult?.data?.nestedOrder);

            response = await doPut(alignedOrder, alignedNested);
            result = await response.json().catch(() => ({}));
            if (response.ok) {
                writeSidebarNavCfgCache({ order: alignedOrder, nestedOrder });
                return;
            }

            // Some older backends reject nestedOrder entirely; keep local cache and persist only order.
            response = await doPut(alignedOrder, null);
            result = await response.json().catch(() => ({}));
            if (response.ok) {
                writeSidebarNavCfgCache({ order: alignedOrder, nestedOrder });
                return;
            }
        }

        throw new Error(result?.error || result?.message || "Failed to save sidebar order");
    },

    async getMySidebarNavConfig(): Promise<{ order: string[] | null; nestedOrder: unknown | null }> {
        const token = localStorage.getItem("auth_token");
        const cached = readSidebarNavCfgCache();
        const response = await fetch(`${API_URL}/app-settings/my-sidebar-nav`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || "Failed to load sidebar order");
        }
        const order = result?.data?.order;
        const nestedOrder = result?.data?.nestedOrder ?? cached.nestedOrder ?? null;
        const resolvedOrder = Array.isArray(order) ? order : cached.order;
        writeSidebarNavCfgCache({
            order: Array.isArray(resolvedOrder) ? resolvedOrder : null,
            nestedOrder,
        });
        return { order: Array.isArray(resolvedOrder) ? resolvedOrder : null, nestedOrder };
    },

    async putMySidebarNavConfig(order: string[], nestedOrder: unknown | null): Promise<void> {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(`${API_URL}/app-settings/my-sidebar-nav`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ order, nestedOrder }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || "Failed to save sidebar order");
        }
        writeSidebarNavCfgCache({ order, nestedOrder });
    },

    async getSurveyDropdowns(): Promise<{
        stationStatusOptions: Array<{ value: string; label: string }>;
        stageOptions: Array<{ value: string; label: string }>;
    }> {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(`${API_URL}/app-settings/survey-dropdowns`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || "Failed to load survey dropdowns");
        }
        const data = result?.data;
        return {
            stationStatusOptions: Array.isArray(data?.stationStatusOptions) ? data.stationStatusOptions : [],
            stageOptions: Array.isArray(data?.stageOptions) ? data.stageOptions : [],
        };
    },

    async putSurveyDropdowns(payload: {
        stationStatusOptions: Array<{ value: string; label: string }>;
        stageOptions: Array<{ value: string; label: string }>;
    }): Promise<void> {
        const token = localStorage.getItem("auth_token");
        const response = await fetch(`${API_URL}/app-settings/survey-dropdowns`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
            throw new Error(result?.error || result?.message || "Failed to save survey dropdowns");
        }
    },
};
