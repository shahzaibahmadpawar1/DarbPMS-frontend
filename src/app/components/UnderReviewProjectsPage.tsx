import { useState, useEffect } from "react";
import {
    Clock, CheckCircle, XCircle, MessageSquare,
    ChevronDown, ChevronUp, ExternalLink, MapPin,
    Calendar, User, FileText
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// API endpoints
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface InvestmentProject {
    id: string;
    project_name: string;
    project_code: string;
    department_type: 'investment' | 'franchise';
    request_type: string;
    city: string;
    district: string;
    area: number;
    project_status: string;
    contract_type: string;
    google_location: string;
    priority_level: string;
    order_date: string;
    request_sender: string;
    review_status: 'Pending Review' | 'Validated' | 'Approved' | 'Rejected';
    pm_comment?: string;
    ceo_comment?: string;
    owner_name: string;
    created_at: string;
}

export function UnderReviewProjectsPage() {
    const { user, token } = useAuth();
    const [projects, setProjects] = useState<InvestmentProject[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_URL}/investment-projects`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const result = await response.json();
            if (result.data) {
                // Filter based on role logic
                // For now, show all but UI elements change
                setProjects(result.data);
            }
        } catch (err) {
            console.error("Failed to fetch projects:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleUpdateStatus = async (projectId: string, newStatus: string) => {
        if (!comment && (newStatus === 'Rejected' || newStatus === 'Validated')) {
            alert("Please provide a comment.");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await fetch(`${API_URL}/investment-projects/${projectId}/review`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reviewStatus: newStatus,
                    comment: comment
                })
            });

            if (response.ok) {
                alert(`Project ${newStatus} successfully!`);
                setComment("");
                setExpandedId(null);
                fetchProjects();
            } else {
                const err = await response.json();
                alert(`Error: ${err.error || 'Failed to update status'}`);
            }
        } catch (err) {
            console.error("Failed to update status:", err);
            alert("Failed to update status");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Pending Review': return "bg-amber-100 text-amber-700 border-amber-200";
            case 'Validated': return "bg-blue-100 text-blue-700 border-blue-200";
            case 'Approved': return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case 'Rejected': return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const isCEO = user?.role === 'ceo';
    const isAdmin = user?.role === 'admin';
    const isPM = user?.role === 'user' || isAdmin;

    // Filter projects based on the current user's role and status
    // User/PM sees everything but can only validate 'Pending Review'
    // CEO sees 'Validated' (or potentially everything but primarily focuses on validated)

    const filteredProjects = projects.filter(p => {
        if (isCEO) return p.review_status === 'Validated' || p.review_status === 'Approved' || p.review_status === 'Rejected';
        return true; // PM/Admin sees all
    });

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Under-Review Projects</h1>
                <p className="text-muted-foreground mt-2">Manage project validations and executive approvals</p>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="bg-card rounded-2xl border border-dashed border-border p-20 text-center">
                    <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <h3 className="text-xl font-bold text-foreground">No projects under review</h3>
                    <p className="text-muted-foreground mt-2">New projects will appear here once submitted.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredProjects.map((project) => (
                        <div
                            key={project.id}
                            className={`bg-card rounded-2xl border transition-all duration-300 overflow-hidden ${expandedId === project.id ? "ring-2 ring-primary border-transparent shadow-xl" : "border-border shadow-sm hover:shadow-md"
                                }`}
                        >
                            {/* Header */}
                            <div
                                className="p-6 flex flex-wrap items-center justify-between gap-4 cursor-pointer"
                                onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${project.department_type === 'investment' ? 'bg-blue-500/10 text-blue-500' : 'bg-purple-500/10 text-purple-500'
                                        }`}>
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground">{project.project_name}</h3>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                            {project.project_code} • {project.department_type}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${getStatusBadge(project.review_status)}`}>
                                        {project.review_status}
                                    </span>
                                    {expandedId === project.id ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                                </div>
                            </div>

                            {/* Details Panel */}
                            {expandedId === project.id && (
                                <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-300">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-t border-border">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-muted-foreground uppercase">City / District</p>
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                                <span>{project.city}, {project.district}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-muted-foreground uppercase">Owner</p>
                                            <div className="flex items-center gap-2 text-sm">
                                                <User className="w-3.5 h-3.5 text-primary" />
                                                <span>{project.owner_name || 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-muted-foreground uppercase">Request Date</p>
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="w-3.5 h-3.5 text-primary" />
                                                <span>{project.order_date ? new Date(project.order_date).toLocaleDateString() : 'N/A'}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-muted-foreground uppercase">GPS Location</p>
                                            <a
                                                href={project.google_location}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-sm text-primary hover:underline"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                                <span>View on Maps</span>
                                            </a>
                                        </div>
                                    </div>

                                    {/* History / Comments */}
                                    <div className="bg-muted/30 rounded-xl p-4 space-y-4 mb-6">
                                        {project.pm_comment && (
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0">
                                                    <MessageSquare className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-muted-foreground">PM VALIDATION COMMENT</p>
                                                    <p className="text-sm text-foreground mt-1">{project.pm_comment}</p>
                                                </div>
                                            </div>
                                        )}
                                        {project.ceo_comment && (
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 flex-shrink-0">
                                                    <CheckCircle className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-muted-foreground">CEO DECISION COMMENT</p>
                                                    <p className="text-sm text-foreground mt-1">{project.ceo_comment}</p>
                                                </div>
                                            </div>
                                        )}
                                        {!project.pm_comment && !project.ceo_comment && (
                                            <p className="text-xs text-muted-foreground italic text-center py-2">No existing comments.</p>
                                        )}
                                    </div>

                                    {/* Action Bar */}
                                    <div className="border-t border-border pt-6">
                                        <div className="mb-4">
                                            <label className="block text-sm font-bold text-muted-foreground mb-2 flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4" />
                                                Add Comment / Decision Notes
                                            </label>
                                            <textarea
                                                className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                                                rows={3}
                                                placeholder="Enter your validation notes or reasons for approval/rejection..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3 font-semibold">
                                            {/* PM Actions */}
                                            {isPM && project.review_status === 'Pending Review' && (
                                                <button
                                                    disabled={isSubmitting}
                                                    onClick={() => handleUpdateStatus(project.id, 'Validated')}
                                                    className="px-6 py-2.5 bg-primary text-white rounded-lg flex items-center gap-2 hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                    Validate for CEO Approval
                                                </button>
                                            )}

                                            {/* CEO Actions */}
                                            {isCEO && project.review_status === 'Validated' && (
                                                <>
                                                    <button
                                                        disabled={isSubmitting}
                                                        onClick={() => handleUpdateStatus(project.id, 'Approved')}
                                                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        Approve Project
                                                    </button>
                                                    <button
                                                        disabled={isSubmitting}
                                                        onClick={() => handleUpdateStatus(project.id, 'Rejected')}
                                                        className="px-6 py-2.5 bg-red-600 text-white rounded-lg flex items-center gap-2 hover:bg-red-700 shadow-lg shadow-red-200 transition-all disabled:opacity-50"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        Reject Project
                                                    </button>
                                                </>
                                            )}

                                            {/* Admin can also reject at any time */}
                                            {isAdmin && project.review_status !== 'Rejected' && project.review_status !== 'Approved' && (
                                                <button
                                                    disabled={isSubmitting}
                                                    onClick={() => handleUpdateStatus(project.id, 'Rejected')}
                                                    className="px-6 py-2.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-all"
                                                >
                                                    Cancel / Reject
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
