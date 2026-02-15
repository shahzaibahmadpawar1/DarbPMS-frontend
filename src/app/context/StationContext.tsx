import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface StationContextType {
    selectedStation: {
        id: string;
        station_code: string;
        name: string;
        region: string;
        city: string;
        project: string;
    } | null;
    setSelectedStation: (station: StationContextType["selectedStation"]) => void;
    accessMode: 'admin' | 'view-only' | null;
    setAccessMode: (mode: 'admin' | 'view-only' | null) => void;
}

const StationContext = createContext<StationContextType | undefined>(undefined);

export function StationProvider({ children }: { children: ReactNode }) {
    const [selectedStation, setSelectedStation] = useState<StationContextType["selectedStation"]>(() => {
        const saved = localStorage.getItem("selectedStation");
        return saved ? JSON.parse(saved) : null;
    });

    const [accessMode, setAccessMode] = useState<'admin' | 'view-only' | null>(() => {
        const saved = localStorage.getItem("accessMode") as 'admin' | 'view-only' | null;
        // Default to 'admin' mode for production (editable forms)
        return saved || 'admin';
    });

    useEffect(() => {
        if (selectedStation) {
            localStorage.setItem("selectedStation", JSON.stringify(selectedStation));
        } else {
            localStorage.removeItem("selectedStation");
        }
    }, [selectedStation]);

    useEffect(() => {
        if (accessMode) {
            localStorage.setItem("accessMode", accessMode);
        } else {
            localStorage.removeItem("accessMode");
        }
    }, [accessMode]);

    return (
        <StationContext.Provider value={{ selectedStation, setSelectedStation, accessMode, setAccessMode }}>
            {children}
        </StationContext.Provider>
    );
}

export function useStation() {
    const context = useContext(StationContext);
    if (context === undefined) {
        throw new Error("useStation must be used within a StationProvider");
    }
    return context;
}
