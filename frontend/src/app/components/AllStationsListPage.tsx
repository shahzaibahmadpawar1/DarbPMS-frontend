import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
    Activity,
    ChevronDown,
    ChevronRight,
    Search,
    Trash2,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "@/context/AuthContext";
import { isStationTypeFilterValue, STATION_TYPE_QUERY_KEY } from "../constants/stationTypeFilter";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const STATIONS_PAGE_SIZE = 200;
const PROJECTS_PAGE_SIZE = 200;
const TASKS_PAGE_SIZE = 200;
const ACTIVE_BRANCH_STATUSES = new Set([
    'manager_queue',
    'assigned',
    'employee_submitted',
    'manager_submitted',
    'under_super_admin_review',
] as const);

type InvestmentProjectVisibility = {
    id: string;
    project_code: string | null;
    station_code: string | null;
    workflow_path: string | null;
    review_status: string | null;
};

type WorkflowTaskVisibility = {
    investment_project_id: string | null;
    flow_type: string | null;
    status: string | null;
};

const fetchAllInvestmentProjectsForVisibility = async (token: string): Promise<InvestmentProjectVisibility[]> => {
    const allProjects: InvestmentProjectVisibility[] = [];
    let offset = 0;

    while (true) {
        const params = new URLSearchParams({
            limit: String(PROJECTS_PAGE_SIZE),
            offset: String(offset),
        });
        const response = await fetch(`${API_BASE_URL}/investment-projects?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(response.statusText || 'Failed to fetch projects');
        }

        const result = await response.json();
        const pageItems = Array.isArray(result?.data) ? (result.data as InvestmentProjectVisibility[]) : [];
        allProjects.push(...pageItems);

        if (pageItems.length < PROJECTS_PAGE_SIZE) {
            break;
        }

        offset += PROJECTS_PAGE_SIZE;
    }

    return allProjects;
};

const fetchAllWorkflowTasksForVisibility = async (token: string): Promise<WorkflowTaskVisibility[]> => {
    const allTasks: WorkflowTaskVisibility[] = [];
    let offset = 0;

    while (true) {
        const response = await fetch(`${API_BASE_URL}/tasks?limit=${TASKS_PAGE_SIZE}&offset=${offset}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(response.statusText || 'Failed to fetch workflow tasks');
        }

        const result = await response.json();
        const pageItems = Array.isArray(result?.data) ? (result.data as WorkflowTaskVisibility[]) : [];
        allTasks.push(...pageItems);

        if (pageItems.length < TASKS_PAGE_SIZE) {
            break;
        }

        offset += TASKS_PAGE_SIZE;
    }

    return allTasks;
};

const computeHiddenStationCodes = (
    projects: InvestmentProjectVisibility[],
    tasks: WorkflowTaskVisibility[],
): Set<string> => {
    const hidden = new Set<string>();
    const projectJoinCodeById = new Map<string, string>();

    for (const project of projects) {
        const workflowPath = String(project.workflow_path || '').trim().toLowerCase();
        const joinCode = String(project.station_code || project.project_code || '').trim();
        if (joinCode) {
            projectJoinCodeById.set(project.id, joinCode);
        }

        // Hide if explicitly routed to contract/doc and not yet approved.
        if (workflowPath === 'contract' || workflowPath === 'documents') {
            const reviewStatus = String(project.review_status || '').trim();
            if (reviewStatus !== 'Approved' && joinCode) {
                hidden.add(joinCode);
            }
        }
    }

    // Also hide if any active contract/doc workflow task exists.
    for (const task of tasks) {
        const projectId = String(task.investment_project_id || '').trim();
        if (!projectId) continue;

        const flowType = String(task.flow_type || '').trim().toLowerCase();
        if (!(flowType === 'contract' || flowType === 'documents')) continue;

        const status = String(task.status || '').trim();
        if (!ACTIVE_BRANCH_STATUSES.has(status as any)) continue;

        const joinCode = projectJoinCodeById.get(projectId);
        if (joinCode) hidden.add(joinCode);
    }

    return hidden;
};

const bucketLabels: Record<string, string> = {
    'total-stations': 'Total Stations',
    'under-execution': 'Under Execution',
    'not-started': 'Not Started',
    'operational-stations': 'Operational Stations',
    'opening-soon': 'Opening Soon',
    'new-stations': 'New Stations During the Month',
    'total-projects': 'Total Projects',
    'pending-review': 'Pending Review',
    'validated': 'Validated',
    'approved': 'Approved',
    'new-projects': 'New Projects',
    'contracted': 'Contracted',
    'documented': 'Documented',
    'rejected': 'Rejected',
};

const getStatusBadgeClass = (status: string) => {
    const value = String(status || '').toLowerCase();
    if (value.includes('active') || value.includes('approved')) return 'bg-success/10 text-success border-success/20';
    if (value.includes('pending') || value.includes('review')) return 'bg-warning/10 text-warning border-warning/20';
    if (value.includes('validated')) return 'bg-info/10 text-info border-info/20';
    return 'bg-muted text-muted-foreground border-border';
};

