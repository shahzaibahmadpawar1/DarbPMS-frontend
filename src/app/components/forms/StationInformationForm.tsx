import { useState, useEffect } from "react";
import { Save, Eye } from "lucide-react";
import { useStation } from "../../context/StationContext";
import { useAutoPopulate } from "../../hooks/useAutoPopulate";
import { useResolvedStationCode } from "../../hooks/useResolvedStationCode";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function StationInformationForm() {
  const { accessMode } = useStation();
  const { getPartialPopulationData, hasAutoPopulateData, clearInvestmentProjectData } = useAutoPopulate();
  const resolvedStationCode = useResolvedStationCode();
  const isReadOnly = accessMode === 'view-only';
  const stationTypes = ["operation", "rent", "franchise", "investment", "ownership"];

  const [existingStationCode, setExistingStationCode] = useState<string | null>(null);

  // Empty form data ready for user input
  const [formData, setFormData] = useState({
    stationCode: "",
    stationName: "",
    areaRegion: "",
    city: "",
    district: "",
    street: "",
    geographicLocation: "",
    stationTypeCode: "",
  });

  const fetchExistingStation = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        return;
      }

      const code = String(resolvedStationCode || '').trim();
      if (!code) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/stations/${encodeURIComponent(code)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const row = data?.data;
        if (row) {
          setExistingStationCode(row.station_code);
          setFormData((prev) => ({
            ...prev,
            stationCode: row.station_code || prev.stationCode,
            stationName: row.station_name || prev.stationName,
            areaRegion: row.area_region || prev.areaRegion,
            city: row.city || prev.city,
            district: row.district || prev.district,
            street: row.street || prev.street,
            geographicLocation: row.geographic_location || prev.geographicLocation,
            stationTypeCode: row.station_type_code || prev.stationTypeCode,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching station:", error);
    }
  };

  useEffect(() => {
    fetchExistingStation();
  }, [resolvedStationCode]);

  useEffect(() => {
    if (!hasAutoPopulateData()) {
      return;
    }

    setFormData((prev) => {
      const partialData = getPartialPopulationData('station', { includeCode: true, includeName: true });
      return {
        ...prev,
        stationCode: prev.stationCode || partialData.stationCode || prev.stationCode,
        stationName: prev.stationName || partialData.stationName || prev.stationName,
        areaRegion: prev.areaRegion || partialData.areaRegion || prev.areaRegion,
        city: prev.city || partialData.city || prev.city,
        district: prev.district || partialData.district || prev.district,
        geographicLocation: prev.geographicLocation || partialData.geographicLocation || prev.geographicLocation,
      };
    });
  }, [hasAutoPopulateData, getPartialPopulationData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('auth_token');
      const updateKey = existingStationCode || formData.stationCode;
      const method = existingStationCode ? 'PUT' : 'POST';
      const endpoint = existingStationCode
        ? `${API_BASE_URL}/stations/${encodeURIComponent(updateKey)}`
        : `${API_BASE_URL}/stations`;

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(existingStationCode ? "Station Information updated successfully!" : "Station Information saved successfully!");
        setExistingStationCode(formData.stationCode || existingStationCode);
        clearInvestmentProjectData();
      } else if (response.status === 401 || response.status === 403) {
        alert("Authentication failed. Please log out and then log in again to sync with the Vercel backend. Your token might be from a different session (localhost).");
      } else if (response.status === 409 && !existingStationCode) {
        const fallbackUpdate = await fetch(`${API_BASE_URL}/stations/${encodeURIComponent(formData.stationCode)}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (fallbackUpdate.ok) {
          setExistingStationCode(formData.stationCode);
          alert("Station Information updated successfully!");
          clearInvestmentProjectData();
          return;
        }

        const fallbackData = await fallbackUpdate.json();
        alert(`Error: ${fallbackData.error || 'Failed to update station information'}`);
      } else {
        alert(`Error: ${data.error || 'Failed to save station information'}`);
      }
    } catch (error) {
      console.error("Error saving station:", error);
      alert("Failed to save station information. Please make sure the backend server is running.");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Station Information</h1>
          <p className="text-muted-foreground mt-2">
            {isReadOnly ? "View station details" : "The core record for fuel station management"}
          </p>
        </div>

        {isReadOnly && (
          <div className="flex items-center gap-2 px-4 py-2 bg-info/5 text-info rounded-lg border border-info/20">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-semibold">View Only Mode</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-xl p-8 card-glow border-t-4 border-primary relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Basic Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Station Code (PK) <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.stationCode}
                  onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                  required
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Station Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.stationName}
                  onChange={(e) => setFormData({ ...formData, stationName: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                  required
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              Location Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Area/Region</label>
                <input
                  type="text"
                  value={formData.areaRegion}
                  onChange={(e) => setFormData({ ...formData, areaRegion: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">District</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Street</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                  disabled={isReadOnly}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Geographic Location (Google Maps URL)</label>
                <input
                  type="url"
                  value={formData.geographicLocation}
                  onChange={(e) => setFormData({ ...formData, geographicLocation: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                  placeholder="https://maps.google.com/..."
                  disabled={isReadOnly}
                />
              </div>
            </div>
          </div>



          {/* Additional Details */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              Additional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">
                  Station Type Code (FK)
                </label>
                <select
                  value={formData.stationTypeCode}
                  onChange={(e) => setFormData({ ...formData, stationTypeCode: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                  disabled={isReadOnly}
                >
                  <option value="">Select Type</option>
                  {stationTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          {!isReadOnly && (
            <div className="flex justify-end">
              <button
                type="submit"
                className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20"
              >
                <Save className="w-5 h-5" />
                Save Station Information
              </button>
            </div>
          )}
          </form>
    </div >
  );
}
