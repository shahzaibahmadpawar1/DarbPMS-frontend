import { useState } from "react";
import { LayoutDashboard, BarChart2, Share2, Megaphone, Target, PieChart, Users } from "lucide-react";

type ActiveTab = "dashboard" | "campaigns" | "branding" | "performance";

function DashboardTab() {
    const stats = [
        { label: "Brand Presence", value: "88%", icon: <Target className="w-5 h-5" />, color: "text-violet-500", bg: "bg-violet-500/10" },
        { label: "Active Campaigns", value: "4", icon: <Megaphone className="w-5 h-5" />, color: "text-primary", bg: "bg-primary/10" },
        { label: "Total Reach", value: "1.2M", icon: <Share2 className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "NPS Score", value: "42", icon: <Users className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
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
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm text-center py-12">
                <PieChart className="w-16 h-16 text-primary mx-auto mb-4 opacity-50" />
                <h3 className="font-semibold text-foreground">Marketing ROI Analytics</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-2">Detailed visualization of marketing spend versus conversion rates across all channels.</p>
            </div>
        </div>
    );
}

export function MarketingDepartmentPage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

    const tabs = [
        { id: "dashboard" as ActiveTab, label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "campaigns" as ActiveTab, label: "Campaigns", icon: <Megaphone className="w-4 h-4" /> },
        { id: "branding" as ActiveTab, label: "Branding & Creative", icon: <Target className="w-4 h-4" /> },
        { id: "performance" as ActiveTab, label: "Marketing Performance Report", icon: <BarChart2 className="w-4 h-4" /> },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Marketing Department</h1>
                <p className="text-muted-foreground mt-1">Manage brand identity, campaigns, and market performance</p>
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
                        <Target className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">Access marketing central hubs, creative assets, and performance data.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
