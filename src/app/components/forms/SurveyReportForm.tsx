import { useState } from "react";
import { Save, List, PlusCircle, Eye, Trash2, Upload, X } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

interface ProjectComponent {
    id: string;
    area: string;
    building: string;
}

interface MosqueArea {
    id: string;
    area: string;
    availability: string;
    prayerRoomType: string;
    prayerRoomNumber: string;
    toiletType: string;
}

interface FuelPump {
    id: string;
    number: string;
    size: string;
}

interface FuelTank {
    id: string;
    productType: string;
    number: string;
    size: string;
}

interface CompletionStage {
    id: string;
    completionRate: string;
    theCondition: string;
    item: string;
    stage: string;
    number: string;
}

interface DocumentUpload {
    name: string;
    file: File | null;
}

export function SurveyReportForm() {
    const { accessMode } = useStation();
    const isReadOnly = accessMode === 'view-only';

    const [viewMode, setViewMode] = useState<'form' | 'records'>('form');

    // Project Completion Rate Report
    const [projectStartDate, setProjectStartDate] = useState(isReadOnly ? "2024-01-15" : "");
    const [projectDeliveryDate, setProjectDeliveryDate] = useState(isReadOnly ? "2025-11-15" : "");
    const [typeOfContract, setTypeOfContract] = useState(isReadOnly ? "employment" : "");
    const [reportNumber, setReportNumber] = useState(isReadOnly ? "154/1/2025" : "");
    const [projectName, setProjectName] = useState(isReadOnly ? "Prince Fawaz - Jeddah" : "");
    const [city, setCity] = useState(isReadOnly ? "Jeddah" : "");
    const [location, setLocation] = useState(isReadOnly ? "https://maps.app.goo.gl/BsSRbvX1GwVzwEpd6" : "");
    const [theDate, setTheDate] = useState(isReadOnly ? "2024-01-15" : "");

    // Project Components
    const [projectComponents, setProjectComponents] = useState<ProjectComponent[]>(
        isReadOnly ? [
            { id: "1", area: "nothing", building: "washing machine" },
            { id: "2", area: "215.7 m2", building: "Drive True Restaurant" },
            { id: "3", area: "58.8 m2", building: "Restaurant shop" },
            { id: "4", area: "nothing", building: "Diesel umbrella" },
        ] : []
    );

    // Mosque Areas
    const [mosqueAreas, setMosqueAreas] = useState<MosqueArea[]>(
        isReadOnly ? [
            { id: "1", area: "Prayer Room", availability: "available", prayerRoomType: "Men's Prayer Room", prayerRoomNumber: "1", toiletType: "Men's Toilet" },
            { id: "2", area: "Prayer Room", availability: "available", prayerRoomType: "Women's Prayer Room", prayerRoomNumber: "1", toiletType: "Women's Toilet" },
        ] : []
    );

    // Fuel Pumps
    const [fuelPumps, setFuelPumps] = useState<FuelPump[]>(
        isReadOnly ? [
            { id: "1", number: "6", size: "Standard" },
            { id: "2", number: "4", size: "Large" },
        ] : []
    );

    // Fuel Tanks
    const [fuelTanks, setFuelTanks] = useState<FuelTank[]>(
        isReadOnly ? [
            { id: "1", productType: "91", number: "2", size: "60 fuel tank" },
            { id: "2", productType: "91", number: "1", size: "80 fuel tank" },
            { id: "3", productType: "Diesel", number: "1", size: "Fuel tank capacity 115" },
        ] : []
    );

    // Project Documents
    const [projectDocuments, setProjectDocuments] = useState<DocumentUpload[]>([
        { name: "Building Permit", file: null },
        { name: "Initial Receipt", file: null },
        { name: "Project Archiving", file: null },
        { name: "Project Plans", file: null },
        { name: "General Guarantee Certificates", file: null },
        { name: "Inventory and Delivery Report", file: null },
        { name: "Certificate of Completion of Installations", file: null },
        { name: "Maintenance Contracts", file: null },
    ]);

    // License Authorities
    const [licenseAuthorities, setLicenseAuthorities] = useState<DocumentUpload[]>([
        { name: "Ministry of Energy", file: null },
        { name: "Environment", file: null },
        { name: "Administrative Control / Civil Defense", file: null },
        { name: "Municipality", file: null },
        { name: "Standardization", file: null },
        { name: "Aramco Added the Station", file: null },
    ]);

    // Completion Stages
    const [completionStages, setCompletionStages] = useState<CompletionStage[]>(
        isReadOnly ? [
            { id: "1", completionRate: "100.00%", theCondition: "Remaining manhole covers", item: "Fuel room", stage: "", number: "1" },
            { id: "2", completionRate: "100.00%", theCondition: "", item: "Water tanks", stage: "", number: "2" },
            { id: "3", completionRate: "0.00%", theCondition: "Construction has not yet begun: a well will be built on the site", item: "orchards", stage: "tanks", number: "5" },
            { id: "4", completionRate: "100.00%", theCondition: "The metal structure has been completed", item: "Fuel canopy", stage: "", number: "6" },
            { id: "5", completionRate: "100.00%", theCondition: "Structural work included the construction of the canopy's iron frame", item: "supermarket", stage: "", number: "7" },
            { id: "6", completionRate: "0.00%", theCondition: "Foundation works, beams, and column reinforcement", item: "kiosks", stage: "", number: "8" },
            { id: "7", completionRate: "0.00%", theCondition: "nothing", item: "Mosque", stage: "", number: "9" },
            { id: "8", completionRate: "100.00%", theCondition: "Building and metal structure works", item: "Car service", stage: "", number: "10" },
            { id: "9", completionRate: "100.00%", theCondition: "Structural works and buildings", item: "Commercial shops", stage: "", number: "11" },
            { id: "10", completionRate: "100.00%", theCondition: "Bone works", item: "Drive Thru Restaurants", stage: "", number: "12" },
            { id: "11", completionRate: "95.00%", theCondition: "Foundation and extension works", item: "Plumbing extensions, general site drainage", stage: "", number: "14" },
            { id: "12", completionRate: "95.00%", theCondition: "Foundation and extension works", item: "Electrical Extensions", stage: "", number: "17" },
            { id: "13", completionRate: "90.00%", theCondition: "Factory building remnants", item: "Gasoline extensions", stage: "", number: "20" },
        ] : []
    );

    // New sections
    const [projectObstacles, setProjectObstacles] = useState(isReadOnly ? "Sample obstacles text..." : "");
    const [visitNote, setVisitNote] = useState(isReadOnly ? "Sample visit notes..." : "");
    const [projectPhotos, setProjectPhotos] = useState<File[]>([]);

    const mockRecords = [
        { no: "SR-001", projectName: "Jeddah Station", location: "Jeddah", startDate: "2024-01-15", status: "In Progress" },
        { no: "SR-002", projectName: "Riyadh Station", location: "Riyadh", startDate: "2024-02-01", status: "Completed" },
        { no: "SR-003", projectName: "Dammam Station", location: "Dammam", startDate: "2024-03-10", status: "In Progress" },
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Survey Report:", {
            projectStartDate,
            projectDeliveryDate,
            typeOfContract,
            reportNumber,
            projectName,
            city,
            location,
            theDate,
            projectComponents,
            mosqueAreas,
            fuelPumps,
            fuelTanks,
            projectDocuments,
            licenseAuthorities,
            completionStages,
            projectObstacles,
            visitNote,
            projectPhotos,
        });
        alert("Survey Report saved successfully!");
    };

    // Helper functions for dynamic rows
    const addProjectComponent = () => {
        setProjectComponents([...projectComponents, {
            id: Date.now().toString(),
            area: "",
            building: "",
        }]);
    };

    const removeProjectComponent = (id: string) => {
        setProjectComponents(projectComponents.filter(comp => comp.id !== id));
    };

    const updateProjectComponent = (id: string, field: keyof ProjectComponent, value: string) => {
        setProjectComponents(projectComponents.map(comp =>
            comp.id === id ? { ...comp, [field]: value } : comp
        ));
    };

    const addMosqueArea = () => {
        setMosqueAreas([...mosqueAreas, {
            id: Date.now().toString(),
            area: "",
            availability: "",
            prayerRoomType: "",
            prayerRoomNumber: "",
            toiletType: "",
        }]);
    };

    const removeMosqueArea = (id: string) => {
        setMosqueAreas(mosqueAreas.filter(area => area.id !== id));
    };

    const updateMosqueArea = (id: string, field: keyof MosqueArea, value: string) => {
        setMosqueAreas(mosqueAreas.map(area =>
            area.id === id ? { ...area, [field]: value } : area
        ));
    };

    const addFuelPump = () => {
        setFuelPumps([...fuelPumps, {
            id: Date.now().toString(),
            number: "",
            size: "",
        }]);
    };

    const removeFuelPump = (id: string) => {
        setFuelPumps(fuelPumps.filter(pump => pump.id !== id));
    };

    const updateFuelPump = (id: string, field: keyof FuelPump, value: string) => {
        setFuelPumps(fuelPumps.map(pump =>
            pump.id === id ? { ...pump, [field]: value } : pump
        ));
    };

    const addFuelTank = () => {
        setFuelTanks([...fuelTanks, {
            id: Date.now().toString(),
            productType: "",
            number: "",
            size: "",
        }]);
    };

    const removeFuelTank = (id: string) => {
        setFuelTanks(fuelTanks.filter(tank => tank.id !== id));
    };

    const updateFuelTank = (id: string, field: keyof FuelTank, value: string) => {
        setFuelTanks(fuelTanks.map(tank =>
            tank.id === id ? { ...tank, [field]: value } : tank
        ));
    };

    const addCompletionStage = () => {
        setCompletionStages([...completionStages, {
            id: Date.now().toString(),
            completionRate: "",
            theCondition: "",
            item: "",
            stage: "",
            number: "",
        }]);
    };

    const removeCompletionStage = (id: string) => {
        setCompletionStages(completionStages.filter(stage => stage.id !== id));
    };

    const updateCompletionStage = (id: string, field: keyof CompletionStage, value: string) => {
        setCompletionStages(completionStages.map(stage =>
            stage.id === id ? { ...stage, [field]: value } : stage
        ));
    };

    const handleDocumentUpload = (index: number, file: File | null, type: 'project' | 'license') => {
        if (type === 'project') {
            const updated = [...projectDocuments];
            updated[index].file = file;
            setProjectDocuments(updated);
        } else {
            const updated = [...licenseAuthorities];
            updated[index].file = file;
            setLicenseAuthorities(updated);
        }
    };

    const handlePhotoUpload = (files: FileList | null) => {
        if (files) {
            setProjectPhotos([...projectPhotos, ...Array.from(files)]);
        }
    };

    const removePhoto = (index: number) => {
        setProjectPhotos(projectPhotos.filter((_, i) => i !== index));
    };

    return (
        <div className="w-full">
            <div className="p-4 sm:p-6 md:p-8 min-w-[1200px] lg:min-w-full text-foreground bg-background">
                <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Project Survey Report</h1>
                        <p className="text-muted-foreground mt-2 text-sm sm:text-base">Comprehensive project completion rate and survey documentation</p>
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
                                <span>New Entry</span>
                            </button>
                            <button
                                onClick={() => setViewMode('records')}
                                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'records'
                                    ? 'bg-card text-primary shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                <List className="w-4 h-4" />
                                <span>View Records</span>
                            </button>
                        </div>
                    )}

                    {isReadOnly && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-info/5 text-info rounded-lg border border-info/20">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm font-semibold">View Only Mode</span>
                        </div>
                    )}
                </div>

                {viewMode === 'form' ? (
                    <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-xl p-4 sm:p-6 md:p-8 card-glow border-t-4 border-primary relative animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Project Completion Rate Report */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 bg-orange-500/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3">
                                Project Completion Rate Report
                            </h2>
                            <div className="grid grid-cols-4 gap-4 mt-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                        Project Start Date <span className="text-error">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={projectStartDate}
                                        onChange={(e) => setProjectStartDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                        required
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                                        Project Delivery Date <span className="text-error">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={projectDeliveryDate}
                                        onChange={(e) => setProjectDeliveryDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                        required
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Type of Contract</label>
                                    <input
                                        type="text"
                                        value={typeOfContract}
                                        onChange={(e) => setTypeOfContract(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                        placeholder="e.g., employment"
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Report Number</label>
                                    <input
                                        type="text"
                                        value={reportNumber}
                                        onChange={(e) => setReportNumber(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                        placeholder="e.g., 154/1/2025"
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Project Name</label>
                                    <input
                                        type="text"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                        placeholder="e.g., Prince Fawaz - Jeddah"
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">City</label>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                        placeholder="e.g., Jeddah"
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Location</label>
                                    <input
                                        type="text"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                        placeholder="Google Maps URL or address"
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">The Date</label>
                                    <input
                                        type="date"
                                        value={theDate}
                                        onChange={(e) => setTheDate(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                        disabled={isReadOnly}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Project Components */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 bg-orange-500/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3 flex-1">
                                    Project Components
                                </h2>
                                {!isReadOnly && (
                                    <button
                                        type="button"
                                        onClick={addProjectComponent}
                                        className="w-fit px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Add Component
                                    </button>
                                )}
                            </div>
                            <div className="rounded-lg border border-border overflow-hidden">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-muted/50">
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Area</th>
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Building</th>
                                            {!isReadOnly && <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projectComponents.map((component) => (
                                            <tr key={component.id}>
                                                <td className="border border-border px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={component.area}
                                                        onChange={(e) => updateProjectComponent(component.id, 'area', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    />
                                                </td>
                                                <td className="border border-border px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={component.building}
                                                        onChange={(e) => updateProjectComponent(component.id, 'building', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    />
                                                </td>
                                                {!isReadOnly && (
                                                    <td className="border border-border px-2 py-2 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeProjectComponent(component.id)}
                                                            className="text-error hover:text-error/80 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mosque Section */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 bg-orange-500/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3 flex-1">
                                    Mosque
                                </h2>
                                {!isReadOnly && (
                                    <button
                                        type="button"
                                        onClick={addMosqueArea}
                                        className="w-fit px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Add Row
                                    </button>
                                )}
                            </div>
                            <div className="rounded-lg border border-border overflow-hidden">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-muted/50">
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Area</th>
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Availability</th>
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Prayer Room Type</th>
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Prayer Room Number</th>
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Toilet Type</th>
                                            {!isReadOnly && <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {mosqueAreas.map((area) => (
                                            <tr key={area.id}>
                                                <td className="border border-border px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={area.area}
                                                        onChange={(e) => updateMosqueArea(area.id, 'area', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    />
                                                </td>
                                                <td className="border border-border px-2 py-2">
                                                    <select
                                                        value={area.availability}
                                                        onChange={(e) => updateMosqueArea(area.id, 'availability', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="available">Available</option>
                                                        <option value="not available">Not Available</option>
                                                    </select>
                                                </td>
                                                <td className="border border-border px-2 py-2">
                                                    <select
                                                        value={area.prayerRoomType}
                                                        onChange={(e) => updateMosqueArea(area.id, 'prayerRoomType', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="Men's Prayer Room">Men's Prayer Room</option>
                                                        <option value="Women's Prayer Room">Women's Prayer Room</option>
                                                    </select>
                                                </td>
                                                <td className="border border-border px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={area.prayerRoomNumber}
                                                        onChange={(e) => updateMosqueArea(area.id, 'prayerRoomNumber', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    />
                                                </td>
                                                <td className="border border-border px-2 py-2">
                                                    <select
                                                        value={area.toiletType}
                                                        onChange={(e) => updateMosqueArea(area.id, 'toiletType', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="Men's Toilet">Men's Toilet</option>
                                                        <option value="Women's Toilet">Women's Toilet</option>
                                                    </select>
                                                </td>
                                                {!isReadOnly && (
                                                    <td className="border border-border px-2 py-2 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeMosqueArea(area.id)}
                                                            className="text-error hover:text-error/80 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Fuel Pumps Section */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 bg-orange-500/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3 flex-1">
                                    Fuel Pumps
                                </h2>
                                {!isReadOnly && (
                                    <button
                                        type="button"
                                        onClick={addFuelPump}
                                        className="w-fit px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Add Pump
                                    </button>
                                )}
                            </div>
                            <div className="rounded-lg border border-border overflow-hidden">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-muted/50">
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Number</th>
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Size</th>
                                            {!isReadOnly && <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fuelPumps.map((pump) => (
                                            <tr key={pump.id}>
                                                <td className="border border-border px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={pump.number}
                                                        onChange={(e) => updateFuelPump(pump.id, 'number', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    />
                                                </td>
                                                <td className="border border-border px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={pump.size}
                                                        onChange={(e) => updateFuelPump(pump.id, 'size', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    />
                                                </td>
                                                {!isReadOnly && (
                                                    <td className="border border-border px-2 py-2 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFuelPump(pump.id)}
                                                            className="text-error hover:text-error/80 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Fuel Tanks Section */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 bg-orange-500/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3 flex-1">
                                    Fuel Tanks
                                </h2>
                                {!isReadOnly && (
                                    <button
                                        type="button"
                                        onClick={addFuelTank}
                                        className="w-fit px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Add Tank
                                    </button>
                                )}
                            </div>
                            <div className="rounded-lg border border-border overflow-hidden">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-muted/50">
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Product Type</th>
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Number</th>
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Size</th>
                                            {!isReadOnly && <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fuelTanks.map((tank) => (
                                            <tr key={tank.id}>
                                                <td className="border border-border px-2 py-2">
                                                    <select
                                                        value={tank.productType}
                                                        onChange={(e) => updateFuelTank(tank.id, 'productType', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    >
                                                        <option value="">Select</option>
                                                        <option value="Diesel">Diesel</option>
                                                        <option value="91">91</option>
                                                        <option value="95">95</option>
                                                        <option value="98">98</option>
                                                    </select>
                                                </td>
                                                <td className="border border-border px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={tank.number}
                                                        onChange={(e) => updateFuelTank(tank.id, 'number', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    />
                                                </td>
                                                <td className="border border-border px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={tank.size}
                                                        onChange={(e) => updateFuelTank(tank.id, 'size', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    />
                                                </td>
                                                {!isReadOnly && (
                                                    <td className="border border-border px-2 py-2 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFuelTank(tank.id)}
                                                            className="text-error hover:text-error/80 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Project Documents */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 bg-orange-500/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3">
                                Project Documents
                            </h2>
                            <div className="space-y-3 mt-4">
                                {projectDocuments.map((doc, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-border rounded-lg bg-muted/20">
                                        <span className="text-sm font-medium text-foreground flex-1 break-words">{doc.name}</span>
                                        {doc.file && (
                                            <span className="text-xs text-success flex-shrink-0">{doc.file.name}</span>
                                        )}
                                        <label className="cursor-pointer flex-shrink-0">
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => handleDocumentUpload(index, e.target.files?.[0] || null, 'project')}
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            />
                                            <div className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                                                <Upload className="w-5 h-5 text-primary" />
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* License Authorities */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 bg-orange-500/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3">
                                License Authorities
                            </h2>
                            <div className="space-y-3 mt-4">
                                {licenseAuthorities.map((auth, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-border rounded-lg bg-muted/20">
                                        <span className="text-sm font-medium text-foreground flex-1 break-words">{auth.name}</span>
                                        {auth.file && (
                                            <span className="text-xs text-success flex-shrink-0">{auth.file.name}</span>
                                        )}
                                        <label className="cursor-pointer flex-shrink-0">
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => handleDocumentUpload(index, e.target.files?.[0] || null, 'license')}
                                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            />
                                            <div className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                                                <Upload className="w-5 h-5 text-primary" />
                                            </div>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Completion Stages */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 bg-orange-500/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3 flex-1">
                                    Project Completion Stages
                                </h2>
                                {!isReadOnly && (
                                    <button
                                        type="button"
                                        onClick={addCompletionStage}
                                        className="w-fit px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
                                    >
                                        <PlusCircle className="w-4 h-4" />
                                        Add Stage
                                    </button>
                                )}
                            </div>
                            <div className="rounded-lg border border-border overflow-hidden">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-muted/50">
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Completion Rate</th>
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">The Condition</th>
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Item</th>
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Stage</th>
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Number</th>
                                            {!isReadOnly && <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {completionStages.map((stage) => (
                                            <tr key={stage.id}>
                                                <td className="border border-border px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={stage.completionRate}
                                                        onChange={(e) => updateCompletionStage(stage.id, 'completionRate', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        placeholder="e.g., 100.00%"
                                                        disabled={isReadOnly}
                                                    />
                                                </td>
                                                <td className="border border-border px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={stage.theCondition}
                                                        onChange={(e) => updateCompletionStage(stage.id, 'theCondition', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    />
                                                </td>
                                                <td className="border border-border px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={stage.item}
                                                        onChange={(e) => updateCompletionStage(stage.id, 'item', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    />
                                                </td>
                                                <td className="border border-border px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={stage.stage}
                                                        onChange={(e) => updateCompletionStage(stage.id, 'stage', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    />
                                                </td>
                                                <td className="border border-border px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={stage.number}
                                                        onChange={(e) => updateCompletionStage(stage.id, 'number', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    />
                                                </td>
                                                {!isReadOnly && (
                                                    <td className="border border-border px-2 py-2 text-center">
                                                        <button
                                                            type="button"
                                                            onClick={() => removeCompletionStage(stage.id)}
                                                            className="text-error hover:text-error/80 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Project Obstacles */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 bg-orange-500/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3">
                                Project Obstacles
                            </h2>
                            <textarea
                                value={projectObstacles}
                                onChange={(e) => setProjectObstacles(e.target.value)}
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground min-h-[120px]"
                                placeholder="Describe any obstacles encountered during the project..."
                                disabled={isReadOnly}
                            />
                        </div>

                        {/* Visit Note */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 bg-orange-500/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3">
                                Visit Note
                            </h2>
                            <textarea
                                value={visitNote}
                                onChange={(e) => setVisitNote(e.target.value)}
                                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground min-h-[120px]"
                                placeholder="Add notes from site visit..."
                                disabled={isReadOnly}
                            />
                        </div>

                        {/* Project Photos */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 bg-orange-500/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3 flex-1">
                                    Project Photos
                                </h2>
                                <label className="cursor-pointer">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handlePhotoUpload(e.target.files)}
                                    />
                                    <div className="w-fit flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                        <Upload className="w-4 h-4" />
                                        Upload Photos
                                    </div>
                                </label>
                            </div>
                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => handlePhotoUpload(e.target.files)}
                                />
                                <div className="flex items-center justify-center gap-2 px-6 py-4 border-2 border-dashed border-border rounded-lg hover:border-primary transition-colors bg-muted/20">
                                    <Upload className="w-5 h-5 text-muted-foreground" />
                                    <span className="text-sm font-medium text-muted-foreground">Click to upload photos</span>
                                </div>
                            </label>
                            {
                                projectPhotos.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                                        {projectPhotos.map((photo, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={URL.createObjectURL(photo)}
                                                    alt={`Project photo ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg border border-border"
                                                />
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => removePhoto(index)}
                                                        className="absolute top-2 right-2 p-1 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    <label className="absolute bottom-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={(e) => {
                                                                if (e.target.files && e.target.files.length > 0) {
                                                                    const newPhotos = [...projectPhotos];
                                                                    newPhotos[index] = e.target.files[0];
                                                                    setProjectPhotos(newPhotos);
                                                                }
                                                            }}
                                                        />
                                                        <div className="p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-lg">
                                                            <Upload className="w-4 h-4" />
                                                        </div>
                                                    </label>
                                                </>
                                                <p className="text-xs text-muted-foreground mt-1 truncate">{photo.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                )
                            }
                        </div>
                        {!isReadOnly && (
                            <div className="flex justify-end mt-8">
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20"
                                >
                                    <Save className="w-5 h-5" />
                                    Save Survey Report
                                </button>
                            </div>
                        )}
                    </form>
                ) : (
                    <FormRecordsList
                        title="Survey Reports"
                        columns={["Report No", "Project Name", "Location", "Start Date", "Status"]}
                        records={mockRecords}
                    />
                )}
            </div>
        </div>
    );
}
