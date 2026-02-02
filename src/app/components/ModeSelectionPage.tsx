import { useNavigate } from "react-router-dom";
import { Building2, LayoutGrid, ArrowRight } from "lucide-react";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function ModeSelectionPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-violet-50 via-cyan-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Language Switcher - Top Right */}
            <div className="absolute top-6 right-6 z-20">
                <LanguageSwitcher />
            </div>

            {/* Mesh Gradients */}
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-100/30 via-transparent to-cyan-100/30 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(6,182,212,0.1),transparent_50%)] pointer-events-none"></div>

            <div className="w-full max-w-5xl relative z-10 animate-in fade-in zoom-in duration-500">
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/40 p-12 vibrant-glow relative overflow-hidden">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-500 via-purple-500 to-cyan-500"></div>

                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-600 via-purple-600 to-cyan-500 rounded-2xl shadow-xl shadow-violet-200 mb-6">
                            <Building2 className="w-10 h-10 text-white drop-shadow-lg" />
                        </div>
                        <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Welcome to Darb Station</h1>
                        <p className="text-lg text-gray-500 font-medium">Choose your access mode</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* All Stations Option */}
                        <button
                            onClick={() => navigate("/all-stations-dashboard")}
                            className="group relative bg-white/50 border-2 border-gray-100 p-10 rounded-3xl hover:border-violet-400 hover:shadow-2xl hover:shadow-violet-100 hover:-translate-y-2 transition-all text-center overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 bg-violet-100 rounded-2xl flex items-center justify-center group-hover:bg-violet-600 group-hover:scale-110 transition-all">
                                    <LayoutGrid className="w-10 h-10 text-violet-600 group-hover:text-white transition-colors" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">All Stations</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Access the complete dashboard with overview of all stations, analytics, and comprehensive station management
                            </p>

                            <div className="flex items-center justify-center gap-2 text-violet-600 font-bold group-hover:gap-4 transition-all">
                                <span>View All Stations</span>
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </button>

                        {/* Single Station Option */}
                        <button
                            onClick={() => navigate("/select-station")}
                            className="group relative bg-white/50 border-2 border-gray-100 p-10 rounded-3xl hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-100 hover:-translate-y-2 transition-all text-center overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <div className="mb-6 flex justify-center">
                                <div className="w-20 h-20 bg-cyan-100 rounded-2xl flex items-center justify-center group-hover:bg-cyan-600 group-hover:scale-110 transition-all">
                                    <Building2 className="w-10 h-10 text-cyan-600 group-hover:text-white transition-colors" />
                                </div>
                            </div>

                            <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">Station</h2>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Select a specific station to view detailed analytics and manage all forms for that particular location
                            </p>

                            <div className="flex items-center justify-center gap-2 text-cyan-600 font-bold group-hover:gap-4 transition-all">
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
