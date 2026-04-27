import { useParams, Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Activity, AlertCircle, CheckCircle2, Clock, DollarSign } from "lucide-react";
import logo from "../../assets/logo.png";

export function StationAnalyticsPage() {
    const { stationId } = useParams();

    // Demo data for the specific station
    const stationData = {
        name: stationId?.replace(/-/g, " ").toUpperCase() || "Station",
        status: "Active",
        completion: 75,
        budget: "2.5M SAR",
        spent: "1.8M SAR",
        formsCompleted: 11,
        totalForms: 15,
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Back Button */}
            <Link
                to="/all-stations-list"
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to All Stations
            </Link>

            {/* Header */}
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border card-glow p-8 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl p-2">
                        <img src={logo} alt="Darb Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-4xl font-black text-foreground tracking-tight">{stationData.name}</h1>
                        <p className="text-muted-foreground font-medium">Station Analytics Dashboard</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-muted-foreground">Form Completion</span>
                        <span className="text-sm font-bold text-primary">
                            {stationData.formsCompleted}/{stationData.totalForms} ({Math.round((stationData.formsCompleted / stationData.totalForms) * 100)}%)
                        </span>
                    </div>
                    <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full gradient-primary rounded-full transition-all duration-500"
                            style={{ width: `${Math.round((stationData.formsCompleted / stationData.totalForms) * 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border card-glow p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-success" />
                        </div>
                        <span className="text-sm font-bold text-muted-foreground">Status</span>
                    </div>
                    <p className="text-2xl font-black text-foreground">{stationData.status}</p>
                </div>

                <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border card-glow p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-info" />
                        </div>
                        <span className="text-sm font-bold text-muted-foreground">Completion</span>
                    </div>
                    <p className="text-2xl font-black text-foreground">{stationData.completion}%</p>
                </div>

                <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border card-glow p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-sm font-bold text-muted-foreground">Budget</span>
                    </div>
                    <p className="text-2xl font-black text-foreground">{stationData.budget}</p>
                </div>

                <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border card-glow p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-warning" />
                        </div>
                        <span className="text-sm font-bold text-muted-foreground">Spent</span>
                    </div>
                    <p className="text-2xl font-black text-foreground">{stationData.spent}</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Form Completion Donut Chart */}
                <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border card-glow p-6">
                    <h3 className="text-xl font-black text-foreground mb-6">Form Completion Status</h3>
                    <div className="flex items-center justify-center">
                        <div className="relative w-64 h-64">
                            {/* SVG Donut Chart */}
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                {/* Background circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="hsl(var(--muted))"
                                    strokeWidth="12"
                                />
                                {/* Completed segment */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="url(#gradient1)"
                                    strokeWidth="12"
                                    strokeDasharray={`${(stationData.formsCompleted / stationData.totalForms) * 251.2} 251.2`}
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                                        <stop offset="100%" stopColor="hsl(var(--secondary))" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-4xl font-black text-foreground">{stationData.formsCompleted}/{stationData.totalForms}</p>
                                <p className="text-sm font-semibold text-muted-foreground">Forms Complete</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full gradient-primary"></div>
                            <span className="text-sm font-medium text-foreground">Completed: {stationData.formsCompleted}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-muted"></div>
                            <span className="text-sm font-medium text-foreground">Remaining: {stationData.totalForms - stationData.formsCompleted}</span>
                        </div>
                    </div>
                </div>

                {/* Budget Progress Chart */}
                <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border card-glow p-6">
                    <h3 className="text-xl font-black text-foreground mb-6">Budget Utilization</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-semibold text-muted-foreground">Total Budget</span>
                                <span className="text-sm font-bold text-foreground">{stationData.budget}</span>
                            </div>
                            <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full gradient-primary rounded-full transition-all duration-500"
                                    style={{ width: '72%' }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-xs font-medium text-muted-foreground">Spent: {stationData.spent}</span>
                                <span className="text-xs font-medium text-muted-foreground">72% Used</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                            <div className="bg-primary/10 rounded-xl p-4">
                                <p className="text-xs font-semibold text-primary mb-1">Allocated</p>
                                <p className="text-2xl font-black text-primary">{stationData.budget}</p>
                            </div>
                            <div className="bg-secondary/10 rounded-xl p-4">
                                <p className="text-xs font-semibold text-secondary mb-1">Remaining</p>
                                <p className="text-2xl font-black text-secondary">0.7M SAR</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Progress */}
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border card-glow p-6 mb-8">
                <h3 className="text-xl font-black text-foreground mb-6">Project Timeline</h3>
                <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-muted"></div>
                    <div className="absolute left-0 top-0 w-1 bg-gradient-to-b from-primary to-secondary" style={{ height: '75%' }}></div>

                    <div className="space-y-6 pl-8">
                        <div className="relative">
                            <div className="absolute -left-[33px] w-3 h-3 rounded-full bg-primary border-4 border-background shadow-lg"></div>
                            <div className="bg-primary/10 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    <p className="font-bold text-primary">Planning Phase</p>
                                </div>
                                <p className="text-sm text-muted-foreground">Completed on Jan 15, 2026</p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[33px] w-3 h-3 rounded-full bg-secondary border-4 border-background shadow-lg"></div>
                            <div className="bg-secondary/10 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="w-4 h-4 text-secondary" />
                                    <p className="font-bold text-secondary">Construction Phase</p>
                                </div>
                                <p className="text-sm text-muted-foreground">In Progress - 75% Complete</p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[33px] w-3 h-3 rounded-full bg-muted border-4 border-background shadow-lg"></div>
                            <div className="bg-muted rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="w-4 h-4 text-muted-foreground" />
                                    <p className="font-bold text-muted-foreground">Final Inspection</p>
                                </div>
                                <p className="text-sm text-muted-foreground">Scheduled for Mar 1, 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* License Status Grid */}
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border card-glow p-6">
                <h3 className="text-xl font-black text-foreground mb-6">License & Permit Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { name: "Commercial License", status: "Active", color: "green" },
                        { name: "Building Permit", status: "Active", color: "green" },
                        { name: "Salamah License", status: "Pending", color: "yellow" },
                        { name: "Environmental License", status: "Active", color: "green" },
                        { name: "Energy License", status: "Active", color: "green" },
                        { name: "Taqyees License", status: "Pending", color: "yellow" },
                    ].map((license) => (
                        <div key={license.name} className="flex items-center justify-between p-4 bg-background rounded-xl border border-border">
                            <span className="text-sm font-semibold text-foreground">{license.name}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${license.color === "green"
                                ? "bg-success/10 text-success"
                                : "bg-warning/10 text-warning"
                                }`}>
                                {license.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
