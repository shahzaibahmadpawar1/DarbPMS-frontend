import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Building2,
    MapPin,
    Map,
    FileText,
    Save,
    X,
    Plus,
    Trash2,
} from "lucide-react";

export function AddNewProjectForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        projectName: "",
        projectCode: "",
        description: "",
        region: "",
        city: "",
        startDate: "",
        expectedEndDate: "",
        projectManager: "",
        budget: "",
        status: "Planning",
    });

    const [selectedStations, setSelectedStations] = useState<string[]>([]);
    const [newStation, setNewStation] = useState("");

    // Available stations (this would come from your database)
    const availableStations = [
        "Darb Al Sultan Station",
        "Jeddah Central Hub",
        "Dammam East Point",
        "Medina Oasis Station",
        "Riyadh North Station",
        "Makkah Gateway",
        "Taif Mountain Station",
        "Abha Highland Station",
        "Khobar Coastal Station",
        "Yanbu Port Station",
    ];

    const regions = [
        "Central Region",
        "Western Region",
        "Eastern Region",
        "Northern Region",
        "Southern Region",
    ];

    const cities = [
        "Riyadh",
        "Jeddah",
        "Makkah",
        "Medina",
        "Dammam",
        "Khobar",
        "Dhahran",
        "Taif",
        "Abha",
        "Yanbu",
        "Tabuk",
        "Buraidah",
        "Khamis Mushait",
        "Najran",
        "Al Kharj",
    ];

    const projectStatuses = [
        "Planning",
        "Under Development",
        "In Progress",
        "On Hold",
        "Completed",
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddStation = () => {
        if (newStation && !selectedStations.includes(newStation)) {
            setSelectedStations((prev) => [...prev, newStation]);
            setNewStation("");
        }
    };

    const handleRemoveStation = (station: string) => {
        setSelectedStations((prev) => prev.filter((s) => s !== station));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would submit the form data to your backend
        console.log("Project Data:", {
            ...formData,
            stations: selectedStations,
        });
        // Navigate back after submission
        navigate(-1);
    };

    const handleCancel = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-background p-8">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-black text-foreground mb-2 tracking-tight">
                        Add New Project
                    </h1>
                    <p className="text-muted-foreground font-medium">
                        Create a new project and assign stations
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border/40 card-glow p-8 mb-6">
                        {/* Project Information Section */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <Building2 className="w-5 h-5 text-primary" />
                                Project Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Project Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-muted-foreground mb-2">
                                        Project Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="projectName"
                                        value={formData.projectName}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="Enter project name"
                                    />
                                </div>

                                {/* Project Code */}
                                <div>
                                    <label className="block text-sm font-semibold text-muted-foreground mb-2">
                                        Project Code *
                                    </label>
                                    <input
                                        type="text"
                                        name="projectCode"
                                        value={formData.projectCode}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="e.g., PRJ-2024-001"
                                    />
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-muted-foreground mb-2">
                                        Project Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground resize-none"
                                        placeholder="Enter project description"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Location Information Section */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-primary" />
                                Location Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Region */}
                                <div>
                                    <label className="block text-sm font-semibold text-muted-foreground mb-2">
                                        Region *
                                    </label>
                                    <select
                                        name="region"
                                        value={formData.region}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                    >
                                        <option value="">Select Region</option>
                                        {regions.map((region) => (
                                            <option key={region} value={region}>
                                                {region}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-semibold text-muted-foreground mb-2">
                                        City *
                                    </label>
                                    <select
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                    >
                                        <option value="">Select City</option>
                                        {cities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Stations Section */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <Map className="w-5 h-5 text-primary" />
                                Assigned Stations
                            </h2>

                            {/* Add Station */}
                            <div className="flex gap-3 mb-4">
                                <select
                                    value={newStation}
                                    onChange={(e) => setNewStation(e.target.value)}
                                    className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                >
                                    <option value="">Select a station to add</option>
                                    {availableStations
                                        .filter((station) => !selectedStations.includes(station))
                                        .map((station) => (
                                            <option key={station} value={station}>
                                                {station}
                                            </option>
                                        ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleAddStation}
                                    disabled={!newStation}
                                    className="btn-primary px-6 py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Station
                                </button>
                            </div>

                            {/* Selected Stations List */}
                            {selectedStations.length > 0 && (
                                <div className="bg-muted rounded-lg p-4">
                                    <p className="text-sm font-semibold text-muted-foreground mb-3">
                                        Selected Stations ({selectedStations.length})
                                    </p>
                                    <div className="space-y-2">
                                        {selectedStations.map((station) => (
                                            <div
                                                key={station}
                                                className="flex items-center justify-between bg-card px-4 py-3 rounded-lg border border-border"
                                            >
                                                <span className="text-sm font-medium text-foreground">
                                                    {station}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveStation(station)}
                                                    className="text-error hover:text-error/80 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Project Details Section */}
                        <div className="mb-8">
                            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                Project Details
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Start Date */}
                                <div>
                                    <label className="block text-sm font-semibold text-muted-foreground mb-2">
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                    />
                                </div>

                                {/* Expected End Date */}
                                <div>
                                    <label className="block text-sm font-semibold text-muted-foreground mb-2">
                                        Expected End Date *
                                    </label>
                                    <input
                                        type="date"
                                        name="expectedEndDate"
                                        value={formData.expectedEndDate}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                    />
                                </div>

                                {/* Project Manager */}
                                <div>
                                    <label className="block text-sm font-semibold text-muted-foreground mb-2">
                                        Project Manager *
                                    </label>
                                    <input
                                        type="text"
                                        name="projectManager"
                                        value={formData.projectManager}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="Enter project manager name"
                                    />
                                </div>

                                {/* Budget */}
                                <div>
                                    <label className="block text-sm font-semibold text-muted-foreground mb-2">
                                        Budget (SAR)
                                    </label>
                                    <input
                                        type="number"
                                        name="budget"
                                        value={formData.budget}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                        placeholder="Enter budget amount"
                                    />
                                </div>

                                {/* Status */}
                                <div>
                                    <label className="block text-sm font-semibold text-muted-foreground mb-2">
                                        Project Status *
                                    </label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-background text-foreground"
                                    >
                                        {projectStatuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-4">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-6 py-3 border border-border text-muted-foreground rounded-lg hover:bg-muted transition-colors font-semibold flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-primary px-6 py-3 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200 font-semibold flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            Create Project
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
