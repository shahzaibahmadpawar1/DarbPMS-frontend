import { useState, useEffect } from "react";
import { Save, List, PlusCircle, Send } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function DispensersForm() {
    const { accessMode } = useStation();
    const isReadOnly = accessMode === 'view-only';

    const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [draftSerialNumber, setDraftSerialNumber] = useState<string | null>(null);
    const [records, setRecords] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        quantity: "",
        dispenserName: "",
        model: "",
        vendor: "",
        numberOfNozzles: "",
        status: "",
        stationCode: "",
        canopyCode: "",
    });

    useEffect(() => {
        fetchRecords();
    }, []);

    useEffect(() => {
        const loadLatestSaved = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) return;

                const response = await fetch(`${API_BASE_URL}/dispensers/latest-saved`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) return;
                const result = await response.json();
                const saved = result?.data;
                if (!saved) return;

                setDraftSerialNumber(saved.dispenser_serial_number || null);
                setFormData({
                    quantity: "",
                    dispenserName: saved.dispenser_name || "",
                    model: saved.model || "",
                    vendor: saved.vendor || "",
                    numberOfNozzles: saved.number_of_nozzles != null ? String(saved.number_of_nozzles) : "",
                    status: saved.status || "",
                    stationCode: saved.station_code || "",
                    canopyCode: saved.canopy_code || "",
                });
            } catch (error) {
                console.error("Error loading latest saved dispenser:", error);
            }
        };

        void loadLatestSaved();
    }, []);

    const fetchRecords = async () => {
        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                console.warn("No auth token found, please log in.");
                return;
            }

            const response = await fetch(`${API_BASE_URL}/dispensers`, {
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
            console.error("Error fetching dispensers:", error);
        }
    };

    const persistDispenser = async (mode: 'save' | 'submit') => {
        if (mode === 'submit') {
            setSubmitting(true);
        } else {
            setLoading(true);
        }

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(
                draftSerialNumber ? `${API_BASE_URL}/dispensers/${draftSerialNumber}` : `${API_BASE_URL}/dispensers`,
                {
                method: draftSerialNumber ? 'PUT' : 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    dispenserSerialNumber: draftSerialNumber || undefined,
                    submit: mode === 'submit',
                }),
            }
            });

            const data = await response.json();

            if (response.ok) {
                setDraftSerialNumber(data?.data?.dispenser_serial_number || draftSerialNumber);

                if (mode === 'submit') {
                    alert("Dispenser information submitted successfully!");
                    setDraftSerialNumber(null);
                    setFormData({
                        quantity: "",
                        dispenserName: "",
                        model: "",
                        vendor: "",
                        numberOfNozzles: "",
                        status: "",
                        stationCode: "",
                        canopyCode: "",
                    });
                } else {
                    alert("Dispenser information saved successfully. You can continue later.");
                }

                fetchRecords();
            } else if (response.status === 401 || response.status === 403) {
                alert("Authentication failed. Please log out and then log in again to sync with the Vercel backend. Your token might be from a different session (localhost).");
            } else {
                alert(`Error: ${data.error || `Failed to ${mode} dispenser information`}`);
            }
        } catch (error) {
            console.error("Error saving dispenser:", error);
            alert(`Failed to ${mode} dispenser information. Please check your connection.`);
        } finally {
            setLoading(false);
            setSubmitting(false);
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
                    <h1 className="text-3xl font-bold text-foreground">Dispensers</h1>
                    <p className="text-muted-foreground mt-2">
                        {isReadOnly ? "View dispenser details" : "Manage fuel station dispensers"}
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
                <form onSubmit={(e) => e.preventDefault()} className="max-w-4xl bg-card rounded-2xl border border-border p-8 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">Quantity *</label>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                required
                                disabled={isReadOnly}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">Name/Label *</label>
                            <input
                                type="text"
                                name="dispenserName"
                                value={formData.dispenserName}
                                onChange={handleInputChange}
                                required
                                disabled={isReadOnly}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                            />
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
                            <label className="text-sm font-semibold text-muted-foreground">Vendor</label>
                            <input
                                type="text"
                                name="vendor"
                                value={formData.vendor}
                                onChange={handleInputChange}
                                disabled={isReadOnly}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-muted-foreground">Number of Nozzles</label>
                            <input
                                type="number"
                                name="numberOfNozzles"
                                value={formData.numberOfNozzles}
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
                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={loading || submitting}
                                onClick={() => void persistDispenser('save')}
                                className="border border-border px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2 disabled:opacity-60"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? "Saving..." : "Save Dispenser Information"}
                            </button>
                            <button
                                type="button"
                                onClick={() => void persistDispenser('submit')}
                                disabled={loading || submitting}
                                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                {submitting ? "Submitting..." : "Submit Dispenser Information"}
                            </button>
                        </div>
                    )}
                </form>
            ) : (
                <FormRecordsList
                    title="Dispenser Records"
                    columns={["Serial Number", "Name", "Model", "Vendor", "Nozzles", "Station", "Status"]}
                    records={records.map(r => ({
                        "Serial Number": r.dispenser_serial_number,
                        "Name": r.dispenser_name,
                        "Model": r.model || "N/A",
                        "Vendor": r.vendor || "N/A",
                        "Nozzles": r.number_of_nozzles || "0",
                        "Station": r.station_code,
                        "Status": r.status || "N/A"
                    }))}
                />
            )}
        </div>
    );
}
