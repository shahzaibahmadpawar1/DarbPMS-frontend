import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FileText, FolderOpen, BarChart2, Upload, Eye, ExternalLink } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { isLegalDepartment } from "@/services/api";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
type LegalTab = "contract" | "document";

type WorkflowTask = {
    id: string;
    investment_project_id: string | null;
    flow_type: "contract" | "documents" | string;
    target_department: string | null;
    status: string;
    project_name: string | null;
    project_code: string | null;
    city: string | null;
    created_at: string;
    assigned_to_username: string | null;
    metadata: Record<string, unknown> | null;
    attachment_url: string | null;
    manager_attachment_url: string | null;
    employee_attachment_url: string | null;
    manager_note: string | null;
    employee_note: string | null;
};

export function LegalWorkflowPage() {
    const { token, user } = useAuth();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [tasks, setTasks] = useState<WorkflowTask[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [projectDetailsById, setProjectDetailsById] = useState<Record<string, any>>({});
    const [taskFile, setTaskFile] = useState<File | null>(null);
    const [note, setNote] = useState("");
    const [savingDoc, setSavingDoc] = useState(false);
    const activeTab: LegalTab = searchParams.get("tab") === "document" ? "document" : "contract";
    const canEditLegalWorkflow = !!user && (user.role === "super_admin" || isLegalDepartment(user.department));
    const canViewLegalWorkflow = canEditLegalWorkflow || user?.role === "ceo";

    useEffect(() => {
        if (!token) return;
        let mounted = true;
        const load = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/tasks?limit=500&offset=0`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) return;
                const result = await response.json();
                if (!mounted) return;
                setTasks(Array.isArray(result?.data) ? result.data : []);
            } finally {
                if (mounted) setLoading(false);
            }
        };
        void load();
        return () => {
            mounted = false;
        };
    }, [token]);

    const rows = useMemo(() => {
        const targetFlow = activeTab === "contract" ? "contract" : "documents";
        const filtered = tasks.filter(
            (t) => String(t.flow_type).toLowerCase() === targetFlow && String(t.target_department || "").toLowerCase() === "legal",
        );

        const seen = new Set<string>();
        const unique: WorkflowTask[] = [];
        for (const t of filtered) {
            const key = t.investment_project_id || t.id;
            if (seen.has(key)) continue;
            seen.add(key);
            unique.push(t);
        }
        return unique;
    }, [tasks, activeTab]);

    const selectedTask = useMemo(
        () => rows.find((r) => r.id === selectedTaskId) || null,
        [rows, selectedTaskId],
    );

    useEffect(() => {
        if (!selectedTask?.investment_project_id || !token) return;
        const projectId = selectedTask.investment_project_id;
        if (projectDetailsById[projectId]) return;
        let mounted = true;
        const loadProject = async () => {
            const response = await fetch(`${API_URL}/investment-projects/${encodeURIComponent(projectId)}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) return;
            const result = await response.json().catch(() => ({}));
            if (!mounted) return;
            setProjectDetailsById((prev) => ({ ...prev, [projectId]: result?.data || null }));
        };
        void loadProject();
        return () => {
            mounted = false;
        };
    }, [selectedTask?.investment_project_id, token, projectDetailsById]);

    const selectedProject = selectedTask?.investment_project_id
        ? projectDetailsById[selectedTask.investment_project_id]
        : null;

    const uploadFile = async (file: File): Promise<{ fileUrl: string; fileName: string } | null> => {
        if (!token) return null;
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${API_URL}/files/upload`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result?.data?.url) {
            alert(String(result?.error || "Failed to upload file"));
            return null;
        }
        return { fileUrl: String(result.data.url), fileName: String(result.data.fileName || file.name) };
    };

    const handleAttachDocument = async () => {
        if (!token || !selectedTask || !taskFile || !canEditLegalWorkflow) return;
        setSavingDoc(true);
        try {
            const uploaded = await uploadFile(taskFile);
            if (!uploaded) return;
            const response = await fetch(`${API_URL}/tasks/${selectedTask.id}/manager-validate`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    comment: note || "Document attached by legal workflow.",
                    attachmentUrl: uploaded.fileUrl,
                }),
            });
            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                alert(String(result?.error || "Failed to attach document"));
                return;
            }
            alert("Document attached successfully.");
            setTaskFile(null);
            setNote("");
            const refreshed = await fetch(`${API_URL}/tasks?limit=500&offset=0`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (refreshed.ok) {
                const rj = await refreshed.json().catch(() => ({}));
                setTasks(Array.isArray(rj?.data) ? rj.data : []);
            }
        } finally {
            setSavingDoc(false);
        }
    };

    if (!canViewLegalWorkflow) {
        return (
            <div className="p-8">
                <div className="bg-card rounded-xl border border-border p-8 text-center">
                    <p className="text-lg font-bold text-foreground">Legal</p>
                    <p className="text-sm text-muted-foreground mt-2">Only CEO, Super Admin, and Legal users can view this page.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Legal</h1>
                <p className="text-muted-foreground mt-1">Contract and document workflow queue assigned by CEO / Super Admin.</p>
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    type="button"
                    onClick={() => setSearchParams({}, { replace: true })}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === "contract" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                >
                    <FileText className="w-4 h-4" /> Contract
                </button>
                <button
                    type="button"
                    onClick={() => setSearchParams({ tab: "document" }, { replace: true })}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === "document" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"}`}
                >
                    <FolderOpen className="w-4 h-4" /> Document
                </button>
                <Link
                    to="/all-stations-reports"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-muted hover:bg-muted/80"
                >
                    <BarChart2 className="w-4 h-4" /> Reports
                </Link>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border">
                    <p className="font-semibold text-foreground">{activeTab === "contract" ? "Contract Queue" : "Document Queue"}</p>
                </div>
                {loading ? (
                    <div className="p-8 text-center text-muted-foreground">Loading...</div>
                ) : rows.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">No stations found.</div>
                ) : (
                    <div className="divide-y divide-border">
                        {rows.map((r) => (
                            <div key={r.id} className="px-4 py-3 flex items-center justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-foreground">{r.project_name || "Station"}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {r.project_code || "—"} · {r.city || "—"} · {new Date(r.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right flex items-center gap-2">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Status</p>
                                        <p className="text-sm font-semibold">{r.status || "—"}</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedTaskId(r.id)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-semibold hover:bg-muted"
                                    >
                                        <Eye className="w-4 h-4" /> Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedTask && (
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-border flex items-center justify-between gap-3">
                        <p className="font-semibold text-foreground">Station Details</p>
                        <button type="button" onClick={() => setSelectedTaskId(null)} className="text-sm text-muted-foreground hover:text-foreground">Close</button>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            <p><span className="text-muted-foreground">Station/Project:</span> <span className="font-semibold">{selectedTask.project_name || "—"}</span></p>
                            <p><span className="text-muted-foreground">Code:</span> <span className="font-semibold">{selectedTask.project_code || "—"}</span></p>
                            <p><span className="text-muted-foreground">City:</span> <span className="font-semibold">{selectedTask.city || "—"}</span></p>
                            <p><span className="text-muted-foreground">Flow:</span> <span className="font-semibold">{selectedTask.flow_type}</span></p>
                            <p><span className="text-muted-foreground">Assigned To:</span> <span className="font-semibold">{selectedTask.assigned_to_username || "—"}</span></p>
                            <p><span className="text-muted-foreground">Status:</span> <span className="font-semibold">{selectedTask.status || "—"}</span></p>
                        </div>

                        {selectedProject && (
                            <div className="rounded-lg border border-border p-3">
                                <p className="text-sm font-semibold mb-2">Project snapshot</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    <p><span className="text-muted-foreground">Request type:</span> {selectedProject.request_type || "—"}</p>
                                    <p><span className="text-muted-foreground">Contract type:</span> {selectedProject.contract_type || "—"}</p>
                                    <p><span className="text-muted-foreground">Owner:</span> {selectedProject.owner_name || "—"}</p>
                                    <p><span className="text-muted-foreground">Google location:</span> {selectedProject.google_location || "—"}</p>
                                </div>
                            </div>
                        )}

                        {activeTab === "contract" && (
                            <div className="rounded-lg border border-border p-3">
                                <p className="text-sm font-semibold mb-2">Contract action</p>
                                {(() => {
                                    const meta = selectedTask.metadata || {};
                                    const stationCode = String(meta.stationCode || meta.station_code || meta.stationcode || "").trim();
                                    const backTo = `/all-stations-legal${activeTab === "document" ? "?tab=document" : ""}`;
                                    if (!stationCode) {
                                        return <p className="text-sm text-muted-foreground">Station code missing in task metadata. Unable to open contract form.</p>;
                                    }
                                    return (
                                        <button
                                            type="button"
                                            disabled={!canEditLegalWorkflow}
                                            onClick={() =>
                                                navigate(`/station/${encodeURIComponent(stationCode)}/form/contract?taskId=${encodeURIComponent(selectedTask.id)}&backTo=${encodeURIComponent(backTo)}`)
                                            }
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50"
                                        >
                                            <FileText className="w-4 h-4" /> {canEditLegalWorkflow ? "Open Contract Form" : "View Contract Form"}
                                        </button>
                                    );
                                })()}
                            </div>
                        )}

                        {activeTab === "document" && (
                            <div className="rounded-lg border border-border p-3 space-y-3">
                                <p className="text-sm font-semibold">Document action</p>
                                {(selectedTask.attachment_url || selectedTask.manager_attachment_url || selectedTask.employee_attachment_url) && (
                                    <a
                                        href={(selectedTask.manager_attachment_url || selectedTask.employee_attachment_url || selectedTask.attachment_url) || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 text-primary underline text-sm"
                                    >
                                        <ExternalLink className="w-4 h-4" /> Open latest attached document
                                    </a>
                                )}
                                {canEditLegalWorkflow ? (
                                    <div className="space-y-2">
                                        <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background cursor-pointer text-sm">
                                            <Upload className="w-4 h-4" /> Upload document
                                            <input type="file" className="hidden" onChange={(e) => setTaskFile(e.target.files?.[0] || null)} />
                                        </label>
                                        {taskFile && <p className="text-xs text-muted-foreground">Selected: {taskFile.name}</p>}
                                        <textarea
                                            rows={2}
                                            value={note}
                                            onChange={(e) => setNote(e.target.value)}
                                            placeholder="Optional note"
                                            className="w-full px-3 py-2 border border-border rounded-lg bg-background text-sm"
                                        />
                                        <button
                                            type="button"
                                            disabled={!taskFile || savingDoc}
                                            onClick={() => void handleAttachDocument()}
                                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-semibold disabled:opacity-50"
                                        >
                                            {savingDoc ? "Saving..." : "Attach Document"}
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground">Read-only view. Only Super Admin and Legal can attach documents.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

