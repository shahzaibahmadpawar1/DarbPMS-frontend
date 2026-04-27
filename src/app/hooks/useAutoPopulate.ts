import { useStation } from "../context/StationContext";

export interface AutoPopulateConfig {
    stationFields?: boolean;
    ownerFields?: boolean;
}

export function useAutoPopulate() {
    const { investmentProjectData, clearInvestmentProjectData } = useStation();

    /**
     * Maps investment project data to station information form fields
     */
    const mapToStationForm = (config?: { includeCode?: boolean; includeName?: boolean }) => {
        if (!investmentProjectData) return null;

        return {
            stationCode: config?.includeCode ? investmentProjectData.projectCode || "" : "",
            stationName: config?.includeName ? investmentProjectData.projectName || "" : "",
            areaRegion: investmentProjectData.area || "",
            city: investmentProjectData.city || "",
            district: investmentProjectData.district || "",
            geographicLocation: investmentProjectData.googleLocation || "",
            // Note: street is not available in investment data, user fills it manually
            street: "",
        };
    };

    /**
     * Maps investment project data to owner information form fields
     */
    const mapToOwnerForm = () => {
        if (!investmentProjectData) return null;

        return {
            ownerId: investmentProjectData.idNo || "",
            ownerName: investmentProjectData.ownerName || "",
            ownerMobile: investmentProjectData.ownerContactNo || "",
            ownerAddress: investmentProjectData.nationalAddress || "",
            ownerEmail: investmentProjectData.email || "",
            // These will be filled from context or user input
            issueDate: "",
            issuePlace: "",
            stationTypeCode: "",
            stationCode: "",
        };
    };

    /**
     * Partially populates form fields from investment data
     * Only fills fields that exist in investment data
     */
    const getPartialPopulationData = (formType: 'station' | 'owner', config?: any) => {
        if (!investmentProjectData) return {};

        if (formType === 'station') {
            return {
                ...(investmentProjectData.city && { city: investmentProjectData.city }),
                ...(investmentProjectData.district && { district: investmentProjectData.district }),
                ...(investmentProjectData.area && { areaRegion: investmentProjectData.area }),
                ...(investmentProjectData.googleLocation && { geographicLocation: investmentProjectData.googleLocation }),
                ...(config?.includeCode && investmentProjectData.projectCode && { stationCode: investmentProjectData.projectCode }),
                ...(config?.includeName && investmentProjectData.projectName && { stationName: investmentProjectData.projectName }),
            };
        } else if (formType === 'owner') {
            return {
                ...(investmentProjectData.idNo && { ownerId: investmentProjectData.idNo }),
                ...(investmentProjectData.ownerName && { ownerName: investmentProjectData.ownerName }),
                ...(investmentProjectData.ownerContactNo && { ownerMobile: investmentProjectData.ownerContactNo }),
                ...(investmentProjectData.nationalAddress && { ownerAddress: investmentProjectData.nationalAddress }),
                ...(investmentProjectData.email && { ownerEmail: investmentProjectData.email }),
            };
        }

        return {};
    };

    /**
     * Check if there is any investment project data available
     */
    const hasAutoPopulateData = (): boolean => {
        return investmentProjectData !== null && (
            !!investmentProjectData.city ||
            !!investmentProjectData.district ||
            !!investmentProjectData.area ||
            !!investmentProjectData.googleLocation ||
            !!investmentProjectData.ownerName ||
            !!investmentProjectData.ownerContactNo ||
            !!investmentProjectData.idNo ||
            !!investmentProjectData.nationalAddress ||
            !!investmentProjectData.email
        );
    };

    /**
     * Get a summary of what will be auto-populated
     */
    const getAutoPopulateSummary = () => {
        if (!investmentProjectData) return { station: [], owner: [] };

        const stationFields = [];
        const ownerFields = [];

        if (investmentProjectData.city) stationFields.push(`City: ${investmentProjectData.city}`);
        if (investmentProjectData.district) stationFields.push(`District: ${investmentProjectData.district}`);
        if (investmentProjectData.area) stationFields.push(`Area/Region: ${investmentProjectData.area}`);
        if (investmentProjectData.googleLocation) stationFields.push(`Geographic Location: ${investmentProjectData.googleLocation}`);

        if (investmentProjectData.ownerName) ownerFields.push(`Owner Name: ${investmentProjectData.ownerName}`);
        if (investmentProjectData.ownerContactNo) ownerFields.push(`Owner Mobile: ${investmentProjectData.ownerContactNo}`);
        if (investmentProjectData.idNo) ownerFields.push(`Owner ID: ${investmentProjectData.idNo}`);
        if (investmentProjectData.nationalAddress) ownerFields.push(`Owner Address: ${investmentProjectData.nationalAddress}`);
        if (investmentProjectData.email) ownerFields.push(`Owner Email: ${investmentProjectData.email}`);

        return { station: stationFields, owner: ownerFields };
    };

    return {
        investmentProjectData,
        mapToStationForm,
        mapToOwnerForm,
        getPartialPopulationData,
        hasAutoPopulateData,
        getAutoPopulateSummary,
        clearInvestmentProjectData,
    };
}
