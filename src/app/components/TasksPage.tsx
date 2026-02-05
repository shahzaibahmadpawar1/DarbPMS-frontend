import { useState } from "react";
import {
    CheckCircle,
    Clock,
    AlertCircle,
    XCircle,
    Filter,
    Search,
    Calendar,
    User,
    FileText,
    MessageSquare,
    Package,
    Wrench,
    Building2,
    ChevronDown,
} from "lucide-react";

interface Task {
    id: string;
    title: string;
    description: string;
    type: "procurement" | "ceo_complaint" | "maintenance" | "legal" | "investment" | "other";
    status: "pending" | "in_progress" | "completed" | "rejected";
    priority: "low" | "medium" | "high" | "urgent";
    station: string;
    assignedTo: string;
    createdBy: string;
    createdDate: string;
    dueDate: string;
}

export function TasksPage() {
    const [selectedFilter, setSelectedFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");

    // Sample tasks data - replace with actual data from your backend
    const tasks: Task[] = [
        {
            id: "TASK-001",
            title: "Procurement Request - Fuel Pumps",
            description: "Request for 5 new fuel pumps for Location N101",
            type: "procurement",
            status: "pending",
            priority: "high",
            station: "Location N101",
            assignedTo: "Ahmed Hassan",
            createdBy: "Station Manager",
            createdDate: "2024-02-01",
            dueDate: "2024-02-15",
        },
        {
            id: "TASK-002",
            title: "CEO Complaint - Customer Service Issue",
            description: "Customer complaint regarding fuel quality at Jeddah Central Hub",
            type: "ceo_complaint",
            status: "in_progress",
            priority: "urgent",
            station: "Jeddah Central Hub",
            assignedTo: "Sara Ahmed",
            createdBy: "CEO Office",
            createdDate: "2024-02-02",
            dueDate: "2024-02-05",
        },
        {
            id: "TASK-003",
            title: "Maintenance Request - HVAC System",
            description: "HVAC system needs repair at Dammam East Point",
            type: "maintenance",
            status: "completed",
            priority: "medium",
            station: "Dammam East Point",
            assignedTo: "Maintenance Team",
            createdBy: "Operations Manager",
            createdDate: "2024-01-28",
            dueDate: "2024-02-03",
        },
        {
            id: "TASK-004",
            title: "Legal Review - Contract Amendment",
            description: "Review and approve contract amendment for RML-01",
            type: "legal",
            status: "in_progress",
            priority: "high",
            station: "RML-01",
            assignedTo: "Legal Department",
            createdBy: "Property Manager",
            createdDate: "2024-02-03",
            dueDate: "2024-02-10",
        },
        {
            id: "TASK-005",
            title: "Investment Approval - Expansion Project",
            description: "Approval needed for expansion project budget at Location N102",
            type: "investment",
            status: "pending",
            priority: "urgent",
            station: "Location N102",
            assignedTo: "Investment Team",
            createdBy: "Project Manager",
            createdDate: "2024-02-04",
            dueDate: "2024-02-08",
        },
        {
            id: "TASK-006",
            title: "Procurement Request - Safety Equipment",
            description: "Order fire extinguishers and safety gear for all stations",
            type: "procurement",
            status: "in_progress",
            priority: "high",
            station: "All Stations",
            assignedTo: "Procurement Team",
            createdBy: "Safety Officer",
            createdDate: "2024-02-01",
            dueDate: "2024-02-12",
        },
        {
            id: "TASK-007",
            title: "CEO Complaint - Delayed Opening",
            description: "Investigation required for delayed station opening",
            type: "ceo_complaint",
            status: "rejected",
            priority: "medium",
            station: "Medina Oasis Station",
            assignedTo: "Operations Director",
            createdBy: "CEO Office",
            createdDate: "2024-01-25",
            dueDate: "2024-01-30",
        },
        {
            id: "TASK-008",
            title: "Maintenance Request - Lighting System",
            description: "Replace outdoor lighting at Riyadh North Station",
            type: "maintenance",
            status: "pending",
            priority: "low",
            station: "Riyadh North Station",
            assignedTo: "Maintenance Team",
            createdBy: "Station Supervisor",
            createdDate: "2024-02-03",
            dueDate: "2024-02-20",
        },
    ];

    const taskTypes = [
        { value: "all", label: "All Types", icon: FileText, color: "text-gray-600" },
        { value: "procurement", label: "Procurement", icon: Package, color: "text-blue-600" },
        { value: "ceo_complaint", label: "CEO Complaints", icon: MessageSquare, color: "text-red-600" },
        { value: "maintenance", label: "Maintenance", icon: Wrench, color: "text-orange-600" },
        { value: "legal", label: "Legal", icon: FileText, color: "text-orange-600" },
        { value: "investment", label: "Investment", icon: Building2, color: "text-green-600" },
    ];

    const statusOptions = [
        { value: "all", label: "All Status", color: "bg-gray-100 text-gray-700" },
        { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-700" },
        { value: "in_progress", label: "In Progress", color: "bg-blue-100 text-blue-700" },
        { value: "completed", label: "Completed", color: "bg-green-100 text-green-700" },
        { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-700" },
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "pending":
                return <Clock className="w-4 h-4" />;
            case "in_progress":
                return <AlertCircle className="w-4 h-4" />;
            case "completed":
                return <CheckCircle className="w-4 h-4" />;
            case "rejected":
                return <XCircle className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "in_progress":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "completed":
                return "bg-green-100 text-green-700 border-green-200";
            case "rejected":
                return "bg-red-100 text-red-700 border-red-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "urgent":
                return "bg-red-500 text-white";
            case "high":
                return "bg-orange-500 text-white";
            case "medium":
                return "bg-yellow-500 text-white";
            case "low":
                return "bg-green-500 text-white";
            default:
                return "bg-gray-500 text-white";
        }
    };

    const getTypeIcon = (type: string) => {
        const typeConfig = taskTypes.find((t) => t.value === type);
        if (typeConfig) {
            const Icon = typeConfig.icon;
            return <Icon className={`w-5 h-5 ${typeConfig.color}`} />;
        }
        return <FileText className="w-5 h-5 text-gray-600" />;
    };

    // Filter tasks
    const filteredTasks = tasks.filter((task) => {
        const matchesType = selectedFilter === "all" || task.type === selectedFilter;
        const matchesStatus = selectedStatus === "all" || task.status === selectedStatus;
        const matchesSearch =
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.station.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesType && matchesStatus && matchesSearch;
    });

    // Calculate statistics
    const stats = {
        total: tasks.length,
        pending: tasks.filter((t) => t.status === "pending").length,
        inProgress: tasks.filter((t) => t.status === "in_progress").length,
        completed: tasks.filter((t) => t.status === "completed").length,
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Tasks & Requests</h1>
                <p className="text-gray-600 font-medium">
                    Manage all tasks and requests from different departments
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/40 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600">Total Tasks</p>
                            <p className="text-3xl font-black text-gray-900 mt-1">{stats.total}</p>
                        </div>
                        <FileText className="w-10 h-10 text-orange-600" />
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/40 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600">Pending</p>
                            <p className="text-3xl font-black text-yellow-600 mt-1">{stats.pending}</p>
                        </div>
                        <Clock className="w-10 h-10 text-yellow-600" />
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/40 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600">In Progress</p>
                            <p className="text-3xl font-black text-blue-600 mt-1">{stats.inProgress}</p>
                        </div>
                        <AlertCircle className="w-10 h-10 text-blue-600" />
                    </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/40 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-gray-600">Completed</p>
                            <p className="text-3xl font-black text-green-600 mt-1">{stats.completed}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <Filter className="w-5 h-5 text-orange-600" />
                    <h2 className="text-lg font-bold text-gray-900">Filters</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="relative">
                        <select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white appearance-none"
                        >
                            {taskTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white appearance-none"
                        >
                            {statusOptions.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
                {filteredTasks.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No tasks found</h3>
                        <p className="text-gray-600">Try adjusting your filters or search query</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="bg-white/80 backdrop-blur-xl rounded-xl shadow-md border border-white/40 p-6 hover:shadow-xl transition-all duration-200 vibrant-glow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="mt-1">{getTypeIcon(task.type)}</div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(
                                                    task.priority
                                                )}`}
                                            >
                                                {task.priority.toUpperCase()}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mb-3">{task.description}</p>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Building2 className="w-4 h-4" />
                                                <span>{task.station}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <User className="w-4 h-4" />
                                                <span>Assigned to: {task.assignedTo}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                <span>Due: {task.dueDate}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold text-sm ${getStatusColor(
                                        task.status
                                    )}`}
                                >
                                    {getStatusIcon(task.status)}
                                    <span className="capitalize">{task.status.replace("_", " ")}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="text-xs text-gray-500">
                                    Created by {task.createdBy} on {task.createdDate}
                                </div>
                                <div className="text-xs text-gray-500">ID: {task.id}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
