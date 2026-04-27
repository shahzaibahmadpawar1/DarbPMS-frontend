import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useStation } from "../../context/StationContext";
import { feasibilityAPI, getDepartmentLabel, getRoleLabel, usersAPI, type Department } from "@/services/api";
import { useSearchParams } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
const DEPT_PROJECTS_PAGE_SIZE = 200;

const fetchDepartmentProjects = async (
    token: string,
    dept: 'investment' | 'franchise'
): Promise<any[]> => {
    const allProjects: any[] = [];
    let offset = 0;

    while (true) {
        const response = await fetch(
            `${API_URL}/investment-projects?departmentType=${dept}&limit=${DEPT_PROJECTS_PAGE_SIZE}&offset=${offset}`,
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch department projects');
        }

        const result = await response.json();
        const pageItems = Array.isArray(result?.data) ? result.data : [];
        allProjects.push(...pageItems);

        if (pageItems.length < DEPT_PROJECTS_PAGE_SIZE) {
            break;
        }

        offset += DEPT_PROJECTS_PAGE_SIZE;
    }

    return allProjects;
};

const fetchDepartmentProjectById = async (token: string, projectId: string): Promise<any | null> => {
    const response = await fetch(`${API_URL}/investment-projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
        return null;
    }

    const result = await response.json();
    return result?.data || null;
};
import {
    PlusCircle, BarChart2, FileText, BookOpen,
    TrendingUp, CheckCircle2, XCircle, Clock, Upload, FileCheck,
    Trash2, MapPin, User, Phone, Mail, Save, Send,
    Layers, ClipboardList, Download
} from "lucide-react";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type ActiveTab = "new-project" | "feasibility" | "reports" | "contracts";

type FeasibilityReviewDepartment = 'project' | 'operation' | 'realestate' | 'investment' | 'finance';

type DepartmentManagerOption = {
    id: string;
    username: string;
    department: Department | null;
};

interface NewProjectForm {
    requestType: string;
    city: string;
    projectName: string;
    projectCode: string;
    district: string;
    area: string;
    projectStatus: string;
    contractType: string;
    googleLocation: string;
    priorityLevel: string;
    ownerName: string;
    ownerContactNo: string;
    idNo: string;
    nationalAddress: string;
    email: string;
    ownerType: string;
    requestSender: string;
    orderDate: string;
}

interface CommercialElement {
    id: string;
    name: string;
    count: string;
    area: string;
    isDefault?: boolean;
}

interface ProjectDocumentSlot {
    id: string;
    label: string;
    file: File | null;
}

const REQUEST_TYPES = [
    "Design",
    "Cost Estimate",
    "Design + Cost Estimation",
    "Brand Identity Implementation",
    "Cost Estimation for Brand Identity Implementation",
    "Feasibility Study",
];

const PROJECT_STATUSES = ["Vacant Land", "Operational", "Under Structural Construction"];
const CONTRACT_TYPES = ["Operation Station", "Lease Stations", "Investment", "Franchise Station"];
const PRIORITY_LEVELS = ["Low", "Medium", "High", "Critical"];

const DEFAULT_ELEMENT_NAMES = ["Super Market", "Fuel Station", "Kiosks", "Retail Shop", "Drive Through"];
const DEFAULT_DOCUMENT_SLOTS = ["Design File", "Documents", "Auto CAD Drawing (.dwg)"];

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// â”€â”€â”€ Field Helper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-muted-foreground mb-1.5">
                {label}{required && <span className="text-destructive ml-1">*</span>}
            </label>
            {children}
        </div>
    );
}

const inputCls = "w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground text-sm";
const selectCls = inputCls;

// â”€â”€â”€ File Upload Pill â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FileUpload({ label, file, onLabelChange, onChange, onRemoveFile, onRemoveSlot }: {
    label: string; file: File | null;
    onLabelChange?: (v: string) => void;
    onChange: (f: File) => void;
    onRemoveFile: () => void;
    onRemoveSlot?: () => void;
}) {
    const openPreview = () => {
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        window.open(previewUrl, '_blank', 'noopener,noreferrer');
        setTimeout(() => URL.revokeObjectURL(previewUrl), 60000);
    };

    return (
        <div className="border-2 border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-2 mb-2">
                {onLabelChange ? (
                    <input
                        type="text"
                        value={label}
                        onChange={e => onLabelChange(e.target.value)}
                        placeholder="Document label"
                        className="w-full px-2 py-1 text-xs font-semibold text-foreground bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                ) : (
                    <p className="text-xs font-semibold text-muted-foreground">{label}</p>
                )}
                {onRemoveSlot && (
                    <button type="button" onClick={onRemoveSlot} className="p-1 hover:bg-destructive/10 rounded flex-shrink-0" title="Remove slot">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                )}
            </div>
            {file ? (
                <div className="flex items-center justify-between gap-2 bg-emerald-500/5 rounded-lg p-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <FileCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-xs text-emerald-700 truncate">{file.name}</span>
                    </div>
                    <button type="button" onClick={openPreview} className="ml-1 px-2 py-1 text-[10px] border border-border rounded">View</button>
                    <button type="button" onClick={onRemoveFile} className="ml-1 p-1 hover:bg-destructive/10 rounded flex-shrink-0">
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center gap-2 cursor-pointer py-2">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Click to upload (PDF, JPG, PNG, DWG)</span>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.dwg,.doc,.docx"
                        onChange={e => e.target.files?.[0] && onChange(e.target.files[0])} />
                </label>
            )}
        </div>
    );
}

// â”€â”€â”€ Section Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
    return (
        <div className="flex items-center gap-3 pb-4 border-b border-border mb-6">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary">
                {icon}
            </div>
            <div>
                <h3 className="text-base font-bold text-foreground">{title}</h3>
                {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
        </div>
    );
}

// â”€â”€â”€ Stat Card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function StatCard({ label, value, icon, color, bg }: {
    label: string; value: string | number; icon: React.ReactNode; color: string; bg: string;
}) {
    return (
        <div className="bg-card rounded-xl border border-border p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3 ${color}`}>{icon}</div>
            <p className="text-2xl font-black text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground font-medium mt-1">{label}</p>
        </div>
    );
}

