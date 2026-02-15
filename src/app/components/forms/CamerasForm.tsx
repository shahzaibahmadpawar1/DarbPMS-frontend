import { useState, useEffect } from "react";
import { Save, List, PlusCircle } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function CamerasForm() {
    const { accessMode } = useStation();
    const isReadOnly = accessMode === 'view-only';

    const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        serialNumber: "",
        cameraType: "",
        model: "",
        size: "",
        location: "",
        status: "",
        stationCode: "",
    });

    useEffect(() => {
        fetchRecords();
    }, []);

    const fetchRecords = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                console.warn("No auth token found, please log in.");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/cameras`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setRecords(data.data || []);
            } else if (response.status === 401 || response.status === 403) {
                console.error("Authentication failed. Please log out and log in again to sync with the Vercel backend.");
            }
        } catch (error) {
            console.error("Error fetching cameras:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                alert("No authentication token found. Please log in.");
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_BASE_URL}/cameras`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Camera information saved successfully!");
                setFormData({
                    serialNumber: "",
                    cameraType: "",
                    model: "",
                    size: "",
                    location: "",
                    status: "",
                    stationCode: "",
                });
                fetchRecords();
            } else if (response.status === 401 || response.status === 403) {
                alert("Authentication failed. Please log out and then log in again to sync with the Vercel backend. Your token might be from a different session (localhost).");
            } else {
                alert(`Error: ${data.error || 'Failed to save camera information'}`);
            }
        } catch (error) {
            console.error("Error saving camera:", error);
            alert("Failed to save camera information. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Cameras</h1>
                    <p className="text-muted-foreground mt-2">
                        {isReadOnly ? "View camera details" : "Manage station security cameras"}
                    </p>
                </div>

                {!isReadOnly && (
                    <div className="flex bg-muted p-1 rounded-xl w-fit">
                        <button
                            onClick={() => setViewMode('form')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'form'
                                ? 'bg-card text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <PlusCircle className="w-4 h-4" />
                            New Entry
                        </button>
                        <button
                            onClick={() => setViewMode('records')}
                            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'records'
                                ? 'bg-card text-primary shadow-sm'
                                : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <List className="w-4 h-4" />
                            View Records
                        </button>
                    </div>
                )}
            </div>

            {viewMode === 'form' ? (
                <form onSubmit={handleSubmit} className="max-w-4xl bg-card rounded-2xl border border-border p-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">Serial Number *</label>
                            <input
                                type="text"
                                name="serialNumber"
                                value={formData.serialNumber}
                                onChange={handleInputChange}
                                required
                                disabled={isReadOnly}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">Camera Type *</label>
                            <select
                                name="cameraType"
                                value={formData.cameraType}
                                onChange={handleInputChange}
                                required
                                disabled={isReadOnly}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                            >
                                <option value="">Select Type</option>
                                <option value="Bullet">Bullet</option>
                                <option value="Dome">Dome</option>
                                <option value="PTZ">PTZ</option>
                                <option value="IP">IP</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">Model</label>
                            <input
                                type="text"
                                name="model"
                                value={formData.model}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">Station Code *</label>
                            <input
                                type="text"
                                name="stationCode"
                                value={formData.stationCode}
                                onChange={handleInputChange}
                                required
                                disabled={isReadOnly}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                            >
                                <option value="">Select Status</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>

                    {!isReadOnly && (
                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? "Saving..." : "Save Camera Information"}
                            </button>
                        </div>
                    )}
                </form>
            ) : (
                <FormRecordsList
                    title="Camera Records"
                    columns={["Serial Number", "Type", "Model", "Location", "Station", "Status"]}
                    records={records.map(r => ({
                        "Serial Number": r.serial_number,
                        "Type": r.camera_type,
                        "Model": r.model || "N/A",
                        "Location": r.location || "N/A",
                        "Station": r.station_code,
                        "Status": r.status || "N/A"
                    }))}
                />
            )}
        </div>
    );
}
