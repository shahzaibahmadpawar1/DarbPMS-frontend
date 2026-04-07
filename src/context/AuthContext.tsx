import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI, ApiResponse, Department, UserRole, UserStatus, UserType, normalizeUserRole } from '@/services/api';

interface User {
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
    created_at: string;
    updated_at: string;
}

function normalizeUser(user: any): User {
    return {
        ...user,
        role: normalizeUserRole(user?.role),
    };
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check for existing token on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(normalizeUser(JSON.parse(storedUser)));
        }
        setIsLoading(false);
    }, []);

    const login = async (username: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response: ApiResponse = await authAPI.login(username, password);

            if (response.success && response.token && response.user) {
                const normalizedUser = normalizeUser(response.user);

                // Store token and user in localStorage
                localStorage.setItem('auth_token', response.token);
                localStorage.setItem('auth_user', JSON.stringify(normalizedUser));

                // Update state
                setToken(response.token);
                setUser(normalizedUser);
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred during login');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        // Clear localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');

        // Clear state
        setToken(null);
        setUser(null);
        setError(null);
    };

    const value: AuthContextType = {
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        logout,
        error,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