// â”€â”€â”€ New Project Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function NewProjectTab() {
    const { user } = useAuth();
    const { setInvestmentProjectData } = useStation();
    const [searchParams] = useSearchParams();
    const canCreateRole = !!user && ['super_admin', 'department_manager', 'supervisor'].includes(user.role);
    const canCreateDepartment = user?.role === 'super_admin' || user?.department === 'investment' || user?.department === 'franchise';
    const canCreateProject = canCreateRole && canCreateDepartment;
    const selectedProjectId = (searchParams.get("projectId") || "").trim();

    const [form, setForm] = useState<NewProjectForm>({
        requestType: "", city: "", projectName: "", projectCode: "",
        district: "", area: "", projectStatus: "", contractType: "",
        googleLocation: "",
        priorityLevel: "", ownerName: "", ownerContactNo: "",
        idNo: "", nationalAddress: "", email: "", ownerType: "individual",
        requestSender: "", orderDate: "",
    });

    useEffect(() => {
        if (!user) return;

        const roleLabel = getRoleLabel(user.role);
        const rawDepartment = getDepartmentLabel(user.department);
        const userDepartment = rawDepartment === "All Departments" ? "All Departments" : `${rawDepartment} Department`;

        setForm((prev) => ({
            ...prev,
            requestSender: `${user.username || "User"} (${roleLabel}) - ${userDepartment}`,
        }));
    }, [user]);

    const [elements, setElements] = useState<CommercialElement[]>(
        DEFAULT_ELEMENT_NAMES.map(name => ({ id: createId(), name, count: "0", area: "", isDefault: true }))
    );
    const [draftProjectId, setDraftProjectId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [projectDocuments, setProjectDocuments] = useState<ProjectDocumentSlot[]>(
        DEFAULT_DOCUMENT_SLOTS.map(label => ({ id: createId(), label, file: null }))
    );

    const set = (key: keyof NewProjectForm, val: string) => setForm(p => ({ ...p, [key]: val }));

    const updateElement = (id: string, key: keyof Omit<CommercialElement, "id">, value: string) => {
        setElements(prev => prev.map(el => el.id === id ? { ...el, [key]: value } : el));
    };

    const addElement = () => {
        setElements(prev => [...prev, { id: createId(), name: "", count: "0", area: "", isDefault: false }]);
    };

    const removeElement = (id: string) => {
        setElements((prev) => {
            const target = prev.find((el) => el.id === id);
            if (!target) {
                return prev;
            }

            if (target.isDefault && user?.role !== "super_admin") {
                alert("Only CEO can delete the default station elements.");
                return prev;
            }

            return prev.filter((el) => el.id !== id);
        });
    };

    const updateDocument = (id: string, patch: Partial<ProjectDocumentSlot>) => {
        setProjectDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, ...patch } : doc));
    };

    const addDocumentSlot = () => {
        setProjectDocuments(prev => [...prev, { id: createId(), label: "", file: null }]);
    };

    const removeDocumentSlot = (id: string) => {
        setProjectDocuments(prev => prev.filter(doc => doc.id !== id));
    };

    const { token } = useAuth();
    const departmentType = window.location.pathname.includes('investment') ? 'investment' : 'franchise';

    useEffect(() => {
        const loadProjectForEditing = async () => {
            if (!token || !canCreateProject) return;

            try {
                const savedProject = selectedProjectId
                    ? await fetchDepartmentProjectById(token, selectedProjectId)
                    : await (async () => {
                        const response = await fetch(
                            `${API_URL}/investment-projects/latest-saved?departmentType=${departmentType}`,
                            { headers: { 'Authorization': `Bearer ${token}` } }
                        );

                        if (!response.ok) {
                            return null;
                        }

                        const result = await response.json();
                        return result?.data || null;
                    })();

                if (!savedProject?.id) {
                    return;
                }

                if (savedProject.department_type !== departmentType) {
                    if (selectedProjectId) {
                        alert('Selected project belongs to another department form.');
                    }
                    return;
                }

                setDraftProjectId(savedProject.id);
                setForm((prev) => ({
                    ...prev,
                    requestType: savedProject.request_type || "",
                    city: savedProject.city || "",
                    projectName: savedProject.project_name || "",
                    projectCode: savedProject.project_code || "",
                    district: savedProject.district || "",
                    area: savedProject.area != null ? String(savedProject.area) : "",
                    projectStatus: savedProject.project_status || "",
                    contractType: savedProject.contract_type || "",
                    googleLocation: savedProject.google_location || "",
                    priorityLevel: savedProject.priority_level || "",
                    ownerName: savedProject.owner_name || "",
                    ownerContactNo: savedProject.owner_contact_no || "",
                    idNo: savedProject.id_no || "",
                    nationalAddress: savedProject.national_address || "",
                    email: savedProject.email || "",
                    ownerType: savedProject.owner_type || "individual",
                    requestSender: prev.requestSender,
                    orderDate: savedProject.order_date ? String(savedProject.order_date).slice(0, 10) : "",
                }));

                setElements([
                    { id: createId(), name: "Super Market", count: String(savedProject.super_market || 0), area: String(savedProject.super_market_area || 0), isDefault: true },
                    { id: createId(), name: "Fuel Station", count: String(savedProject.fuel_station || 0), area: String(savedProject.fuel_station_area || 0), isDefault: true },
                    { id: createId(), name: "Kiosks", count: String(savedProject.kiosks || 0), area: String(savedProject.kiosks_area || 0), isDefault: true },
                    { id: createId(), name: "Retail Shop", count: String(savedProject.retail_shop || 0), area: String(savedProject.retail_shop_area || 0), isDefault: true },
                    { id: createId(), name: "Drive Through", count: String(savedProject.drive_through || 0), area: String(savedProject.drive_through_area || 0), isDefault: true },
                ]);

                if (selectedProjectId) {
                    alert('Loaded project for editing.');
                } else {
                    alert('Loaded your latest saved project draft.');
                }
            } catch (error) {
                console.error('Failed to load project data:', error);
            }
        };

        void loadProjectForEditing();
    }, [token, canCreateProject, departmentType, selectedProjectId]);

    const uploadProjectFile = async (file: File): Promise<string> => {
        if (!token) {
            throw new Error("Authentication required.");
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_URL}/files/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await response.json();
        if (!response.ok || !result?.data?.url) {
            throw new Error(result?.details || result?.error || "Failed to upload document");
        }

        return result.data.url as string;
    };

    const persistProject = async (mode: 'save' | 'submit') => {
        try {
            const isSubmitMode = mode === 'submit';
            if (isSubmitMode) {
                setIsSubmitting(true);
            } else {
                setIsSaving(true);
            }

            if (!token) {
                alert("Authentication required. Please login again.");
                return;
            }

            if (isSubmitMode && (!form.projectName.trim() || !form.projectCode.trim())) {
                alert("Project Name and Project Code are required to submit.");
                return;
            }

            const normalizeElementName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");
            const mapped = {
                superMarket: 0,
                fuelStation: 0,
                kiosks: 0,
                retailShop: 0,
                driveThrough: 0,
                superMarketArea: 0,
                fuelStationArea: 0,
                kiosksArea: 0,
                retailShopArea: 0,
                driveThroughArea: 0,
            };

            const extraCommercialElements: { name: string; count: number; area: number }[] = [];

            elements.forEach((el) => {
                const key = normalizeElementName(el.name);
                const count = parseInt(el.count || "0", 10) || 0;
                const area = parseFloat(el.area || "0") || 0;

                if (key === "supermarket") {
                    mapped.superMarket += count;
                    mapped.superMarketArea += area;
                    return;
                }
                if (key === "fuelstation") {
                    mapped.fuelStation += count;
                    mapped.fuelStationArea += area;
                    return;
                }
                if (key === "kiosks" || key === "kiosk") {
                    mapped.kiosks += count;
                    mapped.kiosksArea += area;
                    return;
                }
                if (key === "retailshop") {
                    mapped.retailShop += count;
                    mapped.retailShopArea += area;
                    return;
                }
                if (key === "drivethrough") {
                    mapped.driveThrough += count;
                    mapped.driveThroughArea += area;
                    return;
                }

                if (el.name.trim() || count > 0 || area > 0) {
                    extraCommercialElements.push({ name: el.name.trim(), count, area });
                }
            });

            let designFileUrl: string | null = null;
            let documentsUrl: string | null = null;
            let autocadUrl: string | null = null;

            const uploadedDocuments = [] as Array<{ label: string; fileName: string | null; fileUrl: string | null }>;
            for (const doc of projectDocuments) {
                if (!doc.file) {
                    uploadedDocuments.push({ label: doc.label, fileName: null, fileUrl: null });
                    continue;
                }

                const fileUrl = await uploadProjectFile(doc.file);
                const label = (doc.label || "").toLowerCase();

                if (!designFileUrl && label.includes("design")) {
                    designFileUrl = fileUrl;
                } else if (!autocadUrl && (label.includes("cad") || label.includes("dwg"))) {
                    autocadUrl = fileUrl;
                } else if (!documentsUrl) {
                    documentsUrl = fileUrl;
                }

                uploadedDocuments.push({ label: doc.label, fileName: doc.file.name, fileUrl });
            }

            const baseBody = {
                departmentType,
                ...form,
                superMarket: mapped.superMarket,
                fuelStation: mapped.fuelStation,
                kiosks: mapped.kiosks,
                retailShop: mapped.retailShop,
                driveThrough: mapped.driveThrough,
                superMarketArea: mapped.superMarketArea,
                fuelStationArea: mapped.fuelStationArea,
                kiosksArea: mapped.kiosksArea,
                retailShopArea: mapped.retailShopArea,
                driveThroughArea: mapped.driveThroughArea,
                area: parseFloat(form.area) || 0,
                submit: isSubmitMode,
            };

            const body = {
                ...baseBody,
                commercialElements: elements,
                extraCommercialElements,
                designFileUrl,
                documentsUrl,
                autocadUrl,
                projectDocuments: uploadedDocuments,
            };

            const endpoint = draftProjectId
                ? `${API_URL}/investment-projects/${draftProjectId}`
                : `${API_URL}/investment-projects`;
            const method = draftProjectId ? 'PUT' : 'POST';

            // PUT endpoint expects table-backed columns only; avoid sending UI-only metadata.
            const requestBody = method === 'PUT' ? baseBody : body;

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            if (response.ok) {
                const responseData = await response.json();
                const savedId = responseData?.data?.id;
                if (savedId) {
                    setDraftProjectId(savedId);
                }

                setInvestmentProjectData({
                    projectName: form.projectName,
                    projectCode: form.projectCode,
                    city: form.city,
                    district: form.district,
                    area: form.area,
                    googleLocation: form.googleLocation,
                    ownerName: form.ownerName,
                    ownerContactNo: form.ownerContactNo,
                    idNo: form.idNo,
                    nationalAddress: form.nationalAddress,
                    email: form.email,
                });

                if (isSubmitMode) {
                    alert("Project submitted successfully for review!");
                    setDraftProjectId(null);
                    setForm({
                        requestType: "", city: "", projectName: "", projectCode: "",
                        district: "", area: "", projectStatus: "", contractType: "",
                        googleLocation: "",
                        priorityLevel: "", ownerName: "", ownerContactNo: "",
                        idNo: "", nationalAddress: "", email: "", ownerType: "individual",
                        requestSender: "", orderDate: "",
                    });
                    setElements(DEFAULT_ELEMENT_NAMES.map(name => ({ id: createId(), name, count: "0", area: "", isDefault: true })));
                    setProjectDocuments(DEFAULT_DOCUMENT_SLOTS.map(label => ({ id: createId(), label, file: null })));
                } else {
                    alert("Project saved. You can continue later and submit when ready.");
                }
            } else {
                const err = await response.json();
                alert(`Error: ${err.error || 'Failed to save project'}`);
            }
        } catch (err) {
            console.error(err);
            alert("Action failed");
        } finally {
            setIsSaving(false);
            setIsSubmitting(false);
        }
    };

    if (!canCreateProject) {
        return (
            <div className="bg-card rounded-xl border border-border p-6">
                <p className="text-sm font-semibold text-destructive">You are not allowed to create new projects.</p>
                <p className="text-xs text-muted-foreground mt-2">Only CEO, department manager, and supervisor can add new projects.</p>
            </div>
        );
    }

    return (
        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {/* â”€â”€ Project Info â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <SectionHeader icon={<ClipboardList className="w-5 h-5" />} title="Project Information" subtitle="Basic details about the project request" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Field label="Request Type" required>
                        <select value={form.requestType} onChange={e => set("requestType", e.target.value)} className={selectCls}>
                            <option value="">Select Request Type</option>
                            {REQUEST_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </Field>
                    <Field label="Project Name" required>
                        <input type="text" value={form.projectName} onChange={e => set("projectName", e.target.value)} className={inputCls} placeholder="e.g. North Riyadh Station" />
                    </Field>
                    <Field label="Project Code" required>
                        <input type="text" value={form.projectCode} onChange={e => set("projectCode", e.target.value)} className={inputCls} placeholder="e.g. PRJ-2024-001" />
                    </Field>
                    <Field label="City" required>
                        <input type="text" value={form.city} onChange={e => set("city", e.target.value)} className={inputCls} placeholder="e.g. Riyadh" />
                    </Field>
                    <Field label="District">
                        <input type="text" value={form.district} onChange={e => set("district", e.target.value)} className={inputCls} placeholder="e.g. Al-Malqa" />
                    </Field>
                    <Field label="Area/Region">
                        <input type="text" value={form.area} onChange={e => set("area", e.target.value)} className={inputCls} placeholder="e.g. North Jeddah" />
                    </Field>
                    <Field label="Project Status" required>
                        <select value={form.projectStatus} onChange={e => set("projectStatus", e.target.value)} className={selectCls}>
                            <option value="">Select Status</option>
                            {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </Field>
                    <Field label="Contract Type" required>
                        <select value={form.contractType} onChange={e => set("contractType", e.target.value)} className={selectCls}>
                            <option value="">Select Contract Type</option>
                            {CONTRACT_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </Field>
                    <Field label="Priority Level" required>
                        <select value={form.priorityLevel} onChange={e => set("priorityLevel", e.target.value)} className={selectCls}>
                            <option value="">Select Priority</option>
                            {PRIORITY_LEVELS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                    </Field>
                    <Field label="Order Date" required>
                        <input type="date" value={form.orderDate} onChange={e => set("orderDate", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Requester">
                        <input type="text" value={form.requestSender} className={`${inputCls} bg-muted cursor-not-allowed`} placeholder="Automatically filled" disabled />
                    </Field>
                    <Field label="Google Location">
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input type="text" value={form.googleLocation} onChange={e => set("googleLocation", e.target.value)}
                                className={`${inputCls} pl-9`} placeholder="Paste Google Maps link or coordinates" />
                        </div>
                    </Field>
                </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <SectionHeader icon={<Layers className="w-5 h-5" />} title="Station Elements" subtitle="Specify the count and area for each commercial element at the site" />
                <div className="flex justify-end mb-4">
                    <button
                        type="button"
                        onClick={addElement}
                        className="px-4 py-2 rounded-lg text-xs font-semibold border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                    >
                        + Add Commercial Element
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {elements.map((el, idx) => (
                        <div key={el.id} className="bg-muted/50 rounded-xl p-4 border border-border hover:border-primary/30 transition-colors space-y-3">
                            {(() => {
                                const lockDefaultName = !!el.isDefault && user?.role !== "super_admin";
                                return (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={el.name}
                                    readOnly={lockDefaultName}
                                    onChange={e => updateElement(el.id, "name", e.target.value)}
                                    placeholder={`Element ${idx + 1} name`}
                                    title={lockDefaultName ? "Only CEO can edit default element names" : ""}
                                    className={`w-full text-sm font-semibold border border-border rounded-lg px-2.5 py-2 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${lockDefaultName ? "bg-muted/60 cursor-not-allowed" : ""}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeElement(el.id)}
                                    disabled={el.isDefault && user?.role !== "super_admin"}
                                    className="p-2 rounded-lg hover:bg-destructive/10 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                                    title={el.isDefault && user?.role !== "super_admin" ? "Only CEO can delete default elements" : "Remove element"}
                                >
                                    <Trash2 className="w-4 h-4 text-destructive" />
                                </button>
                            </div>
                                );
                            })()}
                            <div className="grid grid-cols-2 gap-2 items-end">
                                <div>
                                    <p className="text-[10px] text-muted-foreground mb-1 text-center">Count</p>
                                    <input
                                        type="number"
                                        min="0"
                                        value={el.count}
                                        onChange={e => updateElement(el.id, "count", e.target.value)}
                                        className="w-full text-center text-lg font-bold border border-border rounded-lg px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                                <div>
                                    <p className="text-[10px] text-muted-foreground mb-1 text-center">Area (sqm)</p>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={el.area}
                                        onChange={e => updateElement(el.id, "area", e.target.value)}
                                        placeholder="0.00"
                                        className="w-full text-center text-sm font-medium border border-border rounded-lg px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    {elements.length === 0 && (
                        <div className="col-span-full text-center text-sm text-muted-foreground py-6 border border-dashed border-border rounded-xl">
                            No commercial elements yet. Use "Add Commercial Element" to create entries.
                        </div>
                    )}
                </div>
            </div>

            {/* â”€â”€ Attachments â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <SectionHeader icon={<Upload className="w-5 h-5" />} title="Project Documents" subtitle="Upload design files, documents, and drawings" />
                <div className="flex justify-end mb-4">
                    <button
                        type="button"
                        onClick={addDocumentSlot}
                        className="px-4 py-2 rounded-lg text-xs font-semibold border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                    >
                        + Add Document Slot
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {projectDocuments.map(doc => (
                        <FileUpload
                            key={doc.id}
                            label={doc.label}
                            file={doc.file}
                            onLabelChange={(value) => updateDocument(doc.id, { label: value })}
                            onChange={(file) => updateDocument(doc.id, { file })}
                            onRemoveFile={() => updateDocument(doc.id, { file: null })}
                            onRemoveSlot={() => removeDocumentSlot(doc.id)}
                        />
                    ))}
                    {projectDocuments.length === 0 && (
                        <div className="col-span-full text-center text-sm text-muted-foreground py-6 border border-dashed border-border rounded-xl">
                            No document slots yet. Use "Add Document Slot" to create entries.
                        </div>
                    )}
                </div>
            </div>

            {/* â”€â”€ Owner Info â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <SectionHeader icon={<User className="w-5 h-5" />} title="Owner Information" subtitle="Details about the land/project owner" />

                {/* Individual / Company toggle */}
                <div className="flex gap-3 mb-5">
                    {["individual", "company"].map(type => (
                        <button
                            key={type}
                            type="button"
                            onClick={() => set("ownerType", type)}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold border transition-all capitalize ${form.ownerType === type
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background border-border text-muted-foreground hover:border-primary/50"
                                }`}
                        >
                            {type === "individual" ? "Individual" : "Company"}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Field label={form.ownerType === "company" ? "Company Name" : "Owner Name"} required>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input type="text" value={form.ownerName} onChange={e => set("ownerName", e.target.value)}
                                className={`${inputCls} pl-9`} placeholder={form.ownerType === "company" ? "Company name" : "Full name"} />
                        </div>
                    </Field>
                    <Field label={form.ownerType === "company" ? "Company Contact No" : "Owner Contact No"} required>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input type="tel" value={form.ownerContactNo} onChange={e => set("ownerContactNo", e.target.value)}
                                className={`${inputCls} pl-9`} placeholder="+966 5X XXX XXXX" />
                        </div>
                    </Field>
                    <Field label="ID No" required>
                        <input type="text" value={form.idNo} onChange={e => set("idNo", e.target.value)} className={inputCls} placeholder="National ID or CR Number" />
                    </Field>
                    <Field label="Email">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                                className={`${inputCls} pl-9`} placeholder="owner@example.com" />
                        </div>
                    </Field>
                    <Field label="National Address" required>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input type="text" value={form.nationalAddress} onChange={e => set("nationalAddress", e.target.value)}
                                className={`${inputCls} pl-9`} placeholder="National address code" />
                        </div>
                    </Field>
                </div>
            </div>

            {/* â”€â”€ Submit â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => void persistProject('save')}
                    disabled={isSaving || isSubmitting}
                    className="px-8 py-3 rounded-xl flex items-center gap-2 font-semibold text-sm border border-border text-foreground bg-background hover:bg-muted transition-all disabled:opacity-60"
                >
                    <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                    type="button"
                    onClick={() => void persistProject('submit')}
                    disabled={isSaving || isSubmitting}
                    className="btn-primary px-8 py-3 rounded-xl flex items-center gap-2 font-semibold text-sm shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-60"
                >
                    <Send className="w-4 h-4" /> {isSubmitting ? 'Submitting...' : 'Submit Project Request'}
                </button>
            </div>
        </form>
    );
}

// â”€â”€â”€ Feasibility Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FeasibilityTab({ deptLabel }: { deptLabel: string }) {
    const [stats, setStats] = useState({ total: 0, approved: 0, signed_contract: 0, rejected: 0 });
    const [items, setItems] = useState<any[]>([]);
    const { token } = useAuth();
    const { user } = useAuth();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showHistory, setShowHistory] = useState(true);
    const [expandedHistoryProjectId, setExpandedHistoryProjectId] = useState<string | null>(null);
    const [historyProjectDetails, setHistoryProjectDetails] = useState<Record<string, any>>({});

    const departmentType = window.location.pathname.includes('investment') ? 'investment' : 'franchise';

    const canCreateRole = !!user && ['super_admin', 'department_manager', 'supervisor'].includes(user.role);
    const canCreateDepartment = user?.role === 'super_admin' || user?.department === 'investment' || user?.department === 'franchise';
    const canCreateFeasibility = canCreateRole && canCreateDepartment;

    const [managerOptions, setManagerOptions] = useState<Record<FeasibilityReviewDepartment, DepartmentManagerOption[]>>({
        project: [],
        operation: [],
        realestate: [],
        investment: [],
        finance: [],
    });

    const [selectedManagers, setSelectedManagers] = useState<Record<FeasibilityReviewDepartment, string>>({
        project: '',
        operation: '',
        realestate: '',
        investment: '',
        finance: '',
    });

    const [isLoadingManagers, setIsLoadingManagers] = useState(false);
    const [managerLoadError, setManagerLoadError] = useState<string | null>(null);

    const feasibilityRequestType = 'Feasibility Study';

    const [form, setForm] = useState<NewProjectForm>({
        requestType: feasibilityRequestType,
        city: "",
        projectName: "",
        projectCode: "",
        district: "",
        area: "",
        projectStatus: "",
        contractType: "",
        googleLocation: "",
        priorityLevel: "",
        ownerName: "",
        ownerContactNo: "",
        idNo: "",
        nationalAddress: "",
        email: "",
        ownerType: "individual",
        requestSender: "",
        orderDate: "",
    });

    const [elements, setElements] = useState<CommercialElement[]>(
        DEFAULT_ELEMENT_NAMES.map(name => ({ id: createId(), name, count: "0", area: "", isDefault: true }))
    );
    const [projectDocuments, setProjectDocuments] = useState<ProjectDocumentSlot[]>(
        DEFAULT_DOCUMENT_SLOTS.map(label => ({ id: createId(), label, file: null }))
    );

    useEffect(() => {
        if (!user) return;

        const roleLabel = getRoleLabel(user.role);
        const rawDepartment = getDepartmentLabel(user.department);
        const userDepartment = rawDepartment === "All Departments" ? "All Departments" : `${rawDepartment} Department`;

        setForm((prev) => ({
            ...prev,
            requestType: feasibilityRequestType,
            requestSender: `${user.username || "User"} (${roleLabel}) - ${userDepartment}`,
        }));
    }, [user]);

    const set = (key: keyof NewProjectForm, val: string) => setForm(p => ({ ...p, [key]: val }));

    const updateElement = (id: string, key: keyof Omit<CommercialElement, "id">, value: string) => {
        setElements(prev => prev.map(el => el.id === id ? { ...el, [key]: value } : el));
    };

    const addElement = () => {
        setElements(prev => [...prev, { id: createId(), name: "", count: "0", area: "", isDefault: false }]);
    };

    const removeElement = (id: string) => {
        setElements((prev) => {
            const target = prev.find((el) => el.id === id);
            if (!target) return prev;
            if (target.isDefault && user?.role !== "super_admin") {
                alert("Only CEO can delete the default station elements.");
                return prev;
            }
            return prev.filter((el) => el.id !== id);
        });
    };

    const updateDocument = (id: string, patch: Partial<ProjectDocumentSlot>) => {
        setProjectDocuments(prev => prev.map(doc => doc.id === id ? { ...doc, ...patch } : doc));
    };

    const addDocumentSlot = () => {
        setProjectDocuments(prev => [...prev, { id: createId(), label: "", file: null }]);
    };

    const removeDocumentSlot = (id: string) => {
        setProjectDocuments(prev => prev.filter(doc => doc.id !== id));
    };

    const uploadProjectFile = async (file: File): Promise<string> => {
        if (!token) {
            throw new Error("Authentication required.");
        }

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${API_URL}/files/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result?.data?.url) {
            throw new Error(result?.details || result?.error || "Failed to upload document");
        }

        return result.data.url as string;
    };

    const fetchDepartmentManagers = async (dept: FeasibilityReviewDepartment): Promise<DepartmentManagerOption[]> => {
        if (!token) return [];
        // `usersAPI` reads the same auth_token; token presence is used here to avoid extra calls.
        return usersAPI.getDepartmentManagers(dept as unknown as Department) as unknown as DepartmentManagerOption[];
    };

    useEffect(() => {
        const fetchFeasibility = async () => {
            if (!token) {
                setItems([]);
                return;
            }

            const dept = departmentType;
            const [statsRes, departmentProjects] = await Promise.all([
                fetch(`${API_URL}/investment-projects/feasibility-stats?departmentType=${dept}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetchDepartmentProjects(token, dept)
            ]);
            const statsData = await statsRes.json();
            if (statsData.data) setStats(statsData.data);
            setItems(departmentProjects.filter((p: any) => p.request_type === 'Feasibility Study'));
        };
        fetchFeasibility();
    }, [token, departmentType]);

    const loadHistoryProjectDetails = async (projectId: string) => {
        if (!token) return;
        if (historyProjectDetails[projectId]) return;
        const project = await fetchDepartmentProjectById(token, projectId);
        if (!project) return;
        setHistoryProjectDetails((prev) => ({ ...prev, [projectId]: project }));
    };

    useEffect(() => {
        const loadManagers = async () => {
            if (!token || !showCreateForm) return;
            setIsLoadingManagers(true);
            setManagerLoadError(null);
            try {
                const [project, operation, realestate, investment, finance] = await Promise.all([
                    fetchDepartmentManagers('project'),
                    fetchDepartmentManagers('operation'),
                    fetchDepartmentManagers('realestate'),
                    fetchDepartmentManagers('investment'),
                    fetchDepartmentManagers('finance'),
                ]);

                setManagerOptions({
                    project,
                    operation,
                    realestate,
                    investment,
                    finance,
                });
            } catch (err) {
                console.error('Failed to load department managers:', err);
                setManagerLoadError('Failed to load department managers.');
            } finally {
                setIsLoadingManagers(false);
            }
        };

        void loadManagers();
    }, [token, showCreateForm]);

    const submitFeasibility = async () => {
        if (!token) {
            alert('Authentication required.');
            return;
        }

        const missing = (Object.entries(selectedManagers) as Array<[FeasibilityReviewDepartment, string]>)
            .filter(([_, value]) => !String(value || '').trim())
            .map(([key]) => key);
        if (missing.length > 0) {
            alert(`Select managers for: ${missing.join(', ')}`);
            return;
        }

        if (!form.projectName.trim() || !form.projectCode.trim()) {
            alert("Project Name and Project Code are required to submit.");
            return;
        }

        try {
            // Upload documents (optional)
            let designFileUrl: string | null = null;
            let documentsUrl: string | null = null;
            let autocadUrl: string | null = null;
            for (const slot of projectDocuments) {
                if (!slot.file) continue;
                const fileUrl = await uploadProjectFile(slot.file);
                const label = String(slot.label || '').toLowerCase();
                if (!designFileUrl && label.includes("design")) {
                    designFileUrl = fileUrl;
                } else if (!autocadUrl && (label.includes("cad") || label.includes("dwg") || label.includes("autocad"))) {
                    autocadUrl = fileUrl;
                } else if (!documentsUrl) {
                    documentsUrl = fileUrl;
                }
            }

            const normalizeElementName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");
            const mapped = {
                superMarket: 0,
                fuelStation: 0,
                kiosks: 0,
                retailShop: 0,
                driveThrough: 0,
                superMarketArea: 0,
                fuelStationArea: 0,
                kiosksArea: 0,
                retailShopArea: 0,
                driveThroughArea: 0,
            };

            for (const el of elements) {
                const key = normalizeElementName(el.name || '');
                const count = Number.parseInt(String(el.count || '0'), 10);
                const area = Number.parseFloat(String(el.area || '0'));
                if (key.includes('supermarket')) {
                    mapped.superMarket = Number.isFinite(count) ? count : 0;
                    mapped.superMarketArea = Number.isFinite(area) ? area : 0;
                } else if (key.includes('fuelstation')) {
                    mapped.fuelStation = Number.isFinite(count) ? count : 0;
                    mapped.fuelStationArea = Number.isFinite(area) ? area : 0;
                } else if (key.includes('kiosk')) {
                    mapped.kiosks = Number.isFinite(count) ? count : 0;
                    mapped.kiosksArea = Number.isFinite(area) ? area : 0;
                } else if (key.includes('retailshop')) {
                    mapped.retailShop = Number.isFinite(count) ? count : 0;
                    mapped.retailShopArea = Number.isFinite(area) ? area : 0;
                } else if (key.includes('drivethrough')) {
                    mapped.driveThrough = Number.isFinite(count) ? count : 0;
                    mapped.driveThroughArea = Number.isFinite(area) ? area : 0;
                }
            }

            await feasibilityAPI.submitFeasibility({
                departmentType,
                ...form,
                requestType: feasibilityRequestType,
                selectedManagers,
                ...mapped,
                designFileUrl,
                documentsUrl,
                autocadUrl,
            });
        } catch (error: any) {
            alert(`Error: ${String(error?.message || 'Failed to submit feasibility study')}`);
            return;
        }

        alert('Feasibility study submitted and routed to department managers.');
        setShowCreateForm(false);
        setSelectedManagers({ project: '', operation: '', realestate: '', investment: '', finance: '' });
        setForm((prev) => ({
            ...prev,
            requestType: feasibilityRequestType,
            city: "",
            projectName: "",
            projectCode: "",
            district: "",
            area: "",
            projectStatus: "",
            contractType: "",
            googleLocation: "",
            priorityLevel: "",
            ownerName: "",
            ownerContactNo: "",
            idNo: "",
            nationalAddress: "",
            email: "",
            ownerType: "individual",
            requestSender: prev.requestSender,
            orderDate: "",
        }));
        setElements(DEFAULT_ELEMENT_NAMES.map(name => ({ id: createId(), name, count: "0", area: "", isDefault: true })));
        setProjectDocuments(DEFAULT_DOCUMENT_SLOTS.map(label => ({ id: createId(), label, file: null })));
    };

    const statCards = [
        { label: "Total Opportunities", value: stats.total, icon: <TrendingUp className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Approved", value: stats.approved, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Signed Contract", value: stats.signed_contract, icon: <FileText className="w-5 h-5" />, color: "text-primary", bg: "bg-primary/10" },
        { label: "Rejected", value: stats.rejected, icon: <XCircle className="w-5 h-5" />, color: "text-red-500", bg: "bg-red-500/10" },
    ];

    const badgeColor: Record<string, string> = {
        "Approved": "bg-emerald-500/10 text-emerald-600",
        "Signed Contract": "bg-primary/10 text-primary",
        "Rejected": "bg-red-500/10 text-red-600",
        "Pending Review": "bg-info/10 text-info",
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(s => <StatCard key={s.label} {...s} />)}
            </div>
            {canCreateFeasibility && (
                <div className="flex justify-end">
                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => setShowHistory((v) => !v)}
                            className="px-5 py-2.5 rounded-lg text-sm font-semibold border border-border bg-background hover:bg-muted transition-colors"
                        >
                            {showHistory ? 'Hide History' : 'History'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowCreateForm((v) => !v)}
                            className="btn-primary px-5 py-2.5 rounded-lg text-sm font-semibold"
                        >
                            {showCreateForm ? 'Close Feasibility Form' : '+ Create Feasibility Study'}
                        </button>
                    </div>
                </div>
            )}

            {showCreateForm && (
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-6">
                    <SectionHeader
                        icon={<BookOpen className="w-5 h-5" />}
                        title="Feasibility Study Submission"
                        subtitle="Request Type is locked to Feasibility Study. Select department managers to route this request."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Field label="Request Type" required>
                            <input
                                type="text"
                                value={feasibilityRequestType}
                                disabled
                                className={`${inputCls} bg-muted cursor-not-allowed`}
                            />
                        </Field>
                        <Field label="Project Name" required>
                            <input type="text" value={form.projectName} onChange={e => set("projectName", e.target.value)} className={inputCls} placeholder="e.g. North Riyadh Station" />
                        </Field>
                        <Field label="Project Code" required>
                            <input type="text" value={form.projectCode} onChange={e => set("projectCode", e.target.value)} className={inputCls} placeholder="e.g. PRJ-2024-001" />
                        </Field>
                        <Field label="City" required>
                            <input type="text" value={form.city} onChange={e => set("city", e.target.value)} className={inputCls} placeholder="e.g. Riyadh" />
                        </Field>
                        <Field label="District">
                            <input type="text" value={form.district} onChange={e => set("district", e.target.value)} className={inputCls} placeholder="e.g. Al-Malqa" />
                        </Field>
                        <Field label="Area/Region">
                            <input type="text" value={form.area} onChange={e => set("area", e.target.value)} className={inputCls} placeholder="e.g. North Jeddah" />
                        </Field>
                        <Field label="Project Status" required>
                            <select value={form.projectStatus} onChange={e => set("projectStatus", e.target.value)} className={selectCls}>
                                <option value="">Select Status</option>
                                {PROJECT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </Field>
                        <Field label="Contract Type" required>
                            <select value={form.contractType} onChange={e => set("contractType", e.target.value)} className={selectCls}>
                                <option value="">Select Contract Type</option>
                                {CONTRACT_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </Field>
                        <Field label="Priority Level" required>
                            <select value={form.priorityLevel} onChange={e => set("priorityLevel", e.target.value)} className={selectCls}>
                                <option value="">Select Priority</option>
                                {PRIORITY_LEVELS.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </Field>
                        <Field label="Order Date" required>
                            <input type="date" value={form.orderDate} onChange={e => set("orderDate", e.target.value)} className={inputCls} />
                        </Field>
                        <Field label="Requester">
                            <input type="text" value={form.requestSender} className={`${inputCls} bg-muted cursor-not-allowed`} placeholder="Automatically filled" disabled />
                        </Field>
                        <Field label="Google Location">
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={form.googleLocation}
                                    onChange={e => set("googleLocation", e.target.value)}
                                    className={`${inputCls} pl-9`}
                                    placeholder="Paste Google Maps link or coordinates"
                                />
                            </div>
                        </Field>
                    </div>

                    <div className="bg-muted/30 rounded-xl border border-border p-5 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-bold text-foreground">Station Elements</p>
                                <p className="text-xs text-muted-foreground">Specify the count and area for each commercial element at the site.</p>
                            </div>
                            <button
                                type="button"
                                onClick={addElement}
                                className="px-4 py-2 rounded-lg text-xs font-bold border border-border bg-background hover:bg-muted transition-colors"
                            >
                                + Add Commercial Element
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {elements.map((el) => (
                                <div key={el.id} className="bg-background rounded-xl border border-border p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={el.name}
                                            onChange={(e) => updateElement(el.id, "name", e.target.value)}
                                            disabled={el.isDefault}
                                            className={`${inputCls} ${el.isDefault ? "bg-muted cursor-not-allowed" : ""}`}
                                            placeholder="Element name"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeElement(el.id)}
                                            className="p-2 rounded-lg hover:bg-destructive/10"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground font-semibold">Count</p>
                                            <input
                                                type="number"
                                                min={0}
                                                value={el.count}
                                                onChange={(e) => updateElement(el.id, "count", e.target.value)}
                                                className={inputCls}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-xs text-muted-foreground font-semibold">Area (sqm)</p>
                                            <input
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                value={el.area}
                                                onChange={(e) => updateElement(el.id, "area", e.target.value)}
                                                className={inputCls}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-muted/30 rounded-xl border border-border p-5 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-bold text-foreground">Project Documents</p>
                                <p className="text-xs text-muted-foreground">Upload design files, documents, and drawings.</p>
                            </div>
                            <button
                                type="button"
                                onClick={addDocumentSlot}
                                className="px-4 py-2 rounded-lg text-xs font-bold border border-border bg-background hover:bg-muted transition-colors"
                            >
                                + Add Document Slot
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {projectDocuments.map((doc) => (
                                <div key={doc.id} className="bg-background rounded-xl border border-border p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={doc.label}
                                            onChange={(e) => updateDocument(doc.id, { label: e.target.value })}
                                            className={inputCls}
                                            placeholder="e.g. Design File"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeDocumentSlot(doc.id)}
                                            className="p-2 rounded-lg hover:bg-destructive/10"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </button>
                                    </div>
                                    <FileUpload
                                        label={doc.label}
                                        file={doc.file}
                                        onChange={(file) => updateDocument(doc.id, { file })}
                                        onRemoveFile={() => updateDocument(doc.id, { file: null })}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-muted/30 rounded-xl border border-border p-5 space-y-4">
                        <div>
                            <p className="text-sm font-bold text-foreground">Owner Information</p>
                            <p className="text-xs text-muted-foreground">Details about the land/project owner.</p>
                        </div>

                        <div className="inline-flex rounded-xl border border-border overflow-hidden bg-background">
                            <button
                                type="button"
                                onClick={() => set("ownerType", "individual")}
                                className={`px-5 py-2 text-xs font-bold ${form.ownerType === "individual" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                            >
                                Individual
                            </button>
                            <button
                                type="button"
                                onClick={() => set("ownerType", "company")}
                                className={`px-5 py-2 text-xs font-bold ${form.ownerType === "company" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
                            >
                                Company
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Field label="Owner Name" required>
                                <input type="text" value={form.ownerName} onChange={e => set("ownerName", e.target.value)} className={inputCls} placeholder="Full name" />
                            </Field>
                            <Field label="Owner Contact No" required>
                                <input type="text" value={form.ownerContactNo} onChange={e => set("ownerContactNo", e.target.value)} className={inputCls} placeholder="+966 5X XXX XXXX" />
                            </Field>
                            <Field label="ID No" required>
                                <input type="text" value={form.idNo} onChange={e => set("idNo", e.target.value)} className={inputCls} placeholder="National ID or CR Number" />
                            </Field>
                            <Field label="Email">
                                <input type="email" value={form.email} onChange={e => set("email", e.target.value)} className={inputCls} placeholder="owner@example.com" />
                            </Field>
                            <Field label="National Address" required>
                                <input type="text" value={form.nationalAddress} onChange={e => set("nationalAddress", e.target.value)} className={inputCls} placeholder="National address code" />
                            </Field>
                        </div>
                    </div>

                    <div className="bg-muted/30 rounded-xl border border-border p-5 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-bold text-foreground">Route to Department Managers</p>
                                <p className="text-xs text-muted-foreground">Select the department manager for each required department.</p>
                            </div>
                            {isLoadingManagers && <p className="text-xs text-muted-foreground">Loading managers...</p>}
                        </div>
                        {managerLoadError && (
                            <div className="text-xs text-destructive font-semibold">{managerLoadError}</div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {([
                                ['project', 'Project'],
                                ['operation', 'Operation'],
                                ['realestate', 'Realestate'],
                                ['investment', 'Investment'],
                                ['finance', 'Finance'],
                            ] as Array<[FeasibilityReviewDepartment, string]>).map(([dept, label]) => (
                                <Field key={dept} label={`${label} Department Manager`} required>
                                    <select
                                        value={selectedManagers[dept]}
                                        onChange={(e) => setSelectedManagers((prev) => ({ ...prev, [dept]: e.target.value }))}
                                        className={selectCls}
                                    >
                                        <option value="">Select manager</option>
                                        {managerOptions[dept].map((m) => (
                                            <option key={m.id} value={m.id}>
                                                {m.username}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => void submitFeasibility()}
                            className="btn-primary px-8 py-3 rounded-xl flex items-center gap-2 font-semibold text-sm shadow-lg hover:shadow-primary/25 transition-all"
                        >
                            <Send className="w-4 h-4" /> Submit Feasibility Study
                        </button>
                    </div>
                </div>
            )}

            {showHistory && (
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <div className="p-5 border-b border-border flex items-center justify-between">
                        <div>
                            <h3 className="font-bold text-foreground">{deptLabel}  -  Feasibility History</h3>
                            <p className="text-xs text-muted-foreground mt-1">Previously submitted feasibility study forms</p>
                        </div>
                        <span className="text-xs text-muted-foreground font-semibold">{items.length} records</span>
                    </div>
                    <div className="divide-y divide-border">
                        {items.length === 0 ? (
                            <div className="p-10 text-center text-muted-foreground">No records found.</div>
                        ) : items.map((item: any) => {
                            const isExpanded = expandedHistoryProjectId === item.id;
                            const details = historyProjectDetails[item.id];
                            return (
                                <div key={item.id} className="px-5 py-4 hover:bg-muted/20 transition-colors">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-foreground truncate">{item.project_name}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {item.project_code} · {item.city} · {new Date(item.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 flex-shrink-0">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColor[item.review_status] || "bg-muted text-muted-foreground"}`}>
                                                {item.review_status}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={async () => {
                                                    const next = isExpanded ? null : item.id;
                                                    setExpandedHistoryProjectId(next);
                                                    if (next) {
                                                        await loadHistoryProjectDetails(item.id);
                                                    }
                                                }}
                                                className="px-3 py-1.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold hover:bg-muted/40"
                                            >
                                                {isExpanded ? 'Hide' : 'View'}
                                            </button>
                                        </div>
                                    </div>

                                    {isExpanded && details && (
                                        <div className="mt-4 rounded-xl border border-border bg-background p-4">
                                            <p className="text-xs font-bold text-muted-foreground uppercase mb-3">Submitted Form Details</p>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                                <p className="text-muted-foreground"><span className="font-semibold text-foreground">Request Type:</span> {details.request_type || '-'}</p>
                                                <p className="text-muted-foreground"><span className="font-semibold text-foreground">Project Status:</span> {details.project_status || '-'}</p>
                                                <p className="text-muted-foreground"><span className="font-semibold text-foreground">Contract Type:</span> {details.contract_type || '-'}</p>
                                                <p className="text-muted-foreground"><span className="font-semibold text-foreground">Area:</span> {details.area ?? '-'}</p>
                                                <p className="text-muted-foreground"><span className="font-semibold text-foreground">Priority:</span> {details.priority_level || '-'}</p>
                                                <p className="text-muted-foreground"><span className="font-semibold text-foreground">Order Date:</span> {details.order_date ? String(details.order_date).slice(0, 10) : '-'}</p>
                                                <p className="text-muted-foreground md:col-span-2 lg:col-span-3"><span className="font-semibold text-foreground">Google Location:</span> {details.google_location || '-'}</p>
                                                <p className="text-muted-foreground md:col-span-2 lg:col-span-3"><span className="font-semibold text-foreground">Requester:</span> {details.request_sender || '-'}</p>
                                            </div>

                                            <div className="mt-4 rounded-xl border border-border bg-muted/10 p-4">
                                                <p className="text-xs font-bold text-muted-foreground uppercase mb-3">Owner Information</p>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                                                    <p className="text-muted-foreground"><span className="font-semibold text-foreground">Owner Type:</span> {details.owner_type || '-'}</p>
                                                    <p className="text-muted-foreground"><span className="font-semibold text-foreground">Owner Name:</span> {details.owner_name || '-'}</p>
                                                    <p className="text-muted-foreground"><span className="font-semibold text-foreground">Owner Contact No:</span> {details.owner_contact_no || '-'}</p>
                                                    <p className="text-muted-foreground"><span className="font-semibold text-foreground">ID / CR No:</span> {details.id_no || '-'}</p>
                                                    <p className="text-muted-foreground"><span className="font-semibold text-foreground">Email:</span> {details.email || '-'}</p>
                                                    <p className="text-muted-foreground"><span className="font-semibold text-foreground">National Address:</span> {details.national_address || '-'}</p>
                                                </div>
                                            </div>

                                            {(Number(details.super_market || 0) > 0
                                                || Number(details.fuel_station || 0) > 0
                                                || Number(details.kiosks || 0) > 0
                                                || Number(details.retail_shop || 0) > 0
                                                || Number(details.drive_through || 0) > 0
                                                || Number(details.super_market_area || 0) > 0
                                                || Number(details.fuel_station_area || 0) > 0
                                                || Number(details.kiosks_area || 0) > 0
                                                || Number(details.retail_shop_area || 0) > 0
                                                || Number(details.drive_through_area || 0) > 0) && (
                                                    <div className="mt-4 rounded-xl border border-border bg-muted/10 p-4">
                                                        <p className="text-xs font-bold text-muted-foreground uppercase mb-3">Station Elements</p>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                                            {[
                                                                { label: 'Super Market', count: details.super_market, area: details.super_market_area },
                                                                { label: 'Fuel Station', count: details.fuel_station, area: details.fuel_station_area },
                                                                { label: 'Kiosks', count: details.kiosks, area: details.kiosks_area },
                                                                { label: 'Retail Shop', count: details.retail_shop, area: details.retail_shop_area },
                                                                { label: 'Drive Through', count: details.drive_through, area: details.drive_through_area },
                                                            ].map((e) => (
                                                                <div key={e.label} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
                                                                    <span className="font-semibold text-foreground">{e.label}</span>
                                                                    <span className="text-muted-foreground">{Number(e.count || 0)} • {Number(e.area || 0)} sqm</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                            {(details.design_file_url || details.documents_url || details.autocad_url) && (
                                                <div className="mt-4 rounded-xl border border-border bg-muted/10 p-4">
                                                    <p className="text-xs font-bold text-muted-foreground uppercase mb-3">Project Documents</p>
                                                    {(() => {
                                                        const toFileHref = (url: any) => {
                                                            const u = String(url || "").trim();
                                                            if (!u) return null;
                                                            if (u.startsWith("http://") || u.startsWith("https://")) return u;
                                                            if (u.startsWith("/")) return `${API_URL}${u}`;
                                                            return `${API_URL}/${u}`;
                                                        };
                                                        return (
                                                            <div className="flex flex-wrap gap-2">
                                                                {details.design_file_url && (
                                                                    <a
                                                                        href={toFileHref(details.design_file_url) || undefined}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary/15 transition-colors"
                                                                    >
                                                                        <Download className="w-4 h-4" /> Design File
                                                                    </a>
                                                                )}
                                                                {details.documents_url && (
                                                                    <a
                                                                        href={toFileHref(details.documents_url) || undefined}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary/15 transition-colors"
                                                                    >
                                                                        <Download className="w-4 h-4" /> Documents
                                                                    </a>
                                                                )}
                                                                {details.autocad_url && (
                                                                    <a
                                                                        href={toFileHref(details.autocad_url) || undefined}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg text-sm font-semibold hover:bg-primary/15 transition-colors"
                                                                    >
                                                                        <Download className="w-4 h-4" /> AutoCAD (DWG)
                                                                    </a>
                                                                )}
                                                            </div>
                                                        );
                                                    })()}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

// â”€â”€â”€ Reports Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ReportsTab({ deptLabel }: { deptLabel: string }) {
    const [attachments, setAttachments] = useState<Record<string, File | null>>({
        q1Report: null, q2Report: null, q3Report: null, annualReport: null,
    });

    const REPORT_TYPES = [
        { key: "q1Report", label: "Q1 Performance Report" },
        { key: "q2Report", label: "Q2 Performance Report" },
        { key: "q3Report", label: "Q3 Performance Report" },
        { key: "annualReport", label: "Annual Management Report" },
    ];

    return (
        <div className="space-y-6">
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <SectionHeader icon={<BarChart2 className="w-5 h-5" />}
                    title={`${deptLabel}  -  Reports & Analysis`}
                    subtitle="Upload and manage periodic performance reports" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {REPORT_TYPES.map(rt => (
                        <div key={rt.key} className="border-2 border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
                            <p className="text-sm font-semibold text-foreground mb-3">{rt.label}</p>
                            {attachments[rt.key] ? (
                                <div className="flex items-center justify-between gap-2 bg-emerald-500/5 rounded-lg p-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        <FileCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        <span className="text-xs text-emerald-700 truncate">{attachments[rt.key]!.name}</span>
                                    </div>
                                    <button type="button" onClick={() => setAttachments(p => ({ ...p, [rt.key]: null }))}
                                        className="p-1 hover:bg-destructive/10 rounded flex-shrink-0">
                                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex items-center gap-3 cursor-pointer py-1">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Upload className="w-4 h-4 text-primary" />
                                    </div>
                                    <span className="text-xs text-muted-foreground">Click to attach report (PDF, XLSX)</span>
                                    <input type="file" className="hidden" accept=".pdf,.xlsx,.xls,.doc,.docx"
                                        onChange={e => e.target.files?.[0] && setAttachments(p => ({ ...p, [rt.key]: e.target.files![0] }))} />
                                </label>
                            )}
                        </div>
                    ))}
                </div>
                <div className="flex justify-end mt-5">
                    <button type="button" onClick={() => alert("Reports saved!")}
                        className="btn-primary px-6 py-2.5 rounded-lg flex items-center gap-2 text-sm font-semibold">
                        <Save className="w-4 h-4" /> Save Reports
                    </button>
                </div>
            </div>
        </div>
    );
}

// â”€â”€â”€ Contracts Tab â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ContractsTab({ deptLabel }: { deptLabel: string }) {
    const [stats, setStats] = useState({ total: 0, contracted: 0, need_contract: 0 });
    const [items, setItems] = useState<any[]>([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchContracts = async () => {
            if (!token) {
                setItems([]);
                return;
            }

            const dept = window.location.pathname.includes('investment') ? 'investment' : 'franchise';
            const [statsRes, departmentProjects] = await Promise.all([
                fetch(`${API_URL}/investment-projects/contract-stats?departmentType=${dept}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetchDepartmentProjects(token, dept)
            ]);
            const statsData = await statsRes.json();
            if (statsData.data) setStats(statsData.data);
            setItems(departmentProjects);
        };
        fetchContracts();
    }, [token]);

    const statCards = [
        { label: "Total Contracts", value: stats.total, icon: <FileText className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Contracted", value: stats.contracted, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Need Contract", value: stats.need_contract, icon: <Clock className="w-5 h-5" />, color: "text-info", bg: "bg-info/10" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statCards.map(s => <StatCard key={s.label} {...s} />)}
            </div>
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold text-foreground">{deptLabel}  -  Contract List</h3>
                </div>
                <div className="divide-y divide-border">
                    {items.length === 0 ? (
                        <div className="p-10 text-center text-muted-foreground">No records found.</div>
                    ) : items.map((c: any) => (
                        <div key={c.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
                            <div>
                                <p className="text-sm font-semibold text-foreground">{c.project_name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{c.contract_type}  -  {new Date(c.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.review_status === "Approved"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-info/10 text-info"
                                }`}>
                                {c.review_status === "Approved" ? "Active" : "Under Review"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// â”€â”€â”€ Shared Department Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface DeptPageProps {
    title: string;
    description: string;
    accentColor?: string;
}

export function InvestmentFranchiseDepartmentPage({ title, description }: DeptPageProps) {
    const [activeTab, setActiveTab] = useState<ActiveTab>("new-project");
    const { user } = useAuth();
    const canCreateRole = !!user && ['super_admin', 'department_manager', 'supervisor'].includes(user.role);
    const canCreateDepartment = user?.role === 'super_admin' || user?.department === 'investment' || user?.department === 'franchise';
    const canCreateProject = canCreateRole && canCreateDepartment;

    const tabs = [
        ...(canCreateProject ? [{ id: "new-project" as ActiveTab, label: "New Project", icon: <PlusCircle className="w-4 h-4" /> }] : []),
        { id: "feasibility" as ActiveTab, label: "Feasibility Study & Opportunity Assessment", icon: <BookOpen className="w-4 h-4" /> },
        { id: "reports" as ActiveTab, label: "Reports & Analysis", icon: <BarChart2 className="w-4 h-4" /> },
        { id: "contracts" as ActiveTab, label: "Contracts", icon: <FileText className="w-4 h-4" /> },
    ];

    useEffect(() => {
        if (!canCreateProject && activeTab === 'new-project') {
            setActiveTab('feasibility');
        }
    }, [canCreateProject, activeTab]);

    const renderContent = () => {
        switch (activeTab) {
            case "new-project": return <NewProjectTab />;
            case "feasibility": return <FeasibilityTab deptLabel={title} />;
            case "reports": return <ReportsTab deptLabel={title} />;
            case "contracts": return <ContractsTab deptLabel={title} />;
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">{title}</h1>
                <p className="text-muted-foreground mt-1">{description}</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 mb-6 bg-muted/50 p-1.5 rounded-xl">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                            ? "bg-card text-primary shadow-sm border border-border"
                            : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                            }`}
                    >
                        {tab.icon}
                        <span className="hidden sm:inline">{tab.label}</span>
                        <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {renderContent()}
            </div>
        </div>
    );
}

