import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    ChevronDown,
    ChevronRight,
    FileText,
    Users,
    Scroll,
    Shield,
    Leaf,
    Package,
    Activity,
    Search,
    CheckCircle,
    XCircle,
    Info,
    Camera,
    Fuel,
    Droplet,
    Database,
    Maximize,
    TrendingUp,
    Building2,
    Settings,
    Home,
    ShieldCheck,
    ShoppingBag,
    Scale,
    Target,
    Landmark,
    Monitor,
    Wallet,
    AlertTriangle,
    Briefcase,
    Paperclip,
    Trash2,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const stationSections = [
    {
        group: "STATION ESSENTIALS",
        items: [
            { title: "Station Information", icon: <Info className="w-4 h-4" />, path: "station-information", completed: false },
            { title: "Cameras", icon: <Camera className="w-4 h-4" />, path: "cameras", completed: false },
            { title: "Dispensers", icon: <Fuel className="w-4 h-4" />, path: "dispensers", completed: false },
            { title: "Nozzles", icon: <Droplet className="w-4 h-4" />, path: "nozzles", completed: false },
            { title: "Tanks", icon: <Database className="w-4 h-4" />, path: "tanks", completed: false },
            { title: "Areas", icon: <Maximize className="w-4 h-4" />, path: "areas", completed: false },
        ],
    },
    {
        group: "OWNERSHIP & LEGAL",
        items: [
            { title: "Owner Information", icon: <Users className="w-4 h-4" />, path: "owner-information", completed: true },
            { title: "Deed Information", icon: <Scroll className="w-4 h-4" />, path: "deed-information", completed: true },
            { title: "Building Permit", icon: <FileText className="w-4 h-4" />, path: "building-permit", completed: false },
            { title: "Contract", icon: <FileText className="w-4 h-4" />, path: "contract", completed: false },
            { title: "Commercial License", icon: <FileText className="w-4 h-4" />, path: "commercial-license", completed: true },
        ],
    },
    {
        group: "Government Licenses",
        items: [
            { title: "Salamah License", icon: <Shield className="w-4 h-4" />, path: "salamah-license", completed: false },
            { title: "Taqyees License", icon: <FileText className="w-4 h-4" />, path: "taqyees-license", completed: true },
            { title: "Environmental License", icon: <Leaf className="w-4 h-4" />, path: "environmental-license", completed: true },
            { title: "Attachments", icon: <Paperclip className="w-4 h-4" />, path: "government-license-attachments", completed: false },
        ],
    },
    {
        group: "Project Survey Report",
        items: [
            { title: "Survey Report", icon: <FileText className="w-4 h-4" />, path: "survey-report", completed: false },
        ],
    },
    {
        group: "DEPARTMENTS",
        items: [
            { title: "Investment Department", icon: <TrendingUp className="w-4 h-4" />, path: "investment-department", completed: true },
            { title: "Franchise Department", icon: <Briefcase className="w-4 h-4" />, path: "franchise-department", completed: true },
            { title: "Projects Department", icon: <Building2 className="w-4 h-4" />, path: "project-department", completed: true },
            { title: "Operations Department", icon: <Settings className="w-4 h-4" />, path: "operations-management", completed: false },
            { title: "Property Department", icon: <Home className="w-4 h-4" />, path: "property-department", completed: false },
            { title: "Maintenance & Quality Department", icon: <ShieldCheck className="w-4 h-4" />, path: "quality-department", completed: true },
            { title: "Purchase Department", icon: <ShoppingBag className="w-4 h-4" />, path: "purchase-department", completed: true },
            { title: "Legal Department", icon: <Scale className="w-4 h-4" />, path: "legal-department", completed: true },
            { title: "Marketing Department", icon: <Target className="w-4 h-4" />, path: "marketing-department", completed: false },
            { title: "Government Relations Department", icon: <Landmark className="w-4 h-4" />, path: "government-relations-department", completed: true },
            { title: "IT Department", icon: <Monitor className="w-4 h-4" />, path: "it-department", completed: true },
            { title: "Human Resource Department", icon: <Users className="w-4 h-4" />, path: "human-resource", completed: false },
            { title: "Finance Department", icon: <Wallet className="w-4 h-4" />, path: "finance-department", completed: true },
            { title: "Safety & HSE Department", icon: <AlertTriangle className="w-4 h-4" />, path: "safety", completed: true },
            { title: "Certificates", icon: <FileText className="w-4 h-4" />, path: "certificates", completed: false },
        ],
    },
    {
        group: "Assets",
        items: [
            { title: "Fixed Assets", icon: <Package className="w-4 h-4" />, path: "fixed-assets", completed: true },
        ],
    },
];

export function AllStationsListPage() {
    const { user, token } = useAuth();
    const [stations, setStations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedStations, setExpandedStations] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
    const [deleting, setDeleting] = useState(false);

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchStations();
    }, []);

    const fetchStations = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.warn("No auth token found, redirecting to login...");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/stations`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const result = await response.json();
                // Map backend data to frontend model
                const mappedStations = result.data.map((s: any) => ({
                    id: s.id, // Use actual ID
                    station_code: s.station_code,
                    name: s.station_name,
                    region: s.area_region || "N/A",
                    city: s.city || "N/A",
                    project: s.district || "N/A",
                    customerName: s.street || "N/A",
                    status: s.station_status_code || "Active",
                    formsCompleted: 1,
                    totalForms: 16,
                    raw: s
                }));
                setStations(mappedStations);
            } else if (response.status === 401 || response.status === 403) {
                console.error("Authentication failed. Please log in again.");
            } else {
                console.error("Failed to fetch stations:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching stations:", error);
        } finally {
            setLoading(false);
        }
    };

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

    const handleDelete = async (stationId: string) => {
        if (!token) return;
        setDeleting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/stations/${stationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                setStations(prev => prev.filter(s => s.id !== stationId));
                setDeleteConfirm(null);
            } else {
                const err = await response.json();
                alert(`Failed to delete station: ${err.error || response.statusText}`);
            }
        } catch (error) {
            console.error('Error deleting station:', error);
            alert('Failed to delete station');
        } finally {
            setDeleting(false);
        }
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground font-medium">Loading stations...</p>
                </div>
            </div>
        );
    }

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
                                        {isAdmin && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ id: station.id, name: station.name }); }}
                                                className="p-1.5 sm:p-2 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-lg transition-colors flex-shrink-0"
                                                title="Delete station"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
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
                                                        to={`/station/${station.id}/form/${item.path}`}
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

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-card rounded-2xl shadow-2xl border border-border p-6 max-w-sm w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <Trash2 className="w-5 h-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-bold text-foreground">Delete Station</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-6">
                            Are you sure you want to delete <strong className="text-foreground">{deleteConfirm.name}</strong>? This action cannot be undone and will remove all associated data.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                disabled={deleting}
                                className="px-4 py-2 text-sm font-semibold border border-border rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirm.id)}
                                disabled={deleting}
                                className="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {deleting ? (
                                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Deleting...</>
                                ) : (
                                    <><Trash2 className="w-4 h-4" /> Delete</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
