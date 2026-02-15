import { useState, useEffect } from "react";
import { Save, List, PlusCircle, Eye } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export function StationInformationForm() {
  const { accessMode } = useStation();
  const isReadOnly = accessMode === 'view-only';

  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [records, setRecords] = useState<any[]>([]);

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
    stationStatusCode: "",
  });

  // Fetch existing records
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.warn("No auth token found, please log in.");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/stations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRecords(data.data || []);
      } else if (response.status === 401 || response.status === 403) {
        console.error("Authentication failed. Please log out and log in again to sync with the Vercel backend.");
      }
    } catch (error) {
      console.error("Error fetching stations:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${API_BASE_URL}/stations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Station Information saved successfully!");
        // Reset form
        setFormData({
          stationCode: "",
          stationName: "",
          areaRegion: "",
          city: "",
          district: "",
          street: "",
          geographicLocation: "",
          stationTypeCode: "",
          stationStatusCode: "",
        });
        // Refresh records
        fetchRecords();
        // Optionally navigate to the stations list
        // navigate('/all-stations-list');
      } else if (response.status === 401 || response.status === 403) {
        alert("Authentication failed. Please log out and then log in again to sync with the Vercel backend. Your token might be from a different session (localhost).");
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

        {!isReadOnly && (
          <div className="flex bg-muted p-1 rounded-xl w-fit">
            <button
              onClick={() => setViewMode('form')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'form'
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>New Entry</span>
            </button>
            <button
              onClick={() => setViewMode('records')}
              className={`flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all ${viewMode === 'records'
                ? 'bg-card text-primary shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <List className="w-4 h-4" />
              <span>View Records</span>
            </button>
          </div>
        )}

        {isReadOnly && (
          <div className="flex items-center gap-2 px-4 py-2 bg-info/5 text-info rounded-lg border border-info/20">
            <Eye className="w-4 h-4" />
            <span className="text-sm font-semibold">View Only Mode</span>
          </div>
        )}
      </div>

      {viewMode === 'form' ? (
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
                  <option value="1">Owned Station</option>
                  <option value="2">Rented Station</option>
                  <option value="3">Operation</option>
                  <option value="4">Franchise</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Station Status Code (FK)</label>
                <select
                  value={formData.stationStatusCode}
                  onChange={(e) => setFormData({ ...formData, stationStatusCode: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground"
                  disabled={isReadOnly}
                >
                  <option value="">Select Status</option>
                  <option value="1">Active</option>
                  <option value="2">Inactive</option>
                  <option value="3">Under Construction</option>
                  <option value="4">Under Development</option>
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
      ) : (
        <FormRecordsList
          title="Station Information"
          columns={["Code", "Name", "Region", "City", "District", "Street", "Type", "Status"]}
          records={records.map(r => ({
            "Code": r.station_code,
            "Name": r.station_name,
            "Region": r.area_region || "N/A",
            "City": r.city || "N/A",
            "District": r.district || "N/A",
            "Street": r.street || "N/A",
            "Type": r.station_type_code || "N/A",
            "Status": r.station_status_code || "N/A"
          }))}
        />
      )
      }
    </div >
  );
}
