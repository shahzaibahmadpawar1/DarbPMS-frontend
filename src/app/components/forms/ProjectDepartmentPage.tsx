import { useState, useRef } from "react";
import {
    LayoutDashboard, List, BarChart2, FileText, BookOpen, Wrench,
    Building2, Calendar, CheckCircle2, AlertCircle,
    Upload, X, Paperclip, ChevronDown
} from "lucide-react";

type ActiveTab = "dashboard" | "project-details" | "feasibility" | "reports" | "contracts" | "technical-office";

interface ProjectDetailSection {
    id: number;
    title: string;
    multiple?: boolean;
    subItems?: string[];
}

const projectDetailSections: ProjectDetailSection[] = [
    {
        id: 1,
        title: "Plans",
        subItems: ["Approved Plans", "Architectural Plan", "Civil Defense Plan", "Construction Plan", "Implementation Plans"],
    },
    {
        id: 2,
        title: "Project Documents",
        subItems: ["Soil Report", "Building Permit", "Instrument", "Survey Sketch"],
    },
    { id: 3, title: "Project Status Report" },
    { id: 4, title: "Project Notes" },
    { id: 5, title: "Project Photos", multiple: true },
    {
        id: 6,
        title: "Handover Requests",
        subItems: ["Project Receipt Request", "On-Site Delivery Requests", "Request to Receive a Site or Visit"],
    },
    {
        id: 7,
        title: "Project Banner",
        subItems: ["Design Request", "Design"],
    },
    { id: 8, title: "Project Timeline" },
    {
        id: 9,
        title: "Approvals",
        subItems: [
            "Approval of the Tank and Pump Layout",
            "Fuel Tank Fabrication",
            "Fuel Extension Company",
            "Cladding Company",
            "Advertising Company",
        ],
    },
    { id: 10, title: "Approved Suppliers" },
    { id: 11, title: "Project Status Report" },
    {
        id: 12,
        title: "Work Manuals",
        subItems: [
            "Ministry of Energy Requirements",
            "Darb Company Project Guide",
            "Cladding and Paneling Guide",
            "Fuel Tank Guide",
            "IT Guide",
            "Grounding Guide",
        ],
    },
    { id: 13, title: "Specifications Booklet" },
    { id: 14, title: "Darb Project Photos", multiple: true },
    { id: 15, title: "Electricity Meters" },
    {
        id: 16,
        title: "Warranty Certificates",
        subItems: [
            "Fuel Tank Guarantees",
            "Cladding Warranties",
            "Pump Guarantees",
            "Guarantee of Painting Works",
        ],
    },
    { id: 17, title: "Meeting Minutes" },
    { id: 18, title: "Project Handover Checklist" },
    { id: 19, title: "Project Handover Report" },
    { id: 20, title: "Project Visit Schedule" },
    { id: 21, title: "Project Manager Evaluation" },
    { id: 22, title: "Request to Handover Project to Operations" },
];

function DashboardTab() {
    const stats = [
        { label: "Total Projects", value: "0", icon: <Building2 className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Active Projects", value: "0", icon: <CheckCircle2 className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Pending", value: "0", icon: <AlertCircle className="w-5 h-5" />, color: "text-info", bg: "bg-info/10" },
        { label: "Opening This Year", value: "0", icon: <Calendar className="w-5 h-5" />, color: "text-primary", bg: "bg-primary/10" },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s) => (
                    <div key={s.label} className="bg-card rounded-xl border border-border p-5 shadow-sm">
                        <div className={`w-10 h-10 rounded-lg ${s.bg} flex items-center justify-center mb-3 ${s.color}`}>
                            {s.icon}
                        </div>
                        <p className="text-2xl font-black text-foreground">{s.value}</p>
                        <p className="text-xs text-muted-foreground font-medium mt-1">{s.label}</p>
                    </div>
                ))}
            </div>
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h3 className="font-semibold text-foreground mb-4">Recent Projects</h3>
                <div className="p-10 text-center text-muted-foreground border border-dashed border-border rounded-lg bg-muted/30">
                    No recent projects found.
                </div>
            </div>
        </div>
    );
}

