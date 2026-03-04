import { useState } from "react";
import {
    LayoutDashboard, BarChart2, PlusCircle, Search, ClipboardList, FileText,
    AlertTriangle, CheckCircle2, Clock, Wrench
} from "lucide-react";

type ActiveTab = "dashboard" | "new-ticket" | "ticket-tracking" | "work-orders" | "reports";

function DashboardTab() {
    const stats = [
        { label: "Open Tickets", value: "14", icon: <AlertTriangle className="w-5 h-5" />, color: "text-red-500", bg: "bg-red-500/10" },
        { label: "In Progress", value: "8", icon: <Clock className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Resolved", value: "42", icon: <CheckCircle2 className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Work Orders", value: "6", icon: <Wrench className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
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
                <h3 className="font-semibold text-foreground mb-4">Recent Tickets</h3>
                <div className="space-y-3">
                    {[
                        { id: "TKT-2024-088", issue: "Pump 3 – Nozzle Leak", priority: "High", status: "Open", date: "2024-06-14" },
                        { id: "TKT-2024-087", issue: "POS Terminal – Screen Failure", priority: "Medium", status: "In Progress", date: "2024-06-13" },
                        { id: "TKT-2024-086", issue: "HVAC – Canopy A/C Unit", priority: "Low", status: "Resolved", date: "2024-06-12" },
                    ].map((t) => (
                        <div key={t.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="text-sm font-semibold text-foreground">{t.issue}</p>
                                <p className="text-xs text-muted-foreground">{t.id} · {t.date}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${t.priority === 'High' ? 'bg-red-500/10 text-red-600' : t.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-500/10 text-slate-600'}`}>{t.priority}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${t.status === 'Open' ? 'bg-red-500/10 text-red-600' : t.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'}`}>{t.status}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function NewTicketTab() {
    return (
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">Submit New Ticket</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Ticket Title *</label>
                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="Brief description of the issue" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Category *</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                        <option>Select Category</option>
                        <option>Electrical</option>
                        <option>Mechanical</option>
                        <option>Plumbing</option>
                        <option>IT/Technology</option>
                        <option>Safety</option>
                        <option>Civil Works</option>
                        <option>Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Priority *</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                        <option>Select Priority</option>
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Critical</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Location / Area</label>
                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="e.g. Island 3, Canopy, Office" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Reported By</label>
                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Date Reported</label>
                    <input type="date" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Detailed Description</label>
                    <textarea rows={4} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="Describe the issue in detail..." />
                </div>
            </div>
            <div className="flex justify-end mt-6">
                <button className="btn-primary px-6 py-2.5 rounded-lg flex items-center gap-2">
                    <PlusCircle className="w-4 h-4" /> Submit Ticket
                </button>
            </div>
        </div>
    );
}

function TicketTrackingTab() {
    return (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">Ticket Tracking</h3>
            <div className="mb-4 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Search tickets by ID, issue, or status..." className="w-full pl-10 px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
            </div>
            <div className="space-y-3">
                {[
                    { id: "TKT-2024-088", issue: "Pump 3 – Nozzle Leak", priority: "High", status: "Open", assignee: "Ahmed Al-Harbi", date: "2024-06-14" },
                    { id: "TKT-2024-087", issue: "POS Terminal – Screen Failure", priority: "Medium", status: "In Progress", assignee: "Mohammed Khalid", date: "2024-06-13" },
                    { id: "TKT-2024-086", issue: "HVAC – Canopy A/C Unit", priority: "Low", status: "Resolved", assignee: "Sara Hassan", date: "2024-06-12" },
                    { id: "TKT-2024-085", issue: "Transformer Fault – Area B", priority: "Critical", status: "Open", assignee: "Unassigned", date: "2024-06-11" },
                ].map((t) => (
                    <div key={t.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-xl border border-border hover:shadow-md transition-all cursor-pointer">
                        <div>
                            <p className="text-sm font-bold text-foreground">{t.issue}</p>
                            <p className="text-xs text-muted-foreground">{t.id} · Assignee: {t.assignee} · {t.date}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${t.priority === 'Critical' || t.priority === 'High' ? 'bg-red-500/10 text-red-600' : t.priority === 'Medium' ? 'bg-amber-500/10 text-amber-600' : 'bg-slate-500/10 text-slate-600'}`}>{t.priority}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${t.status === 'Open' ? 'bg-red-500/10 text-red-600' : t.status === 'In Progress' ? 'bg-blue-500/10 text-blue-600' : 'bg-emerald-500/10 text-emerald-600'}`}>{t.status}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function WorkOrdersTab() {
    return (
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <h3 className="text-xl font-bold text-foreground mb-6 pb-4 border-b border-border">Work Orders</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Work Order ID *</label>
                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="e.g. WO-2024-001" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Related Ticket</label>
                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" placeholder="e.g. TKT-2024-088" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Assigned Technician *</label>
                    <input type="text" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Scheduled Date</label>
                    <input type="date" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Work Type</label>
                    <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                        <option>Select Type</option>
                        <option>Corrective Maintenance</option>
                        <option>Preventive Maintenance</option>
                        <option>Emergency Repair</option>
                        <option>Installation</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Estimated Hours</label>
                    <input type="number" className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Work Description</label>
                    <textarea rows={3} className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                </div>
            </div>
            <div className="flex justify-end mt-6">
                <button className="btn-primary px-6 py-2.5 rounded-lg">Create Work Order</button>
            </div>
        </div>
    );
}

export function MaintenanceQualityDepartmentPage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

    const tabs = [
        { id: "dashboard" as ActiveTab, label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "new-ticket" as ActiveTab, label: "Submit New Ticket", icon: <PlusCircle className="w-4 h-4" /> },
        { id: "ticket-tracking" as ActiveTab, label: "Ticket Tracking", icon: <Search className="w-4 h-4" /> },
        { id: "work-orders" as ActiveTab, label: "Work Orders", icon: <ClipboardList className="w-4 h-4" /> },
        { id: "reports" as ActiveTab, label: "Maintenance Report", icon: <FileText className="w-4 h-4" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard": return <DashboardTab />;
            case "new-ticket": return <NewTicketTab />;
            case "ticket-tracking": return <TicketTrackingTab />;
            case "work-orders": return <WorkOrdersTab />;
            case "reports": return (
                <div className="bg-card rounded-xl border border-border p-8 shadow-sm text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart2 className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2">Maintenance Report</h3>
                    <p className="text-muted-foreground text-sm">Access maintenance performance reports, SLA compliance, and equipment health analytics.</p>
                </div>
            );
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Maintenance & Quality Department</h1>
                <p className="text-muted-foreground mt-1">Manage maintenance tickets, work orders, and quality assurance</p>
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
