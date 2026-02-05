import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    MapPin,
    Map as MapIcon,
    Layout,
    ArrowRight,
    ChevronRight,
    ChevronLeft,
    CheckCircle2
} from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useStation } from "../context/StationContext";
import logo from "../../assets/logo.png";

// Demo Data - Reorganized: Region → City → Project → Location
const demoData = {
    regions: [
        {
            id: "central",
            name: "Central Region",
            cities: [
                {
                    id: "riyadh",
                    name: "Riyadh",
                    projects: [
                        { id: "p-exp-1", name: "North Darb Expansion", locations: ["Location N101", "Location N102", "Location N103"] },
                        { id: "p-exp-2", name: "Riyadh Metro Link", locations: ["RML-01", "RML-02"] }
                    ]
                },
                {
                    id: "qassim",
                    name: "Qassim",
                    projects: [
                        { id: "p-qas-1", name: "Qassim Industrial Hub", locations: ["QIH-01", "QIH-02"] }
                    ]
                }
            ]
        },
        {
            id: "western",
            name: "Western Region",
            cities: [
                {
                    id: "jeddah",
                    name: "Jeddah",
                    projects: [
                        { id: "p-cor-1", name: "Red Sea Front", locations: ["RSF-Location 1", "RSF-Location 2"] }
                    ]
                },
                {
                    id: "makkah",
                    name: "Makkah",
                    projects: [
                        { id: "p-mak-1", name: "Holy Sites Development", locations: ["HSD-01", "HSD-02"] }
                    ]
                }
            ]
        },
        {
            id: "eastern",
            name: "Eastern Region",
            cities: [
                {
                    id: "dammam",
                    name: "Dammam",
                    projects: [
                        { id: "p-dam-1", name: "Industrial Zone A", locations: ["IZA-01", "IZA-02"] }
                    ]
                }
            ]
        }
    ]
};