function FileUploadZone({
    label,
    multiple = false,
    files,
    onFilesChange,
}: {
    label?: string;
    multiple?: boolean;
    files: File[];
    onFilesChange: (files: File[]) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            onFilesChange(multiple ? [...files, ...newFiles] : newFiles);
        }
        // reset input so same file can be re-selected
        if (inputRef.current) inputRef.current.value = "";
    };

    const removeFile = (index: number) => {
        onFilesChange(files.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            {label && <p className="text-sm font-medium text-foreground">{label}</p>}
            <div
                className="border-2 border-dashed border-border rounded-lg p-3 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                onClick={() => inputRef.current?.click()}
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Upload className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-foreground">
                            {files.length > 0 ? `${files.length} file${files.length > 1 ? "s" : ""} selected` : "Click to upload"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {multiple ? "Multiple files allowed" : "Single file"}  -  PDF, DOC, DOCX, JPG, PNG
                        </p>
                    </div>
                </div>
                <input
                    ref={inputRef}
                    type="file"
                    multiple={multiple}
                    className="hidden"
                    onChange={handleChange}
                />
            </div>
            {files.length > 0 && (
                <div className="space-y-1">
                    {files.map((file, i) => (
                        <div key={i} className="flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5">
                            <Paperclip className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            <span className="text-xs text-foreground flex-1 truncate">{file.name}</span>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                className="text-muted-foreground hover:text-destructive transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ProjectDetailsTab() {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    // fileStore key format: "sectionId" or "sectionId-subIndex"
    const [fileStore, setFileStore] = useState<Record<string, File[]>>({});

    const getFiles = (key: string) => fileStore[key] ?? [];
    const setFiles = (key: string, files: File[]) =>
        setFileStore((prev) => ({ ...prev, [key]: files }));

    return (
        <div className="space-y-3">
            <h3 className="text-lg font-bold text-foreground mb-2">Project Details  -  Document Attachments</h3>
            {projectDetailSections.map((section) => {
                const isOpen = expandedId === section.id;
                return (
                    <div key={section.id} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                        {/* Header */}
                        <button
                            onClick={() => setExpandedId(isOpen ? null : section.id)}
                            className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-bold text-primary">{section.id}</span>
                                </div>
                                <div>
                                    <span className="text-sm font-semibold text-foreground">{section.title}</span>
                                    {section.subItems && (
                                        <p className="text-xs text-muted-foreground mt-0.5">{section.subItems.length} sub-documents</p>
                                    )}
                                    {!section.subItems && section.multiple && (
                                        <p className="text-xs text-muted-foreground mt-0.5">Multiple attachments</p>
                                    )}
                                    {!section.subItems && !section.multiple && (
                                        <p className="text-xs text-muted-foreground mt-0.5">Attachment</p>
                                    )}
                                </div>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {/* Body  -  kept in DOM, toggled via CSS so file state persists */}
                        <div className={isOpen ? "block" : "hidden"}>
                            <div className="px-4 pb-5 pt-3 border-t border-border bg-muted/20">
                                {section.subItems ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {section.subItems.map((sub, i) => {
                                            const key = `${section.id}-${i}`;
                                            return (
                                                <FileUploadZone
                                                    key={key}
                                                    label={sub}
                                                    files={getFiles(key)}
                                                    onFilesChange={(f) => setFiles(key, f)}
                                                />
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <FileUploadZone
                                        multiple={section.multiple}
                                        files={getFiles(`${section.id}`)}
                                        onFilesChange={(f) => setFiles(`${section.id}`, f)}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}

            <div className="flex justify-end pt-4">
                <button className="btn-primary px-6 py-2.5 rounded-lg flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Save All
                </button>
            </div>
        </div>
    );
}

function GenericInfoPanel({ title, description }: { title: string; description: string }) {
    return (
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
        </div>
    );
}

export function ProjectDepartmentPage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

    const tabs = [
        { id: "dashboard" as ActiveTab, label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "project-details" as ActiveTab, label: "Project Details", icon: <List className="w-4 h-4" /> },
        { id: "feasibility" as ActiveTab, label: "Feasibility Study & Opportunity Assessment", icon: <BookOpen className="w-4 h-4" /> },
        { id: "reports" as ActiveTab, label: "Project Management Reports & Analysis", icon: <BarChart2 className="w-4 h-4" /> },
        { id: "contracts" as ActiveTab, label: "Contracts", icon: <FileText className="w-4 h-4" /> },
        { id: "technical-office" as ActiveTab, label: "Technical Office", icon: <Wrench className="w-4 h-4" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard": return <DashboardTab />;
            case "project-details": return <ProjectDetailsTab />;
            case "feasibility": return <GenericInfoPanel title="Feasibility Study & Opportunity Assessment" description="Manage feasibility studies and opportunity assessment reports for project planning." />;
            case "reports": return <GenericInfoPanel title="Project Management Reports & Analysis" description="View detailed project management reports and performance analysis." />;
            case "contracts": return <GenericInfoPanel title="Contracts" description="Manage project contracts, agreements, and related documentation." />;
            case "technical-office": return <GenericInfoPanel title="Technical Office" description="Access technical drawings, specifications, and engineering documents." />;
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Projects Department</h1>
                <p className="text-muted-foreground mt-1">Manage station projects, contracts, and technical documentation</p>
            </div>

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

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {renderContent()}
            </div>
        </div>
    );
}

