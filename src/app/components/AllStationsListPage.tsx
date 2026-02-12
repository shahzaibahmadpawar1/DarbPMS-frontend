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
        customerName: "North Darb Expansion",
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
        customerName: "North Darb Expansion",
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
        customerName: "RML Logistics",
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
        customerName: "Red Sea Development",
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
        group: "Project Survey Report",
        items: [
            { title: "Survey Report", icon: <FileText className="w-4 h-4" />, completed: false },
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
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState("");

    // Get unique values for filters
    const regions = Array.from(new Set(stations.map(s => s.region)));
    const cities = Array.from(new Set(stations.map(s => s.city)));
    const customers = Array.from(new Set(stations.map(s => s.customerName)));

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

    // Filter stations based on search query and dropdowns
    const filteredStations = stations.filter((station) => {
        const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRegion = selectedRegion === "" || station.region === selectedRegion;
        const matchesCity = selectedCity === "" || station.city === selectedCity;
        const matchesCustomer = selectedCustomer === "" || station.customerName === selectedCustomer;
        return matchesSearch && matchesRegion && matchesCity && matchesCustomer;
    });

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-4 sm:mb-6 md:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-2 tracking-tight">All Stations</h1>
                <p className="text-sm sm:text-base text-muted-foreground font-medium">Manage all stations and their associated forms</p>
            </div>

            {/* Search and Filters */}
            <div className="mb-4 sm:mb-6 space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search stations by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background shadow-sm"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Region Filter */}
                    <div className="relative">
                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm border border-border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-background cursor-pointer hover:border-primary transition-colors font-medium text-foreground"
                        >
                            <option value="">All Regions</option>
                            {regions.map((region) => (
                                <option key={region} value={region}>{region}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>

                    {/* City Filter */}
                    <div className="relative">
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm border border-border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-background cursor-pointer hover:border-primary transition-colors font-medium text-foreground"
                        >
                            <option value="">All Cities</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>

                    {/* Customer Filter */}
                    <div className="relative">
                        <select
                            value={selectedCustomer}
                            onChange={(e) => setSelectedCustomer(e.target.value)}
                            className="w-full pl-3 pr-10 py-2 sm:py-2.5 text-xs sm:text-sm border border-border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-background cursor-pointer hover:border-primary transition-colors font-medium text-foreground"
                        >
                            <option value="">All Customers</option>
                            {customers.map((customer) => (
                                <option key={customer} value={customer}>{customer}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {filteredStations.map((station) => {
                    const completionPercentage = Math.round((station.formsCompleted / station.totalForms) * 100);

                    return (
                        <div
                            key={station.id}
                            className="bg-card/80 backdrop-blur-xl rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg border border-border card-glow overflow-hidden"
                        >
                            {/* Station Header */}
                            <div
                                className="p-3 sm:p-4 md:p-6 cursor-pointer hover:bg-primary/5 transition-colors"
                                onClick={() => toggleStation(station.id)}
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                    <div className="flex items-center gap-3 sm:gap-4 flex-1 w-full sm:w-auto">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg p-1.5 flex-shrink-0">
                                            <img src={logo} alt="Darb Logo" className="w-full h-full object-contain" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2 flex-wrap">
                                                <h3 className="text-base sm:text-lg md:text-xl font-bold text-foreground">{station.name}</h3>
                                                <span
                                                    className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-bold border whitespace-nowrap ${getStatusColor(
                                                        station.status
                                                    )}`}
                                                >
                                                    {station.status}
                                                </span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                                                {station.region} • {station.city} • {station.customerName}
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
                                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                                        <Link
                                            to={`/station/${station.id}/analytics`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors font-semibold text-xs sm:text-sm flex-1 sm:flex-none justify-center"
                                        >
                                            <Activity className="w-4 h-4 flex-shrink-0" />
                                            <span className="hidden xs:inline">Analytics</span>
                                        </Link>
                                        <button className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0">
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
                                <div className="border-t border-gray-100 bg-gray-50/50 p-3 sm:p-4 md:p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
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
