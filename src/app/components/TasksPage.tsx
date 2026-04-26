import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import { departmentOptions, type Department } from "@/services/api";

type WorkflowTaskStatus =
    | "manager_queue"
    | "assigned"
    | "complaint_forwarded"
    | "ceo_rejected"
    | "employee_submitted"
    | "manager_submitted"
    | "under_super_admin_review"
    | "pending_requester_decision"
    | "approved"
    | "rejected"
    | "requester_accepted"
    | "requester_declined";

type WorkflowTaskFlow = "contract" | "documents" | "request" | "ceo_contact";
type RoleViewTab = "manager" | "employee" | "super-admin";
type TaskStatusFilter = "pending" | "completed";
type TaskCardFilter = "all" | "manager" | "employee" | "super-admin" | "my-forms" | "approved" | "rejected";

interface WorkflowTask {
    id: string;
    investment_project_id: string | null;
    title: string;
    description: string | null;
    flow_type: WorkflowTaskFlow;
    status: WorkflowTaskStatus;
    origin_department: Department | "ceo";
    target_department: Department | "ceo";
    assigned_to: string | null;
    assigned_by: string | null;
    attachment_url: string | null;
    attachment_note: string | null;
    attachment_uploaded_by: string | null;
    attachment_uploaded_at: string | null;
    attachment_uploaded_by_username: string | null;
    manager_attachment_url: string | null;
    employee_attachment_url: string | null;
    manager_note: string | null;
    employee_note: string | null;
    assignee_note: string | null;
    super_admin_comment: string | null;
    metadata: Record<string, unknown> | null;
    created_by: string | null;
    created_by_username: string | null;
    created_at: string;
    updated_at: string;
    project_name: string | null;
    project_code: string | null;
    review_status: string | null;
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
    department: Department | null;
}

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const TASKS_PAGE_SIZE = 200;
const DEPARTMENT_SET = new Set(departmentOptions.map((option) => option.value));

const isDepartment = (value: unknown): value is Department => {
    return typeof value === "string" && DEPARTMENT_SET.has(value as Department);
};

const formatApiError = (payload: any, fallback: string): string => {
    const base = String(payload?.error || payload?.message || fallback).trim() || fallback;
    const details = String(payload?.details || "").trim();
    if (!details || details.toLowerCase() === base.toLowerCase()) {
        return base;
    }

    return `${base}: ${details}`;
};

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
    complaint_forwarded: "Complaint Forwarded",
    ceo_rejected: "CEO Rejected",
    employee_submitted: "Employee Submitted",
    manager_submitted: "Manager Submitted",
    under_super_admin_review: "Under Super Admin Review",
    pending_requester_decision: "Pending Requester Decision",
    approved: "Approved",
    rejected: "Rejected",
    requester_accepted: "Requester Accepted",
    requester_declined: "Requester Declined",
};

const statusClass: Record<WorkflowTaskStatus, string> = {
    manager_queue: "bg-warning/10 text-warning border-warning/20",
    assigned: "bg-info/10 text-info border-info/20",
    complaint_forwarded: "bg-primary/10 text-primary border-primary/20",
    ceo_rejected: "bg-warning/10 text-warning border-warning/20",
    employee_submitted: "bg-info/10 text-info border-info/20",
    manager_submitted: "bg-primary/10 text-primary border-primary/20",
    under_super_admin_review: "bg-primary/10 text-primary border-primary/20",
    pending_requester_decision: "bg-warning/10 text-warning border-warning/20",
    approved: "bg-success/10 text-success border-success/20",
    rejected: "bg-error/10 text-error border-error/20",
    requester_accepted: "bg-success/10 text-success border-success/20",
    requester_declined: "bg-error/10 text-error border-error/20",
};

const stageLabel: Record<WorkflowTaskStatus, string> = {
    manager_queue: "Manager queue",
    assigned: "Assigned to user",
    complaint_forwarded: "Complaint forwarded",
    ceo_rejected: "CEO rejected",
    employee_submitted: "Employee submitted",
    manager_submitted: "Manager submitted",
    under_super_admin_review: "Super admin review",
    pending_requester_decision: "Requester decision",
    approved: "Approved",
    rejected: "Rejected",
    requester_accepted: "Requester accepted",
    requester_declined: "Requester declined",
};

const branchLabel: Record<WorkflowTaskFlow, string> = {
    contract: "Contract",
    documents: "Document",
    request: "Request",
    ceo_contact: "CEO Contact",
};

