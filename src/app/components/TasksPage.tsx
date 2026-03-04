import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
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
    const { token } = useAuth();
    const [selectedFilter, setSelectedFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

    const statusFromReview = (reviewStatus: string): Task['status'] => {
        switch (reviewStatus) {
            case 'Pending Review': return 'pending';
            case 'Validated': return 'in_progress';
            case 'Approved': return 'completed';
            case 'Rejected': return 'rejected';
            default: return 'pending';
        }
    };

    const titleFromProject = (project: any): string => {
        switch (project.review_status) {
            case 'Pending Review': return `New Project Submitted - ${project.project_name}`;
            case 'Validated': return `Project Validated - Awaiting CEO Approval (${project.project_name})`;
            case 'Approved': return `Project Approved - Station Created (${project.project_name})`;
            case 'Rejected': return `Project Rejected - ${project.project_name}`;
            default: return project.project_name;
        }
    };

    const descriptionFromProject = (project: any): string => {
        const dept = project.department_type === 'franchise' ? 'Franchise' : 'Investment';
        switch (project.review_status) {
            case 'Pending Review': return `${dept} project "${project.project_name}" (${project.project_code}) submitted and pending PM validation. City: ${project.city || 'N/A'}.`;
            case 'Validated': return `${dept} project "${project.project_name}" has been validated by the Project Manager and is waiting for CEO approval.`;
            case 'Approved': return `${dept} project "${project.project_name}" has been approved by the CEO. Station has been automatically created.`;
            case 'Rejected': return `${dept} project "${project.project_name}" was rejected. Check comments for details.`;
            default: return project.project_name;
        }
    };

    useEffect(() => {
        if (!token) return;
        const fetchTasks = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/tasks`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (response.ok) {
                    const result = await response.json();
                    const mappedTasks: Task[] = (result.data || []).map((project: any) => ({
                        id: project.id,
                        title: titleFromProject(project),
                        description: descriptionFromProject(project),
                        type: project.department_type === 'franchise' ? 'investment' : 'investment',
                        status: statusFromReview(project.review_status),
                        priority: project.priority_level?.toLowerCase() === 'high' ? 'high'
                            : project.priority_level?.toLowerCase() === 'medium' ? 'medium'
                                : project.priority_level?.toLowerCase() === 'urgent' ? 'urgent' : 'low',
                        station: project.city || 'N/A',
                        assignedTo: project.owner_name || 'Unassigned',
                        createdBy: project.request_sender || 'System',
                        createdDate: project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A',
                        dueDate: project.order_date ? new Date(project.order_date).toLocaleDateString() : 'N/A',
                    }));
                    setTasks(mappedTasks);
                } else {
                    console.error('Failed to fetch tasks:', response.statusText);
                }
            } catch (err) {
                console.error('Error fetching tasks:', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, [token]);

    const taskTypes = [
        { value: "all", label: "All Types", icon: FileText, color: "text-muted-foreground" },
        { value: "procurement", label: "Procurement", icon: Package, color: "text-info" },
        { value: "ceo_complaint", label: "CEO Complaints", icon: MessageSquare, color: "text-error" },
        { value: "maintenance", label: "Maintenance", icon: Wrench, color: "text-primary" },
        { value: "legal", label: "Legal", icon: FileText, color: "text-primary" },
        { value: "investment", label: "Investment", icon: Building2, color: "text-success" },
    ];

    const statusOptions = [
        { value: "all", label: "All Status", color: "bg-muted text-muted-foreground" },
        { value: "pending", label: "Pending", color: "bg-warning/10 text-warning" },
        { value: "in_progress", label: "In Progress", color: "bg-info/10 text-info" },
        { value: "completed", label: "Completed", color: "bg-success/10 text-success" },
        { value: "rejected", label: "Rejected", color: "bg-error/10 text-error" },
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
                return "bg-warning/10 text-warning border-warning/20";
            case "in_progress":
                return "bg-info/10 text-info border-info/20";
            case "completed":
                return "bg-success/10 text-success border-success/20";
            case "rejected":
                return "bg-error/10 text-error border-error/20";
            default:
                return "bg-muted text-muted-foreground border-border";
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "urgent":
                return "bg-error text-error-foreground";
            case "high":
                return "bg-primary text-primary-foreground";
            case "medium":
                return "bg-warning text-warning-foreground";
            case "low":
                return "bg-success text-success-foreground";
            default:
                return "bg-muted text-muted-foreground";
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

            {isLoading ? (
                <div className="flex items-center justify-center p-20">
                    <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
            ) : (<>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-card/80 backdrop-blur-xl rounded-xl shadow-md border border-border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground">Total Tasks</p>
                            <p className="text-3xl font-black text-foreground mt-1">{stats.total}</p>
                        </div>
                        <FileText className="w-10 h-10 text-primary" />
                    </div>
                </div>

                <div className="bg-card/80 backdrop-blur-xl rounded-xl shadow-md border border-border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground">Pending</p>
                            <p className="text-3xl font-black text-warning mt-1">{stats.pending}</p>
                        </div>
                        <Clock className="w-10 h-10 text-warning" />
                    </div>
                </div>

                <div className="bg-card/80 backdrop-blur-xl rounded-xl shadow-md border border-border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground">In Progress</p>
                            <p className="text-3xl font-black text-info mt-1">{stats.inProgress}</p>
                        </div>
                        <AlertCircle className="w-10 h-10 text-info" />
                    </div>
                </div>

                <div className="bg-card/80 backdrop-blur-xl rounded-xl shadow-md border border-border p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-semibold text-muted-foreground">Completed</p>
                            <p className="text-3xl font-black text-success mt-1">{stats.completed}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-success" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border card-glow p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <Filter className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-bold text-foreground">Filters</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                        />
                    </div>

                    {/* Type Filter */}
                    <div className="relative">
                        <select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background appearance-none"
                        >
                            {taskTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background appearance-none"
                        >
                            {statusOptions.map((status) => (
                                <option key={status.value} value={status.value}>
                                    {status.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
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
                            className="bg-card/80 backdrop-blur-xl rounded-xl shadow-md border border-border p-6 hover:shadow-xl transition-all duration-200 card-glow"
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
            </>)}
        </div>
    );
}
