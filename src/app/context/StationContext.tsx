import { createContext, useContext, useState, ReactNode } from "react";

interface StationContextType {
    selectedStation: {
        id: string;
        name: string;
        region: string;
        city: string;
        project: string;
    } | null;
    setSelectedStation: (station: StationContextType["selectedStation"]) => void;
}

const StationContext = createContext<StationContextType | undefined>(undefined);

export function StationProvider({ children }: { children: ReactNode }) {
    const [selectedStation, setSelectedStation] = useState<StationContextType["selectedStation"]>(null);

    return (
        <StationContext.Provider value={{ selectedStation, setSelectedStation }}>
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