export function AllStationsListPage() {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [searchParams] = useSearchParams();
    const activeBucket = searchParams.get('bucket') || '';
    const stationTypeParam = searchParams.get(STATION_TYPE_QUERY_KEY);
    const selectedStationType = isStationTypeFilterValue(stationTypeParam) ? stationTypeParam : '';
    const bucketLabel = activeBucket ? bucketLabels[activeBucket] || 'Station Drilldown' : '';
    const [stations, setStations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState("");
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
    const [deleting, setDeleting] = useState(false);

    const canDeleteStation = user?.role === 'super_admin' || user?.role === 'department_manager';

    useEffect(() => {
        fetchStations();
    }, [activeBucket, selectedStationType]);

    const fetchStations = async () => {
        const token = localStorage.getItem('auth_token');
        if (!token) {
            console.warn("No auth token found, redirecting to login...");
            setLoading(false);
            return;
        }

        try {
            const [projects, tasks] = await Promise.all([
                fetchAllInvestmentProjectsForVisibility(token),
                fetchAllWorkflowTasksForVisibility(token),
            ]);
            const hiddenStationCodes = computeHiddenStationCodes(projects, tasks);

            if (activeBucket) {
                const bucketParams = new URLSearchParams({ bucket: activeBucket });
                if (selectedStationType) {
                    bucketParams.set(STATION_TYPE_QUERY_KEY, selectedStationType);
                }
                const endpoint = `${API_BASE_URL}/dashboard/stations?${bucketParams.toString()}`;
                const response = await fetch(endpoint, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(response.statusText || 'Failed to fetch bucket stations');
                }

                const result = await response.json();
                const mappedStations = (result.data || [])
                    .filter((s: any) => !s?.review_status || String(s.review_status).trim() === 'Approved')
                    .filter((s: any) => !hiddenStationCodes.has(String(s?.station_code || s?.stationCode || s?.display_code || '').trim()))
                    .map((s: any) => ({
                    id: s.id || s.station_code,
                    station_code: s.station_code,
                    name: s.station_name,
                    city: s.city || "N/A",
                    stationType: s.station_type_code || "N/A",
                    status: s.station_status_code || "Active",
                    raw: s,
                }));
                setStations(mappedStations);
            }

            if (!activeBucket) {
                const allStations: any[] = [];
                let offset = 0;

                while (true) {
                    const allStationsParams = new URLSearchParams({
                        limit: String(STATIONS_PAGE_SIZE),
                        offset: String(offset),
                    });
                    if (selectedStationType) {
                        allStationsParams.set('type', selectedStationType);
                    }
                    const response = await fetch(`${API_BASE_URL}/stations?${allStationsParams.toString()}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });

                    if (!response.ok) {
                        throw new Error(response.statusText || 'Failed to fetch stations');
                    }

                    const result = await response.json();
                    const pageItems = Array.isArray(result?.data) ? result.data : [];
                    allStations.push(...pageItems);

                    if (pageItems.length < STATIONS_PAGE_SIZE) {
                        break;
                    }

                    offset += STATIONS_PAGE_SIZE;
                }

                const mappedStations = allStations
                    .filter((s: any) => !s?.review_status || String(s.review_status).trim() === 'Approved')
                    .filter((s: any) => !hiddenStationCodes.has(String(s?.station_code || '').trim()))
                    .map((s: any) => ({
                    id: s.id,
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

    const openStation = (stationId: string) => {
        navigate(`/station/${stationId}`);
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

    const filteredBucketStations = stations.filter((station) => {
        const combined = [station.name, station.station_code, station.city, station.stationType, station.status]
            .filter(Boolean)
            .join(' ')
            .toLowerCase();
        return combined.includes(searchQuery.toLowerCase());
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

    if (activeBucket) {
        return (
            <div className="max-w-7xl mx-auto">
                <div className="mb-4 sm:mb-6 md:mb-8 flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mb-2 tracking-tight">{bucketLabel}</h1>
                        <p className="text-sm sm:text-base text-muted-foreground font-medium">Stations matching the selected dashboard bucket</p>
                    </div>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 rounded-lg border border-border text-sm font-semibold hover:bg-muted transition-colors"
                    >
                        Back
                    </button>
                </div>

                <div className="mb-4 sm:mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search stations..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border border-border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background shadow-sm"
                        />
                    </div>
                </div>

                <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-muted border-b border-border">
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Station Name</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Station Code</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">City</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Station Type</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Station Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredBucketStations.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground">
                                            No stations found for this bucket.
                                        </td>
                                    </tr>
                                ) : filteredBucketStations.map((station) => (
                                    <tr
                                        key={station.id}
                                        className="hover:bg-muted/50 transition-colors cursor-pointer"
                                        onClick={() => openStation(station.id)}
                                    >
                                        <td className="px-6 py-4 font-semibold text-foreground">{station.name}</td>
                                        <td className="px-6 py-4 font-mono text-sm text-muted-foreground uppercase">{station.station_code}</td>
                                        <td className="px-6 py-4 text-foreground">{station.city}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{station.stationType}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeClass(station.status)}`}>
                                                {station.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openStation(station.id);
                                                }}
                                            >
                                                Details
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
                                onClick={() => openStation(station.id)}
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
                                        {canDeleteStation && (
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ id: station.id, name: station.name }); }}
                                                className="p-1.5 sm:p-2 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-lg transition-colors flex-shrink-0"
                                                title="Delete station"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            className="p-1.5 sm:p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                                            aria-label="Open station"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openStation(station.id);
                                            }}
                                        >
                                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                        </button>
                                    </div>
                                </div>
                            </div>
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