import { useState, useEffect } from "react";
import { ArrowLeft, Search, MoreVertical, MapPin, Gauge } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface Station {
    id: string;
    station_code: string;
    station_name: string;
    area_region: string;
    city: string;
    district: string;
    station_type_code: string;
    station_status_code: string;
}

export function StationsList() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [stations, setStations] = useState<Station[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchStations = async () => {
            try {
                const response = await fetch(`${API_URL}/stations`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const result = await response.json();
                if (result.data) {
                    setStations(result.data);
                }
            } catch (err) {
                console.error("Failed to fetch stations:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStations();
    }, [token]);

    const filteredStations = stations.filter(s =>
        s.station_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.station_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary min-w-[300px] bg-background text-foreground"
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
                    {isLoading ? (
                        <div className="p-20 text-center">
                            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                        </div>
                    ) : (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-muted border-b border-border">
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Station Details</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Type & Status</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">Location</th>
                                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredStations.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground">
                                            No stations found.
                                        </td>
                                    </tr>
                                ) : filteredStations.map((station) => (
                                    <tr key={station.id} className="hover:bg-muted/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                                                    <Gauge className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">{station.station_name}</p>
                                                    <p className="text-xs text-muted-foreground font-mono uppercase">{station.station_code}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <span className="text-sm text-muted-foreground block">{station.station_type_code || 'Main Station'}</span>
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary`}>
                                                    {station.station_status_code || 'Active'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-sm text-foreground">
                                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                                <span>{station.city}, {station.district || station.area_region}</span>
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
                    )}
                </div>
            </div>
        </div>
    );
}





