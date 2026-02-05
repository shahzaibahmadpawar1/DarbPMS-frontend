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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-gray-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Language Switcher - Top Right */}
            <div className="absolute top-6 right-6 z-20">
                <LanguageSwitcher />
            </div>

            {/* Mesh Gradients */}
            <div className="absolute inset-0 bg-gradient-to-tr from-orange-100/30 via-transparent to-gray-100/30 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1),transparent_50%)] pointer-events-none"></div>

            <div className="w-full max-w-5xl relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/40 p-12 vibrant-glow relative overflow-hidden">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-orange-500 to-gray-500"></div>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl shadow-orange-200 mb-6 p-2">
                            <img src={logo} alt="Darb Logo" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Welcome to <BrandName /> Station</h1>
                        <p className="text-lg text-gray-500 font-medium">Choose your access mode</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* All Stations Option */}
                        <button
                            onClick={() => handleModeSelect('admin', "/all-stations-dashboard")}
                            className="group relative bg-white/50 border-2 border-gray-100 p-10 rounded-3xl hover:border-orange-400 hover:shadow-2xl hover:shadow-orange-100 hover:-translate-y-2 transition-all text-center overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all p-4 shadow-md">
                                    <img src={logo} alt="All Stations" className="w-full h-full object-contain" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">All Stations</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Access the complete dashboard with overview of all stations, analytics, and comprehensive station management
                            </p>

                            <div className="flex items-center justify-center gap-2 text-orange-600 font-bold group-hover:gap-4 transition-all">
                                <span>View All Stations</span>
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </button>

                        {/* Single Station Option */}
                        <button
                            onClick={() => handleModeSelect('view-only', "/select-station")}
                            className="group relative bg-white/50 border-2 border-gray-100 p-10 rounded-3xl hover:border-gray-400 hover:shadow-2xl hover:shadow-gray-100 hover:-translate-y-2 transition-all text-center overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all p-3 shadow-md">
                                    <img src={logo} alt="Station" className="w-full h-full object-contain" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Station</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Select a specific station to view detailed analytics and manage all forms for that particular location
                            </p>

                            <div className="flex items-center justify-center gap-2 text-gray-600 font-bold group-hover:gap-4 transition-all">
                                <span>Select Station</span>
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </button>
                    </div>

                    <div className="mt-12 text-center text-sm font-medium text-gray-400 tracking-wider uppercase">
                        Project Management System
                    </div>
                </div>
            </div>
        </div>
    );
}
