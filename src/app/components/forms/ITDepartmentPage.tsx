import { useState } from "react";
import { LayoutDashboard, BarChart2, Wallet, Camera, Monitor, AlertCircle } from "lucide-react";

type ActiveTab = "dashboard" | "cash-in" | "cameras" | "reports";

function DashboardTab() {
    const stats = [
        { label: "Systems Online", value: "48", icon: <Monitor className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Cash Terminals", value: "12", icon: <Wallet className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Cameras Active", value: "36", icon: <Camera className="w-5 h-5" />, color: "text-violet-500", bg: "bg-violet-500/10" },
        { label: "Active Tickets", value: "5", icon: <AlertCircle className="w-5 h-5" />, color: "text-orange-500", bg: "bg-orange-500/10" },
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
                <h3 className="font-semibold text-foreground mb-4">Recent IT Events</h3>
                <div className="space-y-3">
                    {[
                        { event: "Server Backup Completed", type: "Success", date: "2024-06-14 02:00" },
                        { event: "Camera Feed Disruption – Island 3", type: "Alert", date: "2024-06-13 14:22" },
                        { event: "POS System Update Deployed", type: "Info", date: "2024-06-12 10:05" },
                    ].map((e) => (
                        <div key={e.event} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${e.type === 'Success' ? 'bg-emerald-500' : e.type === 'Alert' ? 'bg-red-500' : 'bg-blue-500'}`} />
                                <p className="text-sm font-semibold text-foreground">{e.event}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">{e.date}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function CashInTab() {
    return (
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">Cash In Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Terminal ID *</label>
                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="e.g. TRM-001" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Transaction Date</label>
                    <input type="date" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Amount (SAR)</label>
                    <input type="number" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Operator</label>
                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                        <option>Select Status</option>
                        <option>Confirmed</option>
                        <option>Pending</option>
                        <option>Discrepancy</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Shift</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                        <option>Select Shift</option>
                        <option>Morning</option>
                        <option>Evening</option>
                        <option>Night</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
                    <textarea rows={3} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
            </div>
            <div className="flex justify-end mt-6">
                <button className="btn-primary px-6 py-2.5 rounded-lg">Save Cash In Record</button>
            </div>
        </div>
    );
}

function CamerasTab() {
    return (
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">Camera Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Camera ID *</label>
                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="e.g. CAM-001" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="e.g. Entrance Gate" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">IP Address</label>
                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                        <option>Select Status</option>
                        <option>Active</option>
                        <option>Offline</option>
                        <option>Maintenance</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Installation Date</label>
                    <input type="date" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Model</label>
                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Notes</label>
                    <textarea rows={3} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
            </div>
            <div className="flex justify-end mt-6">
                <button className="btn-primary px-6 py-2.5 rounded-lg">Save Camera Record</button>
            </div>
        </div>
    );
}

export function ITDepartmentPage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

    const tabs = [
        { id: "dashboard" as ActiveTab, label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "cash-in" as ActiveTab, label: "Cash In", icon: <Wallet className="w-4 h-4" /> },
        { id: "cameras" as ActiveTab, label: "Cameras", icon: <Camera className="w-4 h-4" /> },
        { id: "reports" as ActiveTab, label: "IT Management Reports & Analysis", icon: <BarChart2 className="w-4 h-4" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard": return <DashboardTab />;
            case "cash-in": return <CashInTab />;
            case "cameras": return <CamerasTab />;
            case "reports": return (
                <div className="bg-card rounded-xl border border-border p-8 shadow-sm text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart2 className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">IT Management Reports & Analysis</h3>
                    <p className="text-muted-foreground text-sm">Access system uptime reports, incident logs, and IT performance analytics.</p>
                </div>
            );
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">IT Department</h1>
                <p className="text-muted-foreground mt-1">Manage IT systems, cameras, cash terminals, and technology infrastructure</p>
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
