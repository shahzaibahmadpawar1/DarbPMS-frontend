import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
    Clock, CheckCircle, MessageSquare,
    ChevronDown, ChevronUp, ExternalLink, MapPin,
    Calendar, User, FileText, Phone, Mail, Hash,
    Layers, Tag, Building2, AlertCircle, Download,
} from "lucide-react";

const normalizeStorageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;

    try {
        const parsed = new URL(url);
        const marker = "/storage/v1/object/public/";
        const index = parsed.pathname.indexOf(marker);
        if (index === -1) {
            return url;
        }

        const suffix = parsed.pathname.slice(index + marker.length);
        const slashIndex = suffix.indexOf("/");
        if (slashIndex === -1) {
            return url;
        }

        const objectPath = suffix.slice(slashIndex + 1);
        parsed.pathname = `${marker}pms/${objectPath}`;
        return parsed.toString();
    } catch {
        return url;
    }
};
import { useAuth } from "@/context/AuthContext";

// API endpoints
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const PROJECTS_PAGE_SIZE = 200;

const fetchAllInvestmentProjects = async (token: string): Promise<InvestmentProject[]> => {
    const allProjects: InvestmentProject[] = [];
    let offset = 0;

    while (true) {
        const response = await fetch(`${API_URL}/investment-projects?limit=${PROJECTS_PAGE_SIZE}&offset=${offset}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch projects');
        }

        const result = await response.json();
        const pageItems = Array.isArray(result?.data) ? result.data : [];
        allProjects.push(...pageItems);

        if (pageItems.length < PROJECTS_PAGE_SIZE) {
            break;
        }

        offset += PROJECTS_PAGE_SIZE;
    }

    return allProjects;
};

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
    owner_contact_no: string;
    owner_type: string;
    id_no: string;
    email: string;
    national_address: string;
    super_market: number;
    fuel_station: number;
    kiosks: number;
    retail_shop: number;
    drive_through: number;
    super_market_area: number;
    fuel_station_area: number;
    kiosks_area: number;
    retail_shop_area: number;
    drive_through_area: number;
    design_file_url: string;
    documents_url: string;
    autocad_url: string;
    created_at: string;
}

export function UnderReviewProjectsPage() {
    const { user, token } = useAuth();
    const [searchParams] = useSearchParams();
    const [projects, setProjects] = useState<InvestmentProject[]>([]);
    const [workflowSummary, setWorkflowSummary] = useState({
        totalProjects: 0,
        pending: 0,
        validated: 0,
        approved: 0,
        contracted: 0,
        documented: 0,
        rejected: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const projectCardRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const selectedProjectId = searchParams.get("projectId");

    const fetchProjects = async () => {
        if (!token) {
            setProjects([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const allProjects = await fetchAllInvestmentProjects(token);
            // Filter based on role logic
            // For now, show all but UI elements change
            setProjects(allProjects);
        } catch (err) {
            console.error("Failed to fetch projects:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [token]);

    useEffect(() => {
        if (!selectedProjectId || projects.length === 0) {
            return;
        }

        const targetProject = projects.find((project) => project.id === selectedProjectId);
        if (!targetProject) {
            return;
        }

        setExpandedId(targetProject.id);
        window.requestAnimationFrame(() => {
            projectCardRefs.current[targetProject.id]?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
    }, [projects, selectedProjectId]);

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const response = await fetch(`${API_URL}/dashboard/stats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                const projectsData = data?.projects || {};
                const workflowData = data?.workflow || {};

                setWorkflowSummary({
                    totalProjects: workflowData.total_projects ?? projectsData.total ?? 0,
                    pending: projectsData.pending_review ?? 0,
                    validated: projectsData.validated ?? 0,
                    approved: projectsData.approved ?? 0,
                    contracted: workflowData.contracted ?? 0,
                    documented: workflowData.documented ?? 0,
                    rejected: projectsData.rejected ?? workflowData.rejected ?? 0,
                });
            } catch (err) {
                console.error("Failed to fetch workflow summary:", err);
            }
        };

        if (token) {
            fetchSummary();
        }
    }, [token]);

    const handleWorkflowAction = async (projectId: string, action: 'Approve' | 'Reject' | 'Contract' | 'Documents') => {
        if (!comment.trim()) {
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
                    action,
                    comment: comment
                })
            });

            if (response.ok) {
                alert(`Action ${action} applied successfully!`);
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
            case 'Pending Review': return "bg-info/10 text-info border-info/20";
            case 'Validated': return "bg-primary/10 text-primary border-primary/20";
            case 'Approved': return "bg-success/10 text-success border-success/20";
            case 'Rejected': return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-muted text-muted-foreground border-border";
        }
    };

    const isSuperAdmin = user?.role === 'super_admin';
    const canTakeDecision = isSuperAdmin;

    const filteredProjects = projects;
    const fallbackPending = filteredProjects.filter((project) => project.review_status === 'Pending Review').length;
    const fallbackValidated = filteredProjects.filter((project) => project.review_status === 'Validated').length;
    const fallbackApproved = filteredProjects.filter((project) => project.review_status === 'Approved').length;
    const fallbackRejected = filteredProjects.filter((project) => project.review_status === 'Rejected').length;

    const topCards = [
        { title: 'Total Projects', value: isLoading ? '...' : (workflowSummary.totalProjects || filteredProjects.length) },
        { title: 'Pending', value: isLoading ? '...' : (workflowSummary.pending || fallbackPending) },
        { title: 'Validated', value: isLoading ? '...' : (workflowSummary.validated || fallbackValidated) },
        { title: 'Approved', value: isLoading ? '...' : (workflowSummary.approved || fallbackApproved) },
        { title: 'Contracted', value: isLoading ? '...' : workflowSummary.contracted },
        { title: 'Document', value: isLoading ? '...' : workflowSummary.documented },
        { title: 'Rejected', value: isLoading ? '...' : (workflowSummary.rejected || fallbackRejected) },
    ];

    return (
        <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7 gap-3 mb-8">
                {topCards.map((card) => (
                    <div
                        key={card.title}
                        className="rounded-xl shadow-md px-5 py-5 card-glow transition-all block relative overflow-hidden border border-border bg-card"
                    >
                        <h3 className="text-[11px] uppercase tracking-wide text-muted-foreground font-bold mb-3">{card.title}</h3>
                        <p className="text-5xl leading-none font-black text-foreground">{card.value}</p>
                    </div>
                ))}
            </div>

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Under-Review Projects</h1>
                <p className="text-muted-foreground mt-2">Review-only view for validated projects and final executive decisions</p>
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
                            ref={(element) => {
                                projectCardRefs.current[project.id] = element;
                            }}
                            className={`bg-card rounded-2xl border transition-all duration-300 overflow-hidden ${expandedId === project.id ? "ring-2 ring-primary border-transparent shadow-xl" : "border-border shadow-sm hover:shadow-md"
                                }`}
                        >
                            {/* Header */}
                            <div
                                className="p-6 flex flex-wrap items-center justify-between gap-4 cursor-pointer"
                                onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${project.department_type === 'investment' ? 'bg-info/10 text-info' : 'bg-primary/10 text-primary'
                                        }`}>
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-foreground">{project.project_name}</h3>
                                        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                                            {project.project_code}  -  {project.department_type}
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
                                    {/* Project Info */}
                                    <div className="border-t border-border pt-6 mb-6">
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <FileText className="w-3.5 h-3.5" /> Project Information
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">Request Type</p>
                                                <div className="flex items-center gap-2 text-sm"><Tag className="w-3.5 h-3.5 text-primary flex-shrink-0" /><span>{project.request_type || 'N/A'}</span></div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">City / District</p>
                                                <div className="flex items-center gap-2 text-sm"><MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" /><span>{project.city || 'N/A'}{project.district ? `, ${project.district}` : ''}</span></div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">Area (m2)</p>
                                                <div className="flex items-center gap-2 text-sm"><Layers className="w-3.5 h-3.5 text-primary flex-shrink-0" /><span>{project.area || 'N/A'}</span></div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">Project Status</p>
                                                <div className="flex items-center gap-2 text-sm"><AlertCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" /><span>{project.project_status || 'N/A'}</span></div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">Contract Type</p>
                                                <div className="flex items-center gap-2 text-sm"><FileText className="w-3.5 h-3.5 text-primary flex-shrink-0" /><span>{project.contract_type || 'N/A'}</span></div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">Priority Level</p>
                                                <div className="flex items-center gap-2 text-sm">
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${project.priority_level === 'High' ? 'bg-red-100 text-red-700' : project.priority_level === 'Medium' ? 'bg-info/10 text-info' : 'bg-green-100 text-green-700'}`}>{project.priority_level || 'N/A'}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">Request Date</p>
                                                <div className="flex items-center gap-2 text-sm"><Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" /><span>{project.order_date ? new Date(project.order_date).toLocaleDateString() : 'N/A'}</span></div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">Request Sender</p>
                                                <div className="flex items-center gap-2 text-sm"><User className="w-3.5 h-3.5 text-primary flex-shrink-0" /><span>{project.request_sender || 'N/A'}</span></div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">Submitted On</p>
                                                <div className="flex items-center gap-2 text-sm"><Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" /><span>{project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}</span></div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">GPS Location</p>
                                                <a href={project.google_location} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
                                                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" /><span>View on Maps</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Owner Info */}
                                    <div className="border-t border-border pt-6 mb-6">
                                        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <User className="w-3.5 h-3.5" /> Owner Information
                                            {project.owner_type && <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-muted capitalize">{project.owner_type}</span>}
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">{project.owner_type === 'company' ? 'Company Name' : 'Owner Name'}</p>
                                                <div className="flex items-center gap-2 text-sm"><User className="w-3.5 h-3.5 text-primary flex-shrink-0" /><span>{project.owner_name || 'N/A'}</span></div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">Contact No</p>
                                                <div className="flex items-center gap-2 text-sm"><Phone className="w-3.5 h-3.5 text-primary flex-shrink-0" /><span>{project.owner_contact_no || 'N/A'}</span></div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">ID / CR No</p>
                                                <div className="flex items-center gap-2 text-sm"><Hash className="w-3.5 h-3.5 text-primary flex-shrink-0" /><span>{project.id_no || 'N/A'}</span></div>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">Email</p>
                                                <div className="flex items-center gap-2 text-sm"><Mail className="w-3.5 h-3.5 text-primary flex-shrink-0" /><span>{project.email || 'N/A'}</span></div>
                                            </div>
                                            <div className="space-y-1 col-span-2">
                                                <p className="text-xs font-bold text-muted-foreground uppercase">National Address</p>
                                                <div className="flex items-center gap-2 text-sm"><MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" /><span>{project.national_address || 'N/A'}</span></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Station Elements */}
                                    {(project.super_market > 0 || project.fuel_station > 0 || project.kiosks > 0 || project.retail_shop > 0 || project.drive_through > 0) && (
                                        <div className="border-t border-border pt-6 mb-6">
                                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <Building2 className="w-3.5 h-3.5" /> Station Elements
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                                {[
                                                    { label: 'Supermarket', count: project.super_market, area: project.super_market_area },
                                                    { label: 'Fuel Station', count: project.fuel_station, area: project.fuel_station_area },
                                                    { label: 'Kiosks', count: project.kiosks, area: project.kiosks_area },
                                                    { label: 'Retail Shop', count: project.retail_shop, area: project.retail_shop_area },
                                                    { label: 'Drive Through', count: project.drive_through, area: project.drive_through_area },
                                                ].filter(el => el.count > 0).map(el => (
                                                    <div key={el.label} className="bg-muted/50 rounded-xl p-3 border border-border text-center">
                                                        <p className="text-xs font-bold text-muted-foreground mb-1">{el.label}</p>
                                                        <p className="text-lg font-black text-foreground">{el.count}</p>
                                                        {el.area > 0 && <p className="text-xs text-muted-foreground mt-1">{el.area} m2</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Documents */}
                                    {(project.design_file_url || project.documents_url || project.autocad_url) && (
                                        <div className="border-t border-border pt-6 mb-6">
                                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <Download className="w-3.5 h-3.5" /> Project Documents
                                            </h4>
                                            <div className="flex flex-wrap gap-3">
                                                {project.design_file_url && <a href={normalizeStorageUrl(project.design_file_url) || project.design_file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/15 transition-colors"><Download className="w-4 h-4" />Design File</a>}
                                                {project.documents_url && <a href={normalizeStorageUrl(project.documents_url) || project.documents_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-medium hover:bg-primary/15 transition-colors"><Download className="w-4 h-4" />Documents</a>}
                                                {project.autocad_url && <a href={normalizeStorageUrl(project.autocad_url) || project.autocad_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-info/10 text-info rounded-lg text-sm font-medium hover:bg-info/10 transition-colors"><Download className="w-4 h-4" />AutoCAD (.dwg)</a>}
                                            </div>
                                        </div>
                                    )}

                                    {/* History / Comments */}
                                    <div className="bg-muted/30 rounded-xl p-4 space-y-4 mb-6">
                                        {project.pm_comment && (
                                            <div className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
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
                                            <label className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-2">
                                                <MessageSquare className="w-4 h-4" />
                                                Add Decision Notes
                                            </label>
                                            <textarea
                                                className="w-full bg-background border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none"
                                                rows={3}
                                                placeholder="Enter final approval or rejection notes..."
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                            />
                                        </div>

                                        <div className="flex justify-end gap-3 font-semibold flex-wrap">
                                            {canTakeDecision && project.review_status === 'Pending Review' && (
                                                <>
                                                    <button
                                                        disabled={isSubmitting}
                                                        onClick={() => handleWorkflowAction(project.id, 'Approve')}
                                                        className="px-6 py-2.5 bg-emerald-600 text-white rounded-lg flex items-center gap-2 hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all disabled:opacity-50"
                                                    >
                                                        <CheckCircle className="w-4 h-4" />
                                                        Approve
                                                    </button>
                                                    <button
                                                        disabled={isSubmitting}
                                                        onClick={() => handleWorkflowAction(project.id, 'Reject')}
                                                        className="px-6 py-2.5 bg-error text-white rounded-lg flex items-center gap-2 hover:bg-error/90 shadow-lg shadow-error/20 transition-all disabled:opacity-50"
                                                    >
                                                        <AlertCircle className="w-4 h-4" />
                                                        Reject
                                                    </button>
                                                </>
                                            )}

                                            {!canTakeDecision && (
                                                <p className="text-sm text-muted-foreground">Final approval is handled in the Tasks workflow for your role.</p>
                                            )}

                                            {project.review_status === 'Validated' && canTakeDecision && (
                                                <p className="text-sm text-muted-foreground">Validated projects are finalized from the Tasks workflow.</p>
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

