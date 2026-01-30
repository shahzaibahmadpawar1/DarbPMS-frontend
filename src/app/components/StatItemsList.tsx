import { ArrowLeft, Search, MoreVertical, FileText, Clock, Activity } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface StatItem {
    id: string;
    name: string;
    category: string;
    status: string;
    date: string;
}

const getItems = (type: string): StatItem[] => {
    switch (type) {
        case "active-licenses":
            return [
                { id: "LIC-001", name: "Fuel Retail License", category: "Commercial", status: "Active", date: "Expires: Dec 2026" },
                { id: "LIC-002", name: "Salamah Safety Certificate", category: "Safety", status: "Active", date: "Expires: Aug 2026" },
                { id: "LIC-003", name: "Environmental Permit", category: "Environment", status: "Active", date: "Expires: Mar 2027" },
                { id: "LIC-004", name: "Municipal Building Permit", category: "Construction", status: "Active", date: "Expires: Jan 2026" },
            ];
        case "pending-permits":
            return [
                { id: "PRM-501", name: "Excavation Permit - East Site", category: "Construction", status: "Under Review", date: "Submitted: 3 days ago" },
                { id: "PRM-502", name: "Signage Authorization", category: "Legal", status: "Awaiting Feedback", date: "Submitted: 1 week ago" },
                { id: "PRM-503", name: "Water Connection Request", category: "Utilities", status: "Processing", date: "Submitted: 10 days ago" },
            ];
        case "active-projects":
            return [
                { id: "PRJ-901", name: "Station 157 Construction", category: "Development", status: "On Track", date: "Deadline: Sept 2026" },
                { id: "PRJ-902", name: "Jeddah Hub Retrofitting", category: "Maintenance", status: "Delayed", date: "Deadline: June 2026" },
                { id: "PRJ-903", name: "New Fueling Tech Launch", category: "Innovation", status: "Planning", date: "Deadline: Dec 2026" },
            ];
        default:
            return [];
    }
};

const getTitle = (type: string) => {
    switch (type) {
        case "active-licenses": return "Active Licenses";
        case "pending-permits": return "Pending Permits";
        case "active-projects": return "Active Projects";
        default: return "Items";
    }
};

const getIcon = (type: string) => {
    switch (type) {
        case "active-licenses": return <FileText className="w-5 h-5 text-[#6366f1]" />;
        case "pending-permits": return <Clock className="w-5 h-5 text-[#6366f1]" />;
        case "active-projects": return <Activity className="w-5 h-5 text-[#6366f1]" />;
        default: return <FileText className="w-5 h-5 text-[#6366f1]" />;
    }
};

export function StatItemsList() {
    const navigate = useNavigate();
    const location = useLocation();
    const type = location.pathname.split("/").pop() || "";
    const items = getItems(type);
    const title = getTitle(type);

    return (
        <div className="p-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-[#020713]">{title}</h1>
                        <p className="text-gray-600">Managing all your {title.toLowerCase()} and their current status</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder={`Search ${title.toLowerCase()}...`}
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#6366f1] min-w-[300px]"
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">ID & Name</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Category</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Timelines</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {items.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-violet-50 rounded-lg">
                                                {getIcon(type)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#020713]">{item.name}</p>
                                                <span className="text-xs text-gray-400 font-medium tracking-wider">{item.id}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">{item.category}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.status === 'Active' || item.status === 'On Track'
                                                ? 'bg-green-100 text-green-700'
                                                : item.status === 'Delayed'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-orange-100 text-indigo-700'
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-500">{item.date}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                                            <MoreVertical className="w-5 h-5" />
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





