import { Link } from "react-router-dom";
import { useStation } from "../context/StationContext";
import { Activity, AlertCircle, CheckCircle2, CheckCircle, XCircle } from "lucide-react";
import logo from "../../assets/logo.png";
import { stationSections } from "../data/formSections";

export function SingleStationDashboard() {
    const { selectedStation } = useStation();

    // Use selected station or a default for demo purposes
    const station = selectedStation || {
        id: "location-n101",
        station_code: "N101",
        name: "Location N101",
        region: "Central Region",
        city: "Riyadh",
        project: "North Darb Expansion"
    };

    // Demo data for the specific station
    const totalForms = stationSections.reduce((sum, section) => sum + section.items.length, 0);
    const formsCompleted = stationSections.reduce((sum, section) => sum + section.items.filter((item) => item.completed).length, 0);
    const stationData = {
        name: station.name,
        status: "Active",
        region: station.region,
        city: station.city,
        expansion: station.project,
        completion: Math.round((formsCompleted / totalForms) * 100),
        formsCompleted,
        totalForms,
    };

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="bg-card/80 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-lg border border-border card-glow p-4 sm:p-6 md:p-8 mb-4 md:mb-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl p-2">
                        <img src={logo} alt="Darb Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-1">
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight truncate">{stationData.name}</h1>
                            <span className="px-2 sm:px-3 py-1 bg-success/10 text-success rounded-full text-xs font-bold w-fit">
                                {stationData.status}
                            </span>
                        </div>
                        <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">
                            {stationData.region} • {stationData.city} • {stationData.expansion}
                        </p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 sm:mt-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs sm:text-sm font-semibold text-muted-foreground">Form Completion</span>
                        <span className="text-xs sm:text-sm font-bold text-primary">
                            {stationData.formsCompleted}/{stationData.totalForms} ({stationData.completion}%)
                        </span>
                    </div>
                    <div className="w-full h-2 sm:h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full gradient-primary rounded-full transition-all duration-500"
                            style={{ width: `${stationData.completion}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-4 md:mb-8">
                <div className="bg-card/80 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-lg border border-border card-glow p-4 sm:p-5 md:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-success/10 rounded-lg flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-muted-foreground">Completed</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-foreground">{stationData.formsCompleted}</p>
                </div>

                <div className="bg-card/80 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-lg border border-border card-glow p-4 sm:p-5 md:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-muted-foreground">Pending</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-foreground">{stationData.totalForms - stationData.formsCompleted}</p>
                </div>

                <div className="bg-card/80 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-lg border border-border card-glow p-4 sm:p-5 md:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-info/10 rounded-lg flex items-center justify-center">
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-info" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-muted-foreground">Progress</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-foreground">{stationData.completion}%</p>
                </div>

                <div className="bg-card/80 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-lg border border-border card-glow p-4 sm:p-5 md:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <span className="text-xs sm:text-sm font-bold text-muted-foreground">Status</span>
                    </div>
                    <p className="text-lg sm:text-xl md:text-2xl font-black text-foreground">{stationData.status}</p>
                </div>
            </div>

            {/* Forms Grid */}
            {stationSections.map((section) => (
                <div key={section.group} className="mb-6 md:mb-8">
                    <h2 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 md:mb-4 px-2">
                        {section.group}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        {section.items.map((item) => (
                            <Link
                                key={item.title}
                                to={item.path}
                                className={`rounded-lg md:rounded-xl shadow-md border p-3 md:p-4 hover:shadow-xl hover:scale-105 transition-all duration-200 card-glow group flex items-center justify-between ${item.completed
                                    ? 'bg-success/5 border-success/20 hover:bg-success/10'
                                    : 'bg-error/5 border-error/20 hover:bg-error/10'
                                    }`}
                            >
                                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ${item.completed
                                        ? 'bg-success/10 group-hover:bg-success/20'
                                        : 'bg-error/10 group-hover:bg-error/20'
                                        }`}>
                                        {item.icon}
                                    </div>
                                    <span className={`text-xs sm:text-sm font-semibold transition-colors truncate ${item.completed
                                        ? 'text-success group-hover:text-success'
                                        : 'text-error group-hover:text-error'
                                        }`}>
                                        {item.title}
                                    </span>
                                </div>
                                {item.completed ? (
                                    <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-success flex-shrink-0 ml-2" />
                                ) : (
                                    <XCircle className="w-4 h-4 md:w-5 md:h-5 text-error flex-shrink-0 ml-2" />
                                )}
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