export function TasksPage() {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [tasks, setTasks] = useState<WorkflowTask[]>([]);
    const [assignableUsersByDepartment, setAssignableUsersByDepartment] = useState<Record<string, AssignableUser[]>>({});
    const [loadingDepartmentUsers, setLoadingDepartmentUsers] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [selectedAssignee, setSelectedAssignee] = useState<Record<string, string>>({});
    const [selectedAssigneeNote, setSelectedAssigneeNote] = useState<Record<string, string>>({});
    const [selectedDepartment, setSelectedDepartment] = useState<Record<string, Department>>({});
    const [taskFiles, setTaskFiles] = useState<Record<string, File | null>>({});
    const [reviewComment, setReviewComment] = useState<Record<string, string>>({});
    const [managerComment, setManagerComment] = useState<Record<string, string>>({});
    const [branchDepartment, setBranchDepartment] = useState<Record<string, Department>>({});
    const [branchAssignee, setBranchAssignee] = useState<Record<string, string>>({});
    const [taskHistory, setTaskHistory] = useState<Record<string, { task: WorkflowTask; history: WorkflowHistoryEntry[] }>>({});
    const [expandedHistoryTaskId, setExpandedHistoryTaskId] = useState<string | null>(null);
    const [selectedTaskCard, setSelectedTaskCard] = useState<TaskCardFilter>("all");
    const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>("pending");
    const [taskLoadError, setTaskLoadError] = useState<string | null>(null);

    const canAssign = user?.role === "department_manager" || user?.role === "super_admin" || user?.role === "supervisor";
    const canValidateAsManager = user?.role === "department_manager" || user?.role === "super_admin";
    const isExecutiveReviewer = user?.role === "super_admin" || user?.role === "ceo";
    const isSuperAdmin = isExecutiveReviewer;
    const isProjectDepartmentManager = user?.role === "department_manager" && user?.department === "project";

    const [activeTab, setActiveTab] = useState<RoleViewTab>(() => {
        if (isSuperAdmin) return "super-admin";
        if (canAssign) return "manager";
        return "employee";
    });

    const underReviewPath = useMemo(() => {
        return location.pathname.startsWith("/all-stations-")
            ? "/all-stations-under-review"
            : "/dashboard/under-review";
    }, [location.pathname]);

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

    const fetchAssignableUsersByDepartment = useCallback(async (department: Department): Promise<void> => {
        if (!token || (!canAssign && !isExecutiveReviewer)) return;
        if (assignableUsersByDepartment[department] || loadingDepartmentUsers[department]) return;

        setLoadingDepartmentUsers((prev) => ({ ...prev, [department]: true }));

        try {
            const response = await fetch(
                `${API_URL}/tasks/assignable-users?targetDepartment=${encodeURIComponent(department)}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            if (!response.ok) {
                return;
            }

            const usersResult = await response.json();
            const users = Array.isArray(usersResult?.data) ? usersResult.data : [];
            const filteredUsers = users.filter((user: AssignableUser) => user.department === department);
            setAssignableUsersByDepartment((prev) => ({ ...prev, [department]: filteredUsers }));
        } catch (error) {
            console.error(`Failed to fetch assignable users for department ${department}:`, error);
        } finally {
            setLoadingDepartmentUsers((prev) => ({ ...prev, [department]: false }));
        }
    }, [token, canAssign, isExecutiveReviewer, assignableUsersByDepartment, loadingDepartmentUsers]);

    const loadData = async () => {
        if (!token) return;

        setLoading(true);
        setTaskLoadError(null);
        try {
            let allTasks = await fetchAllWorkflowTasks(token);

            // A quick retry smooths over occasional cold-start/schema sync delays.
            if (allTasks.length === 0) {
                allTasks = await fetchAllWorkflowTasks(token);
            }

            setTasks(allTasks);
        } catch (error) {
            console.error("Failed to fetch workflow tasks:", error);
            setTaskLoadError("Failed to load tasks. Retrying usually resolves this.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [token, canAssign]);

    useEffect(() => {
        if ((!canAssign && !isExecutiveReviewer) || !token || tasks.length === 0) return;

        const departmentsToPrefetch = Array.from(
            new Set(
                tasks
                    .map((task) => task.target_department)
                    .filter((department): department is Department => isDepartment(department)),
            ),
        );

        if (isProjectDepartmentManager && !departmentsToPrefetch.includes("project")) {
            departmentsToPrefetch.push("project");
        }

        departmentsToPrefetch.forEach((department) => {
            void fetchAssignableUsersByDepartment(department);
        });
    }, [canAssign, isExecutiveReviewer, token, tasks, fetchAssignableUsersByDepartment, isProjectDepartmentManager]);

    const matchesSearch = (task: WorkflowTask, query: string): boolean => {
        const q = query.toLowerCase();
        const metadataText = JSON.stringify(task.metadata || {}).toLowerCase();
        return (
            (task.project_name || task.title || "").toLowerCase().includes(q)
            || (task.project_code || task.id || "").toLowerCase().includes(q)
            || task.title.toLowerCase().includes(q)
            || task.origin_department.toLowerCase().includes(q)
            || task.target_department.toLowerCase().includes(q)
            || metadataText.includes(q)
        );
    };

    const getRequestWorkflowSummary = (task: WorkflowTask): { title: string; description: string; className: string } | null => {
        if (task.flow_type !== "request") {
            return null;
        }

        const assignedTo = task.assigned_to_username || "Unassigned";
        const assignedBy = task.assigned_by_username || task.created_by_username || "Unknown";

        if (task.status === "assigned") {
            if (task.assigned_to === user?.id) {
                return {
                    title: "Received by department manager",
                    description: `Assigned to ${assignedTo}. You can delegate this request or continue the review flow.`,
                    className: "bg-info/10 text-info border-info/20",
                };
            }

            return {
                title: "Delegated to assignee",
                description: `Assigned to ${assignedTo} by ${assignedBy}. Waiting for comments and attachment.`,
                className: "bg-primary/10 text-primary border-primary/20",
            };
        }

        if (task.status === "employee_submitted") {
            return {
                title: "Returned to department manager",
                description: `The assignee sent this back after adding comments or an attachment.`,
                className: "bg-warning/10 text-warning border-warning/20",
            };
        }

        if (task.status === "pending_requester_decision") {
            return {
                title: "Waiting for requester decision",
                description: `The department manager reviewed the response and forwarded it to the requester.`,
                className: "bg-warning/10 text-warning border-warning/20",
            };
        }

        if (task.status === "requester_accepted") {
            return {
                title: "Request accepted",
                description: `The requester approved the final response.`,
                className: "bg-success/10 text-success border-success/20",
            };
        }

        if (task.status === "requester_declined") {
            return {
                title: "Request declined",
                description: `The requester rejected the final response.`,
                className: "bg-error/10 text-error border-error/20",
            };
        }

        return {
            title: "Request in progress",
            description: `Assigned to ${assignedTo} and tracked by ${assignedBy}.`,
            className: "bg-muted text-muted-foreground border-border",
        };
    };

    const managerTasks = useMemo(() => {
        return tasks.filter((task) => {
            // For request workflow tasks, show both received tasks and delegated tasks.
            if (
                task.flow_type === "request"
                && (task.assigned_to === user?.id || task.assigned_by === user?.id)
            ) {
                return matchesSearch(task, search);
            }
            // Show unassigned manager queue tasks
            if (task.status === "manager_queue") {
                return matchesSearch(task, search);
            }
            // For other workflow types, show all tasks that match search
            if (task.flow_type !== "request") {
                return matchesSearch(task, search);
            }
            return false;
        });
    }, [tasks, search, user?.id]);

    const employeeTasks = useMemo(() => {
        return tasks.filter((task) => {
            const assignedToMe = task.assigned_to === user?.id;
            const createdByMe = task.created_by === user?.id;
            return (assignedToMe || createdByMe) && matchesSearch(task, search);
        });
    }, [tasks, user?.id, search]);

    const superAdminTasks = useMemo(() => {
        return tasks.filter((task) => {
            return matchesSearch(task, search);
        });
    }, [tasks, search]);

    const isSubmittedFormTask = useCallback((task: WorkflowTask) => {
        return (task.flow_type === "request" || task.flow_type === "ceo_contact") && task.created_by === user?.id;
    }, [user?.id]);

    const stats = useMemo(() => ({
        total: tasks.length,
        managerQueue: tasks.filter((t) => t.status === "manager_queue").length,
        employeeWork: tasks.filter((t) => t.status === "assigned" || t.status === "employee_submitted").length,
        superAdminReview: tasks.filter((t) => t.status === "manager_submitted" || t.status === "under_super_admin_review").length,
        approved: tasks.filter((t) => t.status === "approved").length,
        rejected: tasks.filter((t) => t.status === "rejected").length,
    }), [tasks]);

    const visibleTasks = activeTab === "manager"
        ? managerTasks
        : activeTab === "employee"
            ? employeeTasks
            : superAdminTasks;

    const filteredVisibleTasks = useMemo(() => {
        switch (selectedTaskCard) {
            case "manager":
                return managerTasks.filter((task) => task.status === "manager_queue");
            case "employee":
                return employeeTasks.filter((task) => task.status === "assigned" || task.status === "employee_submitted");
            case "super-admin":
                return superAdminTasks.filter((task) => task.status === "manager_submitted" || task.status === "under_super_admin_review");
            case "my-forms":
                return tasks.filter((task) => isSubmittedFormTask(task) && matchesSearch(task, search));
            case "approved":
                return tasks.filter((task) => task.status === "approved" && matchesSearch(task, search));
            case "rejected":
                return tasks.filter((task) => task.status === "rejected" && matchesSearch(task, search));
            case "all":
            default:
                return visibleTasks;
        }
    }, [employeeTasks, isSubmittedFormTask, managerTasks, search, selectedTaskCard, superAdminTasks, tasks, visibleTasks]);

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

    const getTaskAttachmentUrl = (task: WorkflowTask): string | null => {
        return task.attachment_url || task.manager_attachment_url || task.employee_attachment_url || null;
    };

    const handleAssign = async (taskId: string) => {
        const task = tasks.find((item) => item.id === taskId);
        const requestTaskDelegation = task?.flow_type === "request" && task?.status === "assigned" && task?.assigned_to === user?.id;
        const ceoContactForward = isExecutiveReviewer
            && task?.flow_type === "ceo_contact"
            && (task?.status === "assigned" || task?.status === "ceo_rejected");
        const canAssignNow = task?.status === "manager_queue" || requestTaskDelegation || ceoContactForward;
        if (!canAssignNow) {
            alert("Task is already assigned and cannot be reassigned.");
            return;
        }

        const assignedToUserId = selectedAssignee[taskId];
        const fallbackDepartment = task?.target_department;
        const targetDepartment = isProjectDepartmentManager ? "project" : (selectedDepartment[taskId] || fallbackDepartment);

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
            body: JSON.stringify({
                assignedToUserId,
                targetDepartment,
                assigneeNote: selectedAssigneeNote[taskId] || "",
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error?.error || "Failed to assign task");
            return;
        }

        await loadData();
    };

    const handleManagerAttachment = async (taskId: string) => {
        const file = taskFiles[taskId];
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
        const file = taskFiles[taskId];
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
            body: JSON.stringify({
                attachmentUrl: attachmentUrl || undefined,
                note: managerComment[taskId] || "",
            }),
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
            alert(formatApiError(error, "Failed to review task"));
            return;
        }

        await loadData();
    };

    const handleRequestManagerSubmit = async (taskId: string, decision: "approved" | "rejected") => {
        if (!token) return;

        const file = taskFiles[taskId];
        let attachmentUrl: string | null = null;
        if (file) {
            attachmentUrl = await uploadFile(file);
            if (!attachmentUrl) {
                return;
            }
        }

        const response = await fetch(`${API_URL}/tasks/${taskId}/review`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                decision,
                comment: reviewComment[taskId] || "",
                attachmentUrl: attachmentUrl || undefined,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            alert(formatApiError(error, "Failed to submit manager response"));
            return;
        }

        await loadData();
    };

    const handleRequesterDecision = async (taskId: string, decision: "accept" | "decline") => {
        if (!token) return;

        const response = await fetch(`${API_URL}/tasks/${taskId}/requester-decision`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                decision,
                comment: reviewComment[taskId] || "",
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error?.error || "Failed to submit requester decision");
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
            alert(formatApiError(error, "Failed to route task"));
            return;
        }

        await loadData();
    };

    const handleManagerValidate = async (taskId: string) => {
        if (!token) return;

        const file = taskFiles[taskId];
        let attachmentUrl: string | null = null;
        if (file) {
            attachmentUrl = await uploadFile(file);
            if (!attachmentUrl) {
                return;
            }
        }

        const response = await fetch(`${API_URL}/tasks/${taskId}/manager-validate`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                comment: managerComment[taskId] || "",
                attachmentUrl: attachmentUrl || undefined,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            alert(error?.error || "Failed to validate task");
            return;
        }

        await loadData();
    };

    const handleManagerSubmit = async (taskId: string) => {
        const file = taskFiles[taskId];
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

    const onTaskFileChange = (taskId: string, event: ChangeEvent<HTMLInputElement>) => {
        const selected = event.target.files?.[0] || null;
        setTaskFiles((prev) => ({ ...prev, [taskId]: selected }));
    };

    const renderTaskCard = (task: WorkflowTask, mode: RoleViewTab) => {
        const canManagerAct = mode === "manager"
            && (task.status === "manager_queue" || task.status === "assigned" || task.status === "employee_submitted");
        const canEmployeeAct = mode === "employee"
            && task.assigned_to === user?.id
            && (task.status === "assigned" || task.status === "employee_submitted");
        const canSuperAdminPreviewContract =
            mode === "super-admin"
            && task.flow_type === "contract"
            && task.status !== "manager_queue";
        const canOpenContract =
            task.flow_type === "contract"
            && (
                (task.assigned_to === user?.id && task.status === "assigned")
                || canSuperAdminPreviewContract
            );
        const isGenericTask = task.flow_type === "request" || task.flow_type === "ceo_contact";
        const isContractTask = task.flow_type === "contract";
        const showCeoForwardPanel = isExecutiveReviewer
            && task.flow_type === "ceo_contact"
            && (task.status === "assigned" || task.status === "ceo_rejected");
        const showCeoManagerPanel = mode === "manager"
            && task.flow_type === "ceo_contact"
            && task.status === "complaint_forwarded"
            && task.assigned_to === user?.id;
        const showCeoDecisionPanel = isExecutiveReviewer
            && task.flow_type === "ceo_contact"
            && task.status === "manager_submitted";
        const showSuperAdminDecisionPanel = !isGenericTask
            && mode === "super-admin"
            && (
                task.status === "manager_submitted"
                || task.status === "under_super_admin_review"
                || (task.status === "assigned" && Boolean(task.workflow_path))
            );
        const displayTitle = task.project_name || task.title;
        const displayCode = task.project_code || task.id;
        const meta = task.metadata && typeof task.metadata === "object" ? (task.metadata as Record<string, any>) : null;
        const reviewerComment = task.super_admin_comment || task.manager_note;
        const requestWorkflowSummary = getRequestWorkflowSummary(task);
        return (
            <div key={task.id} className="bg-card/80 rounded-2xl border border-border p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-foreground">{displayTitle}</h3>
                        <p className="text-xs text-muted-foreground">
                            {displayCode} | {branchLabel[task.flow_type]} | {task.origin_department} {"->"} {task.target_department}
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

                {requestWorkflowSummary && (
                    <div className={`rounded-xl border px-4 py-3 ${requestWorkflowSummary.className}`}>
                        <p className="text-[11px] font-black uppercase tracking-wider">Request workflow</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{requestWorkflowSummary.title}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{requestWorkflowSummary.description}</p>
                    </div>
                )}

                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <p>
                        Current assignee: <span className="font-semibold text-foreground">{task.assigned_to_username || "Unassigned"}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        {task.investment_project_id && (
                            <button
                                type="button"
                                onClick={() => navigate(`${underReviewPath}?projectId=${task.investment_project_id}`)}
                                className="px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 text-primary font-semibold hover:bg-primary/20"
                            >
                                Details
                            </button>
                        )}
                        {canOpenContract && (
                            <button
                                type="button"
                                onClick={() => {
                                    const backTo = `${location.pathname}${location.search || ""}`;
                                    const inAllStationsLayout = location.pathname.startsWith("/all-stations-");
                                    const stationCodeFromMeta = meta ? String(meta.stationCode || meta.station_code || meta.stationcode || "").trim() : "";
                                    const previewQuery = canSuperAdminPreviewContract ? "&preview=1" : "";
                                    if (inAllStationsLayout && stationCodeFromMeta) {
                                        navigate(
                                            `/station/${encodeURIComponent(stationCodeFromMeta)}/form/contract?taskId=${encodeURIComponent(task.id)}&backTo=${encodeURIComponent(backTo)}${previewQuery}`,
                                            { state: { backTo } },
                                        );
                                        return;
                                    }
                                    navigate(
                                        `/dashboard/contract?taskId=${encodeURIComponent(task.id)}&backTo=${encodeURIComponent(backTo)}${previewQuery}`,
                                        { state: { backTo } },
                                    );
                                }}
                                className="px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/10 text-primary font-semibold hover:bg-primary/20"
                            >
                                {canSuperAdminPreviewContract ? "Preview Contract" : "Open Contract"}
                            </button>
                        )}
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
                    <p className="text-muted-foreground">Status: {task.review_status || task.status}</p>
                </div>

                {isGenericTask && meta && (
                    <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm font-bold text-foreground">Submitted Details</p>
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                                {branchLabel[task.flow_type]}
                            </span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <p className="text-muted-foreground"><span className="font-semibold text-foreground">Requester:</span> {(meta.requester?.username as string) || task.created_by_username || "Unknown"}</p>
                            <p className="text-muted-foreground"><span className="font-semibold text-foreground">Department:</span> {(meta.department as string) || task.origin_department}</p>
                            <p className="text-muted-foreground"><span className="font-semibold text-foreground">Request Type:</span> {(meta.requestType as string) || "-"}</p>
                            <p className="text-muted-foreground"><span className="font-semibold text-foreground">Subject:</span> {(meta.subject as string) || task.title}</p>
                            <p className="text-muted-foreground"><span className="font-semibold text-foreground">Priority:</span> {(meta.priority as string) || "Normal"}</p>
                            {Array.isArray(meta.stationCodes) && (
                                <p className="text-muted-foreground md:col-span-2">
                                    <span className="font-semibold text-foreground">Stations:</span> {meta.stationCodes.length > 0 ? meta.stationCodes.join(", ") : "None selected"}
                                </p>
                            )}
                            <p className="text-muted-foreground md:col-span-2"><span className="font-semibold text-foreground">Message:</span> {(meta.description as string) || task.description || "-"}</p>
                            {Array.isArray(meta.attachments) && meta.attachments.length > 0 && (
                                <div className="md:col-span-2 space-y-2">
                                    <p className="font-semibold text-foreground">Attachments</p>
                                    <div className="space-y-2">
                                        {meta.attachments.map((attachment: any, index: number) => (
                                            <a key={`${task.id}-attachment-${index}`} href={attachment?.url || "#"} target="_blank" rel="noreferrer" className="block text-primary underline text-sm break-all">
                                                {attachment?.name || `Attachment ${index + 1}`}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {reviewerComment && (
                    <div className="rounded-xl border border-border bg-background/70 p-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Reviewer Response</p>
                        <p className="text-sm text-foreground">{reviewerComment}</p>
                    </div>
                )}

                {task.employee_note && (
                    <div className="rounded-xl border border-border bg-background/70 p-4">
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Employee Comment</p>
                        <p className="text-sm text-foreground">{task.employee_note}</p>
                    </div>
                )}

                {mode === "manager" && task.flow_type === "request" && task.status === "assigned" && task.assigned_to === user?.id && (
                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Department Manager Response</p>
                        <textarea
                            rows={2}
                            value={reviewComment[task.id] || ""}
                            onChange={(event) => setReviewComment((prev) => ({ ...prev, [task.id]: event.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            placeholder="Add response notes for requester"
                        />
                        {!getTaskAttachmentUrl(task) && (
                            <input
                                type="file"
                                onChange={(event) => onTaskFileChange(task.id, event)}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            />
                        )}
                        <div className="flex flex-wrap gap-3">
                            <button type="button" onClick={() => handleRequestManagerSubmit(task.id, "approved")} className="px-4 py-2 bg-success text-white rounded-lg text-sm font-semibold">
                                <CheckCircle className="w-4 h-4 inline mr-1" /> Submit To Requester
                            </button>
                            <button type="button" onClick={() => handleRequestManagerSubmit(task.id, "rejected")} className="px-4 py-2 bg-error text-white rounded-lg text-sm font-semibold">
                                <AlertCircle className="w-4 h-4 inline mr-1" /> Reject Request
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground">Attachment is optional and only one attachment is allowed per request response.</p>
                    </div>
                )}

                {mode === "employee" && task.flow_type === "request" && task.status === "assigned" && task.assigned_to === user?.id && task.assigned_by !== user?.id && (
                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Assigned Task Response</p>
                        <p className="text-sm text-muted-foreground">You can add comments and attachments. Your response will be sent back to the department manager for review.</p>
                        <textarea
                            rows={2}
                            value={reviewComment[task.id] || ""}
                            onChange={(event) => setReviewComment((prev) => ({ ...prev, [task.id]: event.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            placeholder="Add your comments or notes"
                        />
                        {!getTaskAttachmentUrl(task) && (
                            <input
                                type="file"
                                onChange={(event) => onTaskFileChange(task.id, event)}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            />
                        )}
                        <div className="flex flex-wrap gap-3">
                            <button type="button" onClick={() => handleEmployeeSubmit(task.id)} className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
                                <CheckCircle className="w-4 h-4 inline mr-1" /> Send Back To Manager
                            </button>
                        </div>
                        <p className="text-xs text-muted-foreground">You can only add comments and attachments. Assignment and final decisions are handled by the department manager.</p>
                    </div>
                )}

                {task.flow_type === "request" && task.status === "pending_requester_decision" && task.created_by === user?.id && (
                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Requester Final Decision</p>
                        <textarea
                            rows={2}
                            value={reviewComment[task.id] || ""}
                            onChange={(event) => setReviewComment((prev) => ({ ...prev, [task.id]: event.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            placeholder="Optional decision note"
                        />
                        <div className="flex flex-wrap gap-3">
                            <button type="button" onClick={() => handleRequesterDecision(task.id, "accept")} className="px-4 py-2 bg-success text-white rounded-lg text-sm font-semibold">
                                <CheckCircle className="w-4 h-4 inline mr-1" /> Accept
                            </button>
                            <button type="button" onClick={() => handleRequesterDecision(task.id, "decline")} className="px-4 py-2 bg-error text-white rounded-lg text-sm font-semibold">
                                <AlertCircle className="w-4 h-4 inline mr-1" /> Decline
                            </button>
                        </div>
                    </div>
                )}

                {showCeoDecisionPanel && (
                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Executive Decision</p>
                        <textarea
                            rows={2}
                            value={reviewComment[task.id] || ""}
                            onChange={(event) => setReviewComment((prev) => ({ ...prev, [task.id]: event.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            placeholder="Add final response to the complainant"
                        />
                        <div className="flex flex-wrap gap-3">
                            <button type="button" onClick={() => handleSuperAdminReview(task.id, "approved")} className="px-4 py-2 bg-success text-white rounded-lg text-sm font-semibold">
                                <CheckCircle className="w-4 h-4 inline mr-1" /> Approve
                            </button>
                            <button type="button" onClick={() => handleSuperAdminReview(task.id, "rejected")} className="px-4 py-2 bg-error text-white rounded-lg text-sm font-semibold">
                                <AlertCircle className="w-4 h-4 inline mr-1" /> Reject and Reassign
                            </button>
                        </div>
                    </div>
                )}

                {showCeoManagerPanel && (
                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Department Manager Progress</p>
                        <textarea
                            rows={2}
                            value={managerComment[task.id] || ""}
                            onChange={(e) => setManagerComment((prev) => ({ ...prev, [task.id]: e.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            placeholder="Add comment for CEO review"
                        />
                        {!getTaskAttachmentUrl(task) && (
                            <input
                                type="file"
                                onChange={(e) => onTaskFileChange(task.id, e)}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            />
                        )}
                        <button
                            type="button"
                            onClick={() => handleManagerValidate(task.id)}
                            className="px-4 py-2 bg-success text-white rounded-lg text-sm font-semibold"
                        >
                            <CheckCircle className="w-4 h-4 inline mr-1" /> Send Progress To CEO
                        </button>
                    </div>
                )}

                {task.assignee_note && (
                    <div className="rounded-lg border border-border p-3 bg-background/70">
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Assignment Note</p>
                        <p className="text-sm text-foreground">{task.assignee_note}</p>
                    </div>
                )}

{getTaskAttachmentUrl(task)
                    && !showSuperAdminDecisionPanel
                    && (
                    <div className="rounded-lg border border-border p-3 bg-background/70">
                        <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Attachment</p>
                        <a href={getTaskAttachmentUrl(task) || "#"} target="_blank" rel="noreferrer" className="text-primary underline text-sm">
                            Open attached file
                        </a>
                        <p className="text-xs text-muted-foreground mt-2">
                            Uploaded by: {task.attachment_uploaded_by_username || "Unknown"}
                            {task.attachment_uploaded_at ? ` on ${new Date(task.attachment_uploaded_at).toLocaleString()}` : ""}
                        </p>
                    </div>
                )}

                {task.flow_type === "request" && mode === "manager" && canValidateAsManager && task.status === "employee_submitted" && (
                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs font-bold text-muted-foreground uppercase">Manager Validation</p>
                        <textarea
                            rows={2}
                            value={managerComment[task.id] || ""}
                            onChange={(e) => setManagerComment((prev) => ({ ...prev, [task.id]: e.target.value }))}
                            className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            placeholder="Add final manager notes"
                        />
                        {!getTaskAttachmentUrl(task) && (
                            <input
                                type="file"
                                onChange={(e) => onTaskFileChange(task.id, e)}
                                className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                            />
                        )}
                        <button
                            type="button"
                            onClick={() => handleManagerValidate(task.id)}
                            className="px-4 py-2 bg-success text-white rounded-lg text-sm font-semibold"
                        >
                            <CheckCircle className="w-4 h-4 inline mr-1" /> Validate And Send To Requester
                        </button>
                        <button
                            type="button"
                            onClick={() => handleRequestManagerSubmit(task.id, "rejected")}
                            className="px-4 py-2 bg-error text-white rounded-lg text-sm font-semibold"
                        >
                            <AlertCircle className="w-4 h-4 inline mr-1" /> Reject Request
                        </button>
                    </div>
                )}

                {!isGenericTask && !isContractTask && ((canManagerAct && canValidateAsManager) || canEmployeeAct || (mode === "manager" && task.review_status === "Validated" && task.status === "assigned")) && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {canManagerAct && canValidateAsManager && task.review_status !== "Validated" && (
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-muted-foreground uppercase">Attachment</p>
                                <input
                                    type="file"
                                    onChange={(e) => onTaskFileChange(task.id, e)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleManagerAttachment(task.id)}
                                    className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary/90"
                                >
                                    <Upload className="w-4 h-4 inline mr-1" /> Upload Attachment
                                </button>
                            </div>
                        )}

                        {mode === "manager" && task.workflow_path && task.status === "assigned" && (
                            <div className="space-y-2 lg:col-span-2">
                                <p className="text-xs font-bold text-muted-foreground uppercase">Attachment For Super Admin (Branch Routing)</p>
                                <input
                                    type="file"
                                    onChange={(e) => onTaskFileChange(task.id, e)}
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

                        {canEmployeeAct && (
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-muted-foreground uppercase">Attachment</p>
                                <input
                                    type="file"
                                    onChange={(e) => onTaskFileChange(task.id, e)}
                                    className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleEmployeeSubmit(task.id)}
                                    className="px-4 py-2 bg-info text-white rounded-lg text-sm font-semibold hover:bg-info/90"
                                >
                                    <Upload className="w-4 h-4 inline mr-1" /> {taskFiles[task.id] ? "Upload & Submit Attachment" : "Submit For Review"}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {((mode === "manager" && canAssign && ((task.status === "manager_queue" && !task.assigned_to) || (task.flow_type === "request" && task.status === "assigned" && task.assigned_to === user?.id)))
                    || showCeoForwardPanel) && (() => {
                    const chosenDepartment = selectedDepartment[task.id] || task.target_department;
                    const forwardToDepartmentManagerOnly = showCeoForwardPanel;
                    const departmentUsers = isDepartment(chosenDepartment)
                        ? (assignableUsersByDepartment[chosenDepartment] || [])
                            .filter((u) => u.department === chosenDepartment)
                            .filter((u) => !forwardToDepartmentManagerOnly || u.role === "department_manager")
                        : [];
                    const isDepartmentUsersLoading = isDepartment(chosenDepartment)
                        ? loadingDepartmentUsers[chosenDepartment]
                        : false;
                    const requestTaskDelegation = task.flow_type === "request" && task.status === "assigned" && task.assigned_to === user?.id;
                    const isAssignLocked = !requestTaskDelegation && !showCeoForwardPanel && (!!task.assigned_to || task.status !== "manager_queue");

                    return (
                    <div className="border-t border-border pt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <select
                            value={selectedDepartment[task.id] || task.target_department}
                            onChange={(e) => {
                                const nextDepartment = e.target.value as Department;
                                setSelectedDepartment((prev) => ({ ...prev, [task.id]: nextDepartment }));
                                setSelectedAssignee((prev) => ({ ...prev, [task.id]: "" }));
                                void fetchAssignableUsersByDepartment(nextDepartment);
                            }}
                            className="px-3 py-2 border border-border rounded-lg bg-background"
                            disabled={isAssignLocked}
                        >
                            {departmentOptions.map((department) => (
                                <option key={department.value} value={department.value}>
                                    {department.label}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedAssignee[task.id] || ""}
                            onChange={(e) => setSelectedAssignee((prev) => ({ ...prev, [task.id]: e.target.value }))}
                            className="px-3 py-2 border border-border rounded-lg bg-background md:col-span-2"
                            disabled={isAssignLocked}
                        >
                            <option value="">Select assignee</option>
                            {isDepartmentUsersLoading ? (
                                <option value="" disabled>Loading assignees...</option>
                            ) : null}
                            {departmentUsers.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.username} ({u.department || "none"})
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            value={selectedAssigneeNote[task.id] || ""}
                            onChange={(e) => setSelectedAssigneeNote((prev) => ({ ...prev, [task.id]: e.target.value }))}
                            placeholder="Optional note for assignee"
                            className="px-3 py-2 border border-border rounded-lg bg-background md:col-span-3"
                            disabled={isAssignLocked}
                        />
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
                        {requestTaskDelegation && (
                            <p className="text-xs text-muted-foreground md:col-span-4">
                                You can delegate this request task to a user in the selected department.
                            </p>
                        )}
                        {showCeoForwardPanel && (
                            <p className="text-xs text-muted-foreground md:col-span-4">
                                Forward this complaint to a department manager for resolution.
                            </p>
                        )}
                    </div>
                    );
                })()}

                {!isGenericTask && mode === "manager" && canValidateAsManager && (task.status === "manager_queue" || task.status === "employee_submitted") && (
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

                {showSuperAdminDecisionPanel && (
                    <div className="border-t border-border pt-4 space-y-3">
                        <p className="text-xs text-muted-foreground">
                            The validation attachment is shown below.
                        </p>
                        {task.attachment_url && (
                            <div className="rounded-lg border border-border p-3 bg-background/70 text-sm">
                                <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Attachment (from Validation)</p>
                                <a href={task.attachment_url} target="_blank" rel="noreferrer" className="text-primary underline">
                                    Open attachment
                                </a>
                                <p className="text-xs text-muted-foreground mt-2">
                                    Uploaded by: {task.attachment_uploaded_by_username || "Unknown"}
                                    {task.attachment_uploaded_at ? ` on ${new Date(task.attachment_uploaded_at).toLocaleString()}` : ""}
                                </p>
                            </div>
                        )}
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
                                    const nextDepartment = e.target.value as Department;
                                    setBranchDepartment((prev) => ({ ...prev, [task.id]: nextDepartment }));
                                    setBranchAssignee((prev) => ({ ...prev, [task.id]: "" }));
                                    void fetchAssignableUsersByDepartment(nextDepartment);
                                }}
                                className="px-3 py-2 border border-border rounded-lg bg-background"
                            >
                                {departmentOptions.map((department) => (
                                    <option key={department.value} value={department.value}>
                                        {department.label}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={branchAssignee[task.id] || ""}
                                onChange={(e) => setBranchAssignee((prev) => ({ ...prev, [task.id]: e.target.value }))}
                                className="px-3 py-2 border border-border rounded-lg bg-background"
                            >
                                <option value="">Select department manager</option>
                                {(isDepartment(branchDepartment[task.id] || task.target_department)
                                    ? (assignableUsersByDepartment[branchDepartment[task.id] || task.target_department] || [])
                                        .filter((u) => u.department === (branchDepartment[task.id] || task.target_department))
                                    : [])
                                    .filter((u) => u.role === "department_manager")
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

    const completedStatuses: WorkflowTaskStatus[] = ["approved", "rejected", "requester_accepted", "requester_declined"];
    const pendingTasks = filteredVisibleTasks.filter((task) => !completedStatuses.includes(task.status));
    const completedTasks = filteredVisibleTasks.filter((task) => completedStatuses.includes(task.status));

    const selectTaskCard = (card: TaskCardFilter) => {
        setSelectedTaskCard(card);

        if (card === "manager") {
            setActiveTab("manager");
            return;
        }

        if (card === "employee") {
            setActiveTab("employee");
            return;
        }

        if (card === "super-admin") {
            setActiveTab("super-admin");
        }
    };

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
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-6">
                        <button
                            type="button"
                            onClick={() => selectTaskCard("all")}
                            className={`bg-card/80 rounded-xl border p-5 text-left transition-all ${selectedTaskCard === "all" ? "border-primary ring-2 ring-primary/20 shadow-lg" : "border-border hover:border-primary/40 hover:shadow-md"}`}
                        >
                            <p className="text-sm text-muted-foreground">Total</p>
                            <p className="text-3xl font-black text-foreground">{stats.total}</p>
                        </button>
                        {(canAssign || isSuperAdmin) && (
                            <button
                                type="button"
                                onClick={() => selectTaskCard("manager")}
                                className={`bg-card/80 rounded-xl border p-5 text-left transition-all ${selectedTaskCard === "manager" ? "border-warning ring-2 ring-warning/20 shadow-lg" : "border-border hover:border-warning/40 hover:shadow-md"}`}
                            >
                                <p className="text-sm text-muted-foreground">Manager Queue</p>
                                <p className="text-3xl font-black text-warning">{stats.managerQueue}</p>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => selectTaskCard("employee")}
                            className={`bg-card/80 rounded-xl border p-5 text-left transition-all ${selectedTaskCard === "employee" ? "border-info ring-2 ring-info/20 shadow-lg" : "border-border hover:border-info/40 hover:shadow-md"}`}
                        >
                            <p className="text-sm text-muted-foreground">Employee Workbench</p>
                            <p className="text-3xl font-black text-info">{stats.employeeWork}</p>
                        </button>
                        {isExecutiveReviewer && (
                            <button
                                type="button"
                                onClick={() => selectTaskCard("super-admin")}
                                className={`bg-card/80 rounded-xl border p-5 text-left transition-all ${selectedTaskCard === "super-admin" ? "border-primary ring-2 ring-primary/20 shadow-lg" : "border-border hover:border-primary/40 hover:shadow-md"}`}
                            >
                                <p className="text-sm text-muted-foreground">Super Admin Review</p>
                                <p className="text-3xl font-black text-primary">{stats.superAdminReview}</p>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => selectTaskCard("my-forms")}
                            className={`bg-card/80 rounded-xl border p-5 text-left transition-all ${selectedTaskCard === "my-forms" ? "border-info ring-2 ring-info/20 shadow-lg" : "border-border hover:border-info/40 hover:shadow-md"}`}
                        >
                            <p className="text-sm text-muted-foreground">My Submitted Forms</p>
                            <p className="text-3xl font-black text-info">{tasks.filter(isSubmittedFormTask).length}</p>
                        </button>
                        <button
                            type="button"
                            onClick={() => selectTaskCard("approved")}
                            className={`bg-card/80 rounded-xl border p-5 text-left transition-all ${selectedTaskCard === "approved" ? "border-success ring-2 ring-success/20 shadow-lg" : "border-border hover:border-success/40 hover:shadow-md"}`}
                        >
                            <p className="text-sm text-muted-foreground">Approved</p>
                            <p className="text-3xl font-black text-success">{stats.approved}</p>
                        </button>
                        <button
                            type="button"
                            onClick={() => selectTaskCard("rejected")}
                            className={`bg-card/80 rounded-xl border p-5 text-left transition-all ${selectedTaskCard === "rejected" ? "border-error ring-2 ring-error/20 shadow-lg" : "border-border hover:border-error/40 hover:shadow-md"}`}
                        >
                            <p className="text-sm text-muted-foreground">Rejected</p>
                            <p className="text-3xl font-black text-error">{stats.rejected}</p>
                        </button>
                    </div>

                    <div className="bg-card/80 rounded-2xl border border-border p-4 mb-6 space-y-4">
                        {taskLoadError && (
                            <div className="rounded-lg border border-error/20 bg-error/10 text-error px-3 py-2 text-sm font-medium">
                                {taskLoadError}
                            </div>
                        )}
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
                            <button
                                type="button"
                                onClick={() => setStatusFilter("pending")}
                                className={`px-4 py-2 rounded-lg border text-sm font-semibold ${statusFilter === "pending" ? "bg-warning text-white border-warning" : "bg-background border-border text-foreground"}`}
                            >
                                Pending Tasks
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter("completed")}
                                className={`px-4 py-2 rounded-lg border text-sm font-semibold ${statusFilter === "completed" ? "bg-success text-white border-success" : "bg-background border-border text-foreground"}`}
                            >
                                Completed Tasks
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {statusFilter === "pending" && (
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
                        )}

                        {statusFilter === "completed" && (
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
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
