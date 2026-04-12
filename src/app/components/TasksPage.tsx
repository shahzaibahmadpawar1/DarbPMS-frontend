import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
    AlertCircle,
    CheckCircle,
    Clock,
    FileText,
    Search,
    ShieldCheck,
    Upload,
    User,
} from "lucide-react";

type WorkflowTaskStatus =
    | "manager_queue"
    | "assigned"
    | "employee_submitted"
    | "manager_submitted"
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
    workflow_path: WorkflowTaskFlow | null;
    city: string | null;
    assigned_to_username: string | null;
    assigned_by_username: string | null;
}

interface WorkflowHistoryEntry {
    id: string;
    entity_type: string;
    entity_id: string;
    old_state: string | null;
    new_state: string;
    note: string | null;
    metadata: Record<string, unknown> | null;
    created_at: string;
    changed_by_username: string | null;
    changed_by_role: string | null;
}

interface AssignableUser {
    id: string;
    username: string;
    role: string;
    department: "investment" | "franchise" | null;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const TASKS_PAGE_SIZE = 200;

const fetchAllWorkflowTasks = async (token: string): Promise<WorkflowTask[]> => {
    const allTasks: WorkflowTask[] = [];
    let offset = 0;

    while (true) {
        const response = await fetch(`${API_URL}/tasks?limit=${TASKS_PAGE_SIZE}&offset=${offset}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch workflow tasks");
        }

        const result = await response.json();
        const pageItems = Array.isArray(result?.data) ? result.data : [];
        allTasks.push(...pageItems);

        if (pageItems.length < TASKS_PAGE_SIZE) {
            break;
        }

        offset += TASKS_PAGE_SIZE;
    }

    return allTasks;
};

const statusLabel: Record<WorkflowTaskStatus, string> = {
    manager_queue: "Manager Queue",
    assigned: "Assigned",
    employee_submitted: "Employee Submitted",
    manager_submitted: "Manager Submitted",
    under_super_admin_review: "Under Super Admin Review",
    approved: "Approved",
    rejected: "Rejected",
};

const statusClass: Record<WorkflowTaskStatus, string> = {
    manager_queue: "bg-warning/10 text-warning border-warning/20",
    assigned: "bg-info/10 text-info border-info/20",
    employee_submitted: "bg-info/10 text-info border-info/20",
    manager_submitted: "bg-primary/10 text-primary border-primary/20",
    under_super_admin_review: "bg-primary/10 text-primary border-primary/20",
    approved: "bg-success/10 text-success border-success/20",
    rejected: "bg-error/10 text-error border-error/20",
};

const stageLabel: Record<WorkflowTaskStatus, string> = {
    manager_queue: "Manager queue",
    assigned: "Assigned to user",
    employee_submitted: "Employee submitted",
    manager_submitted: "Manager submitted",
    under_super_admin_review: "Super admin review",
    approved: "Approved",
    rejected: "Rejected",
};

const branchLabel: Record<WorkflowTaskFlow, string> = {
    contract: "Contract",
    documents: "Document",
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
    const [managerComment, setManagerComment] = useState<Record<string, string>>({});
    const [branchDepartment, setBranchDepartment] = useState<Record<string, "investment" | "franchise">>({});
    const [branchAssignee, setBranchAssignee] = useState<Record<string, string>>({});
    const [taskHistory, setTaskHistory] = useState<Record<string, { task: WorkflowTask; history: WorkflowHistoryEntry[] }>>({});
    const [expandedHistoryTaskId, setExpandedHistoryTaskId] = useState<string | null>(null);

    const canAssign = user?.role === "department_manager" || user?.role === "super_admin" || user?.role === "supervisor";
    const canValidateAsManager = user?.role === "department_manager" || user?.role === "super_admin";
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
            const [allTasks, usersResponse] = await Promise.all([
                fetchAllWorkflowTasks(token),
                canAssign
                    ? fetch(`${API_URL}/tasks/assignable-users`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    : Promise.resolve(null),
            ]);

            setTasks(allTasks);

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
    }, [token, canAssign]);

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
            return matchesSearch(task, search);
        });
    }, [tasks, search]);

    const employeeTasks = useMemo(() => {
        return tasks.filter((task) => {
            const assignedToMe = task.assigned_to === user?.id;
            return assignedToMe && matchesSearch(task, search);
        });
    }, [tasks, user?.id, search]);

    const superAdminTasks = useMemo(() => {
        return tasks.filter((task) => {
            return matchesSearch(task, search);
        });
    }, [tasks, search]);

    const stats = useMemo(() => ({
        total: tasks.length,
        managerQueue: tasks.filter((t) => t.status === "manager_queue").length,
        employeeWork: tasks.filter((t) => t.status === "assigned" || t.status === "employee_submitted").length,
        superAdminReview: tasks.filter((t) => t.status === "manager_submitted" || t.status === "under_super_admin_review").length,
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
        const task = tasks.find((item) => item.id === taskId);
        const isAlreadyAssigned = !!task?.assigned_to || task?.status !== "manager_queue";
        if (isAlreadyAssigned) {
            alert("Task is already assigned and cannot be reassigned.");
            return;
        }

        const assignedToUserId = selectedAssignee[taskId];
        const fallbackDepartment = task?.target_department;
        const targetDepartment = selectedDepartment[taskId] || fallbackDepartment;

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
        let attachmentUrl: string | null = null;
        if (file) {
            attachmentUrl = await uploadFile(file);
        }

        if ((file && !attachmentUrl) || !token) {
            return;
        }

        const response = await fetch(`${API_URL}/tasks/${taskId}/employee-submit`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ attachmentUrl: attachmentUrl || undefined }),
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

    const handleSuperAdminBranch = async (taskId: string, decision: "contract" | "document") => {
        if (!token) return;

        const assignedToUserId = branchAssignee[taskId];
        const targetDepartment = branchDepartment[taskId] || tasks.find((task) => task.id === taskId)?.target_department;

        if (!assignedToUserId || !targetDepartment) {
            alert("Select department and manager first.");
            return;
        }

        const response = await fetch(`${API_URL}/tasks/${taskId}/review`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ decision, comment: reviewComment[taskId] || "", assignedToUserId, targetDepartment }),
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error?.error || "Failed to route task");
            return;
        }

        await loadData();
    };

    const handleManagerValidate = async (taskId: string) => {
        if (!token) return;

        const response = await fetch(`${API_URL}/tasks/${taskId}/manager-validate`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ comment: managerComment[taskId] || "" }),
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error?.error || "Failed to validate task");
            return;
        }

        await loadData();
    };

    const handleManagerSubmit = async (taskId: string) => {
        const file = managerFiles[taskId];
        if (!file) {
            alert("Select a file first.");
            return;
        }

        const attachmentUrl = await uploadFile(file);
        if (!attachmentUrl || !token) {
            return;
        }

        const response = await fetch(`${API_URL}/tasks/${taskId}/manager-submit`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ attachmentUrl, note: managerComment[taskId] || "" }),
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error?.error || "Failed to submit branch attachment");
            return;
        }

        await loadData();
    };

    const loadTaskHistory = async (taskId: string) => {
        if (!token) return;

        const response = await fetch(`${API_URL}/tasks/${taskId}/history`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error?.error || "Failed to load workflow history");
            return;
        }

        const result = await response.json();
        if (result?.data?.task && Array.isArray(result?.data?.history)) {
            setTaskHistory((prev) => ({
                ...prev,
                [taskId]: {
                    task: result.data.task,
                    history: result.data.history,
                },
            }));
        }
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
        const isPendingTask = task.status !== "approved" && task.status !== "rejected";
        const canManagerAct = mode === "manager"
            && (task.status === "manager_queue" || task.status === "assigned" || task.status === "employee_submitted");
        const canEmployeeAct = mode === "employee"
            && task.assigned_to === user?.id
            && (task.status === "assigned" || task.status === "employee_submitted");

        return (
            <div key={task.id} className="bg-card/80 rounded-2xl border border-border p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-foreground">{task.project_name}</h3>
                        <p className="text-xs text-muted-foreground">
                            {task.project_code} | {task.flow_type.toUpperCase()} | {task.origin_department} {"->"} {task.target_department}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-muted text-muted-foreground border border-border">
                                Stage: {stageLabel[task.status]}
                            </span>
                            {task.workflow_path && (
                                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                                    Branch: {branchLabel[task.workflow_path]}
                                </span>
                            )}
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full border text-xs font-bold ${statusClass[task.status]}`}>
                        {statusLabel[task.status]}
                    </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <p>
                        Current assignee: <span className="font-semibold text-foreground">{task.assigned_to_username || "Unassigned"}</span>
                    </p>
                    <button
                        type="button"
                        onClick={async () => {
                            const nextOpen = expandedHistoryTaskId === task.id ? null : task.id;
                            setExpandedHistoryTaskId(nextOpen);
                            if (nextOpen && !taskHistory[task.id]) {
                                await loadTaskHistory(task.id);
                            }
                        }}
                        className="px-3 py-1.5 rounded-lg border border-border bg-background text-foreground font-semibold hover:bg-muted/50"
                    >
                        {expandedHistoryTaskId === task.id ? "Hide history" : "View history"}
                    </button>
                </div>

                {expandedHistoryTaskId === task.id && taskHistory[task.id] && (
                    <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-bold text-foreground">Workflow History</p>
                                <p className="text-xs text-muted-foreground">Project {taskHistory[task.id].task.project_code} · {taskHistory[task.id].task.project_name}</p>
                            </div>
                            <span className="text-xs text-muted-foreground">{taskHistory[task.id].history.length} events</span>
                        </div>

                        <div className="space-y-3">
                            {taskHistory[task.id].history.map((entry) => (
                                <div key={entry.id} className="flex gap-3 rounded-lg border border-border bg-background p-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <p className="text-sm font-semibold text-foreground">
                                                {entry.entity_type === 'workflow_task' ? 'Task' : 'Project'} transition: {entry.old_state || 'created'} → {entry.new_state}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString()}</p>
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            By {entry.changed_by_username || 'System'}{entry.changed_by_role ? ` (${entry.changed_by_role})` : ''}
                                        </p>
                                        {entry.note && <p className="text-sm text-foreground mt-2">{entry.note}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                    <p className="text-muted-foreground"><Clock className="w-4 h-4 inline mr-1" /> Created: {new Date(task.created_at).toLocaleDateString()}</p>
                    <p className="text-muted-foreground"><User className="w-4 h-4 inline mr-1" /> Assigned To: {task.assigned_to_username || "Unassigned"}</p>
                    <p className="text-muted-foreground">Project Status: {task.review_status}</p>
                </div>

                {((canManagerAct && canValidateAsManager) || canEmployeeAct || (mode === "manager" && task.review_status === "Validated" && task.status === "assigned")) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {canManagerAct && canValidateAsManager && task.review_status !== "Validated" && (
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

                        {mode === "manager" && task.review_status === "Validated" && task.status === "assigned" && (
                            <div className="space-y-2 lg:col-span-2">
                                <p className="text-xs font-bold text-muted-foreground uppercase">Branch Attachment For Super Admin</p>
                                <input
                                    type="file"
                                    onChange={(e) => onManagerFileChange(task.id, e)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                />
                                <textarea
                                    rows={2}
                                    value={managerComment[task.id] || ""}
                                    onChange={(e) => setManagerComment((prev) => ({ ...prev, [task.id]: e.target.value }))}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                    placeholder="Add attachment note"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleManagerSubmit(task.id)}
                                    className="px-4 py-2 bg-success text-white rounded-lg text-sm font-semibold"
                                >
                                    <Upload className="w-4 h-4 inline mr-1" /> Upload And Submit To Super Admin
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
                            {canEmployeeAct && (
                                <button
                                    type="button"
                                    onClick={() => handleEmployeeSubmit(task.id)}
                                    className="px-4 py-2 bg-info text-white rounded-lg text-sm font-semibold hover:bg-info/90"
                                >
                                    <Upload className="w-4 h-4 inline mr-1" /> {employeeFiles[task.id] ? "Upload & Submit Employee Attachment" : "Submit For Review"}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {mode === "manager" && canValidateAsManager && (task.status === "manager_queue" || task.status === "employee_submitted") && (
                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Manager Validation Comment</p>
                        <textarea
                            rows={2}
                            value={managerComment[task.id] || ""}
                            onChange={(e) => setManagerComment((prev) => ({ ...prev, [task.id]: e.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            placeholder="Add validation notes before sending to super admin"
                        />
                        <button
                            type="button"
                            onClick={() => handleManagerValidate(task.id)}
                            className="px-4 py-2 bg-success text-white rounded-lg text-sm font-semibold"
                        >
                            <CheckCircle className="w-4 h-4 inline mr-1" /> Validate And Send To Super Admin
                        </button>
                    </div>
                )}

                {mode === "manager" && canAssign && isPendingTask && (() => {
                    const chosenDepartment = selectedDepartment[task.id] || task.target_department;
                    const departmentUsers = assignableUsers.filter((u) => u.department === chosenDepartment);
                    const isAssignLocked = !!task.assigned_to || task.status !== "manager_queue";

                    return (
                    <div className="border-t border-border pt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <select
                            value={selectedDepartment[task.id] || task.target_department}
                            onChange={(e) => {
                                const nextDepartment = e.target.value as "investment" | "franchise";
                                setSelectedDepartment((prev) => ({ ...prev, [task.id]: nextDepartment }));
                                setSelectedAssignee((prev) => ({ ...prev, [task.id]: "" }));
                            }}
                            className="px-3 py-2 border border-border rounded-lg bg-background"
                            disabled={isAssignLocked}
                        >
                            <option value="investment">investment</option>
                            <option value="franchise">franchise</option>
                        </select>
                        <select
                            value={selectedAssignee[task.id] || ""}
                            onChange={(e) => setSelectedAssignee((prev) => ({ ...prev, [task.id]: e.target.value }))}
                            className="px-3 py-2 border border-border rounded-lg bg-background md:col-span-2"
                            disabled={isAssignLocked}
                        >
                            <option value="">Select assignee</option>
                            {departmentUsers.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.username} ({u.department || "none"})
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={() => handleAssign(task.id)}
                            disabled={isAssignLocked || !selectedAssignee[task.id]}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${isAssignLocked || !selectedAssignee[task.id]
                                ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60 blur-[0.3px]"
                                : "bg-primary text-white hover:bg-primary/90"
                                }`}
                        >
                            {isAssignLocked ? "Assigned" : "Assign"}
                        </button>
                        {isAssignLocked && (
                            <p className="text-xs text-muted-foreground md:col-span-4">
                                This task is already assigned to {task.assigned_to_username || "a user"} and cannot be reassigned.
                            </p>
                        )}
                    </div>
                    );
                })()}

                {mode === "super-admin" && (task.status === "manager_submitted" || task.status === "under_super_admin_review") && (
                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs text-muted-foreground">
                            One attachment is required for contract/documents review. Either manager or employee upload is enough.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <div className="rounded-lg border border-border p-3 bg-background/70">
                                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Manager Attachment</p>
                                {task.manager_attachment_url ? (
                                    <a href={task.manager_attachment_url} target="_blank" rel="noreferrer" className="text-primary underline">
                                        Open manager file
                                    </a>
                                ) : (
                                    <p className="text-muted-foreground">Not uploaded</p>
                                )}
                            </div>
                            <div className="rounded-lg border border-border p-3 bg-background/70">
                                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Employee Attachment</p>
                                {task.employee_attachment_url ? (
                                    <a href={task.employee_attachment_url} target="_blank" rel="noreferrer" className="text-primary underline">
                                        Open employee file
                                    </a>
                                ) : (
                                    <p className="text-muted-foreground">Not uploaded</p>
                                )}
                            </div>
                        </div>
                        <p className="text-sm font-semibold text-foreground"><ShieldCheck className="w-4 h-4 inline mr-1" /> Super Admin Decision</p>
                        <textarea
                            rows={2}
                            value={reviewComment[task.id] || ""}
                            onChange={(e) => setReviewComment((prev) => ({ ...prev, [task.id]: e.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            placeholder="Decision comment"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <select
                                value={branchDepartment[task.id] || task.target_department}
                                onChange={(e) => {
                                    const nextDepartment = e.target.value as "investment" | "franchise";
                                    setBranchDepartment((prev) => ({ ...prev, [task.id]: nextDepartment }));
                                    setBranchAssignee((prev) => ({ ...prev, [task.id]: "" }));
                                }}
                                className="px-3 py-2 border border-border rounded-lg bg-background"
                            >
                                <option value="investment">investment</option>
                                <option value="franchise">franchise</option>
                            </select>
                            <select
                                value={branchAssignee[task.id] || ""}
                                onChange={(e) => setBranchAssignee((prev) => ({ ...prev, [task.id]: e.target.value }))}
                                className="px-3 py-2 border border-border rounded-lg bg-background"
                            >
                                <option value="">Select department manager</option>
                                {assignableUsers
                                    .filter((u) => u.role === "department_manager" && u.department === (branchDepartment[task.id] || task.target_department))
                                    .map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.username} ({u.department || "none"})
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => handleSuperAdminBranch(task.id, "contract")}
                                className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold"
                            >
                                <FileText className="w-4 h-4 inline mr-1" /> Contract Path
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSuperAdminBranch(task.id, "document")}
                                className="px-4 py-2 bg-info text-white rounded-lg text-sm font-semibold"
                            >
                                <FileText className="w-4 h-4 inline mr-1" /> Document Path
                            </button>
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

    const completedStatuses: WorkflowTaskStatus[] = ["approved", "rejected"];
    const pendingTasks = visibleTasks.filter((task) => !completedStatuses.includes(task.status));
    const completedTasks = visibleTasks.filter((task) => completedStatuses.includes(task.status));

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

                    <div className="space-y-6">
                        <div>
                            <h2 className="text-lg font-bold text-foreground mb-3">Pending</h2>
                            <div className="space-y-4">
                                {pendingTasks.length === 0 ? (
                                    <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
                                        No pending tasks in this view.
                                    </div>
                                ) : (
                                    pendingTasks.map((task) => renderTaskCard(task, activeTab))
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-lg font-bold text-foreground mb-3">Completed</h2>
                            <div className="space-y-4">
                                {completedTasks.length === 0 ? (
                                    <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground">
                                        No completed tasks in this view.
                                    </div>
                                ) : (
                                    completedTasks.map((task) => renderTaskCard(task, activeTab))
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
