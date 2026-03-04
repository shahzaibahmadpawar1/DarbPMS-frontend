import { useState } from "react";
import { LayoutDashboard, BarChart2, Zap, Fuel, ClipboardCheck, AlertTriangle } from "lucide-react";

type ActiveTab = "dashboard" | "inspections" | "fuel" | "daily-reports";

function DashboardTab() {
    const stats = [
        { label: "Daily Transactions", value: "1,240", icon: <Zap className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Fuel Level (Avg)", value: "78%", icon: <Fuel className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Inspections (MTD)", value: "24 / 30", icon: <ClipboardCheck className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Active Incidents", value: "2", icon: <AlertTriangle className="w-5 h-5" />, color: "text-red-500", bg: "bg-red-500/10" },
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
                <h3 className="font-semibold text-foreground mb-4">Live Operational Status</h3>
                <div className="space-y-3">
                    {[
                        { item: "Pump 1 to 12 Status", value: "Normal", trend: "100%", status: "success" },
                        { item: "Storage Tank A (91)", value: "Low Alert", trend: "18%", status: "warning" },
                        { item: "POS Connectivity", value: "Stable", trend: "99.9%", status: "success" },
                    ].map((i) => (
                        <div key={i.item} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm font-semibold text-foreground">{i.item}</p>
                            <div className="text-right">
                                <p className={`text-sm font-bold ${i.status === 'success' ? 'text-emerald-500' : 'text-amber-500'}`}>{i.value}</p>
                                <p className="text-xs text-muted-foreground">{i.trend}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function InspectionsTab() {
    return (
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <h3 className="text-xl font-bold text-foreground">Site Inspections</h3>
                <button className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" /> New Inspection
                </button>
            </div>
            <div className="space-y-4">
                {[
                    { id: "INS-771", station: "Station 204", date: "2024-06-12", inspector: "John Doe", score: "94%" },
                    { id: "INS-770", station: "Station 112", date: "2024-06-11", inspector: "Jane Smith", score: "88%" },
                ].map((i) => (
                    <div key={i.id} className="p-4 bg-muted/30 border border-border rounded-xl flex items-center justify-between">
                        <div>
                            <p className="font-bold text-foreground">{i.station} Inspection</p>
                            <p className="text-xs text-muted-foreground">ID: {i.id} · Inspector: {i.inspector} · {i.date}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-lg font-black text-primary">{i.score}</p>
                            <button className="text-xs text-primary font-bold hover:underline">View Report</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function OperationsManagementPage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

    const tabs = [
        { id: "dashboard" as ActiveTab, label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "inspections" as ActiveTab, label: "Site Inspections", icon: <ClipboardCheck className="w-4 h-4" /> },
        { id: "fuel" as ActiveTab, label: "Fuel Inventory", icon: <Fuel className="w-4 h-4" /> },
        { id: "daily-reports" as ActiveTab, label: "Reports & Analysis", icon: <BarChart2 className="w-4 h-4" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard": return <DashboardTab />;
            case "inspections": return <InspectionsTab />;
            case "fuel":
                return (
                    <div className="bg-card rounded-xl border border-border p-8 shadow-sm text-center">
                        <Fuel className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-2">Fuel Inventory Management</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">Manage fuel reconciliation, deliveries, and real-time tank monitoring.</p>
                    </div>
                );
            case "daily-reports":
                return (
                    <div className="bg-card rounded-xl border border-border p-8 shadow-sm text-center">
                        <BarChart2 className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-2">Operations Reports & Analysis</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">Daily operational reports, efficiency analysis, and station throughput tracking.</p>
                    </div>
                );
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Operations Management</h1>
                <p className="text-muted-foreground mt-1">Daily station operations, fuel tracking, and compliance checks</p>
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
                {renderContent()}
            </div>
        </div>
    );
}

// Helper icons
function PlusCircle({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>;
}
