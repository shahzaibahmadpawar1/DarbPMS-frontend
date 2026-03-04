import { useState } from "react";
import { LayoutDashboard, ShieldAlert, HeartPulse, HardHat, FileWarning, CheckCircle } from "lucide-react";

type ActiveTab = "dashboard" | "incidents" | "audits" | "training";

function DashboardTab() {
    const stats = [
        { label: "Safety Score", value: "98/100", icon: <ShieldAlert className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Safe Days", value: "412", icon: <CheckCircle className="w-5 h-5" />, color: "text-primary", bg: "bg-primary/10" },
        { label: "Active Audits", value: "2", icon: <HardHat className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Near Misses", value: "1", icon: <FileWarning className="w-5 h-5" />, color: "text-orange-500", bg: "bg-orange-500/10" },
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
                <h3 className="font-semibold text-foreground mb-4 font-black flex items-center gap-2">
                    <HardHat className="w-4 h-4 text-primary" /> Recent Safety Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-muted/50 rounded-xl">
                        <p className="text-sm font-bold text-foreground mb-2">Personal Protective Equipment (PPE)</p>
                        <div className="w-full bg-border rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 text-right">100% COMPLIANCE</p>
                    </div>
                    <div className="p-4 bg-muted/50 rounded-xl">
                        <p className="text-sm font-bold text-foreground mb-2">Fire Safety Systems</p>
                        <div className="w-full bg-border rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-1 text-right">95% OPERATIONAL</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function SafetyDepartmentPage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

    const tabs = [
        { id: "dashboard" as ActiveTab, label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "incidents" as ActiveTab, label: "Incident Reporting", icon: <FileWarning className="w-4 h-4" /> },
        { id: "audits" as ActiveTab, label: "Safety Audits", icon: <HardHat className="w-4 h-4" /> },
        { id: "training" as ActiveTab, label: "Safety Training Report", icon: <HeartPulse className="w-4 h-4" /> },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground font-black tracking-tight flex items-center gap-3">
                    <ShieldAlert className="w-8 h-8 text-primary" /> SAFETY & HSE
                </h1>
                <p className="text-muted-foreground mt-1 font-medium">Health, Safety, and Environmental compliance portal</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6 bg-muted/50 p-1.5 rounded-xl">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold transition-all duration-200 ${activeTab === tab.id
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
                    <div className="bg-card rounded-xl border border-border p-12 shadow-sm text-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShieldAlert className="w-10 h-10 text-primary" />
                        </div>
                        <h3 className="text-xl font-black text-foreground mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">Manage and track safety incidents, conduct mobile audits, and monitor staff certifications.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
