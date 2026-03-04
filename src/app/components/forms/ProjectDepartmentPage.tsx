import { useState } from "react";
import {
    LayoutDashboard, List, BarChart2, FileText, BookOpen, Wrench,
    ChevronRight, Building2, Calendar, CheckCircle2, AlertCircle
} from "lucide-react";

type ActiveTab = "dashboard" | "project-details" | "feasibility" | "reports" | "contracts" | "technical-office";

type ProjectDetailsSubType =
    | "total-projects"
    | "city"
    | "opening-year"
    | "project-status"
    | "company-name"
    | "station-code"
    | "station-name";

const projectDetailsOptions = [
    { id: "total-projects" as ProjectDetailsSubType, label: "Total Projects" },
    { id: "city" as ProjectDetailsSubType, label: "City" },
    { id: "opening-year" as ProjectDetailsSubType, label: "Opening Year" },
    { id: "project-status" as ProjectDetailsSubType, label: "Project Status" },
    { id: "company-name" as ProjectDetailsSubType, label: "Company Name" },
    { id: "station-code" as ProjectDetailsSubType, label: "Station Code" },
    { id: "station-name" as ProjectDetailsSubType, label: "Station Name" },
];

function DashboardTab() {
    const stats = [
        { label: "Total Projects", value: "0", icon: <Building2 className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Active Projects", value: "0", icon: <CheckCircle2 className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Pending", value: "0", icon: <AlertCircle className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Opening This Year", value: "0", icon: <Calendar className="w-5 h-5" />, color: "text-violet-500", bg: "bg-violet-500/10" },
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

function ProjectDetailsTab() {
    const [selectedSub, setSelectedSub] = useState<ProjectDetailsSubType | null>(null);

    if (selectedSub) {
        return (
            <div>
                <button onClick={() => setSelectedSub(null)} className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ChevronRight className="w-4 h-4 rotate-180" /> Back to Project Details
                </button>
                <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
                    <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">
                        {projectDetailsOptions.find(o => o.id === selectedSub)?.label}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedSub === "total-projects" && (
                            <>
                                <div className="md:col-span-2 bg-muted/50 rounded-xl p-6">
                                    <p className="text-5xl font-black text-primary text-center">0</p>
                                    <p className="text-center text-muted-foreground mt-2">Total Projects Registered</p>
                                </div>
                            </>
                        )}
                        {selectedSub !== "total-projects" && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">{projectDetailsOptions.find(o => o.id === selectedSub)?.label} <span className="text-red-500">*</span></label>
                                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Reference ID</label>
                                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
                                    <textarea rows={3} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                                </div>
                            </>
                        )}
                    </div>
                    <div className="flex justify-end mt-6">
                        <button className="btn-primary px-6 py-2.5 rounded-lg flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Select Project Detail Category</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projectDetailsOptions.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => setSelectedSub(option.id)}
                        className="flex items-center justify-between p-4 bg-card rounded-xl border border-border hover:border-primary/50 hover:shadow-md hover:bg-primary/5 transition-all duration-200 text-left group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                                <List className="w-4 h-4 text-primary" />
                            </div>
                            <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{option.label}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                ))}
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
