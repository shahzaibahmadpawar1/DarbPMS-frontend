import { useState } from "react";
import { useEffect } from "react";
import { Save, PlusCircle, Eye, Trash2, Upload, X } from "lucide-react";
import { useStation } from "../../context/StationContext";
import { useResolvedStationCode } from "../../hooks/useResolvedStationCode";

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
    stage: string;
    customStage: string;
    condition: string;
    completionRate: string;
    remarks: string;
    attachment: File | null;
    attachmentUrl?: string | null;
    attachmentName?: string | null;
}

interface DocumentUpload {
    name: string;
    file: File | null;
    fileUrl?: string | null;
    fileName?: string | null;
}

interface StoredAttachment {
    file: File | null;
    fileUrl?: string | null;
    fileName?: string | null;
    previewUrl?: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const normalizeStoredAttachment = (value: any): StoredAttachment | null => {
    if (!value) {
        return null;
    }

    if (typeof value === 'string') {
        return { file: null, fileUrl: value, fileName: null };
    }

    const fileUrl = value.fileUrl || value.url || null;
    const fileName = value.fileName || value.name || null;

    if (!fileUrl && !fileName) {
        return null;
    }

    return {
        file: null,
        fileUrl,
        fileName,
        previewUrl: value.previewUrl || fileUrl || null,
    };
};

const uploadSurveyFile = async (token: string, file: File): Promise<{ fileName: string; fileUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const result = await response.json();
    if (!response.ok) {
        throw new Error(result?.error || 'Failed to upload file');
    }

    return {
        fileName: result?.data?.fileName || file.name,
        fileUrl: result?.data?.url || result?.data?.publicUrl || '',
    };
};

export function SurveyReportForm() {
    const { accessMode, selectedStation } = useStation();
    const resolvedStationCode = useResolvedStationCode();
    const isReadOnly = accessMode === 'view-only';
    const [isSaving, setIsSaving] = useState(false);

    // Project Completion Rate Report
    const [projectStartDate, setProjectStartDate] = useState(isReadOnly ? "2024-01-15" : "");
    const [projectDeliveryDate, setProjectDeliveryDate] = useState(isReadOnly ? "2025-11-15" : "");
    const [typeOfContract, setTypeOfContract] = useState(isReadOnly ? "employment" : "");
    const [reportNumber, setReportNumber] = useState(isReadOnly ? "154/1/2025" : "");
    const [projectName, setProjectName] = useState(isReadOnly ? "Prince Fawaz - Jeddah" : "");
    const [city, setCity] = useState(isReadOnly ? "Jeddah" : "");
    const [location, setLocation] = useState(isReadOnly ? "https://maps.app.goo.gl/BsSRbvX1GwVzwEpd6" : "");
    const [theDate, setTheDate] = useState(isReadOnly ? "2024-01-15" : "");
    const [stationStatusCode, setStationStatusCode] = useState(isReadOnly ? "1" : "");
    const [stationStatusRemarks, setStationStatusRemarks] = useState(isReadOnly ? "Station is currently active and operating normally." : "");
    const [stationStatusStage, setStationStatusStage] = useState(isReadOnly ? "operating license" : "");
    const [stationStatusCustomStage, setStationStatusCustomStage] = useState("");
    const [stationStatusCondition, setStationStatusCondition] = useState(isReadOnly ? "Operational readiness verified" : "");
    const [stationStatusCompletionRate, setStationStatusCompletionRate] = useState(isReadOnly ? "100.00%" : "");
    const [stationStatusAttachment, setStationStatusAttachment] = useState<StoredAttachment | null>(null);

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
            { id: "1", stage: "operating license", customStage: "", condition: "License documents completed", completionRate: "100.00%", remarks: "Ready for compliance check", attachment: null },
            { id: "2", stage: "electricity connection", customStage: "", condition: "Grid connection under process", completionRate: "75.00%", remarks: "Awaiting final utility approval", attachment: null },
            { id: "3", stage: "other", customStage: "Fuel canopy setup", condition: "Steel structure completed", completionRate: "90.00%", remarks: "Pending final paint and signage", attachment: null },
        ] : []
    );

    // New sections
    const [projectObstacles, setProjectObstacles] = useState(isReadOnly ? "Sample obstacles text..." : "");
    const [visitNote, setVisitNote] = useState(isReadOnly ? "Sample visit notes..." : "");
    const [projectPhotos, setProjectPhotos] = useState<StoredAttachment[]>([]);

    const applyPayload = (payload: any) => {
        if (!payload || typeof payload !== 'object') return;

        setProjectStartDate(payload.projectStartDate || "");
        setProjectDeliveryDate(payload.projectDeliveryDate || "");
        setTypeOfContract(payload.typeOfContract || "");
        setReportNumber(payload.reportNumber || "");
        setProjectName(payload.projectName || "");
        setCity(payload.city || "");
        setLocation(payload.location || "");
        setTheDate(payload.theDate || "");
        setStationStatusCode(payload.stationStatusCode || "");
        setStationStatusRemarks(payload.stationStatusRemarks || "");
        setStationStatusStage(payload.stationStatusStage || "");
        setStationStatusCustomStage(payload.stationStatusCustomStage || "");
        setStationStatusCondition(payload.stationStatusCondition || "");
        setStationStatusCompletionRate(payload.stationStatusCompletionRate || "");
        setProjectComponents(Array.isArray(payload.projectComponents) ? payload.projectComponents : []);
        setMosqueAreas(Array.isArray(payload.mosqueAreas) ? payload.mosqueAreas : []);
        setFuelPumps(Array.isArray(payload.fuelPumps) ? payload.fuelPumps : []);
        setFuelTanks(Array.isArray(payload.fuelTanks) ? payload.fuelTanks : []);
        setProjectObstacles(payload.projectObstacles || "");
        setVisitNote(payload.visitNote || "");
        setCompletionStages(Array.isArray(payload.completionStages)
            ? payload.completionStages.map((stage: any) => ({
                ...stage,
                attachment: null,
                attachmentUrl: stage.attachmentUrl || stage.attachment || null,
                attachmentName: stage.attachmentName || null,
            }))
            : []);

        setStationStatusAttachment(normalizeStoredAttachment({
            fileUrl: payload.stationStatusAttachmentUrl || null,
            fileName: payload.stationStatusAttachmentName || null,
        }));

        if (Array.isArray(payload.projectDocuments) && payload.projectDocuments.length) {
            setProjectDocuments(payload.projectDocuments.map((doc: any) => ({
                name: doc.name || "Document",
                file: null,
                fileUrl: doc.fileUrl || null,
                fileName: doc.fileName || null,
            })));
        }

        if (Array.isArray(payload.licenseAuthorities) && payload.licenseAuthorities.length) {
            setLicenseAuthorities(payload.licenseAuthorities.map((doc: any) => ({
                name: doc.name || "Authority Document",
                file: null,
                fileUrl: doc.fileUrl || null,
                fileName: doc.fileName || null,
            })));
        }

        if (Array.isArray(payload.projectPhotos) && payload.projectPhotos.length) {
            setProjectPhotos(payload.projectPhotos.map((photo: any) => ({
                file: null,
                fileUrl: photo.fileUrl || photo.url || null,
                fileName: photo.fileName || photo.name || null,
                previewUrl: photo.fileUrl || photo.url || null,
            })));
        }
    };

    useEffect(() => {
        const stationCode = resolvedStationCode || selectedStation?.station_code;
        if (!stationCode) return;

        const token = localStorage.getItem('auth_token');
        if (!token) return;

        const loadSurvey = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/survey-reports/station/${encodeURIComponent(stationCode)}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) return;
                const result = await response.json();
                const payload = result?.data?.payload;
                if (payload) {
                    applyPayload(payload);
                }
            } catch (error) {
                console.error('Failed to load survey report:', error);
            }
        };

        loadSurvey();
    }, [resolvedStationCode, selectedStation?.station_code]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const stationCode = resolvedStationCode || selectedStation?.station_code;
        if (!stationCode) {
            alert('Station code is required to save survey report.');
            return;
        }

        setIsSaving(true);

        const token = localStorage.getItem('auth_token');
        if (!token) {
            alert('Authentication token is missing. Please log in again.');
            setIsSaving(false);
            return;
        }

        const uploadedStationStatusAttachment = stationStatusAttachment?.file
            ? await uploadSurveyFile(token, stationStatusAttachment.file)
            : null;

        const uploadedProjectDocuments = await Promise.all(projectDocuments.map(async (doc) => {
            const uploaded = doc.file ? await uploadSurveyFile(token, doc.file) : null;
            return {
                name: doc.name,
                fileName: uploaded?.fileName || doc.fileName || null,
                fileUrl: uploaded?.fileUrl || doc.fileUrl || null,
            };
        }));

        const uploadedLicenseAuthorities = await Promise.all(licenseAuthorities.map(async (doc) => {
            const uploaded = doc.file ? await uploadSurveyFile(token, doc.file) : null;
            return {
                name: doc.name,
                fileName: uploaded?.fileName || doc.fileName || null,
                fileUrl: uploaded?.fileUrl || doc.fileUrl || null,
            };
        }));

        const uploadedCompletionStages = await Promise.all(completionStages.map(async (stage) => {
            const uploaded = stage.attachment ? await uploadSurveyFile(token, stage.attachment) : null;
            return {
                ...stage,
                attachment: null,
                attachmentName: uploaded?.fileName || stage.attachmentName || null,
                attachmentUrl: uploaded?.fileUrl || stage.attachmentUrl || null,
            };
        }));

        const uploadedProjectPhotos = await Promise.all(projectPhotos.map(async (photo) => {
            const uploaded = photo.file ? await uploadSurveyFile(token, photo.file) : null;
            return {
                fileName: uploaded?.fileName || photo.fileName || null,
                fileUrl: uploaded?.fileUrl || photo.fileUrl || null,
            };
        }));

        const payload = {
            projectStartDate,
            projectDeliveryDate,
            typeOfContract,
            reportNumber,
            projectName,
            city,
            location,
            theDate,
            stationStatusCode,
            stationStatusStage,
            stationStatusCustomStage,
            stationStatusCondition,
            stationStatusCompletionRate,
            stationStatusRemarks,
            stationStatusAttachmentName: uploadedStationStatusAttachment?.fileName || stationStatusAttachment?.fileName || "",
            stationStatusAttachmentUrl: uploadedStationStatusAttachment?.fileUrl || stationStatusAttachment?.fileUrl || null,
            projectComponents,
            mosqueAreas,
            fuelPumps,
            fuelTanks,
            projectDocuments: uploadedProjectDocuments,
            licenseAuthorities: uploadedLicenseAuthorities,
            completionStages: uploadedCompletionStages,
            projectObstacles,
            visitNote,
            projectPhotos: uploadedProjectPhotos,
        };

        try {
            const response = await fetch(`${API_BASE_URL}/survey-reports/station/${encodeURIComponent(stationCode)}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ payload }),
            });

            const result = await response.json();
            if (!response.ok) {
                alert(result?.error || 'Failed to save survey report');
                return;
            }

            alert('Survey Report saved successfully!');
        } catch (error) {
            console.error('Error saving survey report:', error);
            alert('Failed to save survey report');
        } finally {
            setIsSaving(false);
        }
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
            stage: "",
            customStage: "",
            condition: "",
            completionRate: "",
            remarks: "",
            attachment: null,
        }]);
    };

    const removeCompletionStage = (id: string) => {
        setCompletionStages(completionStages.filter(stage => stage.id !== id));
    };

    const openPreview = (file?: File | null, fileUrl?: string | null) => {
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            window.open(previewUrl, '_blank', 'noopener,noreferrer');
            setTimeout(() => URL.revokeObjectURL(previewUrl), 60000);
            return;
        }
        if (fileUrl) {
            window.open(fileUrl, '_blank', 'noopener,noreferrer');
        }
    };

    const updateCompletionStage = (id: string, field: keyof CompletionStage, value: string) => {
        setCompletionStages(completionStages.map(stage =>
            stage.id === id ? { ...stage, [field]: value } : stage
        ));
    };

    const updateCompletionAttachment = (id: string, file: File | null) => {
        setCompletionStages(completionStages.map(stage =>
            stage.id === id ? { ...stage, attachment: file } : stage
        ));
    };

    const handleDocumentUpload = (index: number, file: File | null, type: 'project' | 'license') => {
        if (type === 'project') {
            const updated = [...projectDocuments];
            updated[index].file = file;
            if (file) {
                updated[index].fileName = file.name;
                updated[index].fileUrl = null;
            }
            setProjectDocuments(updated);
        } else {
            const updated = [...licenseAuthorities];
            updated[index].file = file;
            if (file) {
                updated[index].fileName = file.name;
                updated[index].fileUrl = null;
            }
            setLicenseAuthorities(updated);
        }
    };

    const handlePhotoUpload = (files: FileList | null) => {
        if (files) {
            const nextPhotos = Array.from(files).map((file) => ({
                file,
                fileName: file.name,
                previewUrl: URL.createObjectURL(file),
            }));
            setProjectPhotos([...projectPhotos, ...nextPhotos]);
        }
    };

    const removePhoto = (index: number) => {
        setProjectPhotos((prev) => {
            const next = [...prev];
            const removed = next[index];
            if (removed?.previewUrl?.startsWith('blob:')) {
                URL.revokeObjectURL(removed.previewUrl);
            }
            next.splice(index, 1);
            return next;
        });
    };

    return (
        <div className="w-full">
            <div className="p-4 sm:p-6 md:p-8 min-w-[1200px] lg:min-w-full text-foreground bg-background">
                <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Project Survey Report</h1>
                        <p className="text-muted-foreground mt-2 text-sm sm:text-base">Comprehensive project completion rate and survey documentation</p>
                    </div>

                    {isReadOnly && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-info/5 text-info rounded-lg border border-info/20">
                            <Eye className="w-4 h-4" />
                            <span className="text-sm font-semibold">View Only Mode</span>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-xl p-4 sm:p-6 md:p-8 card-glow border-t-4 border-primary relative animate-in fade-in slide-in-from-bottom-4 duration-500">

                        {/* Project Completion Rate Report */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 bg-primary/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3">
                                Project Completion Rate
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
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Expected Date</label>
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
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 bg-primary/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3 flex-1">
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
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 bg-primary/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3 flex-1">
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
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 bg-primary/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3 flex-1">
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
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 bg-primary/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3 flex-1">
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
                            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 bg-primary/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3">
                                Project Documents
                            </h2>
                            <div className="space-y-3 mt-4">
                                {projectDocuments.map((doc, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-border rounded-lg bg-muted/20">
                                        <span className="text-sm font-medium text-foreground flex-1 break-words">{doc.name}</span>
                                        {(doc.file || doc.fileName || doc.fileUrl) && (
                                            <span className="text-xs text-success flex-shrink-0">{doc.file?.name || doc.fileName || doc.fileUrl}</span>
                                        )}
                                        {(doc.file || doc.fileUrl) && (
                                            <button
                                                type="button"
                                                onClick={() => openPreview(doc.file, doc.fileUrl || null)}
                                                className="px-2 py-1 text-xs border border-border rounded-md hover:bg-muted"
                                            >
                                                View
                                            </button>
                                        )}
                                        {!isReadOnly && (
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
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* License Authorities */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 bg-primary/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3">
                                License Authorities
                            </h2>
                            <div className="space-y-3 mt-4">
                                {licenseAuthorities.map((auth, index) => (
                                    <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 border border-border rounded-lg bg-muted/20">
                                        <span className="text-sm font-medium text-foreground flex-1 break-words">{auth.name}</span>
                                        {(auth.file || auth.fileName || auth.fileUrl) && (
                                            <span className="text-xs text-success flex-shrink-0">{auth.file?.name || auth.fileName || auth.fileUrl}</span>
                                        )}
                                        {(auth.file || auth.fileUrl) && (
                                            <button
                                                type="button"
                                                onClick={() => openPreview(auth.file, auth.fileUrl || null)}
                                                className="px-2 py-1 text-xs border border-border rounded-md hover:bg-muted"
                                            >
                                                View
                                            </button>
                                        )}
                                        {!isReadOnly && (
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
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Completion Stages */}
                        <div className="mb-8">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 bg-primary/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3 flex-1">
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
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Stage</th>
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Condition</th>
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Completion Rate</th>
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Remarks</th>
                                            <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Attachment</th>
                                            {!isReadOnly && <th className="border border-border px-4 py-2 text-left text-sm font-semibold">Actions</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {completionStages.map((stage) => (
                                            <tr key={stage.id}>
                                                <td className="border border-border px-2 py-2">
                                                    <div className="space-y-2">
                                                        <select
                                                            value={stage.stage}
                                                            onChange={(e) => updateCompletionStage(stage.id, 'stage', e.target.value)}
                                                            className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                            disabled={isReadOnly}
                                                        >
                                                            <option value="">Select Stage</option>
                                                            <option value="operating license">operating license</option>
                                                            <option value="electricity connection">electricity connection</option>
                                                            <option value="automation">automation</option>
                                                            <option value="cameras">cameras</option>
                                                            <option value="finishing stage">finishing stage</option>
                                                            <option value="it works">it works</option>
                                                            <option value="other">other</option>
                                                        </select>
                                                        {stage.stage === 'other' && (
                                                            <input
                                                                type="text"
                                                                value={stage.customStage}
                                                                onChange={(e) => updateCompletionStage(stage.id, 'customStage', e.target.value)}
                                                                className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                                placeholder="Enter custom stage"
                                                                disabled={isReadOnly}
                                                            />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="border border-border px-2 py-2">
                                                    <input
                                                        type="text"
                                                        value={stage.condition}
                                                        onChange={(e) => updateCompletionStage(stage.id, 'condition', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted"
                                                        disabled={isReadOnly}
                                                    />
                                                </td>
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
                                                    <textarea
                                                        value={stage.remarks}
                                                        onChange={(e) => updateCompletionStage(stage.id, 'remarks', e.target.value)}
                                                        className="w-full px-2 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-primary rounded bg-background text-foreground disabled:bg-muted min-h-[70px]"
                                                        placeholder="Add comment or remark"
                                                        disabled={isReadOnly}
                                                    />
                                                </td>
                                                <td className="border border-border px-2 py-2">
                                                    <div className="flex flex-col gap-2">
                                                        {!isReadOnly && (
                                                            <label className="cursor-pointer w-fit">
                                                                <input
                                                                    type="file"
                                                                    className="hidden"
                                                                    onChange={(e) => updateCompletionAttachment(stage.id, e.target.files?.[0] || null)}
                                                                />
                                                                <div className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                                                                    <Upload className="w-5 h-5 text-primary" />
                                                                </div>
                                                            </label>
                                                        )}
                                                        {stage.attachment && (
                                                            <span className="text-xs text-muted-foreground truncate">{stage.attachment.name}</span>
                                                        )}
                                                        {!stage.attachment && (stage as any).attachmentUrl && (
                                                            <button
                                                                type="button"
                                                                className="px-2 py-1 text-xs border border-border rounded-md hover:bg-muted"
                                                                onClick={() => openPreview(null, (stage as any).attachmentUrl)}
                                                            >
                                                                View
                                                            </button>
                                                        )}
                                                        {!stage.attachment && (stage as any).attachmentName && (
                                                            <span className="text-xs text-muted-foreground truncate">{(stage as any).attachmentName}</span>
                                                        )}
                                                        {!stage.attachment && isReadOnly && (
                                                            <span className="text-xs text-muted-foreground">No attachment</span>
                                                        )}
                                                    </div>
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

                        {/* Station Status */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 bg-primary/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3">
                                Station Status
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Status</label>
                                    <select
                                        value={stationStatusCode}
                                        onChange={(e) => setStationStatusCode(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                        disabled={isReadOnly}
                                    >
                                        <option value="">Select Status</option>
                                        <option value="1">Active</option>
                                        <option value="2">Inactive</option>
                                        <option value="3">Under Construction</option>
                                        <option value="4">Under Development</option>
                                        <option value="5">Pending</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Stage</label>
                                    <select
                                        value={stationStatusStage}
                                        onChange={(e) => setStationStatusStage(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                        disabled={isReadOnly}
                                    >
                                        <option value="">Select Stage</option>
                                        <option value="operating license">operating license</option>
                                        <option value="electricity connection">electricity connection</option>
                                        <option value="automation">automation</option>
                                        <option value="cameras">cameras</option>
                                        <option value="finishing stage">finishing stage</option>
                                        <option value="it works">it works</option>
                                        <option value="other">other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Condition</label>
                                    <input
                                        type="text"
                                        value={stationStatusCondition}
                                        onChange={(e) => setStationStatusCondition(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                        disabled={isReadOnly}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Completion Rate</label>
                                    <input
                                        type="text"
                                        value={stationStatusCompletionRate}
                                        onChange={(e) => setStationStatusCompletionRate(e.target.value)}
                                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                        placeholder="e.g., 100.00%"
                                        disabled={isReadOnly}
                                    />
                                </div>
                                {stationStatusStage === 'other' && (
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-1">Custom Stage</label>
                                        <input
                                            type="text"
                                            value={stationStatusCustomStage}
                                            onChange={(e) => setStationStatusCustomStage(e.target.value)}
                                            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                                            placeholder="Enter custom stage"
                                            disabled={isReadOnly}
                                        />
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Attachment</label>
                                    <div className="flex items-center gap-2 min-h-[42px]">
                                        {!isReadOnly && (
                                            <label className="cursor-pointer">
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0] || null;
                                                        setStationStatusAttachment(file ? { file, fileName: file.name, fileUrl: null, previewUrl: URL.createObjectURL(file) } : null);
                                                    }}
                                                />
                                                <div className="p-2 hover:bg-primary/10 rounded-lg transition-colors">
                                                    <Upload className="w-5 h-5 text-primary" />
                                                </div>
                                            </label>
                                        )}
                                            {stationStatusAttachment ? (
                                            <button
                                                type="button"
                                                className="px-2 py-1 text-xs border border-border rounded-md hover:bg-muted"
                                                    onClick={() => openPreview(stationStatusAttachment.file, stationStatusAttachment.fileUrl || stationStatusAttachment.previewUrl || null)}
                                            >
                                                    View {stationStatusAttachment.file?.name || stationStatusAttachment.fileName || 'Attachment'}
                                            </button>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">No attachment</span>
                                        )}
                                    </div>
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Remarks</label>
                                    <textarea
                                        value={stationStatusRemarks}
                                        onChange={(e) => setStationStatusRemarks(e.target.value)}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground min-h-[120px]"
                                        placeholder="Add remarks, e.g., why station is pending..."
                                        disabled={isReadOnly}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Project Obstacles */}
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 bg-primary/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3">
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
                            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2 bg-primary/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3">
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
                                <h2 className="text-xl font-semibold text-foreground border-b border-border pb-2 bg-primary/10 px-4 -mx-4 sm:px-6 sm:-mx-6 md:px-8 md:-mx-8 py-3 flex-1">
                                    Project Photos
                                </h2>
                                {!isReadOnly && (
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
                                )}
                            </div>
                            {!isReadOnly && (
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
                            )}
                            {
                                projectPhotos.length > 0 && (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                                        {projectPhotos.map((photo, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={photo.previewUrl || photo.fileUrl || ''}
                                                    alt={photo.fileName || `Project photo ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg border border-border"
                                                />
                                                <>
                                                    {!isReadOnly && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removePhoto(index)}
                                                            className="absolute top-2 right-2 p-1 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    {!isReadOnly && (
                                                        <label className="absolute bottom-2 right-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                className="hidden"
                                                                onChange={(e) => {
                                                                    if (e.target.files && e.target.files.length > 0) {
                                                                        const file = e.target.files[0];
                                                                        setProjectPhotos((prev) => {
                                                                            const next = [...prev];
                                                                            const previous = next[index];
                                                                            if (previous?.previewUrl?.startsWith('blob:')) {
                                                                                URL.revokeObjectURL(previous.previewUrl);
                                                                            }
                                                                            next[index] = { file, fileName: file.name, previewUrl: URL.createObjectURL(file) };
                                                                            return next;
                                                                        });
                                                                    }
                                                                }}
                                                            />
                                                            <div className="p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-lg">
                                                                <Upload className="w-4 h-4" />
                                                            </div>
                                                        </label>
                                                    )}
                                                </>
                                                <p className="text-xs text-muted-foreground mt-1 truncate">{photo.fileName || photo.file?.name || photo.fileUrl}</p>
                                                {(photo.file || photo.fileUrl) && (
                                                    <button
                                                        type="button"
                                                        className="mt-1 text-xs border border-border rounded-md px-2 py-1 hover:bg-muted"
                                                        onClick={() => openPreview(photo.file, photo.fileUrl || photo.previewUrl || null)}
                                                    >
                                                        View
                                                    </button>
                                                )}
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
                                    disabled={isSaving}
                                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20"
                                >
                                    <Save className="w-5 h-5" />
                                    {isSaving ? 'Saving...' : 'Save Survey Report'}
                                </button>
                            </div>
                        )}
                </form>
            </div>
        </div>
    );
}

