import { useStation } from "../context/StationContext";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp, Activity, AlertCircle, CheckCircle2, Clock, DollarSign } from "lucide-react";
import logo from "../../assets/logo.png";

export function SingleStationAnalytics() {
    const { selectedStation } = useStation();

    // Use selected station or a default for demo purposes
    const station = selectedStation || {
        id: "location-n101",
        name: "Location N101",
        region: "Central Region",
        city: "Riyadh",
        project: "North Darb Expansion"
    };

    // Demo data for the specific station
    const stationData = {
        name: station.name,
        status: "Active",
        completion: 75,
        budget: "2.5M SAR",
        spent: "1.8M SAR",
        formsCompleted: 11,
        totalForms: 15,
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow p-8 mb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl p-2">
                        <img src={logo} alt="Darb Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">{stationData.name}</h1>
                        <p className="text-gray-600 font-medium">Station Analytics Dashboard</p>
                        <p className="text-sm text-gray-500 mt-1">{station.region} • {station.city} • {station.project}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-600">Form Completion</span>
                        <span className="text-sm font-bold text-violet-600">
                            {stationData.formsCompleted}/{stationData.totalForms} ({Math.round((stationData.formsCompleted / stationData.totalForms) * 100)}%)
                        </span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-orange-600 to-gray-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.round((stationData.formsCompleted / stationData.totalForms) * 100)}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Activity className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-600">Status</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900">{stationData.status}</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-600">Completion</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900">{stationData.completion}%</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-violet-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-600">Budget</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900">{stationData.budget}</p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                        </div>
                        <span className="text-sm font-bold text-gray-600">Spent</span>
                    </div>
                    <p className="text-2xl font-black text-gray-900">{stationData.spent}</p>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Form Completion Donut Chart */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow p-6">
                    <h3 className="text-xl font-black text-gray-900 mb-6">Form Completion Status</h3>
                    <div className="flex items-center justify-center">
                        <div className="relative w-64 h-64">
                            {/* SVG Donut Chart */}
                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                {/* Background circle */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#e5e7eb"
                                    strokeWidth="12"
                                />
                                {/* Completed segment */}
                                <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="url(#gradient1)"
                                    strokeWidth="12"
                                    strokeDasharray={`${(stationData.formsCompleted / stationData.totalForms) * 251.2} 251.2`}
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#f97316" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <p className="text-4xl font-black text-gray-900">{stationData.formsCompleted}/{stationData.totalForms}</p>
                                <p className="text-sm font-semibold text-gray-600">Forms Complete</p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-orange-600 to-gray-600"></div>
                            <span className="text-sm font-medium text-gray-700">Completed: {stationData.formsCompleted}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                            <span className="text-sm font-medium text-gray-700">Remaining: {stationData.totalForms - stationData.formsCompleted}</span>
                        </div>
                    </div>
                </div>

                {/* Budget Progress Chart */}
                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow p-6">
                    <h3 className="text-xl font-black text-gray-900 mb-6">Budget Utilization</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-700">Total Budget</span>
                                <span className="text-sm font-bold text-gray-900">{stationData.budget}</span>
                            </div>
                            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-orange-600 to-gray-600 rounded-full transition-all duration-500"
                                    style={{ width: '72%' }}
                                ></div>
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-xs font-medium text-gray-600">Spent: {stationData.spent}</span>
                                <span className="text-xs font-medium text-gray-600">72% Used</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                            <div className="bg-violet-50 rounded-xl p-4">
                                <p className="text-xs font-semibold text-violet-600 mb-1">Allocated</p>
                                <p className="text-2xl font-black text-violet-900">{stationData.budget}</p>
                            </div>
                            <div className="bg-cyan-50 rounded-xl p-4">
                                <p className="text-xs font-semibold text-cyan-600 mb-1">Remaining</p>
                                <p className="text-2xl font-black text-cyan-900">0.7M SAR</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline Progress */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow p-6 mb-8">
                <h3 className="text-xl font-black text-gray-900 mb-6">Project Timeline</h3>
                <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200"></div>
                    <div className="absolute left-0 top-0 w-1 bg-gradient-to-b from-orange-600 to-gray-600" style={{ height: '75%' }}></div>

                    <div className="space-y-6 pl-8">
                        <div className="relative">
                            <div className="absolute -left-[33px] w-3 h-3 rounded-full bg-violet-600 border-4 border-white shadow-lg"></div>
                            <div className="bg-violet-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle2 className="w-4 h-4 text-violet-600" />
                                    <p className="font-bold text-violet-900">Planning Phase</p>
                                </div>
                                <p className="text-sm text-gray-600">Completed on Jan 15, 2026</p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[33px] w-3 h-3 rounded-full bg-cyan-600 border-4 border-white shadow-lg"></div>
                            <div className="bg-cyan-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="w-4 h-4 text-cyan-600" />
                                    <p className="font-bold text-cyan-900">Construction Phase</p>
                                </div>
                                <p className="text-sm text-gray-600">In Progress - 75% Complete</p>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute -left-[33px] w-3 h-3 rounded-full bg-gray-300 border-4 border-white shadow-lg"></div>
                            <div className="bg-gray-50 rounded-xl p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <p className="font-bold text-gray-700">Final Inspection</p>
                                </div>
                                <p className="text-sm text-gray-600">Scheduled for Mar 1, 2026</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* License Status Grid */}
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 vibrant-glow p-6">
                <h3 className="text-xl font-black text-gray-900 mb-6">License & Permit Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { name: "Commercial License", status: "Active", color: "green" },
                        { name: "Building Permit", status: "Active", color: "green" },
                        { name: "Salamah License", status: "Pending", color: "yellow" },
                        { name: "Environmental License", status: "Active", color: "green" },
                        { name: "Energy License", status: "Active", color: "green" },
                        { name: "Taqyees License", status: "Pending", color: "yellow" },
                    ].map((license) => (
                        <div key={license.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-sm font-semibold text-gray-700">{license.name}</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${license.color === "green"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                                }`}>
                                {license.status}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
