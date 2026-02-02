import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Building2,
    ChevronDown,
    ChevronRight,
    FileText,
    Users,
    Scroll,
    Pencil,
    HardHat,
    Shield,
    Leaf,
    Zap,
    Package,
    Activity,
} from "lucide-react";

// Demo stations data
const stations = [
    {
        id: "station-n101",
        name: "Location N101",
        region: "Central Region",
        city: "Riyadh",
        project: "North Darb Expansion",
        status: "Active",
        formsCompleted: 11,
        totalForms: 15,
    },
    {
        id: "station-n102",
        name: "Location N102",
        region: "Central Region",
        city: "Riyadh",
        project: "North Darb Expansion",
        status: "Active",
        formsCompleted: 8,
        totalForms: 15,
    },
    {
        id: "station-rml-01",
        name: "RML-01",
        region: "Central Region",
        city: "Riyadh",
        project: "Riyadh Metro Link",
        status: "Under Construction",
        formsCompleted: 5,
        totalForms: 15,
    },
    {
        id: "station-rsf-1",
        name: "RSF-Location 1",
        region: "Western Region",
        city: "Jeddah",
        project: "Red Sea Front",
        status: "Planning",
        formsCompleted: 3,
        totalForms: 15,
    },
];

const stationSections = [
    {
        group: "Station Essentials",
        items: [
            { title: "Station Information", icon: <Building2 className="w-4 h-4" /> },
            { title: "Station Type", icon: <FileText className="w-4 h-4" /> },
            { title: "Station Status", icon: <FileText className="w-4 h-4" /> },
        ],
    },
    {
        group: "Ownership & Legal",
        items: [
            { title: "Owner Information", icon: <Users className="w-4 h-4" /> },
            { title: "Deed Information", icon: <Scroll className="w-4 h-4" /> },
            { title: "Contract", icon: <FileText className="w-4 h-4" /> },
        ],
    },
    {
        group: "Engineering & Design",
        items: [
            { title: "Consultation Office", icon: <Pencil className="w-4 h-4" /> },
            { title: "Architectural Design", icon: <Pencil className="w-4 h-4" /> },
            { title: "Building Permit", icon: <HardHat className="w-4 h-4" /> },
        ],
    },
    {
        group: "Government Licenses",
        items: [
            { title: "Commercial License", icon: <FileText className="w-4 h-4" /> },
            { title: "Salamah License", icon: <Shield className="w-4 h-4" /> },
            { title: "Taqyees License", icon: <FileText className="w-4 h-4" /> },
            { title: "Environmental License", icon: <Leaf className="w-4 h-4" /> },
            { title: "Energy License", icon: <Zap className="w-4 h-4" /> },
        ],
    },
    {
        group: "Assets",
        items: [
            { title: "Fixed Assets", icon: <Package className="w-4 h-4" /> },
        ],
    },
];

export function AllStationsListPage() {
    const [expandedStations, setExpandedStations] = useState<string[]>([]);

    const toggleStation = (stationId: string) => {
        setExpandedStations((prev) =>
            prev.includes(stationId)
                ? prev.filter((id) => id !== stationId)
                : [...prev, stationId]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Active":
                return "bg-green-100 text-green-700 border-green-200";
            case "Under Construction":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "Planning":
                return "bg-blue-100 text-blue-700 border-blue-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">All Stations</h1>
                <p className="text-gray-600 font-medium">Manage all stations and their associated forms</p>
            </div>

            <div className="space-y-4">
                {stations.map((station) => {
                    const completionPercentage = Math.round((station.formsCompleted / station.totalForms) * 100);

                    return (
                        <div
                            key={station.id}
                            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow overflow-hidden"
                        >
                            {/* Station Header */}
                            <div
                                className="p-6 cursor-pointer hover:bg-violet-50/50 transition-colors"
                                onClick={() => toggleStation(station.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                                            <Building2 className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-gray-900">{station.name}</h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                                                        station.status
                                                    )}`}
                                                >
                                                    {station.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">
                                                {station.region} • {station.city} • {station.project}
                                            </p>

                                            {/* Progress Bar */}
                                            <div className="max-w-md">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-semibold text-gray-600">Form Completion</span>
                                                    <span className="text-xs font-bold text-violet-600">
                                                        {station.formsCompleted}/{station.totalForms} ({completionPercentage}%)
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full transition-all duration-500"
                                                        style={{ width: `${completionPercentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Link
                                            to={`/station/${station.id}/analytics`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-lg hover:bg-violet-200 transition-colors font-semibold text-sm"
                                        >
                                            <Activity className="w-4 h-4" />
                                            Analytics
                                        </Link>
                                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                            {expandedStations.includes(station.id) ? (
                                                <ChevronDown className="w-5 h-5 text-gray-600" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5 text-gray-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Forms Section */}
                            {expandedStations.includes(station.id) && (
                                <div className="border-t border-gray-100 bg-gray-50/50 p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {stationSections.map((section) => (
                                            <div key={section.group} className="space-y-2">
                                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                                                    {section.group}
                                                </h4>
                                                {section.items.map((item) => (
                                                    <Link
                                                        key={item.title}
                                                        to={`/station/${station.id}/form/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                                                        className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg hover:bg-violet-50 hover:text-violet-700 transition-colors text-sm font-medium text-gray-700 border border-gray-100 hover:border-violet-200"
                                                    >
                                                        {item.icon}
                                                        <span>{item.title}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
