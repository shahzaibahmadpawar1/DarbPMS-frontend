import { useState } from "react";
import { LayoutDashboard, BarChart2, FileText, Scale } from "lucide-react";

type ActiveTab = "dashboard" | "contracts" | "reports";

function DashboardTab() {
    const stats = [
        { label: "Active Cases", value: "12", icon: <Scale className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Active Contracts", value: "38", icon: <FileText className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Pending Review", value: "5", icon: <BarChart2 className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Resolved", value: "94", icon: <Scale className="w-5 h-5" />, color: "text-violet-500", bg: "bg-violet-500/10" },
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
                <h3 className="font-semibold text-foreground mb-4">Recent Legal Cases</h3>
                <div className="space-y-3">
                    {[
                        { id: "LGL-2024-041", type: "Contractual Compliance", party: "Supreme Tech Solutions", status: "In Review", date: "2024-05-12" },
                        { id: "LGL-2024-038", type: "License Dispute", party: "Al-Rashid Group", status: "Active", date: "2024-04-20" },
                        { id: "LGL-2024-030", type: "Employment Issue", party: "Internal HR", status: "Resolved", date: "2024-03-08" },
                    ].map((c) => (
                        <div key={c.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="text-sm font-semibold text-foreground">{c.type}</p>
                                <p className="text-xs text-muted-foreground">{c.id} · {c.party} · {c.date}</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.status === 'Active' ? 'bg-blue-500/10 text-blue-600' : c.status === 'In Review' ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                                {c.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ContractsTab() {
    return (
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">Contracts Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Contract ID *</label>
                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Contract Type</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                        <option>Select Type</option>
                        <option>Service Agreement</option>
                        <option>Lease Agreement</option>
                        <option>Supplier Contract</option>
                        <option>Employment Contract</option>
                        <option>NDA</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Counter Party</label>
                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Start Date</label>
                    <input type="date" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">End Date</label>
                    <input type="date" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                        <option>Select Status</option>
                        <option>Draft</option>
                        <option>Active</option>
                        <option>Expired</option>
                        <option>Terminated</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
                    <textarea rows={3} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
            </div>
            <div className="flex justify-end mt-6">
                <button className="btn-primary px-6 py-2.5 rounded-lg">Save Contract</button>
            </div>
        </div>
    );
}

export function LegalDepartmentPage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

    const tabs = [
        { id: "dashboard" as ActiveTab, label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "contracts" as ActiveTab, label: "Contracts", icon: <FileText className="w-4 h-4" /> },
        { id: "reports" as ActiveTab, label: "Legal Management Reports & Analytics", icon: <BarChart2 className="w-4 h-4" /> },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Legal Department</h1>
                <p className="text-muted-foreground mt-1">Manage legal cases, contracts, and compliance documentation</p>
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
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === "dashboard" ? <DashboardTab /> : activeTab === "contracts" ? <ContractsTab /> : (
                    <div className="bg-card rounded-xl border border-border p-8 shadow-sm text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BarChart2 className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Legal Management Reports & Analytics</h3>
                        <p className="text-muted-foreground text-sm">Comprehensive reports on legal cases, contract status, compliance metrics, and risk exposure.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
