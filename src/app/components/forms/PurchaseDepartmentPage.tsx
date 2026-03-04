import { useState } from "react";
import { LayoutDashboard, BarChart2, ShoppingCart, Package, TrendingDown, CheckCircle } from "lucide-react";

type ActiveTab = "dashboard" | "reports";

function DashboardTab() {
    const stats = [
        { label: "Total Requests", value: "156", icon: <ShoppingCart className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Approved", value: "98", icon: <CheckCircle className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Pending Orders", value: "34", icon: <Package className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Avg. Cost Saved", value: "12.3%", icon: <TrendingDown className="w-5 h-5" />, color: "text-violet-500", bg: "bg-violet-500/10" },
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
                <h3 className="font-semibold text-foreground mb-4">Recent Procurement Requests</h3>
                <div className="space-y-3">
                    {[
                        { id: "PR-2024-112", type: "Product Supply", requester: "Ahmed Al-Harbi", status: "Approved", date: "2024-06-10" },
                        { id: "PR-2024-113", type: "Price Quote – Pumps", requester: "Sara Hassan", status: "Pending", date: "2024-06-12" },
                        { id: "PR-2024-114", type: "Purchase Clothes", requester: "Mohammed Khalid", status: "In Review", date: "2024-06-14" },
                    ].map((r) => (
                        <div key={r.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="text-sm font-semibold text-foreground">{r.type}</p>
                                <p className="text-xs text-muted-foreground">{r.id} · {r.requester} · {r.date}</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${r.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' : r.status === 'Pending' ? 'bg-amber-500/10 text-amber-600' : 'bg-blue-500/10 text-blue-600'}`}>
                                {r.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ReportsTab() {
    return (
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart2 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">Procurement Management Reports & Analysis</h3>
            <p className="text-muted-foreground text-sm">Access comprehensive procurement reports, spend analysis, and supplier performance metrics.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {["Monthly Spend Report", "Supplier Performance", "Cost Savings Analysis"].map((r) => (
                    <div key={r} className="p-4 bg-muted/50 rounded-xl border border-border hover:border-primary/30 cursor-pointer transition-all hover:shadow-md">
                        <BarChart2 className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-sm font-semibold text-foreground">{r}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function PurchaseDepartmentPage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

    const tabs = [
        { id: "dashboard" as ActiveTab, label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "reports" as ActiveTab, label: "Procurement Management Reports & Analysis", icon: <BarChart2 className="w-4 h-4" /> },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Purchase / Procurement Department</h1>
                <p className="text-muted-foreground mt-1">Manage procurement requests, suppliers, and cost analysis</p>
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
                {activeTab === "dashboard" ? <DashboardTab /> : <ReportsTab />}
            </div>
        </div>
    );
}
