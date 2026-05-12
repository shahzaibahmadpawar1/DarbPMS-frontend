import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "@/utils/translations";

type TaskStatusFilter = "pending" | "completed";
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

type WorkflowTask = {
    id: string;
    flow_type: string;
    status: WorkflowTaskStatus;
    title: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    project_name: string | null;
    project_code: string | null;
    city: string | null;
};

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const TASKS_PAGE_SIZE = 200;
const COMPLETED_STATUSES: WorkflowTaskStatus[] = ["approved", "rejected", "requester_accepted", "requester_declined"];

async function fetchAllTasks(token: string): Promise<WorkflowTask[]> {
    const out: WorkflowTask[] = [];
    let offset = 0;
    while (true) {
        const response = await fetch(`${API_URL}/tasks?limit=${TASKS_PAGE_SIZE}&offset=${offset}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error("Failed to load tasks");
        const payload = await response.json().catch(() => ({}));
        const items = Array.isArray(payload?.data) ? payload.data : [];
        out.push(...items);
        if (items.length < TASKS_PAGE_SIZE) break;
        offset += TASKS_PAGE_SIZE;
    }
    return out;
}

export function SubmittedApprovedRequestsPage() {
    const { token } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>("pending");
    const [items, setItems] = useState<WorkflowTask[]>([]);

    useEffect(() => {
        if (!token) return;
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const all = await fetchAllTasks(token);
                if (!mounted) return;
                const requestTasks = all.filter((task) => String(task.flow_type).toLowerCase() === "request");
                setItems(requestTasks);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        void load();
        return () => {
            mounted = false;
        };
    }, [token]);

    const filtered = useMemo(() => {
        if (statusFilter === "completed") {
            return items.filter((task) => COMPLETED_STATUSES.includes(task.status));
        }
        return items.filter((task) => !COMPLETED_STATUSES.includes(task.status));
    }, [items, statusFilter]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-foreground">{t("submittedApprovedRequests")}</h1>
                <p className="text-muted-foreground">Request tasks overview from task workflow.</p>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setStatusFilter("pending")}
                    className={`px-4 py-2 rounded-lg border text-sm font-semibold ${statusFilter === "pending" ? "bg-warning text-white border-warning" : "bg-background border-border text-foreground"}`}
                >
                    {t("pending")}
                </button>
                <button
                    type="button"
                    onClick={() => setStatusFilter("completed")}
                    className={`px-4 py-2 rounded-lg border text-sm font-semibold ${statusFilter === "completed" ? "bg-success text-white border-success" : "bg-background border-border text-foreground"}`}
                >
                    {t("completed")}
                </button>
                <Link to="/all-stations-requests" className="px-4 py-2 rounded-lg border text-sm font-semibold bg-background border-border text-foreground hover:bg-muted">
                    {t("newRequest")}
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : filtered.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No requests found.</div>
                ) : (
                    <div className="divide-y divide-border">
                        {filtered.map((task) => (
                            <div key={task.id} className="px-4 py-3 flex items-center justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-foreground">{task.title || "Request"}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {task.project_name || "—"} · {task.project_code || "—"} · {task.city || "—"}
                                    </p>
                                    {task.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground">{new Date(task.created_at).toLocaleDateString()}</p>
                                    <p className="text-sm font-semibold mt-1">{task.status}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

