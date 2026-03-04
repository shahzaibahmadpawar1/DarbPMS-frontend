import { useState } from "react";
import { LayoutDashboard, Users, UserPlus, FileCheck, Calendar, Award } from "lucide-react";

type ActiveTab = "dashboard" | "employees" | "recruitment" | "payroll" | "training";

function DashboardTab() {
    const stats = [
        { label: "Total Employees", value: "156", icon: <Users className="w-5 h-5" />, color: "text-primary", bg: "bg-primary/10" },
        { label: "New Hires (MTD)", value: "12", icon: <UserPlus className="w-5 h-5" />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
        { label: "Leaves Today", value: "8", icon: <Calendar className="w-5 h-5" />, color: "text-amber-500", bg: "bg-amber-500/10" },
        { label: "Certifications", value: "45", icon: <Award className="w-5 h-5" />, color: "text-blue-500", bg: "bg-blue-500/10" },
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
                <h3 className="font-semibold text-foreground mb-4">Upcoming Renewals</h3>
                <div className="space-y-3">
                    {[
                        { name: "John Smith", type: "Iqama Renewal", date: "In 5 days", urgency: "High" },
                        { name: "Ahmed Mohammed", type: "Health Certificate", date: "In 12 days", urgency: "Medium" },
                        { name: "Sarah Doe", type: "Safety Training", date: "In 20 days", urgency: "Low" },
                    ].map((r) => (
                        <div key={r.name} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                            <div>
                                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                                <p className="text-xs text-muted-foreground">{r.type}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-foreground">{r.date}</p>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${r.urgency === 'High' ? 'bg-red-500/10 text-red-600' : 'bg-slate-500/10 text-slate-600'}`}>{r.urgency}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function HumanResourcePage() {
    const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

    const tabs = [
        { id: "dashboard" as ActiveTab, label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: "employees" as ActiveTab, label: "Employee Files", icon: <Users className="w-4 h-4" /> },
        { id: "recruitment" as ActiveTab, label: "Recruitment", icon: <UserPlus className="w-4 h-4" /> },
        { id: "payroll" as ActiveTab, label: "Payroll", icon: <FileCheck className="w-4 h-4" /> },
        { id: "training" as ActiveTab, label: "Training & Development", icon: <Award className="w-4 h-4" /> },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard": return <DashboardTab />;
            default:
                return (
                    <div className="bg-card rounded-xl border border-border p-8 shadow-sm text-center">
                        <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-foreground mb-2">{tabs.find(t => t.id === activeTab)?.label}</h3>
                        <p className="text-muted-foreground text-sm max-w-md mx-auto">Manage personnel records, organizational structure, and HR workflows.</p>
                    </div>
                );
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Human Resources</h1>
                <p className="text-muted-foreground mt-1">Manage workforce, talent, and employee relations</p>
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
