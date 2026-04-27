import { useState, useEffect } from "react";
import { Save, List, PlusCircle, Send } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";
import { useResolvedStationCode } from "../../hooks/useResolvedStationCode";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function NozzlesForm() {
    const { accessMode } = useStation();
    const resolvedStationCode = useResolvedStationCode();
    const isReadOnly = accessMode === 'view-only';

    const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [draftNozzleSerialNumber, setDraftNozzleSerialNumber] = useState<string | null>(null);
    const [records, setRecords] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        nozzleSerialNumber: "",
        fuelType: "",
        vendor: "",
        dispenserSerialNumber: "",
    });

    useEffect(() => {
        fetchRecords();
    }, []);

    useEffect(() => {
        const prefillDispenserForStation = async () => {
            if (!resolvedStationCode || isReadOnly) return;
            if (draftNozzleSerialNumber || formData.dispenserSerialNumber) return;

            try {
                const token = localStorage.getItem('auth_token');
                if (!token) return;

                const response = await fetch(`${API_BASE_URL}/dispensers/station/${encodeURIComponent(resolvedStationCode)}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) return;
                const data = await response.json();
                const firstDispenser = Array.isArray(data?.data) ? data.data[0] : null;
                const serialNumber = firstDispenser?.dispenser_serial_number;

                if (serialNumber) {
                    setFormData((prev) => ({
                        ...prev,
                        dispenserSerialNumber: prev.dispenserSerialNumber || serialNumber,
                    }));
                }
            } catch (error) {
                console.error('Error prefilling dispenser by station:', error);
            }
        };

        void prefillDispenserForStation();
    }, [resolvedStationCode, isReadOnly, draftNozzleSerialNumber, formData.dispenserSerialNumber]);

    useEffect(() => {
        const loadLatestSaved = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) return;

                const response = await fetch(`${API_BASE_URL}/nozzles/latest-saved`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) return;
                const result = await response.json();
                const saved = result?.data;
                if (!saved) return;

                setDraftNozzleSerialNumber(saved.nozzle_serial_number || null);
                setFormData({
                    nozzleSerialNumber: saved.nozzle_serial_number || "",
                    fuelType: saved.fuel_type || "",
                    vendor: saved.vendor || "",
                    dispenserSerialNumber: saved.dispenser_serial_number || "",
                });
            } catch (error) {
                console.error("Error loading latest saved nozzle:", error);
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

            const response = await fetch(`${API_BASE_URL}/nozzles`, {
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
            console.error("Error fetching nozzles:", error);
        }
    };

    const persistNozzle = async (mode: 'save' | 'submit') => {
        if (mode === 'submit') setSubmitting(true); else setLoading(true);

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(
                draftNozzleSerialNumber ? `${API_BASE_URL}/nozzles/${draftNozzleSerialNumber}` : `${API_BASE_URL}/nozzles`,
                {
                    method: draftNozzleSerialNumber ? 'PUT' : 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        nozzleSerialNumber: draftNozzleSerialNumber || formData.nozzleSerialNumber,
                        submit: mode === 'submit',
                    }),
                }
            );

            const data = await response.json();

            if (response.ok) {
                setDraftNozzleSerialNumber(data?.data?.nozzle_serial_number || draftNozzleSerialNumber);

                if (mode === 'submit') {
                    alert("Nozzle information submitted successfully!");
                    setDraftNozzleSerialNumber(null);
                    setFormData({
                        nozzleSerialNumber: "",
                        fuelType: "",
                        vendor: "",
                        dispenserSerialNumber: "",
                    });
                } else {
                    alert("Nozzle information saved successfully. You can continue later.");
                }

                fetchRecords();
                setViewMode('records');
            } else if (response.status === 401 || response.status === 403) {
                alert("Authentication failed. Please log out and then log in again to sync with the Vercel backend. Your token might be from a different session (localhost).");
            } else {
                alert(`Error: ${data.error || `Failed to ${mode} nozzle information`}`);
            }
        } catch (error) {
            console.error("Error saving nozzle:", error);
            alert(`Failed to ${mode} nozzle information. Please check your connection.`);
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await persistNozzle('save');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Nozzles</h1>
                    <p className="text-muted-foreground mt-2">
                        {isReadOnly ? "View nozzle details" : "Manage station fuel nozzles"}
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
                            <label className="text-sm font-semibold text-muted-foreground">Nozzle Serial Number *</label>
                            <input
                                type="text"
                                name="nozzleSerialNumber"
                                value={formData.nozzleSerialNumber}
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
                            <label className="text-sm font-semibold text-muted-foreground">Dispenser Serial Number *</label>
                            <input
                                type="text"
                                name="dispenserSerialNumber"
                                value={formData.dispenserSerialNumber}
                                onChange={handleInputChange}
                                required
                                disabled={isReadOnly}
                                className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                            />
                        </div>
                    </div>

                    {!isReadOnly && (
                        <div className="mt-8 flex justify-end gap-3">
                            <button
                                type="button"
                                disabled={loading || submitting}
                                onClick={() => void persistNozzle('save')}
                                className="border border-border px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2 disabled:opacity-60"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                disabled={loading || submitting}
                                onClick={() => void persistNozzle('submit')}
                                className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                            >
                                <Send className="w-5 h-5" />
                                {submitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    )}
                </form>
            ) : (
                <FormRecordsList
                    title="Nozzle Records"
                    columns={["Serial Number", "Fuel Type", "Vendor", "Dispenser"]}
                    records={records.map(r => ({
                        "Serial Number": r.nozzle_serial_number,
                        "Fuel Type": r.fuel_type || "N/A",
                        "Vendor": r.vendor || "N/A",
                        "Dispenser": r.dispenser_serial_number
                    }))}
                />
            )}
        </div>
    );
}
