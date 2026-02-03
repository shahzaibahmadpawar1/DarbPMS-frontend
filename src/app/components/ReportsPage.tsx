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
                    color: "from-violet-500 to-purple-500",
                },
                {
                    title: "Under Process Stations",
                    description: "List of stations currently under development or construction",
                    icon: <Clock className="w-5 h-5" />,
                    path: "/reports/under-process",
                    color: "from-blue-500 to-cyan-500",
                },
                {
                    title: "Delayed Stations",
                    description: "Stations experiencing delays with timeline analysis",
                    icon: <AlertCircle className="w-5 h-5" />,
                    path: "/reports/delayed-stations",
                    color: "from-red-500 to-orange-500",
                },
                {
                    title: "Completed Stations",
                    description: "All stations that have been completed and are operational",
                    icon: <CheckCircle className="w-5 h-5" />,
                    path: "/reports/completed-stations",
                    color: "from-green-500 to-emerald-500",
                },
                {
                    title: "Opening Soon Stations",
                    description: "Stations scheduled to open in the near future",
                    icon: <Calendar className="w-5 h-5" />,
                    path: "/reports/opening-soon",
                    color: "from-purple-500 to-pink-500",
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
                    color: "from-indigo-500 to-blue-500",
                },
                {
                    title: "Contract Status",
                    description: "Overview of all contracts and their current status",
                    icon: <FileText className="w-5 h-5" />,
                    path: "/reports/contract-status",
                    color: "from-teal-500 to-cyan-500",
                },
                {
                    title: "Deed Information",
                    description: "Complete deed records for all stations",
                    icon: <FileText className="w-5 h-5" />,
                    path: "/reports/deed-information",
                    color: "from-cyan-500 to-blue-500",
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
                    color: "from-orange-500 to-red-500",
                },
                {
                    title: "Project Timeline",
                    description: "Visual timeline of all projects and their milestones",
                    icon: <TrendingUp className="w-5 h-5" />,
                    path: "/reports/project-timeline",
                    color: "from-violet-500 to-indigo-500",
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
                    color: "from-green-500 to-teal-500",
                },
                {
                    title: "Pending Licenses",
                    description: "All licenses that are pending approval",
                    icon: <Clock className="w-5 h-5" />,
                    path: "/reports/pending-licenses",
                    color: "from-yellow-500 to-orange-500",
                },
                {
                    title: "Expired Licenses",
                    description: "Licenses that have expired and need renewal",
                    icon: <AlertCircle className="w-5 h-5" />,
                    path: "/reports/expired-licenses",
                    color: "from-red-500 to-pink-500",
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
                    color: "from-blue-500 to-purple-500",
                },
                {
                    title: "Stations by City",
                    description: "Detailed list of stations organized by city",
                    icon: <MapPin className="w-5 h-5" />,
                    path: "/reports/by-city",
                    color: "from-cyan-500 to-teal-500",
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
                    color: "from-purple-500 to-violet-500",
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
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Filter className="w-5 h-5 text-violet-600" />
                        <span className="font-semibold text-gray-700">Quick Filters</span>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold text-sm">
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
                                className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/40 p-6 hover:shadow-xl hover:scale-105 transition-all duration-200 vibrant-glow group"
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`w-12 h-12 bg-gradient-to-br ${report.color} rounded-lg flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}
                                    >
                                        {report.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-violet-600 transition-colors">
                                            {report.title}
                                        </h3>
                                        <p className="text-xs text-gray-600 leading-relaxed">
                                            {report.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-end">
                                    <span className="text-xs font-semibold text-violet-600 group-hover:text-violet-700">
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
