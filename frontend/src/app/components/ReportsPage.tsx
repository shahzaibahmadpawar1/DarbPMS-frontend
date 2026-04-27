import { Link } from "react-router-dom";
import {
    FileText,
    Building2,
    Clock,
    AlertCircle,
    CheckCircle,
    Calendar,
    Users,
    TrendingUp,
    MapPin,
    Filter,
    Download,
} from "lucide-react";

export function ReportsPage() {
    const reportCategories = [
        {
            category: "Station Reports",
            reports: [
                {
                    title: "All Station Details",
                    description: "Complete overview of all stations with their current status and information",
                    icon: <Building2 className="w-5 h-5" />,
                    path: "/reports/all-stations",
                    color: "from-primary to-primary",
                },
                {
                    title: "Under Process Stations",
                    description: "List of stations currently under development or construction",
                    icon: <Clock className="w-5 h-5" />,
                    path: "/reports/under-process",
                    color: "from-info to-muted",
                },
                {
                    title: "Delayed Stations",
                    description: "Stations experiencing delays with timeline analysis",
                    icon: <AlertCircle className="w-5 h-5" />,
                    path: "/reports/delayed-stations",
                    color: "from-error to-primary",
                },
                {
                    title: "Completed Stations",
                    description: "All stations that have been completed and are operational",
                    icon: <CheckCircle className="w-5 h-5" />,
                    path: "/reports/completed-stations",
                    color: "from-success to-success/80",
                },
                {
                    title: "Opening Soon Stations",
                    description: "Stations scheduled to open in the near future",
                    icon: <Calendar className="w-5 h-5" />,
                    path: "/reports/opening-soon",
                    color: "from-primary to-secondary",
                },
            ],
        },
        {
            category: "Owner & Legal Reports",
            reports: [
                {
                    title: "Owner Details",
                    description: "Comprehensive list of all station owners and their contact information",
                    icon: <Users className="w-5 h-5" />,
                    path: "/reports/owner-details",
                    color: "from-primary to-secondary",
                },
                {
                    title: "Contract Status",
                    description: "Overview of all contracts and their current status",
                    icon: <FileText className="w-5 h-5" />,
                    path: "/reports/contract-status",
                    color: "from-secondary to-muted",
                },
                {
                    title: "Deed Information",
                    description: "Complete deed records for all stations",
                    icon: <FileText className="w-5 h-5" />,
                    path: "/reports/deed-information",
                    color: "from-gray-500 to-gray-500",
                },
            ],
        },
        {
            category: "Timeline Reports",
            reports: [
                {
                    title: "Stations Opening by Date Range",
                    description: "Filter stations by opening date (e.g., March 1-31)",
                    icon: <Calendar className="w-5 h-5" />,
                    path: "/reports/opening-by-date",
                    color: "from-primary to-error",
                },
                {
                    title: "Project Timeline",
                    description: "Visual timeline of all projects and their milestones",
                    icon: <TrendingUp className="w-5 h-5" />,
                    path: "/reports/project-timeline",
                    color: "from-primary to-primary/80",
                },
            ],
        },
        {
            category: "License & Compliance Reports",
            reports: [
                {
                    title: "License Status Overview",
                    description: "Status of all licenses (Commercial, Salamah, Environmental, etc.)",
                    icon: <FileText className="w-5 h-5" />,
                    path: "/reports/license-status",
                    color: "from-success to-info",
                },
                {
                    title: "Pending Licenses",
                    description: "All licenses that are pending approval",
                    icon: <Clock className="w-5 h-5" />,
                    path: "/reports/pending-licenses",
                    color: "from-warning to-primary",
                },
                {
                    title: "Expired Licenses",
                    description: "Licenses that have expired and need renewal",
                    icon: <AlertCircle className="w-5 h-5" />,
                    path: "/reports/expired-licenses",
                    color: "from-error to-secondary",
                },
            ],
        },
        {
            category: "Regional Reports",
            reports: [
                {
                    title: "Stations by Region",
                    description: "Breakdown of stations by geographical region",
                    icon: <MapPin className="w-5 h-5" />,
                    path: "/reports/by-region",
                    color: "from-secondary to-primary",
                },
                {
                    title: "Stations by City",
                    description: "Detailed list of stations organized by city",
                    icon: <MapPin className="w-5 h-5" />,
                    path: "/reports/by-city",
                    color: "from-muted to-secondary",
                },
            ],
        },
        {
            category: "Department Reports",
            reports: [
                {
                    title: "Department Status Overview",
                    description: "Status of all departments across all stations",
                    icon: <Building2 className="w-5 h-5" />,
                    path: "/reports/department-status",
                    color: "from-primary to-primary/80",
                },
                {
                    title: "Investment Reports",
                    description: "Financial investment data for all projects",
                    icon: <TrendingUp className="w-5 h-5" />,
                    path: "/reports/investment",
                    color: "from-green-500 to-emerald-500",
                },
            ],
        },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Reports</h1>
                <p className="text-gray-600 font-medium">
                    Comprehensive reports and analytics for all station data
                </p>
            </div>

            {/* Quick Actions */}
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border card-glow p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-muted-foreground">Quick Filters</span>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 gradient-primary text-primary-foreground rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-sm">
                        <Download className="w-4 h-4" />
                        Export All Reports
                    </button>
                </div>
            </div>

            {/* Report Categories */}
            {reportCategories.map((category) => (
                <div key={category.category} className="mb-8">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">
                        {category.category}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {category.reports.map((report) => (
                            <Link
                                key={report.title}
                                to={report.path}
                                className="bg-card/80 backdrop-blur-xl rounded-xl shadow-md border border-border p-6 hover:shadow-xl hover:scale-105 transition-all duration-200 card-glow group"
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`w-12 h-12 bg-gradient-to-br ${report.color} rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                                    >
                                        {report.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                            {report.title}
                                        </h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            {report.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-end">
                                    <span className="text-xs font-semibold text-primary group-hover:text-primary/80">
                                        View Report →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
