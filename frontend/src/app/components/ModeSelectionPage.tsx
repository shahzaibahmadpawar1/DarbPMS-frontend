import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { BrandName } from "./BrandName";
import { useStation } from "../context/StationContext";
import logo from "../../assets/logo.png";

export function ModeSelectionPage() {
    const navigate = useNavigate();
    const { setAccessMode } = useStation();

    const handleModeSelect = (mode: 'admin' | 'view-only', path: string) => {
        setAccessMode(mode);
        navigate(path);
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

            <div className="w-full max-w-5xl relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="bg-card/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-border card-glow p-12 relative overflow-hidden">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 gradient-primary"></div>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-background rounded-2xl shadow-xl shadow-primary/10 mb-6 p-2 border border-border">
                            <img src={logo} alt="Darb Logo" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-4xl font-black text-foreground mb-3 tracking-tight">Welcome to <BrandName /> Station</h1>
                        <p className="text-lg text-muted-foreground font-medium">Choose your access mode</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* All Stations Option */}
                        <button
                            onClick={() => handleModeSelect('admin', "/all-stations-dashboard")}
                            className="group relative bg-background border-2 border-border p-10 rounded-3xl hover:border-primary hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all text-center overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 gradient-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all p-4 shadow-md">
                                    <img src={logo} alt="All Stations" className="w-full h-full object-contain" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-foreground mb-3 tracking-tight">All Stations</h2>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                Access the complete dashboard with overview of all stations, analytics, and comprehensive station management
                            </p>

                            <div className="flex items-center justify-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
                                <span>View All Stations</span>
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </button>

                        {/* Single Station Option */}
                        <button
                            onClick={() => handleModeSelect('admin', "/select-station")}
                            className="group relative bg-background border-2 border-border p-10 rounded-3xl hover:border-secondary hover:shadow-2xl hover:shadow-secondary/10 hover:-translate-y-2 transition-all text-center overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 gradient-primary-to-secondary opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all p-3 shadow-md">
                                    <img src={logo} alt="Station" className="w-full h-full object-contain" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-foreground mb-3 tracking-tight">Station</h2>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                Select a specific station to manage and edit all forms, data, and information for that particular location
                            </p>

                            <div className="flex items-center justify-center gap-2 text-secondary font-bold group-hover:gap-4 transition-all">
                                <span>Select Station</span>
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </button>
                    </div>

                    <div className="mt-12 text-center text-sm font-medium text-muted-foreground tracking-wider uppercase">
                        Project Management System
                    </div>
                </div>
            </div>
        </div>
    );
}
