import { useState, useEffect } from "react";
import {
    Clock, CheckCircle, XCircle, MessageSquare,
    ChevronDown, ChevronUp, ExternalLink, MapPin,
    Calendar, User, FileText, Phone, Mail, Hash,
    Layers, Tag, Building2, AlertCircle, Download,
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
    const isPM = user?.role === 'user' || user?.role === 'admin';

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
                                    {/* ── Project Info ── */}
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
                                                <p className="text-xs font-bold text-muted-foreground uppercase">Area (m²)</p>
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
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${project.priority_level === 'High' ? 'bg-red-100 text-red-700' : project.priority_level === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>{project.priority_level || 'N/A'}</span>
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

                                    {/* ── Owner Info ── */}
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

                                    {/* ── Station Elements ── */}
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
                                                        {el.area > 0 && <p className="text-xs text-muted-foreground mt-1">{el.area} m²</p>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* ── Documents ── */}
                                    {(project.design_file_url || project.documents_url || project.autocad_url) && (
                                        <div className="border-t border-border pt-6 mb-6">
                                            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                                                <Download className="w-3.5 h-3.5" /> Project Documents
                                            </h4>
                                            <div className="flex flex-wrap gap-3">
                                                {project.design_file_url && <a href={project.design_file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"><Download className="w-4 h-4" />Design File</a>}
                                                {project.documents_url && <a href={project.documents_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors"><Download className="w-4 h-4" />Documents</a>}
                                                {project.autocad_url && <a href={project.autocad_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors"><Download className="w-4 h-4" />AutoCAD (.dwg)</a>}
                                            </div>
                                        </div>
                                    )}

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
                                            <label className="flex items-center gap-2 text-sm font-bold text-muted-foreground mb-2">
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
