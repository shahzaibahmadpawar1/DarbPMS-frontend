import { useNavigate, useLocation } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import { useStation } from "../context/StationContext";

export function BackToDashboardButton() {
    const navigate = useNavigate();
    const location = useLocation();
    const { accessMode } = useStation();

    // Determine the correct dashboard path based on access mode
    const dashboardPath = accessMode === 'admin' ? '/all-stations-dashboard' : '/dashboard';

    // Don't show the button if we're already on the dashboard
    if (location.pathname === dashboardPath) {
        return null;
    }

    return (
        <div className="flex gap-2">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-all duration-200 border border-border hover:border-primary"
                title="Go back to previous page"
            >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back</span>
            </button>

            <button
                onClick={() => navigate(dashboardPath)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                title="Return to dashboard"
            >
                <Home className="w-4 h-4" />
                <span className="text-sm font-medium">Dashboard</span>
            </button>
        </div>
    );
}





