import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    Search,
    ShieldCheck,
    Upload,
    User,
} from "lucide-react";

type WorkflowTaskStatus =
    | "manager_queue"
    | "assigned"
    | "employee_submitted"
    | "under_super_admin_review"
    | "approved"
    | "rejected";

type WorkflowTaskFlow = "contract" | "documents";
type RoleViewTab = "manager" | "employee" | "super-admin";

interface WorkflowTask {
    id: string;
    investment_project_id: string;
    title: string;
    description: string | null;
    flow_type: WorkflowTaskFlow;
    status: WorkflowTaskStatus;
    origin_department: "investment" | "franchise";
    target_department: "investment" | "franchise";
    assigned_to: string | null;
    assigned_by: string | null;
    manager_attachment_url: string | null;
    employee_attachment_url: string | null;
    manager_note: string | null;
    employee_note: string | null;
    super_admin_comment: string | null;
    created_at: string;
    updated_at: string;
    project_name: string;
    project_code: string;
    review_status: string;
    city: string | null;
    assigned_to_username: string | null;
    assigned_by_username: string | null;
}

interface AssignableUser {
    id: string;
    username: string;
    role: string;
    department: "investment" | "franchise" | null;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const statusLabel: Record<WorkflowTaskStatus, string> = {
    manager_queue: "Manager Queue",
    assigned: "Assigned",
    employee_submitted: "Employee Submitted",
    under_super_admin_review: "Under Super Admin Review",
    approved: "Approved",
    rejected: "Rejected",
};

const statusClass: Record<WorkflowTaskStatus, string> = {
    manager_queue: "bg-warning/10 text-warning border-warning/20",
    assigned: "bg-info/10 text-info border-info/20",
    employee_submitted: "bg-info/10 text-info border-info/20",
    under_super_admin_review: "bg-primary/10 text-primary border-primary/20",
    approved: "bg-success/10 text-success border-success/20",
    rejected: "bg-error/10 text-error border-error/20",
};

export function TasksPage() {
    const { token, user } = useAuth();
    const [tasks, setTasks] = useState<WorkflowTask[]>([]);
    const [assignableUsers, setAssignableUsers] = useState<AssignableUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [selectedAssignee, setSelectedAssignee] = useState<Record<string, string>>({});
    const [selectedDepartment, setSelectedDepartment] = useState<Record<string, "investment" | "franchise">>({});
    const [managerFiles, setManagerFiles] = useState<Record<string, File | null>>({});
    const [employeeFiles, setEmployeeFiles] = useState<Record<string, File | null>>({});
    const [reviewComment, setReviewComment] = useState<Record<string, string>>({});

    const canAssign = user?.role === "department_manager" || user?.role === "super_admin";
    const isSuperAdmin = user?.role === "super_admin";

    const [activeTab, setActiveTab] = useState<RoleViewTab>(() => {
        if (isSuperAdmin) return "super-admin";
        if (canAssign) return "manager";
        return "employee";
    });

    useEffect(() => {
        if (isSuperAdmin) {
            setActiveTab("super-admin");
            return;
        }

        if (canAssign) {
            setActiveTab("manager");
            return;
        }

        setActiveTab("employee");
    }, [isSuperAdmin, canAssign]);

    const loadData = async () => {
        if (!token) return;

        setLoading(true);
        try {
            const [tasksResponse, usersResponse] = await Promise.all([
                fetch(`${API_URL}/tasks`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                canAssign
                    ? fetch(`${API_URL}/tasks/assignable-users`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    : Promise.resolve(null),
            ]);

            if (tasksResponse.ok) {
                const tasksResult = await tasksResponse.json();
                setTasks(Array.isArray(tasksResult?.data) ? tasksResult.data : []);
            }

            if (usersResponse && usersResponse.ok) {
                const usersResult = await usersResponse.json();
                setAssignableUsers(Array.isArray(usersResult?.data) ? usersResult.data : []);
            }
        } catch (error) {
            console.error("Failed to fetch workflow tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [token]);

    const matchesSearch = (task: WorkflowTask, query: string): boolean => {
        const q = query.toLowerCase();
        return (
            task.project_name.toLowerCase().includes(q)
            || task.project_code.toLowerCase().includes(q)
            || task.title.toLowerCase().includes(q)
            || task.origin_department.toLowerCase().includes(q)
            || task.target_department.toLowerCase().includes(q)
        );
    };

    const managerTasks = useMemo(() => {
        return tasks.filter((task) => {
            const inManagerFlow = task.status === "manager_queue" || task.status === "assigned" || task.status === "employee_submitted";
            return inManagerFlow && matchesSearch(task, search);
        });
    }, [tasks, search]);

    const employeeTasks = useMemo(() => {
        return tasks.filter((task) => {
            const assignedToMe = task.assigned_to === user?.id;
            const actionable = task.status === "assigned" || task.status === "employee_submitted";
            return assignedToMe && actionable && matchesSearch(task, search);
        });
    }, [tasks, user?.id, search]);

    const superAdminTasks = useMemo(() => {
        return tasks.filter((task) => {
            const reviewWindow = task.status === "under_super_admin_review" || task.status === "approved" || task.status === "rejected";
            return reviewWindow && matchesSearch(task, search);
        });
    }, [tasks, search]);

    const stats = useMemo(() => ({
        total: tasks.length,
        managerQueue: tasks.filter((t) => t.status === "manager_queue").length,
        employeeWork: tasks.filter((t) => t.status === "assigned" || t.status === "employee_submitted").length,
        superAdminReview: tasks.filter((t) => t.status === "under_super_admin_review").length,
        approved: tasks.filter((t) => t.status === "approved").length,
        rejected: tasks.filter((t) => t.status === "rejected").length,
    }), [tasks]);

    const uploadFile = async (file: File): Promise<string | null> => {
        if (!token) return null;

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_URL}/files/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error?.error || "File upload failed");
            return null;
        }

        const result = await response.json();
        return result?.data?.url || null;
    };

    const handleAssign = async (taskId: string) => {
        const assignedToUserId = selectedAssignee[taskId];
        const targetDepartment = selectedDepartment[taskId];

        if (!assignedToUserId || !targetDepartment || !token) {
            alert("Select employee and target department first.");
            return;
        }

        const response = await fetch(`${API_URL}/tasks/${taskId}/assign`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ assignedToUserId, targetDepartment }),
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error?.error || "Failed to assign task");
            return;
        }

        await loadData();
    };

