import { ArrowLeft, Search, MoreVertical, MapPin, Gauge } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Station {
    id: string;
    name: string;
    location: string;
    completion: number;
    status: string;
    type: string;
}

const stations: Station[] = [
    { id: "ST-001", name: "Darb Al Sultan Station", location: "Riyadh, Saudi Arabia", completion: 85, status: "In Progress", type: "Main Station" },
    { id: "ST-002", name: "Jeddah Central Hub", location: "Jeddah, Saudi Arabia", completion: 45, status: "Early Stage", type: "Distribution Station" },
    { id: "ST-003", name: "Dammam East Point", location: "Dammam, Saudi Arabia", completion: 100, status: "Completed", type: "Satellite Station" },
    { id: "ST-004", name: "Medina Oasis Station", location: "Medina, Saudi Arabia", completion: 15, status: "Planning", type: "Main Station" },
    { id: "ST-005", name: "Abha Mountain View", location: "Abha, Saudi Arabia", completion: 65, status: "In Progress", type: "Regional Station" },
    { id: "ST-006", name: "Khobar Waterfront", location: "Al Khobar, Saudi Arabia", completion: 92, status: "Internal Review", type: "Main Station" },
    { id: "ST-007", name: "Tabuk North Gateway", location: "Tabuk, Saudi Arabia", completion: 30, status: "Permitting", type: "Distribution Station" },
];

export function StationsList() {
    const navigate = useNavigate();

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
                        <h1 className="text-3xl font-bold text-[#020713]">Total Stations</h1>
                        <p className="text-gray-600">List of all fuel stations and their development progress</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search stations..."
                            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#f97316] min-w-[300px]"
                        />
                    </div>
                    <button
                        onClick={() => navigate("/station-information")}
                        className="bg-[#f97316] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#fb923c] transition-colors"
                    >
                        Add New Station
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Station Details</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Type & Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600">Development Progress</th>
                                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stations.map((station) => (
                                <tr key={station.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-violet-50 rounded-lg text-[#f97316]">
                                                <Gauge className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#020713]">{station.name}</p>
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>{station.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <span className="text-sm text-gray-600 block">{station.type}</span>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${station.completion === 100
                                                ? 'bg-green-100 text-green-700'
                                                : station.completion < 30
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : 'bg-orange-100 text-indigo-700'
                                                }`}>
                                                {station.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 min-w-[250px]">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-gray-500 font-medium">Completion Rate</span>
                                                <span className="text-[#020713] font-bold">{station.completion}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[#f97316] to-[#fb923c] transition-all duration-500"
                                                    style={{ width: `${station.completion}%` }}
                                                />
                                            </div>
                                        </div>
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





