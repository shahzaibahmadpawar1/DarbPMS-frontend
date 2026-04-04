import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { getRoleLabel } from "@/services/api";
import { useStation } from "../context/StationContext";
import { departmentSections } from "../data/formSections";

export function DepartmentsPage() {
    const { user } = useAuth();
    const { selectedStation } = useStation();

    const basePath = selectedStation ? `/station/${selectedStation.id}/form` : "/station/new-station/form";

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border p-6 md:p-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight">Departments</h1>
                    <p className="text-sm md:text-base text-muted-foreground">
                        Browse all department modules from one place{user ? ` as ${getRoleLabel(user.role)}` : ""}.
                    </p>
                </div>
            </div>

            {departmentSections.map((section) => (
                <div key={section.group} className="bg-card/80 backdrop-blur-xl rounded-2xl shadow-lg border border-border p-4 sm:p-6 md:p-8">
                    <h2 className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                        {section.group}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        {section.items.map((item) => (
                            <Link
                                key={item.title}
                                to={`${basePath}/${item.path}`}
                                className="rounded-lg md:rounded-xl shadow-md border border-border p-3 md:p-4 hover:shadow-xl hover:scale-105 transition-all duration-200 card-glow group flex items-center"
                            >
                                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                                    <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 bg-muted group-hover:bg-muted/80 text-foreground">
                                        {item.icon}
                                    </div>
                                    <span className="text-xs sm:text-sm font-semibold transition-colors truncate text-foreground">
                                        {item.title}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
