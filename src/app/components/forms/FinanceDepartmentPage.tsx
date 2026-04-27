import { useState } from "react";
import { LayoutDashboard, BarChart2, DollarSign, TrendingUp, CreditCard, ShoppingBag, Activity } from "lucide-react";

type ActiveTab = "dashboard" | "sales" | "reports";

function DashboardTab() {
    const stats = [
        { label: "Total Revenue", value: "SAR 8.4M", icon: <DollarSign className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Monthly Sales", value: "SAR 720K", icon: <ShoppingBag className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Profit Margin", value: "21.7%", icon: <TrendingUp className="w-5 h-5" />, color: "text-primary", bg: "bg-primary/10" },
        { label: "Expenses (MTD)", value: "SAR 190K", icon: <CreditCard className="w-5 h-5" />, color: "text-primary", bg: "bg-primary/10" },
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
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-primary" /> Financial Overview
                </h3>
                <div className="space-y-3">
                    {[
                        { category: "Fuel Sales", amount: "SAR 5,200,000", trend: "+8.2%", positive: true },
                        { category: "Convenience Store", amount: "SAR 1,800,000", trend: "+3.1%", positive: true },
                        { category: "Service Revenue", amount: "SAR 1,400,000", trend: "-1.4%", positive: false },
                    ].map((item) => (
                        <div key={item.category} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <p className="text-sm font-semibold text-foreground">{item.category}</p>
                            <div className="text-right">
                                <p className="text-sm font-bold text-primary">{item.amount}</p>
                                <span className={`text-xs font-semibold ${item.positive ? 'text-emerald-600' : 'text-red-500'}`}>{item.trend}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function SalesTab() {
    return (
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">Sales Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Sale Type</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                        <option>Select Sale Type</option>
                        <option>Fuel Sales</option>
                        <option>Convenience Store</option>
                        <option>Service Invoice</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Invoice Number *</label>
                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Sale Date</label>
                    <input type="date" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Amount (SAR)</label>
                    <input type="number" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Customer</label>
                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Payment Method</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                        <option>Select Method</option>
                        <option>Cash</option>
                        <option>Card</option>
                        <option>Transfer</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
                    <textarea rows={3} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
            </div>
            <div className="flex justify-end mt-6">
                <button className="btn-primary px-6 py-2.5 rounded-lg flex items-center gap-2">
                    Save Sales Record
                </button>
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
            <h3 className="text-lg font-bold text-foreground mb-2">Financial Management Reports & Analysis</h3>
            <p className="text-muted-foreground text-sm">Comprehensive financial reports, P&L statements, budget tracking, and trend analysis.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                {["P&L Statement", "Budget vs Actual", "Cash Flow Report"].map((r) => (
                    <div key={r} className="p-4 bg-muted/50 rounded-xl border border-border hover:border-primary/30 cursor-pointer transition-all hover:shadow-md">
                        <BarChart2 className="w-6 h-6 text-primary mx-auto mb-2" />
                        <p className="text-sm font-semibold text-foreground">{r}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function FinanceDepartmentPage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

    const tabs = [
        { id: "dashboard" as ActiveTab, label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "sales" as ActiveTab, label: "Sales", icon: <ShoppingBag className="w-4 h-4" /> },
        { id: "reports" as ActiveTab, label: "Financial Management Reports & Analysis", icon: <BarChart2 className="w-4 h-4" /> },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Finance Department</h1>
                <p className="text-muted-foreground mt-1">Manage financial operations, sales, and reporting</p>
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
                {activeTab === "dashboard" ? <DashboardTab /> : activeTab === "sales" ? <SalesTab /> : <ReportsTab />}
            </div>
        </div>
    );
}

