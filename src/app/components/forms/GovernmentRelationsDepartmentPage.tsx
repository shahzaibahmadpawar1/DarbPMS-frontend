import { useState } from "react";
import { LayoutDashboard, Shield, Landmark, FileText, BadgeCheck, AlertCircle } from "lucide-react";

type ActiveTab = "dashboard" | "licenses" | "compliance" | "inspections";

function DashboardTab() {
    const stats = [
        { label: "Valid Licenses", value: "24", icon: <BadgeCheck className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Renewals Due", value: "3", icon: <AlertCircle className="w-5 h-5" />, color: "text-orange-500", bg: "bg-orange-500/10" },
        { label: "Agencies Linked", value: "12", icon: <Landmark className="w-5 h-5" />, color: "text-primary", bg: "bg-primary/10" },
        { label: "Incidents", value: "0", icon: <Shield className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
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
                <h3 className="font-semibold text-foreground mb-4">Regulatory Tracker</h3>
                <div className="space-y-3">
                    {[
                        { agency: "Ministry of Energy", document: "Operational License Update", due: "2024-07-15", status: "Active" },
                        { agency: "Civil Defense", document: "Safety Certificate", due: "2024-06-30", status: "Renewal Pending" },
                        { agency: "Municipality", document: "Health Permits", due: "2024-08-01", status: "Active" },
                    ].map((r) => (
                        <div key={r.document} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="text-sm font-semibold text-foreground">{r.agency}</p>
                                <p className="text-xs text-muted-foreground">{r.document}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-foreground">{r.due}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${r.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-orange-500/10 text-orange-600'}`}>{r.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function GovernmentRelationsDepartmentPage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

    const tabs = [
        { id: "dashboard" as ActiveTab, label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "licenses" as ActiveTab, label: "Licenses Management", icon: <BadgeCheck className="w-4 h-4" /> },
        { id: "compliance" as ActiveTab, label: "Compliance Tracking", icon: <Shield className="w-4 h-4" /> },
        { id: "inspections" as ActiveTab, label: "Gov. Inspection Reports", icon: <FileText className="w-4 h-4" /> },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Government Relations</h1>
                <p className="text-muted-foreground mt-1">Manage regulatory compliance, licenses, and agency relations</p>
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
                {activeTab === "dashboard" ? <DashboardTab /> : (
                    <div className="bg-card rounded-xl border border-border p-8 shadow-sm text-center">
                        <Landmark className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">Manage interactions with government bodies and track all active licenses.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
