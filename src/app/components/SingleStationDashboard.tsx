import { Link } from "react-router-dom";
import { useStation } from "../context/StationContext";
import {
    FileText,
    Users,
    Scroll,
    Shield,
    Leaf,
    Zap,
    Package,
    TrendingUp,
    Activity,
    AlertCircle,
    CheckCircle2,
    Info,
    CheckCircle,
    XCircle,
} from "lucide-react";
import logo from "../../assets/logo.png";

export function SingleStationDashboard() {
    const { selectedStation } = useStation();

    // Use selected station or a default for demo purposes
    const station = selectedStation || {
        id: "location-n101",
        name: "Location N101",
        region: "Central Region",
        city: "Riyadh",
        project: "North Darb Expansion"
    };

    // Demo data for the specific station
    const stationData = {
        name: station.name,
        status: "Active",
        region: station.region,
        city: station.city,
        expansion: station.project,
        completion: 73,
        formsCompleted: 11,
        totalForms: 15,
    };

    const formSections = [
        {
            group: "STATION ESSENTIALS",
            items: [
                { title: "Station Information", icon: <Info className="w-4 h-4" />, path: `station-information`, completed: true },
                { title: "Station Type", icon: <FileText className="w-4 h-4" />, path: `station-type`, completed: true },
                { title: "Station Status", icon: <FileText className="w-4 h-4" />, path: `station-status`, completed: false },
            ],
        },
        {
            group: "OWNERSHIP & LEGAL",
            items: [
                { title: "Owner Information", icon: <Users className="w-4 h-4" />, path: `owner-information`, completed: true },
                { title: "Deed Information", icon: <Scroll className="w-4 h-4" />, path: `deed-information`, completed: true },
                { title: "Contract", icon: <FileText className="w-4 h-4" />, path: `contract`, completed: false },
            ],
        },
        {
            group: "GOVERNMENT LICENSES",
            items: [
                { title: "Commercial License", icon: <FileText className="w-4 h-4" />, path: `commercial-license`, completed: true },
                { title: "Salamah License", icon: <Shield className="w-4 h-4" />, path: `salamah-license`, completed: false },
                { title: "Taqyees License", icon: <FileText className="w-4 h-4" />, path: `taqyees-license`, completed: true },
                { title: "Environmental License", icon: <Leaf className="w-4 h-4" />, path: `environmental-license`, completed: true },
                { title: "Energy License", icon: <Zap className="w-4 h-4" />, path: `energy-license`, completed: false },
            ],
        },
        {
            group: "DEPARTMENTS",
            items: [
                { title: "Investment", icon: <FileText className="w-4 h-4" />, path: `investment`, completed: true },
                { title: "Projects", icon: <FileText className="w-4 h-4" />, path: `projects`, completed: true },
                { title: "Operations Management", icon: <FileText className="w-4 h-4" />, path: `operations-management`, completed: false },
                { title: "Franchise Management", icon: <FileText className="w-4 h-4" />, path: `franchise-management`, completed: true },
                { title: "Property Management", icon: <FileText className="w-4 h-4" />, path: `property-management`, completed: false },
                { title: "Quality Management", icon: <FileText className="w-4 h-4" />, path: `quality-management`, completed: true },
                { title: "Procurement Department", icon: <FileText className="w-4 h-4" />, path: `procurement-department`, completed: true },
                { title: "Maintenance Department", icon: <FileText className="w-4 h-4" />, path: `maintenance-department`, completed: false },
                { title: "Legal Department", icon: <FileText className="w-4 h-4" />, path: `legal-department`, completed: true },
                { title: "Marketing Department", icon: <FileText className="w-4 h-4" />, path: `marketing-department`, completed: false },
                { title: "Government Relations Department", icon: <FileText className="w-4 h-4" />, path: `government-relations-department`, completed: true },
                { title: "IT Management", icon: <FileText className="w-4 h-4" />, path: `it-management`, completed: true },
                { title: "Human Resource", icon: <FileText className="w-4 h-4" />, path: `human-resource`, completed: false },
                { title: "Finance", icon: <FileText className="w-4 h-4" />, path: `finance`, completed: true },
                { title: "Safety", icon: <FileText className="w-4 h-4" />, path: `safety`, completed: true },
                { title: "Certificates", icon: <FileText className="w-4 h-4" />, path: `certificates`, completed: false },
            ],
        },
        {
            group: "ASSETS",
            items: [
                { title: "Fixed Assets", icon: <Package className="w-4 h-4" />, path: `fixed-assets`, completed: true },
            ],
        },
    ];

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow p-8 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl p-2">
                        <img src={logo} alt="Darb Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">{stationData.name}</h1>
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                {stationData.status}
                            </span>
                        </div>
                        <p className="text-gray-600 font-medium">
                            {stationData.region} • {stationData.city} • {stationData.expansion}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-600">Form Completion</span>
                        <span className="text-sm font-bold text-violet-600">
                            {stationData.formsCompleted}/{stationData.totalForms} ({stationData.completion}%)
                        </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-violet-600 to-cyan-500 rounded-full transition-all duration-500"
                            style={{ width: `${stationData.completion}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-600">Completed</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900">{stationData.formsCompleted}</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-600">Pending</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900">{stationData.totalForms - stationData.formsCompleted}</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-600">Progress</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900">{stationData.completion}%</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-violet-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-600">Status</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900">{stationData.status}</p>
                </div>
            </div>

            {/* Forms Grid */}
            {formSections.map((section) => (
                <div key={section.group} className="mb-8">
                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">
                        {section.group}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {section.items.map((item) => (
                            <Link
                                key={item.title}
                                to={item.path}
                                className={`rounded-xl shadow-md border p-4 hover:shadow-xl hover:scale-105 transition-all duration-200 vibrant-glow group flex items-center justify-between ${item.completed
                                        ? 'bg-green-50 border-green-200 hover:bg-green-100'
                                        : 'bg-red-50 border-red-200 hover:bg-red-100'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${item.completed
                                            ? 'bg-green-100 group-hover:bg-green-200'
                                            : 'bg-red-100 group-hover:bg-red-200'
                                        }`}>
                                        {item.icon}
                                    </div>
                                    <span className={`text-sm font-semibold transition-colors ${item.completed
                                            ? 'text-green-700 group-hover:text-green-800'
                                            : 'text-red-700 group-hover:text-red-800'
                                        }`}>
                                        {item.title}
                                    </span>
                                </div>
                                {item.completed ? (
                                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                                ) : (
                                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
