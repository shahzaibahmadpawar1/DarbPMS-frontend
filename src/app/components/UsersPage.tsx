import { useState, useEffect } from "react";
import { Users, UserPlus, Trash2, Eye, EyeOff, X, Loader2, Shield } from "lucide-react";
import { Department, getDepartmentLabel, getRoleLabel, usersAPI, UserRecord, UserRole, UserType, UserStatus, StationOption } from "@/services/api";

export function UsersPage() {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [stations, setStations] = useState<StationOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
    const [showAddModal, setShowAddModal] = useState(false);
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [statusLoadingId, setStatusLoadingId] = useState<string | null>(null);

    // New user form state
    const [newFullName, setNewFullName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newUserType, setNewUserType] = useState<UserType>("internal");
    const [newRole, setNewRole] = useState<UserRole>("employee");
    const [newDepartment, setNewDepartment] = useState<Department>("investment");
    const [newStatus, setNewStatus] = useState<UserStatus>("active");
    const [newStationCodes, setNewStationCodes] = useState<string[]>([]);
    const [formError, setFormError] = useState<string | null>(null);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const [usersData, stationsData] = await Promise.all([usersAPI.getAll(), usersAPI.getStations()]);
            setUsers(usersData);
            setStations(stationsData);
        } catch (err: any) {
            setError(err.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const togglePasswordVisibility = (userId: string) => {
        setShowPasswords((prev) => ({ ...prev, [userId]: !prev[userId] }));
    };

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (newUserType === "external" && newStationCodes.length === 0) {
            setFormError("Please select at least one station for external users.");
            return;
        }

        setActionLoading(true);
        try {
            const department = newUserType === "internal" && newRole !== "super_admin" ? newDepartment : null;

            await usersAPI.create({
                username: newUsername,
                password: newPassword,
                role: newUserType === "internal" ? newRole : "employee",
                department,
                full_name: newFullName.trim() || undefined,
                email: newEmail.trim() || undefined,
                phone: newPhone.trim() || undefined,
                user_type: newUserType,
                status: newStatus,
                station_codes: newUserType === "external" ? newStationCodes : [],
            });

            setShowAddModal(false);
            setNewFullName("");
            setNewEmail("");
            setNewPhone("");
            setNewUsername("");
            setNewPassword("");
            setNewUserType("internal");
            setNewRole("employee");
            setNewDepartment("investment");
            setNewStatus("active");
            setNewStationCodes([]);
            await fetchUsers();
        } catch (err: any) {
            setFormError(err.message || "Failed to create user");
        } finally {
            setActionLoading(false);
        }
    };

    const handleStatusChange = async (id: string, status: UserStatus) => {
        setStatusLoadingId(id);
        setError(null);
        try {
            await usersAPI.updateStatus(id, status);
            setUsers((prev) => prev.map((user) => (user.id === id ? { ...user, status } : user)));
        } catch (err: any) {
            setError(err.message || "Failed to update user status");
            await fetchUsers();
        } finally {
            setStatusLoadingId(null);
        }
    };

    const toggleStationSelection = (stationCode: string) => {
        setNewStationCodes((prev) => (
            prev.includes(stationCode)
                ? prev.filter((code) => code !== stationCode)
                : [...prev, stationCode]
        ));
    };

    const handleDeleteUser = async (id: string) => {
        setActionLoading(true);
        try {
            await usersAPI.delete(id);
            setDeleteConfirmId(null);
            await fetchUsers();
        } catch (err: any) {
            setError(err.message || "Failed to delete user");
        } finally {
            setActionLoading(false);
        }
    };

    const roleBadgeColor = (role: UserRole) => {
        switch (role) {
            case "super_admin": return "bg-red-100 text-red-700 border border-red-200";
            case "department_manager": return "bg-green-100 text-green-700 border border-green-200";
            case "supervisor": return "bg-primary/10 text-primary border border-primary/20";
            default: return "bg-info/10 text-info border border-info/20";
        }
    };

    const departmentBadgeColor = (department: Department | null) => {
        if (!department) {
            return "bg-zinc-100 text-zinc-700 border border-zinc-200";
        }

        return department === "investment"
            ? "bg-info/10 text-info border border-info/20"
            : "bg-primary/10 text-primary border border-primary/20";
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                        <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-foreground">Users Management</h1>
                        <p className="text-sm text-muted-foreground">Manage system users and their roles</p>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setShowAddModal(true);
                        setFormError(null);
                        setNewFullName("");
                        setNewEmail("");
                        setNewPhone("");
                        setNewUsername("");
                        setNewPassword("");
                        setNewUserType("internal");
                        setNewRole("employee");
                        setNewDepartment("investment");
                        setNewStatus("active");
                        setNewStationCodes([]);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-sm"
                >
                    <UserPlus className="w-4 h-4" />
                    Add New User
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                    <span className="text-sm">{error}</span>
                    <button onClick={() => setError(null)}><X className="w-4 h-4" /></button>
                </div>
            )}

            {/* Users Table */}
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <Users className="w-12 h-12 mb-3 opacity-30" />
                        <p className="text-sm">No users found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-muted/50 border-b border-border">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">#</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Username</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Phone</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User Type</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Created At</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {users.map((user, index) => (
                                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 text-sm text-muted-foreground">{index + 1}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-foreground whitespace-nowrap">
                                            {user.full_name || "N/A"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                                                    <span className="text-xs font-bold text-primary uppercase">{user.username[0]}</span>
                                                </div>
                                                <span className="text-sm font-medium text-foreground">{user.username}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-foreground whitespace-nowrap">{user.email || "N/A"}</td>
                                        <td className="px-6 py-4 text-sm text-foreground whitespace-nowrap">{user.phone || "N/A"}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-mono text-foreground">
                                                    {showPasswords[user.id] ? user.password : "********"}
                                                </span>
                                                <button
                                                    onClick={() => togglePasswordVisibility(user.id)}
                                                    className="p-1 hover:bg-muted rounded transition-colors text-muted-foreground hover:text-foreground"
                                                    title={showPasswords[user.id] ? "Hide password" : "Show password"}
                                                >
                                                    {showPasswords[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                                                user.user_type === "external"
                                                    ? "bg-orange-100 text-orange-700 border border-orange-200"
                                                    : "bg-slate-100 text-slate-700 border border-slate-200"
                                            }`}>
                                                {user.user_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${roleBadgeColor(user.role)}`}>
                                                <Shield className="w-3 h-3" />
                                                {getRoleLabel(user.role)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${departmentBadgeColor(user.department)}`}>
                                                {getDepartmentLabel(user.department)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={user.status || "active"}
                                                disabled={statusLoadingId === user.id}
                                                onChange={(e) => handleStatusChange(user.id, e.target.value as UserStatus)}
                                                className="px-2.5 py-1 text-xs font-semibold rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                            >
                                                <option value="active">Active</option>
                                                <option value="inactive">Non-Active</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted-foreground">
                                            {new Date(user.created_at).toLocaleDateString("en-US", {
                                                year: "numeric", month: "short", day: "numeric"
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {deleteConfirmId === user.id ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <span className="text-xs text-muted-foreground">Confirm delete?</span>
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        disabled={actionLoading}
                                                        className="px-3 py-1 bg-red-500 text-white rounded text-xs font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
                                                    >
                                                        {actionLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : "Yes"}
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirmId(null)}
                                                        className="px-3 py-1 bg-muted text-foreground rounded text-xs font-semibold hover:bg-muted/80 transition-colors"
                                                    >
                                                        No
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setDeleteConfirmId(user.id)}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete user"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Add User Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-lg font-bold text-foreground">Add New User</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleAddUser} className="p-6 space-y-4">
                            {formError && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {formError}
                                </div>
                            )}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Full Name</label>
                                <input
                                    type="text"
                                    value={newFullName}
                                    onChange={(e) => setNewFullName(e.target.value)}
                                    placeholder="Enter full name"
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Email</label>
                                <input
                                    type="email"
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    placeholder="Enter email"
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Phone #</label>
                                <input
                                    type="text"
                                    value={newPhone}
                                    onChange={(e) => setNewPhone(e.target.value)}
                                    placeholder="Enter phone number"
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Username</label>
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    placeholder="Enter username"
                                    required
                                    minLength={3}
                                    maxLength={50}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter password (min. 6 characters)"
                                        required
                                        minLength={6}
                                        className="w-full px-3 py-2 pr-10 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">User Type</label>
                                <select
                                    value={newUserType}
                                    onChange={(e) => setNewUserType(e.target.value as UserType)}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                                >
                                    <option value="internal">Internal</option>
                                    <option value="external">External</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-foreground">Status</label>
                                <select
                                    value={newStatus}
                                    onChange={(e) => setNewStatus(e.target.value as UserStatus)}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Non-Active</option>
                                </select>
                            </div>
                            {newUserType === "internal" && (
                                <>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-foreground">Role</label>
                                        <select
                                            value={newRole}
                                            onChange={(e) => setNewRole(e.target.value as UserRole)}
                                            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                                        >
                                            <option value="employee">Employee</option>
                                            <option value="supervisor">Supervisor</option>
                                            <option value="department_manager">Department Manager</option>
                                            <option value="super_admin">Super Admin</option>
                                        </select>
                                    </div>
                                    {newRole !== "super_admin" && (
                                        <div className="space-y-1.5">
                                            <label className="text-sm font-medium text-foreground">Department</label>
                                            <select
                                                value={newDepartment}
                                                onChange={(e) => setNewDepartment(e.target.value as Department)}
                                                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                                            >
                                                <option value="investment">Investment</option>
                                                <option value="franchise">Franchise</option>
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}

                            {newUserType === "external" && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Stations (Select one or more)</label>
                                    <div className="max-h-40 overflow-y-auto border border-border rounded-lg bg-background p-2 space-y-1.5">
                                        {stations.length === 0 ? (
                                            <p className="text-xs text-muted-foreground px-1 py-2">No stations available</p>
                                        ) : (
                                            stations.map((station) => (
                                                <label key={station.station_code} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={newStationCodes.includes(station.station_code)}
                                                        onChange={() => toggleStationSelection(station.station_code)}
                                                    />
                                                    <span className="text-foreground">{station.station_name}</span>
                                                    <span className="text-xs text-muted-foreground">({station.station_code})</span>
                                                </label>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-2 border border-border text-foreground rounded-lg text-sm font-semibold hover:bg-muted transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={actionLoading}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {actionLoading ? (
                                        <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</>
                                    ) : (
                                        <><UserPlus className="w-4 h-4" /> Create User</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

