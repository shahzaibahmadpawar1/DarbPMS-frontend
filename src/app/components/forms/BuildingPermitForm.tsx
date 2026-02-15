import { useState, useEffect } from "react";
import { Save, List, PlusCircle, Eye } from "lucide-react";
import { FormRecordsList } from "../FormRecordsList";
import { useStation } from "../../context/StationContext";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

import { useParams } from "react-router-dom";

export function BuildingPermitForm() {
  const { stationId } = useParams();
  const { accessMode, selectedStation } = useStation();
  const isReadOnly = accessMode === 'view-only';

  const [viewMode, setViewMode] = useState<'form' | 'records'>('form');
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<any[]>([]);
  const [currentStation, setCurrentStation] = useState<any>(selectedStation);

  const [formData, setFormData] = useState({
    permitNumber: "",
    licenseDate: "",
    expiryDate: "",
    licenseType: "",
    organizationChartNumber: "",
    constructionType: "",
    urbanArea: "",
    landArea: "",
    wallsPerimeter: "",
    northBorder: "",
    eastBorder: "",
    southBorder: "",
    westBorder: "",
    northDimensions: "",
    eastDimensions: "",
    southDimensions: "",
    westernDimensions: "",
    northThrowback: "",
    eastThrowback: "",
    southThrowback: "",
    westThrowback: "",
    constructionComponents: "",
    numberOfUnits: "",
    stationStatusCode: "",
    stationCode: "",
    officeCode: "",
  });

  useEffect(() => {
    const fetchStationAndRecords = async () => {
      let targetStation = selectedStation;

      if (!targetStation && stationId && stationId !== 'new-station') {
        try {
          const token = localStorage.getItem('auth_token');
          const response = await axios.get(`${API_BASE_URL}/stations/${stationId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          targetStation = response.data.data;
          setCurrentStation(targetStation);
        } catch (error) {
          console.error("Error fetching station details:", error);
        }
      }

      if (targetStation) {
        setFormData(prev => ({ ...prev, stationCode: targetStation.station_code }));
        fetchRecords(targetStation.station_code);
      } else {
        fetchRecords();
      }
    };

    fetchStationAndRecords();
  }, [selectedStation, stationId]);

  const fetchRecords = async (stationCode?: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const code = stationCode || currentStation?.station_code;
      const url = code
        ? `${API_BASE_URL}/building-permits/station/${code}`
        : `${API_BASE_URL}/building-permits`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(response.data.data);
    } catch (error) {
      console.error("Error fetching building permits:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post(`${API_BASE_URL}/building-permits`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Building Permit saved successfully!");
      setFormData({
        permitNumber: "",
        licenseDate: "",
        expiryDate: "",
        licenseType: "",
        organizationChartNumber: "",
        constructionType: "",
        urbanArea: "",
        landArea: "",
        wallsPerimeter: "",
        northBorder: "",
        eastBorder: "",
        southBorder: "",
        westBorder: "",
        northDimensions: "",
        eastDimensions: "",
        southDimensions: "",
        westernDimensions: "",
        northThrowback: "",
        eastThrowback: "",
        southThrowback: "",
        westThrowback: "",
        constructionComponents: "",
        numberOfUnits: "",
        stationStatusCode: "",
        stationCode: selectedStation?.station_code || "",
        officeCode: "",
      });
      fetchRecords();
      setViewMode('records');
    } catch (error: any) {
      console.error("Error saving permit:", error);
      const errorMsg = error.response?.data?.error || "Failed to save permit";
      const details = error.response?.data?.details ? `\nDetails: ${error.response.data.details}` : "";
      alert(`${errorMsg}${details}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Building Permit</h1>
          <p className="text-muted-foreground mt-2">
            {isReadOnly ? "View municipal construction and building permits" : "Manage municipal construction and building permits"}
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Permit Number <span className="text-red-500">*</span></label>
              <input type="text" value={formData.permitNumber} onChange={(e) => setFormData({ ...formData, permitNumber: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" required disabled={isReadOnly} />
            </div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">License Date</label>
              <input type="date" value={formData.licenseDate} onChange={(e) => setFormData({ ...formData, licenseDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Expiry Date</label>
              <input type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">License Type</label>
              <input type="text" value={formData.licenseType} onChange={(e) => setFormData({ ...formData, licenseType: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Organization Chart Number</label>
              <input type="text" value={formData.organizationChartNumber} onChange={(e) => setFormData({ ...formData, organizationChartNumber: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Construction Type</label>
              <input type="text" value={formData.constructionType} onChange={(e) => setFormData({ ...formData, constructionType: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Urban Area</label>
              <input type="text" value={formData.urbanArea} onChange={(e) => setFormData({ ...formData, urbanArea: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Land Area</label>
              <input type="number" step="0.01" value={formData.landArea} onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>
            <div><label className="block text-sm font-medium text-muted-foreground mb-1">Walls Perimeter</label>
              <input type="number" step="0.01" value={formData.wallsPerimeter} onChange={(e) => setFormData({ ...formData, wallsPerimeter: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} /></div>

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg">
              <h3 className="md:col-span-4 font-bold text-primary">Borders</h3>
              <div><label className="block text-sm font-medium text-muted-foreground mb-1">North Border</label>
                <input type="text" value={formData.northBorder} onChange={(e) => setFormData({ ...formData, northBorder: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background" disabled={isReadOnly} /></div>
              <div><label className="block text-sm font-medium text-muted-foreground mb-1">East Border</label>
                <input type="text" value={formData.eastBorder} onChange={(e) => setFormData({ ...formData, eastBorder: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background" disabled={isReadOnly} /></div>
              <div><label className="block text-sm font-medium text-muted-foreground mb-1">South Border</label>
                <input type="text" value={formData.southBorder} onChange={(e) => setFormData({ ...formData, southBorder: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background" disabled={isReadOnly} /></div>
              <div><label className="block text-sm font-medium text-muted-foreground mb-1">West Border</label>
                <input type="text" value={formData.westBorder} onChange={(e) => setFormData({ ...formData, westBorder: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background" disabled={isReadOnly} /></div>
            </div>

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg">
              <h3 className="md:col-span-4 font-bold text-primary">Dimensions</h3>
              <div><label className="block text-sm font-medium text-muted-foreground mb-1">North Dim</label>
                <input type="number" step="0.01" value={formData.northDimensions} onChange={(e) => setFormData({ ...formData, northDimensions: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background" disabled={isReadOnly} /></div>
              <div><label className="block text-sm font-medium text-muted-foreground mb-1">East Dim</label>
                <input type="number" step="0.01" value={formData.eastDimensions} onChange={(e) => setFormData({ ...formData, eastDimensions: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background" disabled={isReadOnly} /></div>
              <div><label className="block text-sm font-medium text-muted-foreground mb-1">South Dim</label>
                <input type="number" step="0.01" value={formData.southDimensions} onChange={(e) => setFormData({ ...formData, southDimensions: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background" disabled={isReadOnly} /></div>
              <div><label className="block text-sm font-medium text-muted-foreground mb-1">West Dim</label>
                <input type="number" step="0.01" value={formData.westernDimensions} onChange={(e) => setFormData({ ...formData, westernDimensions: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background" disabled={isReadOnly} /></div>
            </div>

            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/30 p-4 rounded-lg">
              <h3 className="md:col-span-4 font-bold text-primary">Throwbacks</h3>
              <div><label className="block text-sm font-medium text-muted-foreground mb-1">North Throw</label>
                <input type="number" step="0.01" value={formData.northThrowback} onChange={(e) => setFormData({ ...formData, northThrowback: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background" disabled={isReadOnly} /></div>
              <div><label className="block text-sm font-medium text-muted-foreground mb-1">East Throw</label>
                <input type="number" step="0.01" value={formData.eastThrowback} onChange={(e) => setFormData({ ...formData, eastThrowback: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background" disabled={isReadOnly} /></div>
              <div><label className="block text-sm font-medium text-muted-foreground mb-1">South Throw</label>
                <input type="number" step="0.01" value={formData.southThrowback} onChange={(e) => setFormData({ ...formData, southThrowback: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background" disabled={isReadOnly} /></div>
              <div><label className="block text-sm font-medium text-muted-foreground mb-1">West Throw</label>
                <input type="number" step="0.01" value={formData.westThrowback} onChange={(e) => setFormData({ ...formData, westThrowback: e.target.value })}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background" disabled={isReadOnly} /></div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">Construction Components</label>
              <textarea value={formData.constructionComponents} onChange={(e) => setFormData({ ...formData, constructionComponents: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" rows={2} disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Number Of Units</label>
              <input type="number" value={formData.numberOfUnits} onChange={(e) => setFormData({ ...formData, numberOfUnits: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Station Status Code</label>
              <input type="text" value={formData.stationStatusCode} onChange={(e) => setFormData({ ...formData, stationStatusCode: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Office Code</label>
              <input type="text" value={formData.officeCode} onChange={(e) => setFormData({ ...formData, officeCode: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" disabled={isReadOnly} />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Station Code <span className="text-red-500">*</span></label>
              <input type="text" value={formData.stationCode} onChange={(e) => setFormData({ ...formData, stationCode: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-muted disabled:cursor-not-allowed bg-background text-foreground" required disabled={isReadOnly || !!selectedStation} />
            </div>
          </div>

          {!isReadOnly && (
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-6 py-3 rounded-lg flex items-center gap-2 transition-all shadow-lg hover:shadow-primary/20 disabled:opacity-50"
              >
                <Save className="w-5 h-5" />
                {loading ? "Saving..." : "Save Building Permit"}
              </button>
            </div>
          )}
        </form>
      ) : (
        <FormRecordsList
          title="Building Permits"
          columns={["Permit #", "Type", "Office", "Status", "Station Code"]}
          records={records.map(r => ({
            "Permit #": r.permit_number,
            "Type": r.license_type || "N/A",
            "Office": r.office_code || "N/A",
            "Status": r.station_status_code || "N/A",
            "Station Code": r.station_code
          }))}
        />
      )}
    </div>
  );
}
