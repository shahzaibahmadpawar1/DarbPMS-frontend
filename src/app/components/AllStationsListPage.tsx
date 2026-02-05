import { useState } from "react";
import { Link } from "react-router-dom";
import {
    ChevronDown,
    ChevronRight,
    FileText,
    Users,
    Scroll,
    Shield,
    Leaf,
    Zap,
    Package,
    Activity,
    Search,
    CheckCircle,
    XCircle,
    Info,
} from "lucide-react";
import logo from "../../assets/logo.png";

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
            { title: "Station Information", icon: <Info className="w-4 h-4" />, completed: true },
            { title: "Station Type", icon: <FileText className="w-4 h-4" />, completed: true },
            { title: "Station Status", icon: <FileText className="w-4 h-4" />, completed: false },
        ],
    },
    {
        group: "Ownership & Legal",
        items: [
            { title: "Owner Information", icon: <Users className="w-4 h-4" />, completed: true },
            { title: "Deed Information", icon: <Scroll className="w-4 h-4" />, completed: true },
            { title: "Contract", icon: <FileText className="w-4 h-4" />, completed: false },
        ],
    },
    {
        group: "Government Licenses",
        items: [
            { title: "Commercial License", icon: <FileText className="w-4 h-4" />, completed: true },
            { title: "Salamah License", icon: <Shield className="w-4 h-4" />, completed: false },
            { title: "Taqyees License", icon: <FileText className="w-4 h-4" />, completed: true },
            { title: "Environmental License", icon: <Leaf className="w-4 h-4" />, completed: true },
            { title: "Energy License", icon: <Zap className="w-4 h-4" />, completed: false },
        ],
    },
    {
        group: "Departments",
        items: [
            { title: "Investment", icon: <FileText className="w-4 h-4" />, completed: true },
            { title: "Projects", icon: <FileText className="w-4 h-4" />, completed: true },
            { title: "Operations Management", icon: <FileText className="w-4 h-4" />, completed: false },
            { title: "Franchise Management", icon: <FileText className="w-4 h-4" />, completed: true },
            { title: "Property Management", icon: <FileText className="w-4 h-4" />, completed: false },
            { title: "Quality Management", icon: <FileText className="w-4 h-4" />, completed: true },
            { title: "Procurement Department", icon: <FileText className="w-4 h-4" />, completed: true },
            { title: "Maintenance Department", icon: <FileText className="w-4 h-4" />, completed: false },
            { title: "Legal Department", icon: <FileText className="w-4 h-4" />, completed: true },
            { title: "Marketing Department", icon: <FileText className="w-4 h-4" />, completed: false },
            { title: "Government Relations Department", icon: <FileText className="w-4 h-4" />, completed: true },
            { title: "IT Management", icon: <FileText className="w-4 h-4" />, completed: true },
            { title: "Human Resource", icon: <FileText className="w-4 h-4" />, completed: false },
            { title: "Finance", icon: <FileText className="w-4 h-4" />, completed: true },
            { title: "Safety", icon: <FileText className="w-4 h-4" />, completed: true },
            { title: "Certificates", icon: <FileText className="w-4 h-4" />, completed: false },
        ],
    },
    {
        group: "Assets",
        items: [
            { title: "Fixed Assets", icon: <Package className="w-4 h-4" />, completed: true },
        ],
    },
];

export function AllStationsListPage() {
    const [expandedStations, setExpandedStations] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");

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
                return "bg-success/10 text-success border-success/20";
            case "Under Construction":
                return "bg-warning/10 text-warning border-warning/20";
            case "Planning":
                return "bg-info/10 text-info border-info/20";
            default:
                return "bg-muted text-muted-foreground border-border";
        }
    };

    // Filter stations based on search query
    const filteredStations = stations.filter((station) =>
        station.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-4xl font-black text-foreground mb-2 tracking-tight">All Stations</h1>
                <p className="text-muted-foreground font-medium">Manage all stations and their associated forms</p>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search stations by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background shadow-sm"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredStations.map((station) => {
                    const completionPercentage = Math.round((station.formsCompleted / station.totalForms) * 100);

                    return (
                        <div
                            key={station.id}
                            className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border card-glow overflow-hidden"
                        >
                            {/* Station Header */}
                            <div
                                className="p-6 cursor-pointer hover:bg-primary/5 transition-colors"
                                onClick={() => toggleStation(station.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg p-1.5">
                                            <img src={logo} alt="Darb Logo" className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h3 className="text-xl font-bold text-foreground">{station.name}</h3>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
                                                        station.status
                                                    )}`}
                                                >
                                                    {station.status}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {station.region} • {station.city} • {station.project}
                                            </p>

                                            {/* Progress Bar */}
                                            <div className="max-w-md">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-xs font-semibold text-muted-foreground">Form Completion</span>
                                                    <span className="text-xs font-bold text-primary">
                                                        {station.formsCompleted}/{station.totalForms} ({completionPercentage}%)
                                                    </span>
                                                </div>
                                                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full gradient-primary rounded-full transition-all duration-500"
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
                                            className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-semibold text-sm"
                                        >
                                            <Activity className="w-4 h-4" />
                                            Analytics
                                        </Link>
                                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                                            {expandedStations.includes(station.id) ? (
                                                <ChevronDown className="w-5 h-5 text-muted-foreground" />
                                            ) : (
                                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
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
                                                        className={`flex items-center justify-between gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium border group ${item.completed
                                                            ? 'bg-success/5 text-success border-success/20 hover:bg-success/10 hover:border-success/30'
                                                            : 'bg-error/5 text-error border-error/20 hover:bg-error/10 hover:border-error/30'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            {item.icon}
                                                            <span>{item.title}</span>
                                                        </div>
                                                        {item.completed ? (
                                                            <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                                                        ) : (
                                                            <XCircle className="w-4 h-4 text-error flex-shrink-0" />
                                                        )}
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
