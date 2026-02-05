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
                        className="p-2 hover:bg-muted rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-muted-foreground" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Total Stations</h1>
                        <p className="text-muted-foreground">List of all fuel stations and their development progress</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Search className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            placeholder="Search stations..."
                            className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary min-w-[300px] bg-background"
                        />
                    </div>
                    <button
                        onClick={() => navigate("/station-information")}
                        className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                    >
                        Add New Station
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="bg-card rounded-xl shadow-md overflow-hidden border border-border">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted border-b border-border">
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Station Details</th>
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Type & Status</th>
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Development Progress</th>
                                <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {stations.map((station) => (
                                <tr key={station.id} className="hover:bg-muted/50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                <Gauge className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{station.name}</p>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>{station.location}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <span className="text-sm text-muted-foreground block">{station.type}</span>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${station.completion === 100
                                                ? 'bg-success/10 text-success'
                                                : station.completion < 30
                                                    ? 'bg-info/10 text-info'
                                                    : 'bg-primary/10 text-primary'
                                                }`}>
                                                {station.status}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 min-w-[250px]">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground font-medium">Completion Rate</span>
                                                <span className="text-foreground font-bold">{station.completion}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className="h-full progress-bar transition-all duration-500"
                                                    style={{ width: `${station.completion}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all">
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





