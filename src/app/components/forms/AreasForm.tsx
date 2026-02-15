import { useState, useEffect } from "react";
import { Save, List, PlusCircle, Trash2, Building2 } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

type CommercialComponent = {
    building: string;
    area: string;
    number: string;
};

export function AreasForm() {
    const { accessMode } = useStation();
    const isReadOnly = accessMode === 'view-only';

    const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState<any[]>([]);

    const [formData, setFormData] = useState({
        stationCode: "",
        stationArea: "",
        constructionArea: "",
        canopyArea: "",
        mosqueArea: "",
        mensWcCount: "",
        womenWcCount: "",
        mensPrayerArea: "",
        womenPrayerArea: "",
        workerRoomsCount: "",
        administrationArea: "",
        numberOfPumps: "",
        commercialComponents: [] as CommercialComponent[],
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

            const response = await fetch(`${API_BASE_URL}/areas`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setRecords(data.data || []);
            } else if (response.status === 401 || response.status === 403) {
                console.error("Authentication failed. Please log out and log in again.");
            }
        } catch (error) {
            console.error("Error fetching areas:", error);
        }
    };

    const addCommercialComponent = () => {
        setFormData(prev => ({
            ...prev,
            commercialComponents: [
                ...prev.commercialComponents,
                { building: "", area: "", number: "" }
            ]
        }));
    };

    const removeCommercialComponent = (index: number) => {
        setFormData(prev => ({
            ...prev,
            commercialComponents: prev.commercialComponents.filter((_, i) => i !== index)
        }));
    };

    const handleComponentChange = (index: number, field: keyof CommercialComponent, value: string) => {
        setFormData(prev => {
            const newComponents = [...prev.commercialComponents];
            newComponents[index] = { ...newComponents[index], [field]: value };
            return { ...prev, commercialComponents: newComponents };
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/areas`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                alert("Area information saved successfully!");
                setFormData({
                    stationCode: "",
                    stationArea: "",
                    constructionArea: "",
                    canopyArea: "",
                    mosqueArea: "",
                    mensWcCount: "",
                    womenWcCount: "",
                    mensPrayerArea: "",
                    womenPrayerArea: "",
                    workerRoomsCount: "",
                    administrationArea: "",
                    numberOfPumps: "",
                    commercialComponents: [],
                });
                fetchRecords();
                setViewMode('records');
            } else {
                alert(`Error: ${data.error || 'Failed to save area information'}`);
            }
        } catch (error) {
            console.error("Error saving area:", error);
            alert("Failed to save area information. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-foreground tracking-tight">Station Areas</h1>
                    <p className="text-muted-foreground mt-2">
                        {isReadOnly ? "View station area details" : "Manage station areas and dimensions"}
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
                <form onSubmit={handleSubmit} className="max-w-5xl bg-card rounded-2xl border border-border p-8 shadow-sm">
                    {/* Basic Area Section */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-foreground mb-4 border-b pb-2 flex items-center gap-2">
                            <span className="w-2 h-6 bg-primary rounded-full"></span>
                            General Areas
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                <label className="text-sm font-semibold text-muted-foreground">Station Area (m²)</label>
                                <input
                                    type="number"
                                    name="stationArea"
                                    value={formData.stationArea}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground">Construction Area (m²)</label>
                                <input
                                    type="number"
                                    name="constructionArea"
                                    value={formData.constructionArea}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground">Canopy Area (m²)</label>
                                <input
                                    type="number"
                                    name="canopyArea"
                                    value={formData.canopyArea}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Religious & Facilities Section */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-foreground mb-4 border-b pb-2 flex items-center gap-2">
                            <span className="w-2 h-6 bg-primary rounded-full"></span>
                            Mosque & Facilities
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground">Mosque Area (m²)</label>
                                <input
                                    type="number"
                                    name="mosqueArea"
                                    value={formData.mosqueArea}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground">Men's Prayer Area (m²)</label>
                                <input
                                    type="number"
                                    name="mensPrayerArea"
                                    value={formData.mensPrayerArea}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground">Women's Prayer Area (m²)</label>
                                <input
                                    type="number"
                                    name="womenPrayerArea"
                                    value={formData.womenPrayerArea}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground"># of Men's WC</label>
                                <input
                                    type="number"
                                    name="mensWcCount"
                                    value={formData.mensWcCount}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground"># of Women's WC</label>
                                <input
                                    type="number"
                                    name="womenWcCount"
                                    value={formData.womenWcCount}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground"># of Worker Rooms</label>
                                <input
                                    type="number"
                                    name="workerRoomsCount"
                                    value={formData.workerRoomsCount}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Operational Section */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold text-foreground mb-4 border-b pb-2 flex items-center gap-2">
                            <span className="w-2 h-6 bg-primary rounded-full"></span>
                            Operational & Admin
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground">Administration Area (m²)</label>
                                <input
                                    type="number"
                                    name="administrationArea"
                                    value={formData.administrationArea}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-muted-foreground">Number of Pumps</label>
                                <input
                                    type="number"
                                    name="numberOfPumps"
                                    value={formData.numberOfPumps}
                                    onChange={handleInputChange}
                                    disabled={isReadOnly}
                                    className="w-full px-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary h-11"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Commercial Components Dynamic Section */}
                    <div className="mb-8 p-6 bg-muted/40 rounded-xl border border-dashed border-border">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                <span className="w-2 h-6 bg-primary rounded-full"></span>
                                Commercial Components
                            </h2>
                            {!isReadOnly && (
                                <button
                                    type="button"
                                    onClick={addCommercialComponent}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold shadow-md hover:scale-105 transition-all"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                    Add Component
                                </button>
                            )}
                        </div>

                        {formData.commercialComponents.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                <p>No commercial components added yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {formData.commercialComponents.map((component, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-card rounded-lg border border-border relative group shadow-sm">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Building Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g., Mini Market, Subway"
                                                value={component.building}
                                                onChange={(e) => handleComponentChange(index, 'building', e.target.value)}
                                                disabled={isReadOnly}
                                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm h-10"
                                            />
                                        </div>
                                        <div className="w-full md:w-32 space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Area (m²)</label>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                value={component.area}
                                                onChange={(e) => handleComponentChange(index, 'area', e.target.value)}
                                                disabled={isReadOnly}
                                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm h-10"
                                            />
                                        </div>
                                        <div className="w-full md:w-32 space-y-2">
                                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Number</label>
                                            <input
                                                type="text"
                                                placeholder="#"
                                                value={component.number}
                                                onChange={(e) => handleComponentChange(index, 'number', e.target.value)}
                                                disabled={isReadOnly}
                                                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm h-10"
                                            />
                                        </div>
                                        {!isReadOnly && (
                                            <button
                                                type="button"
                                                onClick={() => removeCommercialComponent(index)}
                                                className="md:self-end mb-1 p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {!isReadOnly && (
                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary text-primary-foreground px-10 py-4 rounded-xl font-bold hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2 shadow-primary/25"
                            >
                                <Save className="w-5 h-5" />
                                {loading ? "Saving..." : "Save Area Information"}
                            </button>
                        </div>
                    )}
                </form>
            ) : (
                <div className="space-y-6">
                    <FormRecordsList
                        title="Area Records"
                        columns={["Station Code", "Station Area", "Const. Area", "Mosque Area", "Pumps"]}
                        records={records.map(r => ({
                            "Station Code": r.station_code,
                            "Station Area": `${r.station_area || 0} m²`,
                            "Const. Area": `${r.construction_area || 0} m²`,
                            "Mosque Area": `${r.mosque_area || 0} m²`,
                            "Pumps": r.number_of_pumps || 0
                        }))}
                    />

                    {/* View Details for selected record could go here if needed */}
                </div>
            )}
        </div>
    );
}