    const handleManagerAttachment = async (taskId: string) => {
        const file = managerFiles[taskId];
        if (!file) {
            alert("Select a file first.");
            return;
        }

        const attachmentUrl = await uploadFile(file);
        if (!attachmentUrl || !token) {
            return;
        }

        const response = await fetch(`${API_URL}/tasks/${taskId}/manager-attachment`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ attachmentUrl }),
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error?.error || "Failed to save manager attachment");
            return;
        }

        await loadData();
    };

    const handleEmployeeSubmit = async (taskId: string) => {
        const file = employeeFiles[taskId];
        if (!file) {
            alert("Select a file first.");
            return;
        }

        const attachmentUrl = await uploadFile(file);
        if (!attachmentUrl || !token) {
            return;
        }

        const response = await fetch(`${API_URL}/tasks/${taskId}/employee-submit`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ attachmentUrl }),
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error?.error || "Failed to submit employee attachment");
            return;
        }

        await loadData();
    };

    const handleSuperAdminReview = async (taskId: string, decision: "approved" | "rejected") => {
        if (!token) return;

        const response = await fetch(`${API_URL}/tasks/${taskId}/review`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ decision, comment: reviewComment[taskId] || "" }),
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error?.error || "Failed to review task");
            return;
        }

        await loadData();
    };

    const onManagerFileChange = (taskId: string, event: ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.files?.[0] || null;
        setManagerFiles((prev) => ({ ...prev, [taskId]: selected }));
    };

    const onEmployeeFileChange = (taskId: string, event: ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.files?.[0] || null;
        setEmployeeFiles((prev) => ({ ...prev, [taskId]: selected }));
    };

    const renderTaskCard = (task: WorkflowTask, mode: RoleViewTab) => {
        const canEmployeeSubmit = task.assigned_to === user?.id || isSuperAdmin;

        return (
            <div key={task.id} className="bg-card/80 rounded-2xl border border-border p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-foreground">{task.project_name}</h3>
                        <p className="text-xs text-muted-foreground">
                            {task.project_code} | {task.flow_type.toUpperCase()} | {task.origin_department} {"->"} {task.target_department}
                        </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full border text-xs font-bold ${statusClass[task.status]}`}>
                        {statusLabel[task.status]}
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <p className="text-muted-foreground"><Clock className="w-4 h-4 inline mr-1" /> Created: {new Date(task.created_at).toLocaleDateString()}</p>
                    <p className="text-muted-foreground"><User className="w-4 h-4 inline mr-1" /> Assigned To: {task.assigned_to_username || "Unassigned"}</p>
                    <p className="text-muted-foreground">Project Status: {task.review_status}</p>
                </div>

                {(mode === "manager" || mode === "employee") && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {mode === "manager" && (
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-muted-foreground uppercase">Manager Attachment</p>
                                <input
                                    type="file"
                                    onChange={(e) => onManagerFileChange(task.id, e)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                />
                                {task.manager_attachment_url && (
                                    <a href={task.manager_attachment_url} target="_blank" rel="noreferrer" className="text-xs text-primary underline">
                                        View uploaded manager attachment
                                    </a>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleManagerAttachment(task.id)}
                                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90"
                                >
                                    <Upload className="w-4 h-4 inline mr-1" /> Upload Manager Attachment
                                </button>
                            </div>
                        )}

                        <div className="space-y-2">
                            <p className="text-xs font-bold text-muted-foreground uppercase">Employee Attachment</p>
                            <input
                                type="file"
                                onChange={(e) => onEmployeeFileChange(task.id, e)}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            />
                            {task.employee_attachment_url && (
                                <a href={task.employee_attachment_url} target="_blank" rel="noreferrer" className="text-xs text-primary underline">
                                    View uploaded employee attachment
                                </a>
                            )}
                            {canEmployeeSubmit && (
                                <button
                                    type="button"
                                    onClick={() => handleEmployeeSubmit(task.id)}
                                    className="px-4 py-2 bg-info text-white rounded-lg text-sm font-semibold hover:bg-info/90"
                                >
                                    <Upload className="w-4 h-4 inline mr-1" /> Submit Employee Attachment
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {mode === "manager" && canAssign && (
                    <div className="border-t border-border pt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <select
                            value={selectedDepartment[task.id] || task.target_department}
                            onChange={(e) => setSelectedDepartment((prev) => ({ ...prev, [task.id]: e.target.value as "investment" | "franchise" }))}
                            className="px-3 py-2 border border-border rounded-lg bg-background"
                        >
                            <option value="investment">investment</option>
                            <option value="franchise">franchise</option>
                        </select>
                        <select
                            value={selectedAssignee[task.id] || ""}
                            onChange={(e) => setSelectedAssignee((prev) => ({ ...prev, [task.id]: e.target.value }))}
                            className="px-3 py-2 border border-border rounded-lg bg-background md:col-span-2"
                        >
                            <option value="">Select assignee</option>
                            {assignableUsers.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.username} ({u.department || "none"})
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => handleAssign(task.id)}
                            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90"
                        >
                            Assign
                        </button>
                    </div>
                )}

                {mode === "super-admin" && task.status === "under_super_admin_review" && (
                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-sm font-semibold text-foreground"><ShieldCheck className="w-4 h-4 inline mr-1" /> Super Admin Decision</p>
                        <textarea
                            rows={2}
                            value={reviewComment[task.id] || ""}
                            onChange={(e) => setReviewComment((prev) => ({ ...prev, [task.id]: e.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            placeholder="Decision comment"
                        />
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => handleSuperAdminReview(task.id, "approved")}
                                className="px-4 py-2 bg-success text-white rounded-lg text-sm font-semibold"
                            >
                                <CheckCircle className="w-4 h-4 inline mr-1" /> Approve
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSuperAdminReview(task.id, "rejected")}
                                className="px-4 py-2 bg-error text-white rounded-lg text-sm font-semibold"
                            >
                                <AlertCircle className="w-4 h-4 inline mr-1" /> Reject
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const visibleTasks = activeTab === "manager"
        ? managerTasks
        : activeTab === "employee"
            ? employeeTasks
            : superAdminTasks;

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-foreground mb-2 tracking-tight">Workflow Tasks</h1>
                <p className="text-muted-foreground font-medium">
                    Role-specific workflow queues for managers, employees, and super admin
                </p>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
                        <div className="bg-card/80 rounded-xl border border-border p-5">
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-3xl font-black text-foreground">{stats.total}</p>
                        </div>
                        <div className="bg-card/80 rounded-xl border border-border p-5">
                            <p className="text-sm text-muted-foreground">Manager Queue</p>
                            <p className="text-3xl font-black text-warning">{stats.managerQueue}</p>
                        </div>
                        <div className="bg-card/80 rounded-xl border border-border p-5">
                            <p className="text-sm text-muted-foreground">Employee Workbench</p>
                            <p className="text-3xl font-black text-info">{stats.employeeWork}</p>
                        </div>
                        <div className="bg-card/80 rounded-xl border border-border p-5">
                            <p className="text-sm text-muted-foreground">Super Admin Review</p>
                            <p className="text-3xl font-black text-primary">{stats.superAdminReview}</p>
                        </div>
                        <div className="bg-card/80 rounded-xl border border-border p-5">
                            <p className="text-sm text-muted-foreground">Approved</p>
                            <p className="text-3xl font-black text-success">{stats.approved}</p>
                        </div>
                        <div className="bg-card/80 rounded-xl border border-border p-5">
                            <p className="text-sm text-muted-foreground">Rejected</p>
                            <p className="text-3xl font-black text-error">{stats.rejected}</p>
                        </div>
                    </div>

                    <div className="bg-card/80 rounded-2xl border border-border p-4 mb-6 space-y-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search by project, code, department..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                            />
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {(canAssign || isSuperAdmin) && (
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("manager")}
                                    className={`px-4 py-2 rounded-lg border text-sm font-semibold ${activeTab === "manager" ? "bg-primary text-white border-primary" : "bg-background border-border text-foreground"}`}
                                >
                                    Manager Queue
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={() => setActiveTab("employee")}
                                className={`px-4 py-2 rounded-lg border text-sm font-semibold ${activeTab === "employee" ? "bg-primary text-white border-primary" : "bg-background border-border text-foreground"}`}
                            >
                                Employee Workbench
                            </button>

                            {isSuperAdmin && (
                                <button
                                    type="button"
                                    onClick={() => setActiveTab("super-admin")}
                                    className={`px-4 py-2 rounded-lg border text-sm font-semibold ${activeTab === "super-admin" ? "bg-primary text-white border-primary" : "bg-background border-border text-foreground"}`}
                                >
                                    Super Admin Review
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-4">
                        {visibleTasks.length === 0 ? (
                            <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
                                No tasks in this view.
                            </div>
                        ) : (
                            visibleTasks.map((task) => renderTaskCard(task, activeTab))
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
