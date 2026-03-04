import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
import {
    PlusCircle, BarChart2, FileText, BookOpen,
    TrendingUp, CheckCircle2, XCircle, Clock, Upload, FileCheck,
    Trash2, MapPin, User, Phone, Mail, Save, Send,
    Layers, ClipboardList
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ActiveTab = "new-project" | "feasibility" | "reports" | "contracts";

interface ElementCount {
    superMarket: string;
    fuelStation: string;
    kiosks: string;
    retailShop: string;
    driveThrough: string;
}

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
    elements: ElementCount;
    elementArea: string;
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

const REQUEST_TYPES = [
    "Design",
    "Cost Estimate",
    "Design + Cost Estimation",
    "Brand Identity Implementation",
    "Cost Estimation for Brand Identity Implementation",
    "Feasibility Study",
];

const PROJECT_STATUSES = ["Vacant Land", "Operational", "Under Structural Construction"];
const CONTRACT_TYPES = ["Operation Station", "Lease Stations", "Investment"];
const PRIORITY_LEVELS = ["Low", "Medium", "High", "Critical"];

// ─── Field Helper ─────────────────────────────────────────────────────────────
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

// ─── File Upload Pill ─────────────────────────────────────────────────────────
function FileUpload({ label, file, onChange, onRemove }: {
    label: string; file: File | null;
    onChange: (f: File) => void; onRemove: () => void;
}) {
    return (
        <div className="border-2 border-dashed border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
            <p className="text-xs font-semibold text-muted-foreground mb-2">{label}</p>
            {file ? (
                <div className="flex items-center justify-between gap-2 bg-emerald-500/5 rounded-lg p-2">
                    <div className="flex items-center gap-2 min-w-0">
                        <FileCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-xs text-emerald-700 truncate">{file.name}</span>
                    </div>
                    <button type="button" onClick={onRemove} className="ml-1 p-1 hover:bg-destructive/10 rounded flex-shrink-0">
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

// ─── Section Header ───────────────────────────────────────────────────────────
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

// ─── Stat Card ────────────────────────────────────────────────────────────────
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

// ─── New Project Tab ──────────────────────────────────────────────────────────
function NewProjectTab() {
    const [form, setForm] = useState<NewProjectForm>({
        requestType: "", city: "", projectName: "", projectCode: "",
        district: "", area: "", projectStatus: "", contractType: "",
        googleLocation: "",
        elements: { superMarket: "0", fuelStation: "0", kiosks: "0", retailShop: "0", driveThrough: "0" },
        elementArea: "", priorityLevel: "", ownerName: "", ownerContactNo: "",
        idNo: "", nationalAddress: "", email: "", ownerType: "individual",
        requestSender: "", orderDate: "",
    });

    const [designFile, setDesignFile] = useState<File | null>(null);
    const [documentsFile, setDocumentsFile] = useState<File | null>(null);
    const [autocadFile, setAutocadFile] = useState<File | null>(null);

    const set = (key: keyof NewProjectForm, val: string) => setForm(p => ({ ...p, [key]: val }));
    const setEl = (key: keyof ElementCount, val: string) =>
        setForm(p => ({ ...p, elements: { ...p.elements, [key]: val } }));

    const { token } = useAuth();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const body = {
                departmentType: (window.location.pathname.includes('investment') ? 'investment' : 'franchise'),
                ...form,
                superMarket: parseInt(form.elements.superMarket),
                fuelStation: parseInt(form.elements.fuelStation),
                kiosks: parseInt(form.elements.kiosks),
                retailShop: parseInt(form.elements.retailShop),
                driveThrough: parseInt(form.elements.driveThrough),
                elementArea: parseFloat(form.elementArea),
                area: parseFloat(form.area),
                // Files would typically be uploaded first and URLs sent here
                // For now, we simulation-submit without files
            };

            const response = await fetch(`${API_URL}/investment-projects`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                alert("Project submitted successfully for review!");
                setForm({
                    requestType: "", city: "", projectName: "", projectCode: "",
                    district: "", area: "", projectStatus: "", contractType: "",
                    googleLocation: "",
                    elements: { superMarket: "0", fuelStation: "0", kiosks: "0", retailShop: "0", driveThrough: "0" },
                    elementArea: "", priorityLevel: "", ownerName: "", ownerContactNo: "",
                    idNo: "", nationalAddress: "", email: "", ownerType: "individual",
                    requestSender: "", orderDate: "",
                });
            } else {
                const err = await response.json();
                alert(`Error: ${err.error || 'Failed to submit'}`);
            }
        } catch (err) {
            console.error(err);
            alert("Submission failed");
        }
    };

    const ELEMENTS: { key: keyof ElementCount; label: string }[] = [
        { key: "superMarket", label: "Super Market" },
        { key: "fuelStation", label: "Fuel Station" },
        { key: "kiosks", label: "Kiosks" },
        { key: "retailShop", label: "Retail Shop" },
        { key: "driveThrough", label: "Drive Through" },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* ── Project Info ──────────────────────────────────────────────── */}
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
                    <Field label="Area (m²)">
                        <input type="number" value={form.area} onChange={e => set("area", e.target.value)} className={inputCls} placeholder="Total area in m²" />
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
                    <Field label="Request Sender">
                        <input type="text" value={form.requestSender} onChange={e => set("requestSender", e.target.value)} className={inputCls} placeholder="Name of the sender" />
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

            {/* ── Elements ──────────────────────────────────────────────────── */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <SectionHeader icon={<Layers className="w-5 h-5" />} title="Station Elements" subtitle="Specify the commercial elements present at the site" />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                    {ELEMENTS.map(el => (
                        <div key={el.key} className="bg-muted/50 rounded-xl p-4 text-center border border-border hover:border-primary/30 transition-colors">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">{el.label}</p>
                            <input
                                type="number"
                                min="0"
                                value={form.elements[el.key]}
                                onChange={e => setEl(el.key, e.target.value)}
                                className="w-full text-center text-lg font-bold border border-border rounded-lg px-2 py-1.5 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                    ))}
                </div>
                <div className="max-w-xs">
                    <Field label="Total Elements Area (m²)">
                        <input type="number" value={form.elementArea} onChange={e => set("elementArea", e.target.value)} className={inputCls} placeholder="Combined area in m²" />
                    </Field>
                </div>
            </div>

            {/* ── Attachments ───────────────────────────────────────────────── */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <SectionHeader icon={<Upload className="w-5 h-5" />} title="Project Documents" subtitle="Upload design files, documents, and drawings" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FileUpload label="Design File" file={designFile}
                        onChange={setDesignFile} onRemove={() => setDesignFile(null)} />
                    <FileUpload label="Documents" file={documentsFile}
                        onChange={setDocumentsFile} onRemove={() => setDocumentsFile(null)} />
                    <FileUpload label="Auto CAD Drawing (.dwg)" file={autocadFile}
                        onChange={setAutocadFile} onRemove={() => setAutocadFile(null)} />
                </div>
            </div>

            {/* ── Owner Info ────────────────────────────────────────────────── */}
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
                    <Field label="Owner Name" required>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input type="text" value={form.ownerName} onChange={e => set("ownerName", e.target.value)}
                                className={`${inputCls} pl-9`} placeholder="Full name or company name" />
                        </div>
                    </Field>
                    <Field label="Owner Contact No" required>
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

            {/* ── Submit ────────────────────────────────────────────────────── */}
            <div className="flex justify-end">
                <button type="submit"
                    className="btn-primary px-8 py-3 rounded-xl flex items-center gap-2 font-semibold text-sm shadow-lg hover:shadow-primary/25 transition-all">
                    <Send className="w-4 h-4" /> Submit Project Request
                </button>
            </div>
        </form>
    );
}

// ─── Feasibility Tab ──────────────────────────────────────────────────────────
function FeasibilityTab({ deptLabel }: { deptLabel: string }) {
    const [stats, setStats] = useState({ total: 0, approved: 0, signed_contract: 0, rejected: 0 });
    const [items, setItems] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchFeasibility = async () => {
            const dept = window.location.pathname.includes('investment') ? 'investment' : 'franchise';
            const [statsRes, itemsRes] = await Promise.all([
                fetch(`${API_URL}/investment-projects/feasibility-stats?departmentType=${dept}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/investment-projects?departmentType=${dept}`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const statsData = await statsRes.json();
            const itemsData = await itemsRes.json();
            if (statsData.data) setStats(statsData.data);
            if (itemsData.data) setItems(itemsData.data.filter((p: any) => p.request_type === 'Feasibility Study'));
        };
        fetchFeasibility();
    }, [token]);

    const statCards = [
        { label: "Total Opportunities", value: stats.total, icon: <TrendingUp className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Approved", value: stats.approved, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Signed Contract", value: stats.signed_contract, icon: <FileText className="w-5 h-5" />, color: "text-violet-500", bg: "bg-violet-500/10" },
        { label: "Rejected", value: stats.rejected, icon: <XCircle className="w-5 h-5" />, color: "text-red-500", bg: "bg-red-500/10" },
    ];

    const badgeColor: Record<string, string> = {
        "Approved": "bg-emerald-500/10 text-emerald-600",
        "Signed Contract": "bg-violet-500/10 text-violet-600",
        "Rejected": "bg-red-500/10 text-red-600",
        "Pending Review": "bg-amber-500/10 text-amber-600",
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map(s => <StatCard key={s.label} {...s} />)}
            </div>
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border">
                    <h3 className="font-bold text-foreground">{deptLabel} — Opportunity Assessments</h3>
                </div>
                <div className="divide-y divide-border">
                    {items.length === 0 ? (
                        <div className="p-10 text-center text-muted-foreground">No records found.</div>
                    ) : items.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
                            <div>
                                <p className="text-sm font-semibold text-foreground">{item.project_name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{item.city} · {new Date(item.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColor[item.review_status] || "bg-muted text-muted-foreground"}`}>
                                {item.review_status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Reports Tab ──────────────────────────────────────────────────────────────
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
                    title={`${deptLabel} — Reports & Analysis`}
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

// ─── Contracts Tab ────────────────────────────────────────────────────────────
function ContractsTab({ deptLabel }: { deptLabel: string }) {
    const [stats, setStats] = useState({ total: 0, contracted: 0, need_contract: 0 });
    const [items, setItems] = useState([]);
    const { token } = useAuth();

    useEffect(() => {
        const fetchContracts = async () => {
            const dept = window.location.pathname.includes('investment') ? 'investment' : 'franchise';
            const [statsRes, itemsRes] = await Promise.all([
                fetch(`${API_URL}/investment-projects/contract-stats?departmentType=${dept}`, { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch(`${API_URL}/investment-projects?departmentType=${dept}`, { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const statsData = await statsRes.json();
            const itemsData = await itemsRes.json();
            if (statsData.data) setStats(statsData.data);
            if (itemsData.data) setItems(itemsData.data);
        };
        fetchContracts();
    }, [token]);

    const statCards = [
        { label: "Total Contracts", value: stats.total, icon: <FileText className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Contracted", value: stats.contracted, icon: <CheckCircle2 className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Need Contract", value: stats.need_contract, icon: <Clock className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-500/10" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {statCards.map(s => <StatCard key={s.label} {...s} />)}
            </div>
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-5 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold text-foreground">{deptLabel} — Contract List</h3>
                </div>
                <div className="divide-y divide-border">
                    {items.length === 0 ? (
                        <div className="p-10 text-center text-muted-foreground">No records found.</div>
                    ) : items.map((c: any) => (
                        <div key={c.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
                            <div>
                                <p className="text-sm font-semibold text-foreground">{c.project_name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{c.contract_type} · {new Date(c.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${c.review_status === "Approved"
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-amber-500/10 text-amber-600"
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

// ─── Shared Department Page ───────────────────────────────────────────────────
interface DeptPageProps {
    title: string;
    description: string;
    accentColor?: string;
}

export function InvestmentFranchiseDepartmentPage({ title, description }: DeptPageProps) {
    const [activeTab, setActiveTab] = useState<ActiveTab>("new-project");

    const tabs = [
        { id: "new-project" as ActiveTab, label: "New Project", icon: <PlusCircle className="w-4 h-4" /> },
        { id: "feasibility" as ActiveTab, label: "Feasibility Study & Opportunity Assessment", icon: <BookOpen className="w-4 h-4" /> },
        { id: "reports" as ActiveTab, label: "Reports & Analysis", icon: <BarChart2 className="w-4 h-4" /> },
        { id: "contracts" as ActiveTab, label: "Contracts", icon: <FileText className="w-4 h-4" /> },
    ];

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
