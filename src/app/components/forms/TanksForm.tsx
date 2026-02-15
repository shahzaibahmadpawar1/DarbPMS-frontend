import { useState, useEffect } from "react";
import { Save, List, PlusCircle } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function TanksForm() {
    const { accessMode } = useStation();
    const isReadOnly = accessMode === 'view-only';

    const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        tankCode: "",
        fuelType: "",
        vendor: "",
        tankCapacity: "",
        tankSize: "",
        tankManufacturer: "",
        stationCode: "",
        canopyCode: "",
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

            const response = await fetch(`${API_BASE_URL}/tanks`, {
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
            console.error("Error fetching tanks:", error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/tanks`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Tank information saved successfully!");
                setFormData({
                    tankCode: "",
                    fuelType: "",
                    vendor: "",
                    tankCapacity: "",
                    tankSize: "",
                    tankManufacturer: "",
                    stationCode: "",
                    canopyCode: "",
                });
                fetchRecords();
            } else if (response.status === 401 || response.status === 403) {
                alert("Authentication failed. Please log out and then log in again to sync with the Vercel backend. Your token might be from a different session (localhost).");
            } else {
                alert(`Error: ${data.error || 'Failed to save tank information'}`);
            }
        } catch (error) {
            console.error("Error saving tank:", error);
            alert("Failed to save tank information. Please check your connection.");
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
                    <h1 className="text-3xl font-bold text-foreground">Tanks</h1>
                    <p className="text-muted-foreground mt-2">
                        {isReadOnly ? "View tank details" : "Manage station fuel tanks"}
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
                            <label className="text-sm font-semibold text-muted-foreground">Tank Code *</label>
                            <input
                                type="text"
                                name="tankCode"
                                value={formData.tankCode}
                                onChange={handleInputChange}
                                required
                                disabled={isReadOnly}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">Fuel Type *</label>
                            <select
                                name="fuelType"
                                value={formData.fuelType}
                                onChange={handleInputChange}
                                required
                                disabled={isReadOnly}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                            >
                                <option value="">Select Fuel Type</option>
                                <option value="91">Gasoline 91</option>
                                <option value="95">Gasoline 95</option>
                                <option value="Diesel">Diesel</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">Tank Capacity (Liters)</label>
                            <input
                                type="number"
                                name="tankCapacity"
                                value={formData.tankCapacity}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">Manufacturer</label>
                            <input
                                type="text"
                                name="tankManufacturer"
                                value={formData.tankManufacturer}
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
                            <label className="text-sm font-semibold text-muted-foreground">Canopy Code</label>
                            <input
                                type="text"
                                name="canopyCode"
                                value={formData.canopyCode}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                            />
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
                                {loading ? "Saving..." : "Save Tank Information"}
                            </button>
                        </div>
                    )}
                </form>
            ) : (
                <FormRecordsList
                    title="Tank Records"
                    columns={["Tank Code", "Fuel Type", "Capacity", "Manufacturer", "Station"]}
                    records={records.map(r => ({
                        "Tank Code": r.tank_code,
                        "Fuel Type": r.fuel_type || "N/A",
                        "Capacity": r.tank_capacity || "0",
                        "Manufacturer": r.tank_manufacturer || "N/A",
                        "Station": r.station_code
                    }))}
                />
            )}
        </div>
    );
}