export function StationSelectionPage() {
    const navigate = useNavigate();
    const { setSelectedStation } = useStation();
    const [step, setStep] = useState(1);
    const [selectedRegion, setSelectedRegion] = useState<any>(null);
    const [selectedCity, setSelectedCity] = useState<any>(null);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [selectedLocation, setSelectedLocation] = useState("");

    const handleRegionSelect = (region: any) => {
        setSelectedRegion(region);
        setStep(2);
    };

    const handleCitySelect = (city: any) => {
        setSelectedCity(city);
        setStep(3);
    };

    const handleProjectSelect = (project: any) => {
        setSelectedProject(project);
        setStep(4);
    };

    const handleLocationSelect = (location: string) => {
        setSelectedLocation(location);
    };

    const handleConfirm = () => {
        if (selectedLocation && selectedRegion && selectedCity && selectedProject) {
            // Save the selected station to context
            setSelectedStation({
                id: selectedLocation.toLowerCase().replace(/\s+/g, "-"),
                name: selectedLocation,
                region: selectedRegion.name,
                city: selectedCity.name,
                project: selectedProject.name,
            });
            navigate("/dashboard");
        }
    };

    const resetToStep = (targetStep: number) => {
        if (targetStep < step) {
            setStep(targetStep);
            if (targetStep <= 3) setSelectedLocation("");
            if (targetStep <= 2) setSelectedProject(null);
            if (targetStep <= 1) setSelectedCity(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-muted via-background to-muted flex items-center justify-center p-4 relative overflow-hidden">
            {/* Language Switcher - Top Right */}
            <div className="absolute top-6 right-6 z-20">
                <LanguageSwitcher />
            </div>

            {/* Mesh Gradients */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.05),transparent_50%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.05),transparent_50%)] pointer-events-none"></div>

            <div className="w-full max-w-4xl relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="bg-card/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-border p-8 md:p-12 card-glow relative overflow-hidden min-h-[600px] flex flex-col">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 gradient-primary"></div>

                    {/* Breadcrumbs / Steps */}
                    <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-4 no-scrollbar">
                        <button
                            onClick={() => resetToStep(1)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${step >= 1 ? 'text-primary bg-primary/10' : 'text-gray-400'}`}
                        >
                            <MapIcon className="w-4 h-4" />
                            Region {selectedRegion && `: ${selectedRegion.name}`}
                        </button>
                        {selectedRegion && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}

                        {(selectedRegion || step === 2) && (
                            <button
                                onClick={() => resetToStep(2)}
                                disabled={step < 2}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${step >= 2 ? 'text-primary bg-primary/10' : 'text-gray-400'}`}
                            >
                                <MapPin className="w-4 h-4" />
                                City {selectedCity && `: ${selectedCity.name}`}
                            </button>
                        )}
                        {selectedCity && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}

                        {(selectedCity || step === 3) && (
                            <button
                                onClick={() => resetToStep(3)}
                                disabled={step < 3}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${step >= 3 ? 'text-primary bg-primary/10' : 'text-gray-400'}`}
                            >
                                <Layout className="w-4 h-4" />
                                Project {selectedProject && `: ${selectedProject.name}`}
                            </button>
                        )}
                        {selectedProject && <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}

                        {(selectedProject || step === 4) && (
                            <button
                                disabled={step < 4}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${step >= 4 ? 'text-gray-600 bg-gray-50' : 'text-gray-400'}`}
                            >
                                <img src={logo} alt="Location" className="w-4 h-4 object-contain" />
                                Location
                            </button>
                        )}
                    </div>

                    <div className="flex-1 flex flex-col justify-center max-w-3xl mx-auto w-full">
                        {step === 1 && (
                            <div className="animate-in slide-in-from-right-8 duration-500">
                                <h2 className="text-4xl font-black text-gray-900 mb-2 leading-tight">Select Region</h2>
                                <p className="text-gray-500 font-medium mb-8">Choose your operational region</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {demoData.regions.map((region) => (
                                        <button
                                            key={region.id}
                                            onClick={() => handleRegionSelect(region)}
                                            className="group bg-white/50 border border-border p-6 rounded-2xl hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all text-left flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                                                    <MapIcon className="w-6 h-6 text-primary group-hover:text-white" />
                                                </div>
                                                <span className="text-xl font-bold text-foreground tracking-tight">{region.name}</span>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-in slide-in-from-right-8 duration-500">
                                <div className="flex items-center gap-2 mb-2 group cursor-pointer" onClick={() => setStep(1)}>
                                    <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                                    <span className="text-sm font-bold text-gray-400 group-hover:text-primary">Back to Regions</span>
                                </div>
                                <h2 className="text-4xl font-black text-gray-900 mb-2 leading-tight">Select City</h2>
                                <p className="text-gray-500 font-medium mb-8">In {selectedRegion?.name}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {selectedRegion?.cities.map((city: any) => (
                                        <button
                                            key={city.id}
                                            onClick={() => handleCitySelect(city)}
                                            className="group bg-white/50 border border-border p-6 rounded-2xl hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all text-left flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                                                    <MapPin className="w-6 h-6 text-primary group-hover:text-white" />
                                                </div>
                                                <span className="text-xl font-bold text-gray-800 tracking-tight">{city.name}</span>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-in slide-in-from-right-8 duration-500">
                                <div className="flex items-center gap-2 mb-2 group cursor-pointer" onClick={() => setStep(2)}>
                                    <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                                    <span className="text-sm font-bold text-gray-400 group-hover:text-primary">Back to Cities</span>
                                </div>
                                <h2 className="text-4xl font-black text-gray-900 mb-2 leading-tight">Select Project</h2>
                                <p className="text-gray-500 font-medium mb-8">In {selectedCity?.name}</p>
                                <div className="grid grid-cols-1 gap-4">
                                    {selectedCity?.projects.map((project: any) => (
                                        <button
                                            key={project.id}
                                            onClick={() => handleProjectSelect(project)}
                                            className="group bg-white/50 border border-border p-6 rounded-2xl hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all text-left flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors">
                                                    <Layout className="w-6 h-6 text-primary group-hover:text-white" />
                                                </div>
                                                <span className="text-xl font-bold text-gray-800 tracking-tight">{project.name}</span>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="animate-in slide-in-from-right-8 duration-500">
                                <div className="flex items-center gap-2 mb-2 group cursor-pointer" onClick={() => setStep(3)}>
                                    <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-primary" />
                                    <span className="text-sm font-bold text-gray-400 group-hover:text-primary">Back to Projects</span>
                                </div>
                                <h2 className="text-4xl font-black text-gray-900 mb-2 leading-tight">Select Location</h2>
                                <p className="text-gray-500 font-medium mb-8">For project: {selectedProject?.name}</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                    {selectedProject?.locations.map((location: string) => (
                                        <button
                                            key={location}
                                            onClick={() => handleLocationSelect(location)}
                                            className={`group p-6 rounded-2xl border transition-all text-left flex items-center justify-between ${selectedLocation === location
                                                ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20'
                                                : 'bg-white/50 border-border text-foreground hover:border-primary/40 hover:shadow-lg'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors p-2 ${selectedLocation === location ? 'bg-white/20' : 'bg-white shadow-sm'
                                                    }`}>
                                                    <img src={logo} alt="Station" className="w-full h-full object-contain" />
                                                </div>
                                                <span className="text-xl font-bold tracking-tight">{location}</span>
                                            </div>
                                            {selectedLocation === location && <CheckCircle2 className="w-6 h-6 text-white" />}
                                        </button>
                                    ))}
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={handleConfirm}
                                        disabled={!selectedLocation}
                                        className={`btn-primary px-10 py-5 rounded-[2rem] font-black text-xl flex items-center gap-3 transition-all ${!selectedLocation ? 'opacity-50 grayscale' : 'hover:scale-105'
                                            }`}
                                    >
                                        Enter Dashboard
                                        <ArrowRight className="w-6 h-6" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 text-center text-sm font-medium text-muted-foreground tracking-wider uppercase">
                        Project Management System • Step {step} of 4
                    </div>
                </div>
            </div>
        </div>
    );
}
