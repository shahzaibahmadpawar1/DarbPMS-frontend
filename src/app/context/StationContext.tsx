import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from "react";

export interface InvestmentProjectData {
    projectName?: string;
    projectCode?: string;
    city?: string;
    district?: string;
    area?: string;
    googleLocation?: string;
    ownerName?: string;
    ownerContactNo?: string;
    idNo?: string;
    nationalAddress?: string;
    email?: string;
}

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
    investmentProjectData: InvestmentProjectData | null;
    setInvestmentProjectData: (data: InvestmentProjectData | null) => void;
    clearInvestmentProjectData: () => void;
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

    const [investmentProjectData, setInvestmentProjectData] = useState<InvestmentProjectData | null>(() => {
        const saved = localStorage.getItem("investmentProjectData");
        return saved ? JSON.parse(saved) : null;
    });

    const clearInvestmentProjectData = useCallback(() => {
        setInvestmentProjectData(null);
        localStorage.removeItem("investmentProjectData");
    }, []);

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

    useEffect(() => {
        if (investmentProjectData) {
            localStorage.setItem("investmentProjectData", JSON.stringify(investmentProjectData));
        } else {
            localStorage.removeItem("investmentProjectData");
        }
    }, [investmentProjectData]);

    const value = useMemo(() => ({
        selectedStation,
        setSelectedStation,
        accessMode,
        setAccessMode,
        investmentProjectData,
        setInvestmentProjectData,
        clearInvestmentProjectData,
    }), [selectedStation, accessMode, investmentProjectData, clearInvestmentProjectData]);

    return (
        <StationContext.Provider value={value}>
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
