import { useState } from "react";
import {
    LayoutDashboard, BarChart2, FileText, Table, Pencil,
    Truck, BarChart, Home, DollarSign, Building
} from "lucide-react";

type ActiveTab =
    | "dashboard"
    | "owner-pricing"
    | "darb-pricing"
    | "plan-modification"
    | "coordination"
    | "delivery-schedule"
    | "project-report"
    | "investment-contracts";

function DashboardTab() {
    const stats = [
        { label: "Properties", value: "63", icon: <Building className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Active Rentals", value: "41", icon: <Home className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Pending Deliveries", value: "8", icon: <Truck className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Avg. Yield", value: "9.3%", icon: <DollarSign className="w-5 h-5" />, color: "text-violet-500", bg: "bg-violet-500/10" },
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
                <h3 className="font-semibold text-foreground mb-4">Recent Property Activity</h3>
                <div className="space-y-3">
                    {[
                        { property: "Station N-204 Land Plot", action: "Pricing Submitted", party: "Owner", date: "2024-06-12" },
                        { property: "Station J-112 Commercial Unit", action: "Delivery Scheduled", party: "Darb", date: "2024-06-10" },
                        { property: "Station D-087 Building A", action: "Plan Modification Requested", party: "Owner", date: "2024-06-08" },
                    ].map((p) => (
                        <div key={p.property} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="text-sm font-semibold text-foreground">{p.property}</p>
                                <p className="text-xs text-muted-foreground">{p.action} · {p.date}</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${p.party === 'Darb' ? 'bg-primary/10 text-primary' : 'bg-slate-500/10 text-slate-600'}`}>{p.party}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function PricingTableTab({ title, isOwner }: { title: string; isOwner: boolean }) {
    return (
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">{title}</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-border">
                            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Property ID</th>
                            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Property Name</th>
                            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">{isOwner ? "Owner" : "Darb"} Price (SAR)</th>
                            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Type</th>
                            <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { id: "PRO-001", name: "Station N-204 Land Plot", price: isOwner ? "1,200,000" : "950,000", type: "Land", status: "Active" },
                            { id: "PRO-002", name: "Station J-112 Commercial Unit", price: isOwner ? "3,500,000" : "3,100,000", type: "Commercial", status: "Pending" },
                            { id: "PRO-003", name: "Station D-087 Building A", price: isOwner ? "2,800,000" : "2,450,000", type: "Building", status: "Active" },
                        ].map((row) => (
                            <tr key={row.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                                <td className="py-3 px-4 font-mono text-xs text-primary">{row.id}</td>
                                <td className="py-3 px-4 text-foreground font-medium">{row.name}</td>
                                <td className="py-3 px-4 text-foreground font-bold">SAR {row.price}</td>
                                <td className="py-3 px-4 text-muted-foreground">{row.type}</td>
                                <td className="py-3 px-4">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${row.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>{row.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end mt-6">
                <button className="btn-primary px-6 py-2.5 rounded-lg flex items-center gap-2">
                    <Table className="w-4 h-4" /> Add New Entry
                </button>
            </div>
        </div>
    );
}

function GenericFormPanel({ title, fields }: { title: string; fields: string[] }) {
    return (
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map((f) => (
                    <div key={f}>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">{f}</label>
                        <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                    </div>
                ))}
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
                    <textarea rows={3} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
            </div>
            <div className="flex justify-end mt-6">
                <button className="btn-primary px-6 py-2.5 rounded-lg">Save</button>
            </div>
        </div>
    );
}

export function PropertyDepartmentPage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

    const tabs = [
        { id: "dashboard" as ActiveTab, label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "owner-pricing" as ActiveTab, label: "Owner-Proposed Pricing Table", icon: <Table className="w-4 h-4" /> },
        { id: "darb-pricing" as ActiveTab, label: "Darb-Proposed Pricing Table", icon: <Table className="w-4 h-4" /> },
        { id: "plan-modification" as ActiveTab, label: "Request for Plan Modification", icon: <Pencil className="w-4 h-4" /> },
        { id: "coordination" as ActiveTab, label: "Coordination Department", icon: <Building className="w-4 h-4" /> },
        { id: "delivery-schedule" as ActiveTab, label: "Delivery Schedule", icon: <Truck className="w-4 h-4" /> },
        { id: "project-report" as ActiveTab, label: "Project Report", icon: <BarChart className="w-4 h-4" /> },
        { id: "investment-contracts" as ActiveTab, label: "Investment Contracts", icon: <FileText className="w-4 h-4" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard": return <DashboardTab />;
            case "owner-pricing": return <PricingTableTab title="Owner-Proposed Pricing Table" isOwner={true} />;
            case "darb-pricing": return <PricingTableTab title="Darb-Proposed Pricing Table" isOwner={false} />;
            case "plan-modification": return <GenericFormPanel title="Request for Plan Modification" fields={["Property ID", "Current Plan Reference", "Modification Type", "Requested By", "Submission Date"]} />;
            case "coordination": return <GenericFormPanel title="Coordination Department" fields={["Coordination ID", "Coordinator Name", "Department", "Contact", "Priority"]} />;
            case "delivery-schedule": return <GenericFormPanel title="Delivery Schedule" fields={["Schedule ID", "Property ID", "Delivery Date", "Responsible Party", "Delivery Type"]} />;
            case "project-report": return (
                <div className="bg-card rounded-xl border border-border p-8 shadow-sm text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart2 className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Project Report</h3>
                    <p className="text-muted-foreground text-sm">Comprehensive property project reports, progress updates, and key performance metrics.</p>
                </div>
            );
            case "investment-contracts": return <GenericFormPanel title="Investment Contracts" fields={["Contract ID", "Investor Name", "Property ID", "Investment Amount (SAR)", "Contract Date", "Expiry Date"]} />;
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Property Department</h1>
                <p className="text-muted-foreground mt-1">Manage property pricing, delivery schedules, and investment contracts</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-6 bg-muted/50 p-1.5 rounded-xl">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === tab.id
                            ? "bg-card text-primary shadow-sm border border-border"
                            : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                            }`}
                    >
                        {tab.icon}
                        <span className="hidden lg:inline">{tab.label}</span>
                        <span className="lg:hidden">{tab.label.split(" ")[0]}</span>
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {renderContent()}
            </div>
        </div>
    );
}
